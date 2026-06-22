<template>
  <div class="rich-text-editor" :class="{ 'is-focused': isFocused }">
    <!-- Панель інструментів -->
    <div class="toolbar" v-if="editor">
      <!-- Історія -->
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          title="Скасувати (Ctrl+Z)"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          title="Повернути (Ctrl+Y)"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
          </svg>
        </button>
      </div>

      <!-- Форматування -->
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          title="Жирний (Ctrl+B)"
          class="tool-btn"
        >
          <strong>B</strong>
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          title="Курсив (Ctrl+I)"
          class="tool-btn"
        >
          <em>I</em>
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }"
          title="Підкреслений (Ctrl+U)"
          class="tool-btn"
        >
          <u>U</u>
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          title="Закреслений"
          class="tool-btn"
        >
          <s>S</s>
        </button>
        <button
          @click="clearFormatting"
          title="Очистити форматування"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </button>
      </div>

      <!-- Розмір і шрифт -->
      <div class="toolbar-group">
        <select
          ref="fontSizeSelect"
          @change="setFontSize($event.target.value)"
          class="tool-select"
          title="Розмір шрифту"
        >
          <option value="">Розмір</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
          <option value="28px">28</option>
          <option value="32px">32</option>
          <option value="36px">36</option>
          <option value="48px">48</option>
          <option value="72px">72</option>
        </select>
        <select
          ref="fontFamilySelect"
          @change="setFontFamily($event.target.value)"
          class="tool-select"
          title="Шрифт"
        >
          <option value="">Шрифт</option>
          <option value="Arial, Helvetica, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Verdana, Geneva, sans-serif">Verdana</option>
          <option value="Tahoma, sans-serif">Tahoma</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="Impact, sans-serif">Impact</option>
        </select>
      </div>

      <!-- Колір -->
      <div class="toolbar-group color-group">
        <div class="color-wrapper" title="Колір тексту">
          <input
            type="color"
            @input="setColor($event.target.value)"
            :value="currentColor"
            class="color-picker"
          />
          <span class="color-preview" :style="{ background: currentColor }"></span>
        </div>
        <button @click="unsetColor" title="Скинути колір" class="tool-btn color-reset">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Вирівнювання -->
      <div class="toolbar-group">
        <button
          @click="setTextAlign('left')"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          title="По лівому краю"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          @click="setTextAlign('center')"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          title="По центру"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          @click="setTextAlign('right')"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          title="По правому краю"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          @click="setTextAlign('justify')"
          :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          title="По ширині"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /><line x1="6" y1="9" x2="18" y2="9" /><line x1="6" y1="15" x2="18" y2="15" />
          </svg>
        </button>
      </div>

      <!-- Списки та цитати -->
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          title="Маркований список"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="6" cy="6" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><line x1="12" y1="6" x2="20" y2="6" /><line x1="12" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          title="Нумерований список"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <text x="4" y="8" font-size="8" font-weight="bold" fill="currentColor">1</text><text x="4" y="14" font-size="8" font-weight="bold" fill="currentColor">2</text><text x="4" y="20" font-size="8" font-weight="bold" fill="currentColor">3</text><line x1="12" y1="6" x2="20" y2="6" /><line x1="12" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          title="Цитата"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().setHorizontalRule().run()"
          title="Горизонтальна лінія"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          title="Код"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
        </button>
      </div>

      <!-- Посилання, медіа -->
      <div class="toolbar-group">
        <button
          @click="setLink"
          :class="{ 'is-active': editor.isActive('link') }"
          title="Посилання (Ctrl+K)"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
        <button
          @click="openImageDialog"
          title="Зображення"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        <button
          @click="openVideoDialog"
          title="Відео"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
        </button>
        <button
          @click="editSelectedMedia"
          :disabled="!editor?.isActive('image') && !editor?.isActive('video')"
          title="Редагувати медіа"
          class="tool-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
        <button
          @click="toggleWrap"
          :disabled="!editor?.isActive('image')"
          :class="{ 'is-active': editor?.isActive('image') && getImageWrap() }"
          title="Обтікання текстом"
          class="tool-btn wrap-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Область редагування -->
    <div
      class="editor-drop-zone"
      @dragover.prevent
      @dragenter.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="handleDrop"
      :class="{ 'is-dragover': isDragOver }"
    >
      <div
        ref="editorViewport"
        class="editor-content"
        :style="{ '--rt-document-scale': documentScale, height: documentViewportHeight }"
      >
        <editor-content
          :editor="editor"
          class="editor-document"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
      </div>
      <div v-if="isDragOver" class="drop-overlay">
        <span>📸 Відпустіть для завантаження зображення</span>
      </div>
    </div>

    <!-- Діалог зображення -->
    <div v-if="imageDialogVisible" class="dialog-overlay" @click.self="closeImageDialog">
      <div class="dialog">
        <h3>{{ editingImage ? 'Редагувати зображення' : 'Вставити зображення' }}</h3>
        <div class="dialog-tabs" v-if="!editingImage">
          <button :class="{ active: activeTab === 'url' }" @click="activeTab = 'url'">За URL</button>
          <button :class="{ active: activeTab === 'upload' }" @click="activeTab = 'upload'">Завантажити</button>
        </div>

        <!-- URL -->
        <div v-if="activeTab === 'url' || editingImage" class="dialog-body">
          <input
            v-if="!editingImage"
            type="text"
            v-model="imageUrl"
            placeholder="https://example.com/image.jpg"
            class="dialog-input"
          />
          <div class="size-fields">
            <div class="size-field">
              <label>Ширина:</label>
              <input type="number" v-model.number="imageWidth" placeholder="авто" step="1" class="size-input" />
              <select v-model="widthUnit" class="size-unit">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
            <div class="size-field">
              <label>Висота:</label>
              <input type="number" v-model.number="imageHeight" placeholder="авто" step="1" class="size-input" />
              <select v-model="heightUnit" class="size-unit">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <small class="dialog-hint">Залиште порожнім для автоматичного розміру</small>
          <div class="dialog-actions">
            <button class="btn-primary" @click="insertOrUpdateImage" :disabled="loadingImage">
              {{ loadingImage ? 'Завантаження...' : 'Застосувати' }}
            </button>
            <button class="btn-secondary" @click="closeImageDialog">Скасувати</button>
          </div>
        </div>

        <!-- Завантаження -->
        <div v-if="activeTab === 'upload' && !editingImage" class="dialog-body">
          <div class="upload-zone" @dragover.prevent @drop.prevent="handleLocalDrop">
            <input type="file" ref="localFileInput" accept="image/*" @change="handleLocalImageUpload" class="upload-input" />
            <div class="upload-placeholder">
              <span class="upload-icon">📤</span>
              <p>Перетягніть зображення або натисніть для вибору</p>
            </div>
          </div>
          <div v-if="uploadPreview" class="upload-preview">
            <img :src="uploadPreview" alt="Preview" />
            <button class="btn-primary" @click="insertBase64Image">Вставити</button>
          </div>
        </div>

        <button class="dialog-close" @click="closeImageDialog">✕</button>
      </div>
    </div>

    <!-- Діалог відео -->
    <div v-if="videoDialogVisible" class="dialog-overlay" @click.self="closeVideoDialog">
      <div class="dialog">
        <h3>Вставити відео</h3>
        <div class="dialog-body">
          <input
            type="text"
            v-model="videoUrl"
            placeholder="https://www.youtube.com/watch?v=... або пряме посилання"
            class="dialog-input"
          />
          <div class="size-fields">
            <div class="size-field">
              <label>Ширина (px):</label>
              <input type="number" v-model.number="videoWidth" placeholder="560" class="size-input" />
            </div>
            <div class="size-field">
              <label>Висота (px):</label>
              <input type="number" v-model.number="videoHeight" placeholder="315" class="size-input" />
            </div>
          </div>
          <small class="dialog-hint">Залиште порожнім для стандартного розміру (560x315)</small>
          <div class="dialog-actions">
            <button class="btn-primary" @click="insertVideo" :disabled="!videoUrl">Вставити</button>
            <button class="btn-secondary" @click="closeVideoDialog">Скасувати</button>
          </div>
        </div>
        <button class="dialog-close" @click="closeVideoDialog">✕</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Image from '@tiptap/extension-image'
