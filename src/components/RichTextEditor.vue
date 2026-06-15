<template>
  <div class="rich-text-editor">
    <div class="toolbar" v-if="editor">
      <!-- Форматирование текста -->
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <strong>B</strong>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <em>I</em>
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
        <u>U</u>
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <s>S</s>
      </button>

      <!-- Заголовки -->
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        H2
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        H3
      </button>

      <!-- Списки и цитаты -->
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        • Список
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        1. Нумер.
      </button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        “ Цитата
      </button>

      <!-- Ссылка и изображение -->
      <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
        🔗 Посилання
      </button>
      <button @click="openImageDialog" class="image-btn">
        🖼️ Зображення
      </button>
      <button @click="editSelectedImage" :disabled="!editor?.isActive('image')" class="image-edit-btn" title="Редагувати розмір зображення">
        ✏️ Розмір
      </button>

      <!-- Очистить форматирование -->
      <button @click="editor.chain().focus().clearNodes().unsetAllMarks().run()">
        ✖ Очистити
      </button>
    </div>

    <editor-content :editor="editor" class="editor-content" />

    <!-- Диалог вставки/редактирования изображения -->
    <div v-if="imageDialogVisible" class="image-dialog-overlay" @click.self="closeImageDialog">
      <div class="image-dialog">
        <h3>{{ editingImage ? 'Редагувати зображення' : 'Вставити зображення' }}</h3>
        <div class="image-dialog-tabs" v-if="!editingImage">
          <button :class="{ active: activeTab === 'url' }" @click="activeTab = 'url'">За URL</button>
          <button :class="{ active: activeTab === 'upload' }" @click="activeTab = 'upload'">Завантажити з ПК</button>
        </div>
        <div v-if="activeTab === 'url' || editingImage" class="image-dialog-url">
          <input v-if="!editingImage" type="text" v-model="imageUrl" placeholder="https://example.com/image.jpg" />

          <div class="size-fields">
            <div class="size-field">
              <label>Ширина:</label>
              <input type="number" v-model.number="imageWidth" placeholder="авто" step="1" />
              <select v-model="widthUnit">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
            <div class="size-field">
              <label>Висота:</label>
              <input type="number" v-model.number="imageHeight" placeholder="авто" step="1" />
              <select v-model="heightUnit">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
            <small>Залиште порожнім для автоматичного розміру (обмеження: 400px висота для авто)</small>
          </div>

          <button @click="insertOrUpdateImage" :disabled="loadingImage">Застосувати</button>
          <span v-if="loadingImage" class="loading">Завантаження...</span>
        </div>
        <div v-if="activeTab === 'upload' && !editingImage" class="image-dialog-upload">
          <input type="file" ref="localFileInput" accept="image/*" @change="handleLocalImageUpload" />
          <div v-if="uploadPreview" class="preview">
            <img :src="uploadPreview" alt="Preview" />
            <button @click="insertBase64Image">Вставити це зображення</button>
          </div>
        </div>
        <button class="close-dialog" @click="closeImageDialog">✕</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Image from '@tiptap/extension-image'

// Создаём кастомное расширение изображения с поддержкой стиля
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(), // сохраняем стандартные атрибуты (src, alt, title)
      style: {
        default: 'max-width: 100%; height: auto; max-height: 400px;',
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {}
          }
          return { style: attributes.style }
        },
      },
    }
  },
})

