<template>
  <div
    ref="viewport"
    class="rich-text-viewport"
    :style="{ '--rt-document-scale': documentScale, height: viewportHeight }"
  >
    <div ref="document" class="rich-text-document">
      <div class="rich-text-content" v-html="safeHtml"></div>
    </div>
  </div>
</template>

<script>
import { sanitizeRichText } from '../utils/sanitizeRichText';

export default {
  name: 'RichTextContent',
  props: {
    html: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      documentScale: 1,
      viewportHeight: 'auto',
      resizeObserver: null,
      scaleFrame: null
    };
  },
  computed: {
    safeHtml() {
      return sanitizeRichText(this.html);
    }
  },
  watch: {
    safeHtml() {
      this.$nextTick(this.scheduleScaleUpdate);
    }
  },
  mounted() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.scheduleScaleUpdate);
      this.resizeObserver.observe(this.$refs.viewport);
      this.resizeObserver.observe(this.$refs.document);
    }

    this.$refs.viewport.addEventListener('load', this.scheduleScaleUpdate, true);
    window.addEventListener('resize', this.scheduleScaleUpdate);
    this.$nextTick(this.scheduleScaleUpdate);
  },
  beforeUnmount() {
    if (this.scaleFrame) cancelAnimationFrame(this.scaleFrame);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.$refs.viewport?.removeEventListener('load', this.scheduleScaleUpdate, true);
    window.removeEventListener('resize', this.scheduleScaleUpdate);
  },
  methods: {
    scheduleScaleUpdate() {
      if (this.scaleFrame) cancelAnimationFrame(this.scaleFrame);
      this.scaleFrame = requestAnimationFrame(() => {
        this.scaleFrame = null;
        this.updateDocumentScale();
      });
    },
    updateDocumentScale() {
      const viewport = this.$refs.viewport;
      const documentPage = this.$refs.document;
      if (!viewport || !documentPage) return;

      const horizontalPadding = 32;
      const availableWidth = Math.max(0, viewport.clientWidth - horizontalPadding);
      const scale = Math.min(1, availableWidth / 760);
      this.documentScale = Number.isFinite(scale) && scale > 0
        ? Number(scale.toFixed(4))
        : 1;

      this.$nextTick(() => {
        const styles = window.getComputedStyle(viewport);
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const paddingBottom = parseFloat(styles.paddingBottom) || 0;
        const documentHeight = Math.max(documentPage.scrollHeight, documentPage.offsetHeight);
        this.viewportHeight = `${Math.ceil(
          documentHeight * this.documentScale + paddingTop + paddingBottom
        )}px`;
      });
    }
  }
};
</script>

<style scoped>
.rich-text-viewport {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 16px;
  background: var(--surface-muted, #f1f5f9);
  contain: inline-size;
}

.rich-text-document {
  display: block;
  width: 760px;
  max-width: none;
  margin: 0 auto;
  transform: scale(var(--rt-document-scale));
  transform-origin: top left;
}

.rich-text-content {
  display: flow-root;
  width: 760px;
  max-width: none;
  min-height: 1.8em;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 24px 28px;
  color: var(--text-primary, #0f172a);
  background: var(--surface, #ffffff);
  border-radius: 4px;
  box-shadow: var(--shadow-card, 0 8px 24px rgba(15, 23, 42, 0.08));
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

.rich-text-content::after {
  display: block;
  clear: both;
  content: '';
}

.rich-text-content :deep(p) {
  min-height: 1.8em;
  margin: 0 0 0.5em;
}

.rich-text-content :deep(ul),
.rich-text-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.8rem;
}

.rich-text-content :deep(blockquote) {
  margin: 1.2rem 0;
  padding: 0.8rem 1.2rem;
  color: var(--text-muted, #475569);
  background: var(--primary-light, #f8fafc);
  border-left: 4px solid var(--secondary, #C7613C);
  border-radius: 0 8px 8px 0;
  font-style: italic;
}

.rich-text-content :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.rich-text-content :deep(a) {
  color: var(--secondary, #C7613C);
  font-weight: 500;
  text-decoration: underline;
}

.rich-text-content :deep(u) {
  text-decoration: underline;
  text-decoration-skip-ink: auto;
}

.rich-text-content :deep(s),
.rich-text-content :deep(strike),
.rich-text-content :deep(del) {
  text-decoration: line-through;
}

.rich-text-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 0.8rem 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.rich-text-content :deep(code) {
  padding: 0.15rem 0.4rem;
  color: var(--secondary, #C7613C);
  background: var(--surface-muted, #f8fafc);
  border-radius: 4px;
  font-size: 0.9em;
}

.rich-text-content :deep(pre) {
  margin: 1rem 0;
  padding: 1rem 1.2rem;
  overflow-x: auto;
  color: var(--code-text, #e2e8f0);
  background: var(--code-bg, #1e293b);
  border-radius: 12px;
  font-size: 0.9rem;
}

.rich-text-content :deep(pre code) {
  padding: 0;
  color: inherit;
  background: none;
  font-size: inherit;
}

.rich-text-content :deep(hr) {
  margin: 1.5rem 0;
  border: 0;
  border-top: 2px solid var(--border, #e9edf2);
}

.rich-text-content :deep(img.align-left:not([data-wrap="false"])) {
  float: left !important;
  max-width: 50% !important;
  margin-top: 0 !important;
  margin-right: 1.5rem !important;
  margin-bottom: 1rem !important;
}

.rich-text-content :deep(img.align-right:not([data-wrap="false"])) {
  float: right !important;
  max-width: 50% !important;
  margin-top: 0 !important;
  margin-bottom: 1rem !important;
  margin-left: 1.5rem !important;
}

.rich-text-content :deep(img.align-center) {
  display: block !important;
  clear: both !important;
  max-width: 100% !important;
  margin: 1.2rem auto !important;
}

.rich-text-content :deep(img.align-left[data-wrap="false"]),
.rich-text-content :deep(img.align-right[data-wrap="false"]) {
  display: block !important;
  float: none !important;
  clear: both !important;
  max-width: 100% !important;
  margin: 1.2rem 0 !important;
}

.rich-text-content :deep(.video-wrapper) {
  max-width: 100%;
}

.rich-text-content :deep(.video-wrapper iframe) {
  display: block;
  max-width: 100%;
  border: 0;
}

.rich-text-content :deep(.video-wrapper.align-left) {
  float: left !important;
  clear: left !important;
  max-width: 50% !important;
  margin-right: 1.5rem !important;
  margin-bottom: 1rem !important;
}

.rich-text-content :deep(.video-wrapper.align-right) {
  float: right !important;
  clear: right !important;
  max-width: 50% !important;
  margin-bottom: 1rem !important;
  margin-left: 1.5rem !important;
}

.rich-text-content :deep(.video-wrapper.align-center) {
  display: block !important;
  clear: both !important;
  max-width: 100% !important;
  margin: 1.2rem auto !important;
}

.rich-text-content :deep(h1),
.rich-text-content :deep(h2),
.rich-text-content :deep(h3),
.rich-text-content :deep(h4),
.rich-text-content :deep(blockquote),
.rich-text-content :deep(hr) {
  clear: both;
}

</style>