import { Node } from '@tiptap/core'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import { TextAlign } from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'

// ============================================================
// КАСТОМНЕ РОЗШИРЕННЯ ДЛЯ РОЗМІРУ ШРИФТУ (FontSize)
// ============================================================
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize || null,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {}
          return { style: `font-size: ${attributes.fontSize}` }
        }
      }
    }
  }
})

// ============================================================
// КАСТОМНЕ РОЗШИРЕННЯ ДЛЯ ЗОБРАЖЕНЬ (з підтримкою вирівнювання та обтікання)
// ============================================================
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: 'max-width: 100%; height: auto; max-height: 400px;',
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          if (!attributes.style) return {}
          return { style: attributes.style }
        }
      },
      textAlign: {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-text-align') || element.style.textAlign || 'left',
        renderHTML: (attributes) => {
          return {
            class: `align-${attributes.textAlign || 'left'}`,
            'data-text-align': attributes.textAlign || 'left'
          }
        }
      },
      wrap: {
        default: true,
        parseHTML: (element) => element.getAttribute('data-wrap') !== 'false',
        renderHTML: (attributes) => {
          return { 'data-wrap': attributes.wrap ? 'true' : 'false' }
        }
      }
    }
  }
})

// ============================================================
// КАСТОМНЕ РОЗШИРЕННЯ ДЛЯ ВІДЕО (iframe)
// ============================================================
const CustomVideo = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '560' },
      height: { default: '315' },
      textAlign: {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-text-align') || element.style.textAlign || 'left',
        renderHTML: (attributes) => {
          if (!attributes.textAlign || attributes.textAlign === 'left') return {}
          return {
            class: `align-${attributes.textAlign}`,
            'data-text-align': attributes.textAlign
          }
        }
      }
    }
  },

  parseHTML() {
    return [{ tag: 'iframe[src]' }, { tag: 'video[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, width, height, textAlign } = HTMLAttributes
    const alignClass = textAlign && textAlign !== 'left' ? ` align-${textAlign}` : ''
    return [
      'div',
      {
        class: `video-wrapper${alignClass}`,
        'data-text-align': textAlign || 'left'
      },
      ['iframe', {
        src: src,
        width: width || '560',
        height: height || '315',
        frameborder: '0',
        allowfullscreen: 'true',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      }]
    ]
  }
})

