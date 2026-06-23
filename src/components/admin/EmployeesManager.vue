<template>
  <div class="manager">
    <h2>Команда школи</h2>
    <button @click="openAddForm" class="btn-add">+ Додати працівника</button>

    <div v-if="showForm" class="form-card">
      <h3>{{ editing ? 'Редагувати працівника' : 'Новий працівник' }}</h3>
      
      <div class="form-group">
        <label>Фото</label>
        <div class="photo-upload-area">
          <div class="photo-preview" @click="triggerFileInput">
            <img v-if="editData.photoUrl" :src="editData.photoUrl" alt="Preview" class="preview-img">
            <div v-else class="preview-placeholder">
              <span>+</span>
              <small>Натисніть для вибору файлу</small>
            </div>
          </div>
          <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display:none">
          <div class="photo-url-row">
            <input v-model="editData.photoUrl" placeholder="Або вставте URL фото" class="form-control">
            <button type="button" class="btn-crop-url" @click="openCropperFromUrl" :disabled="!editData.photoUrl">Обрізати URL</button>
          </div>
          <button v-if="editData.photoUrl" type="button" class="btn-remove-photo" @click="removePhoto">Видалити фото</button>
        </div>
      </div>

      <div class="form-group">
        <label>ПІБ</label>
        <input v-model="editData.fullName" placeholder="Іваненко Іван Іванович" class="form-control">
      </div>
      <div class="form-group">
        <label>Посада</label>
        <input v-model="editData.position" placeholder="Вчитель математики" class="form-control">
      </div>
      <div class="form-group">
        <label>Опис</label>
        <RichTextEditor
          v-model="editData.description"
          content-label="Опис"
          placeholder="Введіть біографію, досягнення, контакти..."
          @limit-change="descriptionOverLimit = $event.overLimit"
        />
      </div>
      <div class="form-actions">
        <button @click="saveItem" class="btn-save" :disabled="saving || descriptionOverLimit">Зберегти</button>
        <button @click="cancelForm" class="btn-cancel">Скасувати</button>
      </div>
    </div>

    <div class="items-list">
      <div v-for="(item, idx) in sortedItems" :key="item.id" class="item-card">
        <div class="item-photo">
          <img :src="item.photoUrl || 'https://via.placeholder.com/80?text=No+Photo'" alt="Фото">
        </div>
        <div class="item-info">
          <h3>{{ item.fullName }}</h3>
          <p class="position">{{ item.position }}</p>
          <!-- Тепер відображаємо HTML з безпечним очищенням та обмеженням висоти -->
          <div class="description-preview" v-html="sanitizeHtml(item.description)"></div>
        </div>
        <div class="item-actions">
          <button @click="moveUp(idx)" :disabled="idx === 0" class="btn-move" title="Вгору">↑</button>
          <button @click="moveDown(idx)" :disabled="idx === sortedItems.length-1" class="btn-move" title="Вниз">↓</button>
          <button @click="editItem(item)" class="btn-edit" title="Редагувати">✏️</button>
          <button @click="deleteItem(item.id)" class="btn-delete" title="Видалити">🗑️</button>
        </div>
      </div>
      <div v-if="sortedItems.length === 0" class="empty-state">
        Немає працівників. Додайте першого!
      </div>
    </div>

    <!-- Модальне вікно для кропу (без змін) -->
    <div
      v-if="cropperModalVisible"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cropper-title"
      @click.self="closeCropper"
    >
      <div class="cropper-modal">
        <button type="button" class="cropper-close" aria-label="Закрити редактор фото" @click="closeCropper">×</button>
        <h3 id="cropper-title">Редагування фото</h3>
        <div class="cropper-container-wrapper">
          <img ref="cropperImage" :src="cropperImageSrc" alt="Crop">
        </div>
        <div class="cropper-controls">
          <button type="button" @click="zoomOut" class="ctrl-btn" aria-label="Зменшити фото" title="Зменшити">−</button>
          <span>Масштаб</span>
          <button type="button" @click="zoomIn" class="ctrl-btn" aria-label="Збільшити фото" title="Збільшити">+</button>
          <button type="button" @click="rotateLeft" class="ctrl-btn" aria-label="Повернути ліворуч" title="Повернути ліворуч">↺</button>
          <button type="button" @click="rotateRight" class="ctrl-btn" aria-label="Повернути праворуч" title="Повернути праворуч">↻</button>
          <button type="button" @click="resetCrop" class="ctrl-btn reset">Скинути</button>
        </div>
        <div class="cropper-actions">
          <button type="button" @click="applyCrop" class="btn-apply">Застосувати</button>
          <button type="button" @click="closeCropper" class="btn-cancel">Скасувати</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import RichTextEditor from '../RichTextEditor.vue';
