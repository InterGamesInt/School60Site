<template>
  <div class="pdf-reader">
    <div v-if="resolvedSrc" class="pdf-toolbar">
      <strong>{{ title }}</strong>
      <a :href="resolvedSrc" target="_blank" rel="noopener noreferrer">Відкрити PDF</a>
    </div>

    <iframe
      v-if="resolvedSrc && useIframe"
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