export default {
  name: 'RichTextEditor',
  components: { EditorContent },
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Розпочніть писати...' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const fontSizeSelect = ref(null)
    const fontFamilySelect = ref(null)
    const currentColor = ref('#000000')
    const isFocused = ref(false)
    const isDragOver = ref(false)
    const editorViewport = ref(null)
    const documentScale = ref(1)
    const documentViewportHeight = ref('auto')
    let resizeObserver = null
    let scaleFrame = null

    function getViewportElement() {
      const target = editorViewport.value
      return target?.$el || target
    }

    function scheduleDocumentScaleUpdate() {
      if (scaleFrame) cancelAnimationFrame(scaleFrame)
      scaleFrame = requestAnimationFrame(updateDocumentScale)
    }

    function updateDocumentScale() {
      const viewport = getViewportElement()
      if (!viewport) return

      const horizontalPadding = 32
      const availableWidth = Math.max(0, viewport.clientWidth - horizontalPadding)
      const scale = Math.min(1, availableWidth / 760)
      documentScale.value = Number.isFinite(scale) && scale > 0 ? scale.toFixed(4) : 1

      nextTick(() => {
        const page = viewport.querySelector('.ProseMirror')
        if (!page) return

        const viewportStyles = window.getComputedStyle(viewport)
        const paddingTop = parseFloat(viewportStyles.paddingTop) || 0
        const paddingBottom = parseFloat(viewportStyles.paddingBottom) || 0
        const pageHeight = page.scrollHeight
        documentViewportHeight.value = `${Math.ceil(pageHeight * Number(documentScale.value) + paddingTop + paddingBottom)}px`
      })
    }

    const editor = useEditor({
      content: props.modelValue,
      extensions: [
        // StarterKit вже включає: історію, код, горизонтальну лінію, списки, цитати тощо
        StarterKit.configure({
          // Вимикаємо те, що будемо додавати окремо
          link: false,
          underline: false,
          strike: false,
          codeBlock: false,   // ми додамо окремо, але можна лишити
          horizontalRule: false, // ми додамо окремо
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' }
        }),
        Underline,
        Strike,
        CustomImage,
        CustomVideo,
        FontSize,
        FontFamily,
        Color,
        TextAlign.configure({
          types: ['heading', 'paragraph', 'image', 'video'],
          alignments: ['left', 'center', 'right', 'justify'],
        }),
        Placeholder.configure({ placeholder: props.placeholder })
      ],
      onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
        updateToolbar()
        scheduleDocumentScaleUpdate()
      },
      onSelectionUpdate: () => {
        updateToolbar()
        scheduleDocumentScaleUpdate()
      }
    })

    // ============================================================
    // ФУНКЦІЯ ДЛЯ ОТРИМАННЯ АТРИБУТІВ З УРАХУВАННЯМ ЗМІШАНИХ ВИДІЛЕНЬ
    // ============================================================
    function getSelectionAttribute(attributeName) {
      if (!editor.value) return ''
      const { state } = editor.value
      const { from, to, empty } = state.selection

      if (empty) {
        const attrs = editor.value.getAttributes('textStyle')
        return attrs[attributeName] || ''
      }

      let firstValue = null
      let isMixed = false

      state.doc.nodesBetween(from, to, (node) => {
        if (node.isText) {
          const mark = node.marks.find(m => m.type.name === 'textStyle')
          const currentValue = mark ? mark.attrs[attributeName] : null
          if (firstValue === null) firstValue = currentValue
          else if (firstValue !== currentValue) isMixed = true
        }
      })

      if (isMixed) return ''
      return firstValue || ''
    }

    // ============================================================
    // ОНОВЛЕННЯ ПАНЕЛІ
    // ============================================================
    function updateToolbar() {
      if (!editor.value) return

      const fontSize = getSelectionAttribute('fontSize')
      const fontFamily = getSelectionAttribute('fontFamily')
      const colorAttrs = editor.value.getAttributes('color')
      const color = colorAttrs.color || '#000000'

      if (fontSizeSelect.value) fontSizeSelect.value.value = fontSize
      if (fontFamilySelect.value) fontFamilySelect.value.value = fontFamily
      currentColor.value = color
    }

    // ============================================================
    // ОТРИМАННЯ СТАНУ ОБТІКАННЯ ДЛЯ ПОТОЧНОГО ЗОБРАЖЕННЯ
    // ============================================================
    function getImageWrap() {
      if (!editor.value || !editor.value.isActive('image')) return false
      const attrs = editor.value.getAttributes('image')
      return attrs.wrap !== false
    }

    // ============================================================
    // ПЕРЕМИКАННЯ ОБТІКАННЯ
    // ============================================================
    function toggleWrap() {
      if (!editor.value || !editor.value.isActive('image')) return
      const currentWrap = getImageWrap()
      editor.value.chain().focus().updateAttributes('image', { wrap: !currentWrap }).run()
    }

    // ============================================================
    // ОЧИСТИТИ ФОРМАТУВАННЯ
    // ============================================================
    function clearFormatting() {
      if (!editor.value) return
      editor.value.chain().focus().clearNodes().unsetAllMarks().run()
    }

    // ============================================================
    // МЕТОДИ ФОРМАТУВАННЯ
    // ============================================================
    const setFontSize = (size) => {
      if (!editor.value) return
      if (!size) {
        editor.value.chain().focus().unsetMark('textStyle').run()
        return
      }
      editor.value.chain().focus().setMark('textStyle', { fontSize: size }).run()
      setTimeout(updateToolbar, 50)
    }

    const setFontFamily = (family) => {
      if (!editor.value) return
      if (!family) {
        editor.value.chain().focus().unsetMark('textStyle').run()
        return
      }
      editor.value.chain().focus().setFontFamily(family).run()
      setTimeout(updateToolbar, 50)
    }

    const setTextAlign = (alignment) => {
      if (!editor.value) return
      if (editor.value.isActive('image')) {
        editor.value.chain().focus().updateAttributes('image', { textAlign: alignment }).run()
      } else if (editor.value.isActive('video')) {
        editor.value.chain().focus().updateAttributes('video', { textAlign: alignment }).run()
      } else {
        editor.value.chain().focus().setTextAlign(alignment).run()
      }
    }

    const setColor = (color) => {
      if (!editor.value) return
      editor.value.chain().focus().setColor(color).run()
      currentColor.value = color
    }

    const unsetColor = () => {
      if (!editor.value) return
      editor.value.chain().focus().unsetColor().run()
      currentColor.value = '#000000'
    }

    const setLink = () => {
      const previousUrl = editor.value.getAttributes('link').href
      const url = window.prompt('Введіть URL:', previousUrl)
      if (url === null) return
      if (url === '') {
        editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    // ============================================================
    // ДІАЛОГ ЗОБРАЖЕННЯ
    // ============================================================
    const imageDialogVisible = ref(false)
    const activeTab = ref('url')
    const imageUrl = ref('')
    const localFileInput = ref(null)
    const uploadPreview = ref(null)
    const loadingImage = ref(false)
    let pendingBase64 = null
    const editingImage = ref(false)
    let currentImageNode = null

    const imageWidth = ref(null)
    const imageHeight = ref(null)
    const widthUnit = ref('px')
    const heightUnit = ref('px')

    function parseStyleValue(style, property) {
      const regex = new RegExp(`${property}:\\s*([\\d.]+)(px|%)?`)
      const match = style.match(regex)
      if (match) {
        return { value: parseFloat(match[1]), unit: match[2] || 'px' }
      }
      return { value: null, unit: 'px' }
    }

    const openImageDialog = () => {
      editingImage.value = false
      activeTab.value = 'url'
      imageUrl.value = ''
      imageWidth.value = null
      imageHeight.value = null
      widthUnit.value = 'px'
      heightUnit.value = 'px'
      uploadPreview.value = null
      pendingBase64 = null
      imageDialogVisible.value = true
    }

    const editSelectedMedia = () => {
      if (!editor.value) return
      if (editor.value.isActive('image')) {
        const { state } = editor.value
        const { from } = state.selection
        const node = state.doc.nodeAt(from)
        if (node && node.type.name === 'image') {
          const src = node.attrs.src
          const style = node.attrs.style || ''
          const widthInfo = parseStyleValue(style, 'width')
          const heightInfo = parseStyleValue(style, 'height')
          imageUrl.value = src
          imageWidth.value = widthInfo.value
          imageHeight.value = heightInfo.value
          widthUnit.value = widthInfo.unit
          heightUnit.value = heightInfo.unit
          editingImage.value = true
          currentImageNode = { node }
          imageDialogVisible.value = true
        }
      } else if (editor.value.isActive('video')) {
        alert('Редагування відео поки що не реалізовано.')
      }
    }

    const generateImageStyle = (widthVal, widthUnitVal, heightVal, heightUnitVal) => {
      let style = ''
      if (widthVal !== null && widthVal !== undefined && widthVal !== '') {
        style += `width: ${widthVal}${widthUnitVal}; `
      }
      if (heightVal !== null && heightVal !== undefined && heightVal !== '') {
        style += `height: ${heightVal}${heightUnitVal}; `
      }
      if (!style) {
        style = 'max-width: 100%; height: auto; max-height: 400px;'
      } else {
        style += 'max-width: 100%; height: auto;'
        if (widthVal !== null && (heightVal === null || heightVal === '')) style += ' height: auto;'
        if (heightVal !== null && (widthVal === null || widthVal === '')) style += ' width: auto;'
      }
      return style.trim()
    }

    function getCurrentAlignment() {
      if (!editor.value) return 'left'
      try {
        if (editor.value.isActive('image')) {
          return editor.value.getAttributes('image').textAlign || 'left'
        }
        if (editor.value.isActive('video')) {
          return editor.value.getAttributes('video').textAlign || 'left'
        }
        return 'left'
      } catch {
        return 'left'
      }
    }

    const insertOrUpdateImage = async () => {
      if (editingImage.value && currentImageNode) {
        const newStyle = generateImageStyle(imageWidth.value, widthUnit.value, imageHeight.value, heightUnit.value)
        const currentWrap = currentImageNode.node.attrs.wrap !== false
        editor.value.chain().focus().updateAttributes('image', {
          src: imageUrl.value,
          style: newStyle,
          textAlign: getCurrentAlignment(),
          wrap: currentWrap
        }).run()
        closeImageDialog()
        return
      }
      if (activeTab.value === 'url') {
        if (!imageUrl.value) return
        loadingImage.value = true
        try {
          const style = generateImageStyle(imageWidth.value, widthUnit.value, imageHeight.value, heightUnit.value)
          const alignment = getCurrentAlignment()
          editor.value.chain().focus().setImage({
            src: imageUrl.value,
            style: style,
            textAlign: alignment,
            wrap: true
          }).run()
          closeImageDialog()
        } catch (err) {
          console.error(err)
          alert('Помилка вставки зображення')
        } finally {
          loadingImage.value = false
        }
      }
    }

    const handleLocalImageUpload = (event) => {
      const file = event.target.files[0]
      if (!file || !file.type.startsWith('image/')) {
        alert('Оберіть зображення')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadPreview.value = e.target.result
        pendingBase64 = e.target.result
      }
      reader.readAsDataURL(file)
    }

    const handleLocalDrop = (e) => {
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          uploadPreview.value = ev.target.result
          pendingBase64 = ev.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const insertBase64Image = () => {
      if (!pendingBase64) return
      const style = generateImageStyle(imageWidth.value, widthUnit.value, imageHeight.value, heightUnit.value)
      const alignment = getCurrentAlignment()
      editor.value.chain().focus().setImage({
        src: pendingBase64,
        style: style,
        textAlign: alignment,
        wrap: true
      }).run()
      closeImageDialog()
    }

    const closeImageDialog = () => {
      imageDialogVisible.value = false
      if (localFileInput.value) localFileInput.value.value = ''
      editingImage.value = false
      currentImageNode = null
      uploadPreview.value = null
      pendingBase64 = null
    }

    // ============================================================
    // ДІАЛОГ ВІДЕО
    // ============================================================
    const videoDialogVisible = ref(false)
    const videoUrl = ref('')
    const videoWidth = ref(560)
    const videoHeight = ref(315)

    const openVideoDialog = () => {
      videoDialogVisible.value = true
      videoUrl.value = ''
    }

    const closeVideoDialog = () => {
      videoDialogVisible.value = false
    }

    const insertVideo = () => {
      if (!videoUrl.value) return
      let embedUrl = videoUrl.value
      if (embedUrl.includes('youtube.com/watch?v=')) {
        const videoId = embedUrl.split('v=')[1]?.split('&')[0]
        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (embedUrl.includes('youtu.be/')) {
        const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0]
        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (embedUrl.includes('vimeo.com/')) {
        const videoId = embedUrl.split('vimeo.com/')[1]?.split('/')[0]
        if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`
      }
      const alignment = getCurrentAlignment()
      editor.value.chain().focus().insertContent({
        type: 'video',
        attrs: {
          src: embedUrl,
          width: videoWidth.value || 560,
          height: videoHeight.value || 315,
          textAlign: alignment
        }
      }).run()
      closeVideoDialog()
    }

    // ============================================================
    // DRAG & DROP НА РЕДАКТОР
    // ============================================================
    const handleDrop = (e) => {
      isDragOver.value = false
      const files = e.dataTransfer.files
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        openImageDialog()
        activeTab.value = 'upload'
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (ev) => {
          uploadPreview.value = ev.target.result
          pendingBase64 = ev.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    // ============================================================
    // СИНХРОНІЗАЦІЯ З БАТЬКІВСЬКИМ КОМПОНЕНТОМ
    // ============================================================
    watch(
      () => props.modelValue,
      (newVal) => {
        const isSame = editor.value?.getHTML() === newVal
        if (!isSame && newVal !== undefined) {
          editor.value?.commands.setContent(newVal, false)
          nextTick(scheduleDocumentScaleUpdate)
        }
      }
    )

    if (editor.value) {
      editor.value.on('selectionUpdate', updateToolbar)
      setTimeout(updateToolbar, 100)
      setTimeout(scheduleDocumentScaleUpdate, 100)
    }

    onMounted(() => {
      const viewport = getViewportElement()
      if (viewport) {
        resizeObserver = new ResizeObserver(scheduleDocumentScaleUpdate)
        resizeObserver.observe(viewport)
        viewport.addEventListener('load', scheduleDocumentScaleUpdate, true)
      }
      window.addEventListener('resize', scheduleDocumentScaleUpdate)
      nextTick(scheduleDocumentScaleUpdate)
    })

    onBeforeUnmount(() => {
      if (scaleFrame) cancelAnimationFrame(scaleFrame)
      if (resizeObserver) resizeObserver.disconnect()
      const viewport = getViewportElement()
      if (viewport) viewport.removeEventListener('load', scheduleDocumentScaleUpdate, true)
      window.removeEventListener('resize', scheduleDocumentScaleUpdate)
      if (editor.value) {
        editor.value.off('selectionUpdate', updateToolbar)
      }
    })

    return {
      editor,
      isFocused,
      isDragOver,
      fontSizeSelect,
      fontFamilySelect,
      currentColor,
      editorViewport,
      documentScale,
      documentViewportHeight,
      getImageWrap,
      toggleWrap,
      clearFormatting,
      setFontSize,
      setFontFamily,
      setTextAlign,
      setColor,
      unsetColor,
      setLink,
      imageDialogVisible,
      activeTab,
      imageUrl,
      localFileInput,
      uploadPreview,
      loadingImage,
      imageWidth,
      imageHeight,
      widthUnit,
      heightUnit,
      editingImage,
      openImageDialog,
      editSelectedMedia,
      insertOrUpdateImage,
      handleLocalImageUpload,
      handleLocalDrop,
      insertBase64Image,
      closeImageDialog,
      videoDialogVisible,
      videoUrl,
      videoWidth,
      videoHeight,
      openVideoDialog,
      closeVideoDialog,
      insertVideo,
      handleDrop
    }
  }
}
</script>

<style scoped>
/* ===== ЗМІННІ ===== */
:root {
  --editor-radius: 16px;
  --editor-shadow: 0 2px 12px rgba(47, 95, 72, 0.06);
  --editor-shadow-focus: 0 4px 20px rgba(47, 95, 72, 0.10);
  --toolbar-bg: #f8fafc;
  --toolbar-border: #e9edf2;
  --btn-bg: #ffffff;
  --btn-border: #d1d9e0;
  --btn-hover: #f1f5f9;
  --btn-active: #C7613C;
  --btn-active-text: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #4a5568;
  --text-muted: #94a3b8;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== ОСНОВНИЙ КОНТЕЙНЕР ===== */
.rich-text-editor {
  --rt-document-width: 760px;
  --rt-document-scale: 1;
  border: 1.5px solid var(--toolbar-border);
  border-radius: var(--editor-radius);
  overflow: hidden;
  background: var(--white, #ffffff);
  box-shadow: var(--editor-shadow);
  transition: border-color var(--transition), box-shadow var(--transition);
}
.rich-text-editor.is-focused {
  border-color: var(--btn-active);
  box-shadow: var(--editor-shadow-focus);
}

/* ===== ПАНЕЛЬ ІНСТРУМЕНТІВ ===== */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 12px;
  background: var(--toolbar-bg);
  border-bottom: 1px solid var(--toolbar-border);
  align-items: center;
  min-height: 48px;
  user-select: none;
}
.toolbar-group {
  display: flex;
  gap: 3px;
  padding: 0 8px;
  border-right: 1px solid var(--toolbar-border);
  align-items: center;
}
.toolbar-group:last-child { border-right: none; }

.tool-btn {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  line-height: 1;
  position: relative;
}
.tool-btn:hover:not(:disabled) {
  background: var(--btn-hover);
  transform: translateY(-1px);
}
.tool-btn.is-active {
  background: var(--btn-active);
  color: var(--btn-active-text);
  box-shadow: 0 2px 8px rgba(199, 97, 60, 0.25);
}
.tool-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none !important;
}
.tool-btn svg {
  display: block;
  flex-shrink: 0;
}

.tool-select {
  background: var(--white, #ffffff);
  border: 1px solid var(--btn-border);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-primary);
  height: 32px;
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.tool-select:hover { border-color: var(--text-muted); }
.tool-select:focus {
  border-color: var(--btn-active);
  box-shadow: 0 0 0 3px rgba(199, 97, 60, 0.12);
}

/* ===== КОЛІР ===== */
.color-group {
  display: flex;
  align-items: center;
  gap: 4px;
}
.color-wrapper {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  border: 1.5px solid var(--btn-border);
  cursor: pointer;
  transition: border-color var(--transition);
  flex-shrink: 0;
}
.color-wrapper:hover { border-color: var(--text-muted); }
.color-picker {
  position: absolute;
  top: -4px;
  left: -4px;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  border: none;
  padding: 0;
  cursor: pointer;
  background: transparent;
}
.color-preview {
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 6px;
  pointer-events: none;
  display: block;
}
.color-reset {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  color: var(--text-muted);
}
.color-reset:hover {
  background: var(--btn-hover);
  color: var(--text-primary);
}

/* ===== ОБЛАСТЬ РЕДАКТУВАННЯ ===== */
.editor-drop-zone {
  position: relative;
  transition: background var(--transition);
  background: #f1f5f9;
}
.editor-content {
  display: block;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 16px;
}
.editor-document {
  display: block;
  width: var(--rt-document-width);
  max-width: none;
  margin: 0 auto;
  transform: scale(var(--rt-document-scale));
  transform-origin: top left;
}
.editor-drop-zone.is-dragover {
  background: rgba(199, 97, 60, 0.04);
}
.drop-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(199, 97, 60, 0.08);
  backdrop-filter: blur(2px);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--btn-active);
  border-radius: 0 0 var(--editor-radius) var(--editor-radius);
  pointer-events: none;
  z-index: 5;
}

.editor-content :deep(.ProseMirror) {
  --rt-content-line-height: 28.8px;
  width: var(--rt-document-width);
  max-width: none;
  box-sizing: border-box;
  margin: 0 auto;
  min-height: 280px;
  padding: 24px 28px;
  outline: none;
  line-height: 1.8;
  color: var(--text-primary);
  font-size: 16px;
  background: var(--white, #ffffff);
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}
.editor-content :deep(.ProseMirror p) {
  margin: 0 0 0.5em 0;
  min-height: 1.8em;
}
.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: var(--text-muted);
  pointer-events: none;
  font-weight: 400;
}
.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  padding-left: 1.8rem;
  margin: 0.5rem 0;
}
.editor-content :deep(.ProseMirror blockquote) {
  border-left: 4px solid var(--btn-active);
  margin: 1.2rem 0;
  padding: 0.8rem 1.2rem;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--toolbar-bg);
  border-radius: 0 8px 8px 0;
}
.editor-content :deep(.ProseMirror a) {
  color: var(--btn-active);
  text-decoration: underline;
  font-weight: 500;
}
.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 0.8rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.editor-content :deep(.ProseMirror .ProseMirror-selectednode) {
  outline: 2px solid var(--btn-active);
  outline-offset: 2px;
  border-radius: 8px;
}
.editor-content :deep(.ProseMirror code) {
  background: var(--toolbar-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--btn-active);
}
.editor-content :deep(.ProseMirror pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  overflow-x: auto;
  font-size: 0.9rem;
  margin: 1rem 0;
}
.editor-content :deep(.ProseMirror pre code) {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
}
.editor-content :deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid var(--toolbar-border);
  margin: 1.5rem 0;
}

/* ===== ВИРІВНЮВАННЯ ЗОБРАЖЕНЬ ===== */
.editor-content :deep(.ProseMirror img.align-left:not([data-wrap="false"])) {
  float: left !important;
  margin-top: 0 !important;
  margin-right: 1.5rem !important;
  margin-bottom: 1rem !important;
  max-width: 50% !important;
}
.editor-content :deep(.ProseMirror img.align-right:not([data-wrap="false"])) {
  float: right !important;
  margin-top: 0 !important;
  margin-left: 1.5rem !important;
  margin-bottom: 1rem !important;
  max-width: 50% !important;
}
.editor-content :deep(.ProseMirror img.align-center) {
  display: block !important;
  clear: both !important;
  margin: 1.2rem auto !important;
  max-width: 100% !important;
}
.editor-content :deep(.ProseMirror img.align-left[data-wrap="false"]),
.editor-content :deep(.ProseMirror img.align-right[data-wrap="false"]) {
  display: block !important;
  float: none !important;
  clear: both !important;
  margin: 1.2rem 0 !important;
  max-width: 100% !important;
}
.editor-content :deep(.ProseMirror .video-wrapper.align-left) {
  float: left !important;
  clear: left !important;
  margin-right: 1.5rem !important;
  margin-bottom: 1rem !important;
  max-width: 50% !important;
}
.editor-content :deep(.ProseMirror .video-wrapper.align-right) {
  float: right !important;
  clear: right !important;
  margin-left: 1.5rem !important;
  margin-bottom: 1rem !important;
  max-width: 50% !important;
}
.editor-content :deep(.ProseMirror .video-wrapper.align-center) {
  display: block !important;
  clear: both !important;
  margin: 1.2rem auto !important;
  max-width: 100% !important;
}
.editor-content :deep(.ProseMirror h1),
.editor-content :deep(.ProseMirror h2),
.editor-content :deep(.ProseMirror h3),
.editor-content :deep(.ProseMirror h4),
.editor-content :deep(.ProseMirror blockquote),
.editor-content :deep(.ProseMirror hr) {
  clear: both;
}

/* ===== ДІАЛОГИ ===== */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}
.dialog {
  background: var(--white, #ffffff);
  border-radius: 28px;
  padding: 32px 36px 28px;
  width: 100%;
  max-width: 540px;
  position: relative;
  box-shadow: 0 32px 64px rgba(0,0,0,0.18);
  animation: dialogFade 0.25s ease;
}
@keyframes dialogFade {
  from { opacity: 0; transform: scale(0.94) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.dialog h3 {
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary, #2F5F48);
  text-align: center;
  padding-right: 28px;
}
.dialog-close {
  position: absolute;
  top: 14px;
  right: 18px;
  background: none;
  border: none;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  color: var(--text-muted);
  transition: color var(--transition), transform var(--transition);
  padding: 4px 8px;
  border-radius: 8px;
}
.dialog-close:hover {
  color: var(--btn-active);
  transform: rotate(90deg);
}
.dialog-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.dialog-tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background: var(--toolbar-bg);
  cursor: pointer;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  transition: all var(--transition);
  color: var(--text-secondary);
}
.dialog-tabs button.active {
  background: var(--btn-active);
  color: var(--btn-active-text);
}
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dialog-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--btn-border);
  border-radius: 12px;
  font-size: 15px;
  transition: border-color var(--transition), box-shadow var(--transition);
  background: var(--white, #ffffff);
  color: var(--text-primary);
}
.dialog-input:focus {
  outline: none;
  border-color: var(--btn-active);
  box-shadow: 0 0 0 3px rgba(199,97,60,0.12);
}
.dialog-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: -4px;
}
.dialog-actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}
.btn-primary {
  background: var(--primary, #2F5F48);
  color: var(--white, #ffffff);
  border: none;
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all var(--transition);
}
.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark, #1e4032);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(47,95,72,0.25);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
.btn-secondary {
  background: var(--toolbar-bg);
  color: var(--text-secondary);
  border: 1px solid var(--btn-border);
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all var(--transition);
}
.btn-secondary:hover {
  background: var(--btn-hover);
}

/* ===== РОЗМІРИ ===== */
.size-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.size-field {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1 1 160px;
}
.size-field label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 14px;
  white-space: nowrap;
}
.size-input {
  width: 70px;
  padding: 8px 10px;
  border: 1.5px solid var(--btn-border);
  border-radius: 8px;
  font-size: 14px;
  background: var(--white, #ffffff);
  color: var(--text-primary);
}
.size-input:focus {
  outline: none;
  border-color: var(--btn-active);
}
.size-unit {
  padding: 8px 4px;
  border: 1.5px solid var(--btn-border);
  border-radius: 8px;
  background: var(--white, #ffffff);
  font-size: 13px;
  color: var(--text-primary);
}

/* ===== ЗАВАНТАЖЕННЯ ===== */
.upload-zone {
  border: 2px dashed var(--btn-border);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  position: relative;
}
.upload-zone:hover {
  border-color: var(--btn-active);
  background: rgba(199,97,60,0.03);
}
.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.upload-icon {
  font-size: 2.4rem;
  display: block;
  margin-bottom: 8px;
}
.upload-placeholder p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}
.upload-preview {
  text-align: center;
  margin-top: 16px;
}
.upload-preview img {
  max-width: 100%;
  max-height: 220px;
  border-radius: 12px;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

/* ===== АДАПТИВНІСТЬ ===== */
@media (max-width: 768px) {
  .toolbar { gap: 2px; padding: 6px 8px; }
  .toolbar-group { padding: 0 4px; }
  .tool-btn { min-width: 28px; height: 28px; padding: 3px 6px; font-size: 12px; }
  .tool-btn svg { width: 14px; height: 14px; }
  .tool-select { font-size: 11px; height: 28px; padding: 2px 6px; min-width: 50px; }
  .color-wrapper { width: 28px; height: 28px; }
  .color-reset { width: 24px; height: 24px; }
  .editor-content { padding: 12px; }
  .dialog { padding: 24px 20px; margin: 12px; }
  .dialog h3 { font-size: 1.3rem; }
  .size-field { flex: 1 1 100%; }
  .size-input { width: 60px; }
}
@media (max-width: 480px) {
  .editor-content { padding: 10px; }
  .dialog { padding: 20px 16px; }
  .dialog-actions { flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
}
</style>