import DOMPurify from 'dompurify';

export default {
  components: { RichTextEditor },
  data() {
    return {
      items: [],
      showForm: false,
      editing: false,
      editId: null,
      editData: { fullName: '', position: '', description: '', photoUrl: '' },
      selectedFile: null,
      saving: false,
      descriptionOverLimit: false,
      cropperModalVisible: false,
      cropperImageSrc: null,
      cropper: null,
      pendingFile: null,
      bodyOverflowBeforeCropper: ''
    };
  },
  computed: {
    sortedItems() {
      return [...this.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  },
  mounted() {
    onSnapshot(collection(db, 'employees'), (snapshot) => {
      this.items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  },
  methods: {
    sanitizeHtml(html) {
      if (!html) return '';
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'blockquote',
          'p', 'br', 'img', 'h1', 'h2', 'h3', 'h4', 'span', 'div',
          'iframe', 'video', 'source', 'pre', 'code', 'hr'
        ],
        ALLOWED_ATTR: [
          'href', 'target', 'src', 'alt', 'class', 'style',
          'width', 'height', 'frameborder', 'allowfullscreen', 'allow',
          'controls', 'autoplay', 'muted', 'loop',
          'data-wrap', 'data-text-align'
        ]
      });
    },
    openAddForm() {
      this.editing = false;
      this.editData = { fullName: '', position: '', description: '', photoUrl: '' };
      this.descriptionOverLimit = false;
      this.showForm = true;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileSelected(event) {
      const file = event.target.files[0];
      if (!file || !file.type.startsWith('image/')) {
        alert('Оберіть зображення');
        return;
      }
      this.cropperImageSrc = URL.createObjectURL(file);
      this.cropperModalVisible = true;
      this.$refs.fileInput.value = '';
      this.pendingFile = file;
    },
    openCropperFromUrl() {
      if (!this.editData.photoUrl) return;
      this.cropperImageSrc = this.editData.photoUrl;
      this.cropperModalVisible = true;
    },
    initCropper() {
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
      const img = this.$refs.cropperImage;
      if (!img) return;
      if (img.complete && img.naturalWidth > 0) {
        this.createCropper(img);
      } else {
        img.onload = () => this.createCropper(img);
        img.onerror = () => {
          alert('Не вдалося завантажити зображення');
          this.closeCropper();
        };
      }
    },
    createCropper(img) {
      try {
        this.cropper = new window.Cropper(img, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 0.9,
          movable: true,
          cropBoxMovable: true,
          cropBoxResizable: true,
          zoomable: true,
          zoomOnTouch: true,
          zoomOnWheel: false,
          rotatable: true,
          scalable: true,
          background: true,
          guides: true,
          center: true,
          responsive: true,
          restore: false,
          toggleDragModeOnDblclick: false,
          minContainerWidth: 0,
          minContainerHeight: 0,
          minCropBoxWidth: 72,
          minCropBoxHeight: 72
        });
      } catch (err) {
        console.error(err);
        alert('Помилка створення редактора');
        this.closeCropper();
      }
    },
    zoomIn() {
      if (this.cropper && typeof this.cropper.zoom === 'function') this.cropper.zoom(0.1);
    },
    zoomOut() {
      if (this.cropper && typeof this.cropper.zoom === 'function') this.cropper.zoom(-0.1);
    },
    rotateLeft() {
      if (this.cropper && typeof this.cropper.rotate === 'function') this.cropper.rotate(-90);
    },
    rotateRight() {
      if (this.cropper && typeof this.cropper.rotate === 'function') this.cropper.rotate(90);
    },
    resetCrop() {
      if (this.cropper && typeof this.cropper.reset === 'function') this.cropper.reset();
    },
    async applyCrop() {
      if (!this.cropper || typeof this.cropper.getCroppedCanvas !== 'function') return;
      try {
        const canvas = this.cropper.getCroppedCanvas({ width: 400, height: 400 });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
        this.selectedFile = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editData.photoUrl = e.target.result;
        };
        reader.readAsDataURL(blob);
        this.closeCropper();
      } catch (err) {
        console.error(err);
        alert('Помилка обрізки');
      }
    },
    closeCropper() {
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
      if (this.cropperImageSrc?.startsWith('blob:')) {
        URL.revokeObjectURL(this.cropperImageSrc);
      }
      this.cropperModalVisible = false;
      this.pendingFile = null;
    },
    async saveItem() {
      if (!this.editData.fullName) {
        alert('Введіть ПІБ');
        return;
      }
      if (this.descriptionOverLimit) {
        alert('Опис перевищує безпечний ліміт Firebase. Скоротіть текст або видаліть частину зображень.');
        return;
      }
      this.saving = true;
      try {
        const employeeData = { ...this.editData };
        if (this.editing) {
          await updateDoc(doc(db, 'employees', this.editId), employeeData);
        } else {
          const maxOrder = Math.max(...this.items.map(i => i.order ?? 0), 0);
          employeeData.order = maxOrder + 1;
          await addDoc(collection(db, 'employees'), employeeData);
        }
        this.cancelForm();
      } catch (err) {
        console.error(err);
        const isSizeError = String(err?.message || '').includes('longer than 1048487 bytes');
        alert(isSizeError
          ? 'Опис завеликий для Firebase. Скоротіть текст або видаліть частину зображень.'
          : 'Помилка збереження. Спробуйте ще раз.');
      } finally {
        this.saving = false;
      }
    },
    editItem(item) {
      this.editing = true;
      this.editId = item.id;
      this.editData = { ...item };
      this.descriptionOverLimit = false;
      this.selectedFile = null;
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.editing = false;
      this.editId = null;
      this.editData = { fullName: '', position: '', description: '', photoUrl: '' };
      this.descriptionOverLimit = false;
      this.selectedFile = null;
      if (this.cropperModalVisible) this.closeCropper();
    },
    removePhoto() {
      this.editData.photoUrl = '';
      this.selectedFile = null;
    },
    async deleteItem(id) {
      if (confirm('Видалити?')) {
        await deleteDoc(doc(db, 'employees', id));
      }
    },
    async moveUp(idx) {
      if (idx === 0) return;
      const list = this.sortedItems;
      const current = list[idx];
      const prev = list[idx - 1];
      const currentOrder = current.order ?? 0;
      const prevOrder = prev.order ?? 0;
      await updateDoc(doc(db, 'employees', current.id), { order: prevOrder });
      await updateDoc(doc(db, 'employees', prev.id), { order: currentOrder });
    },
    async moveDown(idx) {
      if (idx === this.sortedItems.length - 1) return;
      const list = this.sortedItems;
      const current = list[idx];
      const next = list[idx + 1];
      const currentOrder = current.order ?? 0;
      const nextOrder = next.order ?? 0;
      await updateDoc(doc(db, 'employees', current.id), { order: nextOrder });
      await updateDoc(doc(db, 'employees', next.id), { order: currentOrder });
    }
  },
  watch: {
    cropperModalVisible(newVal) {
      if (newVal) {
        this.bodyOverflowBeforeCropper = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        this.$nextTick(() => this.initCropper());
      } else {
        document.body.style.overflow = this.bodyOverflowBeforeCropper;
      }
    }
  },
  beforeUnmount() {
    if (this.cropper) this.cropper.destroy();
    document.body.style.overflow = this.bodyOverflowBeforeCropper;
  }
};
</script>

