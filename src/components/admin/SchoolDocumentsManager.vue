<template>
  <div class="manager school-documents-manager">
    <h2>Шкільна документація</h2>
    <p class="manager-note">
      Додавайте PDF-файли для сторінки «Школа без булінгу», змінюйте їхні назви та описи.
      Файли зберігаються у Firestore, тому краще використовувати стиснуті PDF.
    </p>

    <div v-if="loading" class="state-box">Завантаження документів...</div>

    <template v-else>
      <div class="manager-toolbar">
        <button class="add-button" type="button" @click="addDocument">+ Додати PDF-документ</button>
        <button class="save-metadata-button" type="button" :disabled="saving" @click="saveDocuments">
          {{ saving ? 'Збереження...' : 'Зберегти назви та описи' }}
        </button>
      </div>

      <div class="documents-list">
      <section v-for="(document, index) in documents" :key="document.id" class="document-card">
        <div class="document-main">
          <span class="document-index">Документ {{ index + 1 }}</span>
          <label class="document-field">
            <span>Назва</span>
            <input v-model="document.title" type="text" placeholder="Назва PDF-документа" />
          </label>
          <label class="document-field">
            <span>Опис</span>
            <textarea v-model="document.description" rows="3" placeholder="Коротко опишіть документ"></textarea>
          </label>

          <div v-if="document.fileName" class="current-file">
            <strong>{{ document.fileName || 'PDF-документ' }}</strong>
            <span v-if="document.size">{{ formatFileSize(document.size) }}</span>
            <span v-if="document.updatedAt">Оновлено: {{ formatDate(document.updatedAt) }}</span>
          </div>
          <div v-else class="current-file empty">
            <strong>Файл ще не завантажено</strong>
            <span>Після завантаження документ з'явиться у відповідному PDF-рідері.</span>
          </div>
        </div>

        <div class="document-actions">
          <div v-if="isUploading(document.id)" class="upload-progress">
            <span>{{ getUploadProgress(document.id).message }}</span>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${getUploadProgress(document.id).progress}%` }"></div>
            </div>
          </div>

          <label class="upload-button" :class="{ disabled: isUploading(document.id) }">
            <input
              type="file"
              accept="application/pdf,.pdf"
              :disabled="isUploading(document.id)"
              @change="uploadDocument(document, $event)"
            />
            {{ isUploading(document.id) ? 'Завантаження...' : 'Завантажити PDF' }}
          </label>

          <button
            v-if="document.fileName"
            type="button"
            class="remove-button"
            :disabled="isUploading(document.id)"
            @click="clearDocumentFile(document)"
          >
            Прибрати файл
          </button>
          <button
            type="button"
            class="delete-document-button"
            :disabled="isUploading(document.id)"
            @click="removeDocument(document, index)"
          >
            Видалити документ
          </button>
        </div>
      </section>
      <div v-if="documents.length === 0" class="state-box">
        PDF-документів поки немає.
      </div>
      </div>
      <p v-if="message" class="save-message" :class="{ error: saveError }">{{ message }}</p>
    </template>
  </div>
</template>

<script>
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  clearFirestorePdfDocument,
  mergeSchoolDocuments,
  uploadPdfToFirestoreChunks
} from '../../data/schoolDocuments';

export default {
  name: 'SchoolDocumentsManager',
  data() {
    return {
      documents: [],
      loading: true,
      saving: false,
      uploading: {},
      uploadProgress: {},
      unsubscribeDocuments: null,
      message: '',
      saveError: false
    };
  },
  mounted() {
    this.unsubscribeDocuments = onSnapshot(
      doc(db, 'siteSettings', 'schoolDocuments'),
      (snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : {};
        this.documents = mergeSchoolDocuments(data.documents || {}, data.documentOrder);
        this.loading = false;
      },
      (error) => {
        console.error('School documents loading error:', error);
        this.documents = mergeSchoolDocuments();
        this.loading = false;
      }
    );
  },
  beforeUnmount() {
    if (this.unsubscribeDocuments) {
      this.unsubscribeDocuments();
    }
  },
  methods: {
    createId() {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return `pdf-${crypto.randomUUID()}`;
      }

      return `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    },
    addDocument() {
      this.documents.push({
        id: this.createId(),
        title: 'Новий PDF-документ',
        description: '',
        fileName: '',
        sourceType: '',
        size: 0,
        chunkCount: 0,
        chunkSize: 0,
        dataPath: '',
        updatedAt: null,
        src: ''
      });
      this.message = 'Новий документ додано. Заповніть назву, опис і завантажте файл.';
      this.saveError = false;
    },
    isUploading(id) {
      return Boolean(this.uploading[id]);
    },
    setUploading(id, value) {
      this.uploading = {
        ...this.uploading,
        [id]: value
      };
    },
    setUploadProgress(id, progress) {
      this.uploadProgress = {
        ...this.uploadProgress,
        [id]: {
          progress: progress.progress ?? 0,
          message: progress.message || 'Завантаження...'
        }
      };
    },
    getUploadProgress(id) {
      return this.uploadProgress[id] || {
        progress: 0,
        message: 'Завантаження...'
      };
    },
    normalizeFileName(fileName) {
      return fileName
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ._-]/g, '');
    },
    async uploadDocument(documentItem, event) {
      const input = event.target;
      const file = input.files?.[0];

      if (!file) return;

      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        alert('Оберіть файл у форматі PDF.');
        input.value = '';
        return;
      }

      this.setUploading(documentItem.id, true);
      this.setUploadProgress(documentItem.id, {
        progress: 0,
        message: 'Підготовка до завантаження...'
      });

      try {
        const metadata = await uploadPdfToFirestoreChunks(db, documentItem, file, {
          onProgress: progress => this.setUploadProgress(documentItem.id, progress)
        });
        Object.assign(documentItem, metadata);
        await this.saveDocuments();
      } catch (error) {
        console.error('School document upload error:', error);
        alert('Не вдалося завантажити PDF-файл.');
      } finally {
        input.value = '';
        this.setUploading(documentItem.id, false);
        this.setUploadProgress(documentItem.id, {
          progress: 0,
          message: ''
        });
      }
    },
    async clearDocumentFile(documentItem) {
      if (!confirm(`Прибрати PDF для "${documentItem.title}"?`)) return;

      this.setUploading(documentItem.id, true);

      try {
        await clearFirestorePdfDocument(db, documentItem.id);
        Object.assign(documentItem, {
          fileName: '',
          sourceType: '',
          size: 0,
          chunkCount: 0,
          chunkSize: 0,
          dataPath: '',
          updatedAt: null,
          src: ''
        });
        await this.saveDocuments();
      } catch (error) {
        console.error('School document clearing error:', error);
        alert('Не вдалося прибрати PDF-файл.');
      } finally {
        this.setUploading(documentItem.id, false);
        this.setUploadProgress(documentItem.id, {
          progress: 0,
          message: ''
        });
      }
    },
    async removeDocument(documentItem, index) {
      if (!confirm(`Повністю видалити документ "${documentItem.title}"?`)) return;

      this.setUploading(documentItem.id, true);

      try {
        await clearFirestorePdfDocument(db, documentItem.id);
        this.documents.splice(index, 1);
        await this.saveDocuments();
      } catch (error) {
        console.error('School document deletion error:', error);
        alert('Не вдалося видалити документ.');
      } finally {
        this.setUploading(documentItem.id, false);
      }
    },
    async saveDocuments() {
      const invalidDocument = this.documents.find(item => !item.title.trim());
      if (invalidDocument) {
        this.message = 'Кожен документ повинен мати назву.';
        this.saveError = true;
        return;
      }

      this.saving = true;
      this.message = '';
      this.saveError = false;

      const documentsById = Object.fromEntries(
        this.documents.map(item => [
          item.id,
          {
            title: item.title.trim(),
            description: item.description.trim(),
            fileName: item.fileName || '',
            contentType: item.contentType || 'application/pdf',
            sourceType: item.sourceType || '',
            size: item.size || 0,
            chunkCount: item.chunkCount || 0,
            chunkSize: item.chunkSize || 0,
            dataPath: item.dataPath || '',
            updatedAt: item.updatedAt || null,
            src: item.src || ''
          }
        ])
      );

      try {
        await setDoc(
          doc(db, 'siteSettings', 'schoolDocuments'),
          {
            documents: documentsById,
            documentOrder: this.documents.map(item => item.id),
            updatedAt: Timestamp.now()
          }
        );
        this.message = 'PDF-документи успішно збережено.';
      } catch (error) {
        console.error('School documents saving error:', error);
        this.message = 'Не вдалося зберегти PDF-документи.';
        this.saveError = true;
      } finally {
        this.saving = false;
      }
    },
    formatFileSize(bytes) {
      if (!bytes) return '';
      const units = ['Б', 'КБ', 'МБ', 'ГБ'];
      let size = bytes;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
      }

      return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

      return date.toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.manager {
  background: var(--surface-elevated, #ffffff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-light, 0 1px 3px rgba(0, 0, 0, 0.05));
}

.manager h2 {
  margin: 0 0 12px;
  color: var(--secondary, #C7613C);
  font-weight: 600;
  font-size: 1.8rem;
  border-left: 5px solid var(--secondary, #C7613C);
  padding-left: 16px;
}

.manager-note {
  margin: 0 0 24px;
  color: var(--text-secondary, #4a5568);
  line-height: 1.6;
}

.state-box {
  padding: 32px;
  text-align: center;
  color: var(--text-muted, #607168);
  background: var(--surface-soft, #f8faf7);
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
}

.manager-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.add-button,
.save-metadata-button {
  padding: 10px 18px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.add-button {
  color: var(--on-primary, #ffffff);
  background: var(--primary, #2F5F48);
}

.save-metadata-button {
  color: var(--on-secondary, #ffffff);
  background: var(--secondary, #C7613C);
}

.save-metadata-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.documents-list {
  display: grid;
  gap: 16px;
}

.document-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 18px;
  background: var(--surface-soft, #f8faf7);
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
}

.document-main {
  display: grid;
  gap: 12px;
}

.document-index {
  color: var(--secondary, #C7613C);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.document-field {
  display: grid;
  gap: 7px;
}

.document-field > span {
  color: var(--text-secondary, #485d54);
  font-size: 0.84rem;
  font-weight: 700;
}

.document-field input,
.document-field textarea {
  width: 100%;
  padding: 10px 12px;
  color: var(--text-primary, #1f352b);
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
  resize: vertical;
}

.current-file {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
}

.current-file.empty {
  color: var(--text-muted, #607168);
  background: transparent;
}

.current-file strong {
  color: var(--text-primary, #1f352b);
  word-break: break-word;
}

.current-file span {
  color: var(--text-secondary, #485d54);
  font-size: 0.9rem;
}

.document-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.upload-progress {
  flex: 1 1 240px;
  min-width: 240px;
  align-self: center;
}

.upload-progress span {
  display: block;
  margin-bottom: 6px;
  color: var(--text-secondary, #485d54);
  font-size: 0.9rem;
  line-height: 1.35;
}

.progress-track {
  width: 100%;
  height: 8px;
  overflow: hidden;
  background: var(--border, #d9e4dd);
  border-radius: 999px;
}

.progress-fill {
  height: 100%;
  background: var(--primary, #2F5F48);
  border-radius: inherit;
  transition: width 0.25s ease;
}

.upload-button,
.preview-link,
.remove-button,
.delete-document-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 10px 18px;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease, opacity 0.2s ease;
}

.upload-button {
  color: var(--on-primary, #ffffff);
  background: var(--primary, #2F5F48);
}

.upload-button input {
  display: none;
}

.preview-link {
  color: var(--on-secondary, #ffffff);
  background: var(--secondary, #C7613C);
}

.remove-button {
  color: var(--text-secondary, #485d54);
  background: var(--btn-cancel-bg, #e9ecef);
}

.delete-document-button {
  color: var(--on-secondary, #ffffff);
  background: var(--secondary, #C7613C);
}

.upload-button:hover:not(.disabled),
.preview-link:hover,
.remove-button:hover:not(:disabled),
.delete-document-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.upload-button.disabled,
.remove-button:disabled,
.delete-document-button:disabled {
  cursor: wait;
  opacity: 0.68;
}

.save-message {
  margin: 18px 0 0;
  color: var(--primary, #2F5F48);
  font-weight: 700;
}

.save-message.error {
  color: var(--secondary, #C7613C);
}

@media (max-width: 840px) {
  .document-card {
    grid-template-columns: 1fr;
  }

  .document-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .manager {
    padding: 16px;
  }

  .document-actions {
    flex-direction: column;
  }

  .upload-button,
  .preview-link,
  .remove-button,
  .delete-document-button,
  .upload-progress {
    width: 100%;
    min-width: 0;
  }
}
</style>
