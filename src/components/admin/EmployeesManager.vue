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
        <!-- ВИПРАВЛЕНО: використовуємо editData.description -->
        <RichTextEditor v-model="editData.description" placeholder="Введіть біографію, досягнення, контакти..." />
      </div>
      <div class="form-actions">
        <button @click="saveItem" class="btn-save" :disabled="saving">Зберегти</button>
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
          <p class="description">{{ item.description }}</p>
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

    <!-- Модальне вікно для кропу -->
    <div v-if="cropperModalVisible" class="modal-overlay" @click.self="closeCropper">
      <div class="cropper-modal">
        <h3>Редагування фото</h3>
        <div class="cropper-container-wrapper">
          <img ref="cropperImage" :src="cropperImageSrc" alt="Crop">
        </div>
        <div class="cropper-controls">
          <button @click="zoomOut" class="ctrl-btn">−</button>
          <span>Зум</span>
          <button @click="zoomIn" class="ctrl-btn">+</button>
          <button @click="rotateLeft" class="ctrl-btn">↺</button>
          <button @click="rotateRight" class="ctrl-btn">↻</button>
          <button @click="resetCrop" class="ctrl-btn reset">Скинути</button>
        </div>
        <div class="cropper-actions">
          <button @click="applyCrop" class="btn-apply">Застосувати</button>
          <button @click="closeCropper" class="btn-cancel">Скасувати</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase';  // перевірте, чи вірний шлях
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// ВИПРАВЛЕНО: правильний шлях до RichTextEditor
import RichTextEditor from '../RichTextEditor.vue';

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
      cropperModalVisible: false,
      cropperImageSrc: null,
      cropper: null,
      pendingFile: null
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
    openAddForm() {
      this.editing = false;
      this.editData = { fullName: '', position: '', description: '', photoUrl: '' };
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
          viewMode: 2,
          autoCropArea: 1,
          zoomable: true,
          rotatable: true,
          scalable: true,
          background: true,
          minContainerWidth: 500,
          minContainerHeight: 400,
          responsive: true
        });
        console.log('Cropper created', this.cropper);
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
          this.editData.photoUrl = e.target.result;   // Зберігаємо base64
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
      this.saving = true;
      
      const employeeData = { ...this.editData };
      
      if (this.editing) {
        await updateDoc(doc(db, 'employees', this.editId), employeeData);
      } else {
        const maxOrder = Math.max(...this.items.map(i => i.order ?? 0), 0);
        employeeData.order = maxOrder + 1;
        await addDoc(collection(db, 'employees'), employeeData);
      }
      this.cancelForm();
      this.saving = false;
    },
    editItem(item) {
      this.editing = true;
      this.editId = item.id;
      this.editData = { ...item };
      this.selectedFile = null;
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.editing = false;
      this.editId = null;
      this.editData = { fullName: '', position: '', description: '', photoUrl: '' };
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
        this.$nextTick(() => this.initCropper());
      }
    }
  }
};
</script>

<style scoped>
/* Основний контейнер */
.manager {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.manager h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #C7613C;
  font-weight: 600;
  font-size: 1.8rem;
  border-left: 5px solid #C7613C;
  padding-left: 16px;
}
.btn-add {
  background: #2F5F48;
  color: white;
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
  background: #1e4032;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.form-card {
  background: #fefcf8;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 32px;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.form-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: #2d3e3a;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e2f;
  font-size: 0.9rem;
}
.form-control {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d4d8dd;
  border-radius: 12px;
  font-size: 1rem;
  transition: 0.2s;
}
.form-control:focus {
  outline: none;
  border-color: #C7613C;
  box-shadow: 0 0 0 3px rgba(199,97,60,0.1);
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
  background: #f1f3f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ced4da;
  transition: all 0.2s;
}
.photo-preview:hover {
  border-color: #2F5F48;
  transform: scale(1.02);
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.preview-placeholder {
  text-align: center;
  color: #adb5bd;
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
  background: #6c757d;
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}
.btn-crop-url:hover:not(:disabled) {
  background: #565e64;
}
.btn-remove-photo {
  background: #f8d7da;
  color: #a71d2a;
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
.btn-save, .btn-cancel {
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  border: none;
}
.btn-save {
  background: #2F5F48;
  color: white;
}
.btn-save:hover:not(:disabled) {
  background: #1e4032;
  transform: translateY(-1px);
}
.btn-cancel {
  background: #e9ecef;
  color: #495057;
}
.btn-cancel:hover {
  background: #dee2e6;
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
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 20px;
  border: 1px solid #edf2f7;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.item-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  border-color: #e2e8f0;
}
.item-photo {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  background: #e9ecef;
}
.item-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-info {
  flex: 1;
  min-width: 180px;
}
.item-info h3 {
  margin: 0 0 6px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e2a3a;
}
.position {
  color: #C7613C;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.description {
  color: #4a5568;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
  max-height: 3.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.description ::deep a {
  color: #C7613C;
  text-decoration: none;
}
.description ::deep img,
.description ::deep iframe {
  display: none;
}
.item-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.btn-move, .btn-edit, .btn-delete {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 40px;
  transition: all 0.2s;
  opacity: 0.7;
}
.btn-move:hover, .btn-edit:hover, .btn-delete:hover {
  background: #f1f5f9;
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
  color: #8c9aad;
  background: #fcfcfc;
  border-radius: 32px;
  font-style: italic;
}
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
  .btn-save, .btn-cancel {
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
/* ===== ОНОВЛЕНІ СТИЛІ КРОПЕРА ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
}
.cropper-modal {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  width: 70vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
  color: #212529;
  border: 1px solid #dee2e6;
  opacity: 1;
}
.cropper-modal h3 {
  margin: 0 0 16px 0;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2F5F48;
}
.cropper-container-wrapper {
  width: 100%;
  min-height: 0;
  background: #f8f9fa;
  border-radius: 16px;
  margin: 8px 0 16px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;  
  border: 1px dashed #ced4da;
  overflow: hidden;
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
  background: #2F5F48;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}
.ctrl-btn:hover {
  background: #C7613C;
  transform: translateY(-2px);
}
.ctrl-btn.reset {
  background: #6c757d;
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
.btn-apply, .cropper-actions .btn-cancel {
  padding: 10px 28px;
  border-radius: 40px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.btn-apply {
  background: #2F5F48;
  color: white;
}
.btn-apply:hover {
  background: #1e4032;
}
.cropper-actions .btn-cancel {
  background: #5a6e6a;
  color: #eee;
}
@media (max-width: 640px) {
  .modal-overlay {
    padding: 10px;
  }
  .cropper-modal {
    padding: 16px;
  }
  .cropper-modal h3 {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }
  .ctrl-btn {
    width: 38px;
    height: 38px;
    font-size: 1.2rem;
  }
  .ctrl-btn.reset {
    padding: 0 12px;
    font-size: 0.8rem;
  }
  .btn-apply, .cropper-actions .btn-cancel {
    padding: 8px 20px;
  }
}
</style>