<style scoped>
/* ============================================
   БАЗОВІ ЗМІННІ (для консистентності)
   ============================================ */
:root {
  --primary: #2F5F48;
  --primary-dark: #1e4032;
  --secondary: #C7613C;
  --white: #ffffff;
  --bg: #f9f9f9;
  --bg-light: #fcfcfc;
  --light-bg: #fefcf8;
  --border-color: #e9ecef;
  --border-color-hover: #e2e8f0;
  --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.05);
  --text-primary: #1e293b;
  --text-secondary: #4a5568;
  --text-muted: #888;
  --hover-bg: #f1f5f9;
  --btn-secondary: #6c757d;
  --btn-secondary-hover: #565e64;
  --btn-cancel-bg: #e9ecef;
  --btn-cancel-hover: #dee2e6;
  --danger-bg: #f8d7da;
  --danger-color: #a71d2a;
}

/* ============================================
   КОМПОНЕНТ MANAGER
   ============================================ */
.manager {
  background: var(--surface-elevated, #ffffff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-light, 0 1px 3px rgba(0, 0, 0, 0.05));
}

.manager h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--secondary, #C7613C);
  font-weight: 600;
  font-size: 1.8rem;
  border-left: 5px solid var(--secondary, #C7613C);
  padding-left: 16px;
}

.btn-add {
  background: var(--primary, #2F5F48);
  color: var(--white, #ffffff);
  border: none;
  padding: 10px 20px;
  border-radius: 40px;
  cursor: pointer;
  margin-bottom: 24px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-add:hover {
  background: var(--primary-dark, #1e4032);
  transform: translateY(-2px);
  box-shadow: var(--shadow, 0 4px 8px rgba(0, 0, 0, 0.1));
}

.form-card {
  background: var(--surface-soft, #fefcf8);
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 32px;
  border: 1px solid var(--border-color, #e9ecef);
  box-shadow: var(--card-shadow, 0 4px 12px rgba(0, 0, 0, 0.04));
}
.form-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: var(--text-primary, #2d3e3a);
}

.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary, #2c3e2f);
  font-size: 0.9rem;
}
.form-control {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border-color, #d4d8dd);
  border-radius: 12px;
  font-size: 1rem;
  transition: 0.2s;
  background: var(--surface, #ffffff) !important;
  color: var(--text-primary, #1e293b);
}
.form-control:focus {
  outline: none;
  border-color: var(--secondary, #C7613C);
  box-shadow: 0 0 0 3px var(--focus-ring, rgba(199, 97, 60, 0.1));
}

.photo-upload-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.photo-preview {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--hover-bg, #f1f3f5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color, #ced4da);
  transition: all 0.2s;
}
.photo-preview:hover {
  border-color: var(--primary, #2F5F48);
  transform: scale(1.02);
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.preview-placeholder {
  text-align: center;
  color: var(--text-muted, #adb5bd);
  font-size: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.preview-placeholder small {
  font-size: 11px;
  margin-top: 5px;
}

.photo-url-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.photo-url-row .form-control {
  flex: 2;
  min-width: 180px;
}
.btn-crop-url {
  background: var(--btn-secondary, #6c757d);
  color: var(--white, #ffffff);
  border: none;
  padding: 0 16px;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}
.btn-crop-url:hover:not(:disabled) {
  background: var(--btn-secondary-hover, #565e64);
}
.btn-remove-photo {
  background: var(--danger-bg, #f8d7da);
  color: var(--danger-color, #a71d2a);
  border: none;
  padding: 6px 12px;
  border-radius: 40px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}
.btn-save,
.btn-cancel {
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  border: none;
}
.btn-save {
  background: var(--primary, #2F5F48);
  color: var(--white, #ffffff);
}
.btn-save:hover:not(:disabled) {
  background: var(--primary-dark, #1e4032);
  transform: translateY(-1px);
}
.btn-cancel {
  background: var(--btn-cancel-bg, #e9ecef);
  color: var(--text-secondary, #495057);
}
.btn-cancel:hover {
  background: var(--btn-cancel-hover, #dee2e6);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.item-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  min-width: 0;
  overflow: hidden;
  background: var(--surface-elevated, #ffffff);
  padding: 16px 20px;
  border-radius: 20px;
  border: 1px solid var(--border-color, #edf2f7);
  transition: all 0.2s;
  box-shadow: var(--shadow-light, 0 1px 2px rgba(0, 0, 0, 0.03));
}
.item-card:hover {
  box-shadow: var(--shadow-hover, 0 8px 20px rgba(0, 0, 0, 0.05));
  border-color: var(--border-color-hover, #e2e8f0);
}

.item-photo {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--border-color, #e9ecef);
}
.item-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 180px;
  max-width: 100%;
  overflow: hidden;
}
.item-info h3 {
  margin: 0 0 6px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary, #1e2a3a);
}
.position {
  color: var(--secondary, #C7613C);
  font-weight: 600;
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* ===== СТИЛЬ ДЛЯ ПЕРЕГЛЯДУ ОПИСУ ===== */
.description-preview {
  color: var(--text-secondary, #4a5568);
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0 0 8px 0;
  width: 100%;
  max-width: 100%;
  max-height: 4.5em;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  /* standard property for compatibility */
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.description-preview :deep(img),
.description-preview :deep(iframe),
.description-preview :deep(video),
.description-preview :deep(source),
.description-preview :deep(.video-wrapper) {
  display: none !important;
}
.description-preview ul,
.description-preview ol {
  padding-left: 1.2rem;
  margin: 0.2rem 0;
}
.description-preview blockquote {
  border-left: 4px solid var(--secondary, #C7613C);
  margin: 0.3rem 0;
  padding-left: 0.8rem;
  font-style: italic;
  color: var(--text-secondary, #555);
}
.description-preview a {
  color: var(--secondary, #C7613C);
  text-decoration: underline;
}
/* ===== КІНЕЦЬ ===== */

.item-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.btn-move,
.btn-edit,
.btn-delete {
  background: none;
  color: var(--text-secondary, #495057);
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 40px;
  transition: all 0.2s;
  opacity: 0.7;
}
.btn-move:hover,
.btn-edit:hover,
.btn-delete:hover {
  background: var(--hover-bg, #f1f5f9);
  opacity: 1;
  transform: scale(1.05);
}
.btn-move:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted, #8c9aad);
  background: var(--surface-soft, #fcfcfc);
  border-radius: 32px;
  font-style: italic;
}

/* ============================================
   АДАПТИВНІСТЬ
   ============================================ */
@media (max-width: 700px) {
  .manager {
    padding: 16px;
  }
  .item-card {
    flex-direction: column;
    text-align: center;
    align-items: stretch;
  }
  .item-info {
    text-align: center;
  }
  .item-photo {
    align-self: center;
  }
  .form-actions {
    flex-direction: column;
  }
  .btn-save,
  .btn-cancel {
    width: 100%;
    text-align: center;
  }
  .photo-url-row {
    flex-direction: column;
  }
  .btn-crop-url {
    padding: 8px;
  }
}

/* ============================================
   СТИЛІ КРОПЕРА
   ============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
  overscroll-behavior: contain;
  overflow-y: auto;
}
.cropper-modal {
  position: relative;
  background: var(--surface-elevated, #ffffff);
  border-radius: 20px;
  padding: 24px;
  width: min(920px, 100%);
  height: min(90dvh, 820px);
  max-height: calc(100dvh - 40px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  color: var(--text-primary, #212529);
  border: 1px solid var(--border-color, #dee2e6);
  opacity: 1;
}
.cropper-close {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 2;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--surface-muted, #eef2f1);
  color: var(--text-primary, #212529);
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
}
.cropper-close:hover {
  background: var(--surface-accent, #e4ece9);
}
.cropper-modal h3 {
  margin: 0 52px 16px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary, #2F5F48);
}
.cropper-container-wrapper {
  width: 100%;
  min-height: 0;
  background: var(--surface-soft, #f8f9fa);
  border-radius: 16px;
  margin: 8px 0 16px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--border-color, #ced4da);
  overflow: hidden;
  touch-action: none;
}
.cropper-container-wrapper > img {
  display: block;
  max-width: 100%;
}
.cropper-container-wrapper :deep(.cropper-container) {
  width: 100% !important;
  height: 100% !important;
}

.cropper-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 12px 0 16px;
  flex-wrap: wrap;
  flex-shrink: 0;
}
.cropper-controls span {
  align-self: center;
}
.ctrl-btn {
  background: var(--primary, #2F5F48);
  color: var(--white, #ffffff);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  touch-action: manipulation;
}
.ctrl-btn:hover {
  background: var(--secondary, #C7613C);
  transform: translateY(-2px);
}
.ctrl-btn.reset {
  background: var(--btn-secondary, #6c757d);
  width: auto;
  padding: 0 20px;
  font-size: 0.9rem;
}

.cropper-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 8px;
  flex-shrink: 0;
}
.btn-apply,
.cropper-actions .btn-cancel {
  padding: 10px 28px;
  border-radius: 40px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.btn-apply {
  background: var(--primary, #2F5F48);
  color: var(--white, #ffffff);
}
.btn-apply:hover {
  background: var(--primary-dark, #1e4032);
}
.cropper-actions .btn-cancel {
  background: var(--btn-secondary, #5a6e6a);
  color: var(--white, #ffffff);
}
.cropper-actions .btn-cancel:hover {
  background: var(--btn-secondary-hover, #4a5a56);
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
    align-items: stretch;
  }
  .cropper-modal {
    width: 100%;
    height: 100dvh;
    max-height: none;
    padding:
      max(12px, env(safe-area-inset-top))
      max(12px, env(safe-area-inset-right))
      max(12px, env(safe-area-inset-bottom))
      max(12px, env(safe-area-inset-left));
    border: 0;
    border-radius: 0;
  }
  .cropper-modal h3 {
    font-size: 1.15rem;
    margin: 4px 48px 8px;
  }
  .cropper-close {
    top: max(6px, env(safe-area-inset-top));
    right: max(8px, env(safe-area-inset-right));
  }
  .cropper-container-wrapper {
    min-height: 180px;
    margin: 4px 0 8px;
    border-radius: 12px;
  }
  .cropper-controls {
    gap: 8px;
    margin: 4px 0 10px;
  }
  .cropper-controls span {
    display: none;
  }
  .ctrl-btn {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
    border-radius: 12px;
  }
  .ctrl-btn.reset {
    padding: 0 14px;
    font-size: 0.82rem;
  }
  .cropper-actions {
    gap: 10px;
    margin-top: 0;
  }
  .btn-apply,
  .cropper-actions .btn-cancel {
    flex: 1;
    min-height: 48px;
    padding: 10px 12px;
  }
}

@media (max-width: 380px), (max-height: 620px) {
  .cropper-modal {
    padding-top: max(8px, env(safe-area-inset-top));
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
  .cropper-modal h3 {
    font-size: 1rem;
    margin-bottom: 4px;
  }
  .cropper-controls {
    gap: 6px;
    margin-bottom: 6px;
  }
  .ctrl-btn {
    width: 40px;
    height: 40px;
  }
  .btn-apply,
  .cropper-actions .btn-cancel {
    min-height: 44px;
  }
}
</style>