export default {
  name: 'RichTextEditor',
  components: { EditorContent },
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editor = useEditor({
      content: props.modelValue,
      extensions: [
        StarterKit.configure({ link: false, underline: false, strike: false }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' }
        }),
        Underline,
        Strike,
        CustomImage, // <-- используем наше расширение вместо стандартного Image
        Placeholder.configure({ placeholder: props.placeholder })
      ],
      onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
      }
    })

    // ========== Устаревшая функция автодобавления стиля – больше не нужна,
    // но можно оставить для обработки изображений, добавленных другими способами
    function ensureImageStyle() {
      if (!editor.value) return
      const { state } = editor.value
      state.doc.descendants((node, pos) => {
        if (node.type.name === 'image') {
          const attrs = node.attrs
          const currentStyle = attrs.style || ''
          // Если стиль отсутствует или не содержит размеров, добавляем стандартный
          if (!currentStyle.includes('width') && !currentStyle.includes('max-width')) {
            const defaultStyle = 'max-width: 100%; height: auto; max-height: 400px;'
            editor.value.commands.updateAttributes('image', { style: defaultStyle })
          }
        }
      })
    }

    if (editor.value) {
      editor.value.on('update', () => {
        ensureImageStyle()
      })
      // Первичная обработка уже существующего контента
      setTimeout(() => {
        ensureImageStyle()
      }, 100)
    }

    // ==============================================

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

    // --- Переменные и методы для диалога изображений ---
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

    const editSelectedImage = () => {
      if (!editor.value || !editor.value.isActive('image')) return
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
        // Если размеры не указаны, применяем стандартные ограничения
        style = 'max-width: 100%; height: auto; max-height: 400px;'
      } else {
        style += 'max-width: 100%; height: auto;'
        if (widthVal !== null && (heightVal === null || heightVal === '')) style += ' height: auto;'
        if (heightVal !== null && (widthVal === null || widthVal === '')) style += ' width: auto;'
      }
      return style.trim()
    }

    const insertOrUpdateImage = async () => {
      // Редактирование существующего изображения
      if (editingImage.value && currentImageNode) {
        const newStyle = generateImageStyle(
          imageWidth.value,
          widthUnit.value,
          imageHeight.value,
          heightUnit.value
        )
        // Используем setImage с теми же src и новым стилем
        editor.value.chain().focus().setImage({ src: imageUrl.value, style: newStyle }).run()
        closeImageDialog()
        return
      }

      // Вставка нового изображения по URL
      if (activeTab.value === 'url') {
        if (!imageUrl.value) return
        loadingImage.value = true
        try {
          const style = generateImageStyle(
            imageWidth.value,
            widthUnit.value,
            imageHeight.value,
            heightUnit.value
          )
          // Теперь стиль точно применится, потому что CustomImage его поддерживает
          editor.value.chain().focus().setImage({ src: imageUrl.value, style: style }).run()
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

    const insertBase64Image = () => {
      if (!pendingBase64) return
      const style = generateImageStyle(
        imageWidth.value,
        widthUnit.value,
        imageHeight.value,
        heightUnit.value
      )
      // Вставка base64 с явным стилем
      editor.value.chain().focus().setImage({ src: pendingBase64, style: style }).run()
      closeImageDialog()
    }

    const closeImageDialog = () => {
      imageDialogVisible.value = false
      if (localFileInput.value) localFileInput.value.value = ''
      editingImage.value = false
      currentImageNode = null
    }

    // Синхронизация modelValue извне
    watch(
      () => props.modelValue,
      (newVal) => {
        const isSame = editor.value?.getHTML() === newVal
        if (!isSame && newVal !== undefined) {
          editor.value?.commands.setContent(newVal, false)
        }
      }
    )

    return {
      editor,
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
      editSelectedImage,
      insertOrUpdateImage,
      handleLocalImageUpload,
      insertBase64Image,
      closeImageDialog
    }
  }
}
</script>

<style scoped>
/* Базова стилізація редактора (без обмежень для img) */
.rich-text-editor {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  transition: box-shadow 0.2s;
}
.rich-text-editor:focus-within {
  box-shadow: 0 0 0 3px rgba(199, 97, 60, 0.2);
  border-color: #C7613C;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e2e8f0;
}
.toolbar button {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  color: #1e293b;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.toolbar button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
  transform: translateY(-1px);
}
.toolbar button.is-active {
  background: #C7613C;
  color: white;
  border-color: #C7613C;
}
.editor-content :deep(.ProseMirror) {
  min-height: 260px;
  padding: 20px;
  outline: none;
  line-height: 1.6;
  color: #0f172a;
}
.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
}
.editor-content :deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.2em 0 0.5em;
}
.editor-content :deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1em 0 0.5em;
}
.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  padding-left: 1.5rem;
}
.editor-content :deep(.ProseMirror blockquote) {
  border-left: 4px solid #C7613C;
  margin: 1rem 0;
  padding-left: 1rem;
  color: #475569;
  font-style: italic;
  background: #f8fafc;
  border-radius: 0 8px 8px 0;
}
.editor-content :deep(.ProseMirror a) {
  color: #C7613C;
  text-decoration: underline;
}

/* Зображення в редакторі – без примусових обмежень, тільки базове оформлення */
.editor-content :deep(.ProseMirror img) {
  margin: 0.75rem 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Стилі діалогу */
.image-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.image-dialog {
  background: white;
  border-radius: 24px;
  padding: 24px;
  width: 90%;
  max-width: 550px;
  position: relative;
}
.image-dialog h3 {
  margin-top: 0;
}
.image-dialog-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.image-dialog-tabs button {
  flex: 1;
  padding: 8px;
  border: none;
  background: #f1f5f9;
  cursor: pointer;
  border-radius: 8px;
}
.image-dialog-tabs button.active {
  background: #C7613C;
  color: white;
}
.image-dialog-url {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.image-dialog-url input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}
.size-fields {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.size-field {
  display: flex;
  align-items: center;
  gap: 8px;
}
.size-field label {
  font-weight: 500;
}
.size-field input {
  width: 90px;
  padding: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}
.size-field select {
  padding: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
}
.image-dialog-url button {
  background: #2F5F48;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-start;
}
.image-dialog-upload .preview {
  margin-top: 16px;
  text-align: center;
}
.image-dialog-upload .preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 12px;
}
.image-dialog-upload button {
  background: #2F5F48;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}
.close-dialog {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
.image-edit-btn {
  margin-left: auto;
}
</style>