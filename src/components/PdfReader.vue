<template>
  <div class="pdf-reader">
    <div v-if="resolvedSrc" class="pdf-toolbar">
      <strong>{{ title }}</strong>
      <a :href="resolvedSrc" target="_blank" rel="noopener noreferrer">Відкрити PDF</a>
    </div>

    <div
      v-if="resolvedSrc && renderWithPdfJs"
      ref="pdfShell"
      class="pdf-canvas-shell"
      :style="{ maxHeight: readerHeight }"
    >
      <div v-if="pdfRendering" class="pdf-render-state">
        <span class="pdf-spinner" aria-hidden="true"></span>
        <p>PDF завантажується для перегляду...</p>
      </div>
      <div v-if="pdfRenderError" class="pdf-render-error">
        <p>{{ pdfRenderError }}</p>
        <a :href="resolvedSrc" target="_blank" rel="noopener noreferrer">Відкрити PDF</a>
      </div>
      <div ref="canvasPages" class="pdf-canvas-pages"></div>
    </div>

    <iframe
      v-else-if="resolvedSrc && useIframe"
      class="pdf-frame"
      :src="embedSrc"
      :title="title"
      :style="{ height: readerHeight }"
      loading="lazy"
    ></iframe>

    <object
      v-else-if="resolvedSrc"
      class="pdf-frame"
      :data="embedSrc"
      type="application/pdf"
      :aria-label="title"
      :style="{ height: readerHeight }"
    >
      <p>
        PDF не відобразився.
        <a :href="resolvedSrc" target="_blank" rel="noopener noreferrer">Відкрити PDF</a>
      </p>
    </object>

    <div v-else-if="loading" class="pdf-empty pdf-loading">
      <strong>{{ title }}</strong>
      <span class="pdf-spinner" aria-hidden="true"></span>
      <p>{{ loadingText }}</p>
    </div>

    <div v-else class="pdf-empty">
      <strong>{{ title }}</strong>
      <p>{{ emptyText }}</p>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default {
  name: 'PdfReader',
  props: {
    src: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'PDF-документ'
    },
    height: {
      type: [String, Number],
      default: '680px'
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: 'PDF завантажується...'
    },
    emptyText: {
      type: String,
      default: 'PDF-файл буде додано після завантаження документа.'
    }
  },
  data() {
    return {
      isMobileViewport: false,
      mobileMediaQuery: null,
      removeMobileListener: null,
      pdfRendering: false,
      pdfRenderError: '',
      renderRequestId: 0,
      activeLoadingTask: null,
      activePdfDocument: null,
      pageObserver: null,
      pageRenderTasks: markRaw(new Map())
    };
  },
  computed: {
    resolvedSrc() {
      return this.src?.trim() || '';
    },
    readerHeight() {
      return typeof this.height === 'number' ? `${this.height}px` : this.height;
    },
    useIframe() {
      return this.isGoogleDriveUrl || !this.resolvedSrc.toLowerCase().includes('.pdf');
    },
    renderWithPdfJs() {
      return this.resolvedSrc && this.isMobileViewport && !this.isGoogleDriveUrl;
    },
    isGoogleDriveUrl() {
      return /drive\.google\.com/.test(this.resolvedSrc);
    },
    embedSrc() {
      if (!this.resolvedSrc) return '';

      if (this.isGoogleDriveUrl) {
        const match = this.resolvedSrc.match(/\/file\/d\/([^/]+)/);
        return match ? `https://drive.google.com/file/d/${match[1]}/preview` : this.resolvedSrc;
      }

      return this.resolvedSrc.toLowerCase().includes('#')
        ? this.resolvedSrc
        : `${this.resolvedSrc}#toolbar=1&navpanes=0`;
    }
  },
  watch: {
    resolvedSrc() {
      this.renderPdfForMobile();
    },
    isMobileViewport() {
      this.renderPdfForMobile();
    }
  },
  mounted() {
    this.setupMobileWatcher();
  },
  beforeUnmount() {
    this.renderRequestId += 1;
    this.disposePdfResources();

    if (this.removeMobileListener) {
      this.removeMobileListener();
    }
  },
  methods: {
    disposePdfResources() {
      if (this.pageObserver) {
        this.pageObserver.disconnect();
        this.pageObserver = null;
      }
      this.pageRenderTasks.forEach(renderTask => renderTask.cancel());
      this.pageRenderTasks.clear();

      if (typeof this.activePdfDocument?.destroy === 'function') {
        this.activePdfDocument.destroy();
        this.activePdfDocument = null;
      } else if (typeof this.activeLoadingTask?.destroy === 'function') {
        this.activeLoadingTask.destroy();
      }
      this.activePdfDocument = null;
      this.activeLoadingTask = null;
    },
    async loadPdfBytes(source) {
      if (source.startsWith('data:application/pdf')) {
        const base64 = source.split(',')[1] || '';
        const binary = window.atob(base64);
        return Uint8Array.from(binary, character => character.charCodeAt(0));
      }

      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`PDF request failed: ${response.status}`);
      }

      return new Uint8Array(await response.arrayBuffer());
    },
    releasePageSlot(slot) {
      const pageNumber = Number(slot.dataset.pageNumber);
      const renderTask = this.pageRenderTasks.get(pageNumber);

      if (renderTask) {
        renderTask.cancel();
        this.pageRenderTasks.delete(pageNumber);
      }

      slot.replaceChildren();
      delete slot.dataset.rendered;
      delete slot.dataset.rendering;
    },
    async renderPageSlot(slot, pdfDocument, requestId) {
      if (
        requestId !== this.renderRequestId ||
        slot.dataset.rendered === 'true' ||
        slot.dataset.rendering === 'true'
      ) {
        return;
      }

      const pageNumber = Number(slot.dataset.pageNumber);
      slot.dataset.rendering = 'true';
      let page;

      try {
        page = await pdfDocument.getPage(pageNumber);
        if (requestId !== this.renderRequestId) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(slot.clientWidth, 280);
        const scale = Math.min(1.6, availableWidth / baseViewport.width);
        const viewport = page.getViewport({ scale });
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { alpha: false });

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        canvas.setAttribute('aria-label', `${this.title}, сторінка ${pageNumber}`);
        slot.replaceChildren(canvas);

        const renderTask = markRaw(page.render({
          canvasContext: context,
          viewport,
          transform: pixelRatio !== 1 ? [pixelRatio, 0, 0, pixelRatio, 0, 0] : undefined
        }));
        this.pageRenderTasks.set(pageNumber, renderTask);
        await renderTask.promise;

        if (requestId !== this.renderRequestId) return;
        slot.dataset.rendered = 'true';
        this.pdfRendering = false;
      } catch (error) {
        if (error?.name !== 'RenderingCancelledException') {
          throw error;
        }
      } finally {
        this.pageRenderTasks.delete(pageNumber);
        delete slot.dataset.rendering;
        page?.cleanup();
      }
    },
    observePageSlots(pdfDocument, requestId) {
      const slots = [...this.$refs.canvasPages.querySelectorAll('.pdf-page-slot')];

      if (typeof IntersectionObserver === 'undefined') {
        slots.slice(0, 3).forEach(slot => {
          this.renderPageSlot(slot, pdfDocument, requestId).catch(error => {
            console.error('PDF page rendering error:', error);
          });
        });
        return;
      }

      this.pageObserver = markRaw(new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const slot = entry.target;

            if (entry.isIntersecting) {
              this.renderPageSlot(slot, pdfDocument, requestId).catch(error => {
                if (requestId !== this.renderRequestId) return;
                console.error('PDF page rendering error:', error);
                this.pdfRendering = false;
                this.pdfRenderError = 'Не вдалося показати сторінку PDF. Відкрийте файл окремо.';
              });
            } else if (slot.dataset.rendered === 'true' || slot.dataset.rendering === 'true') {
              this.releasePageSlot(slot);
            }
          });
        },
        {
          root: this.$refs.pdfShell,
          rootMargin: '900px 0px',
          threshold: 0.01
        }
      ));

      slots.forEach(slot => this.pageObserver.observe(slot));
    },
    setupMobileWatcher() {
      if (typeof window === 'undefined' || !window.matchMedia) return;

      this.mobileMediaQuery = window.matchMedia('(max-width: 760px)');
      const updateViewportState = () => {
        this.isMobileViewport = this.mobileMediaQuery.matches;
      };

      updateViewportState();

      if (this.mobileMediaQuery.addEventListener) {
        this.mobileMediaQuery.addEventListener('change', updateViewportState);
        this.removeMobileListener = () => this.mobileMediaQuery.removeEventListener('change', updateViewportState);
      } else if (this.mobileMediaQuery.addListener) {
        this.mobileMediaQuery.addListener(updateViewportState);
        this.removeMobileListener = () => this.mobileMediaQuery.removeListener(updateViewportState);
      }
    },
    async renderPdfForMobile() {
      const requestId = this.renderRequestId + 1;
      this.renderRequestId = requestId;
      this.pdfRenderError = '';
      this.disposePdfResources();

      await this.$nextTick();

      const canvasContainer = this.$refs.canvasPages;
      if (canvasContainer) {
        canvasContainer.innerHTML = '';
      }

      if (!this.renderWithPdfJs || !canvasContainer) {
        this.pdfRendering = false;
        return;
      }

      this.pdfRendering = true;

      try {
        const pdfBytes = await this.loadPdfBytes(this.resolvedSrc);
        if (requestId !== this.renderRequestId) return;

        const loadingTask = pdfjsLib.getDocument({
          data: pdfBytes,
          isEvalSupported: false,
          useWorkerFetch: false
        });
        this.activeLoadingTask = markRaw(loadingTask);
        const pdfDocument = await loadingTask.promise;
        this.activeLoadingTask = null;
        this.activePdfDocument = markRaw(pdfDocument);

        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
          if (requestId !== this.renderRequestId) return;

          const page = await pdfDocument.getPage(pageNumber);
          const baseViewport = page.getViewport({ scale: 1 });
          const availableWidth = Math.max(canvasContainer.clientWidth - 4, 280);
          const scale = Math.min(1.6, availableWidth / baseViewport.width);
          const viewport = page.getViewport({ scale });
          const slot = document.createElement('div');

          slot.className = 'pdf-page-slot';
          slot.dataset.pageNumber = String(pageNumber);
          slot.style.width = `${Math.floor(viewport.width)}px`;
          slot.style.height = `${Math.floor(viewport.height)}px`;
          slot.setAttribute('aria-label', `${this.title}, сторінка ${pageNumber}`);
          canvasContainer.appendChild(slot);
          page.cleanup();
        }

        if (requestId === this.renderRequestId) {
          this.observePageSlots(pdfDocument, requestId);
        }
      } catch (error) {
        if (requestId !== this.renderRequestId) return;

        this.activeLoadingTask = null;
        console.error('Mobile PDF rendering error:', error);
        this.pdfRendering = false;
        this.pdfRenderError = 'Не вдалося показати PDF у вбудованому переглядачі. Відкрийте файл окремо.';
      }
    }
  }
};
</script>

<style scoped>
.pdf-reader {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
  background: var(--surface, #ffffff);
}

.pdf-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border, #d9e4dd);
  background: var(--surface-soft, #f8faf7);
}

.pdf-toolbar strong {
  color: var(--text-primary, #1e293b);
  line-height: 1.35;
}

.pdf-toolbar a {
  flex: 0 0 auto;
  color: var(--secondary, #C7613C);
  font-weight: 600;
}

.pdf-frame {
  display: block;
  width: 100%;
  min-height: 360px;
  border: 0;
  background: #ffffff;
}

.pdf-canvas-shell {
  min-height: 420px;
  overflow: auto;
  padding: 12px;
  background: #eef3f0;
  overscroll-behavior: contain;
}

.pdf-canvas-pages {
  display: grid;
  gap: 14px;
  justify-items: center;
}

.pdf-canvas-pages canvas {
  display: block;
  max-width: 100%;
  height: auto;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(31, 53, 43, 0.14);
}

.pdf-page-slot {
  display: grid;
  max-width: 100%;
  place-items: center;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(31, 53, 43, 0.14);
}

.pdf-page-slot canvas {
  box-shadow: none;
}

.pdf-render-state,
.pdf-render-error {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 28px 12px;
  color: var(--text-secondary, #485d54);
  text-align: center;
}

.pdf-render-state p,
.pdf-render-error p {
  margin: 0;
  line-height: 1.5;
}

.pdf-render-error a {
  color: var(--secondary, #C7613C);
  font-weight: 700;
}

.pdf-empty {
  padding: 28px;
  text-align: center;
  color: var(--text-secondary, #485d54);
  background: var(--surface-soft, #f8faf7);
}

.pdf-empty strong {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary, #1f352b);
}

.pdf-empty p {
  margin: 0;
  line-height: 1.5;
}

.pdf-loading {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.pdf-loading strong {
  margin-bottom: 0;
}

.pdf-spinner {
  width: 34px;
  height: 34px;
  border: 3px solid color-mix(in srgb, var(--primary, #2F5F48) 18%, transparent);
  border-top-color: var(--primary, #2F5F48);
  border-radius: 50%;
  animation: pdf-spin 0.8s linear infinite;
}

@keyframes pdf-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .pdf-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
