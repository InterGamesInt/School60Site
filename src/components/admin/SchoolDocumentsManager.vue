<template>
  <div class="manager school-documents-manager">
    <h2>Шкільна документація</h2>
    <p class="manager-note">
      Завантажте PDF-файли для документів, які відображаються у PDF-рідерах на сторінці "Школа без булінгу".
      Файли зберігаються у Firestore, тому краще використовувати стиснуті PDF.
    </p>

    <div v-if="loading" class="state-box">Завантаження документів...</div>

    <div v-else class="documents-list">
      <section v-for="document in documents" :key="document.id" class="document-card">
        <div class="document-main">
          <div>
            <h3>{{ document.title }}</h3>
            <p>{{ document.description }}</p>
          </div>

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
            @click="clearDocument(document)"
          >
            Прибрати
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  clearFirestorePdfDocument,
  mergeSchoolDocuments,
  schoolDocumentSlots,
  uploadPdfToFirestoreChunks
} from '../../data/schoolDocuments';

export default {
  name: 'SchoolDocumentsManager',
  data() {
    return {
      documentsById: {},
      loading: true,
      uploading: {},
      uploadProgress: {},
      unsubscribeDocuments: null
    };
  },
  computed: {
    documents() {
      return mergeSchoolDocuments(this.documentsById);
    }
  },
  mounted() {
    this.unsubscribeDocuments = onSnapshot(
      doc(db, 'siteSettings', 'schoolDocuments'),
      (snapshot) => {
        this.documentsById = snapshot.exists() ? snapshot.data().documents || {} : {};
        this.loading = false;
      },
      (error) => {
        console.error('School documents loading error:', error);
        this.documentsById = {};
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
        const nextDocuments = {
          ...this.documentsById,
          [documentItem.id]: metadata
        };

        await this.saveDocuments(nextDocuments);
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
    async clearDocument(documentItem) {
      if (!confirm(`Прибрати PDF для "${documentItem.title}"?`)) return;

      this.setUploading(documentItem.id, true);

      try {
        await clearFirestorePdfDocument(db, documentItem.id);
        const nextDocuments = { ...this.documentsById };
        delete nextDocuments[documentItem.id];
        await this.saveDocuments(nextDocuments);
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
    async saveDocuments(nextDocuments) {
      await setDoc(
        doc(db, 'siteSettings', 'schoolDocuments'),
        {
          documents: nextDocuments,
          documentOrder: schoolDocumentSlots.map(item => item.id),
          updatedAt: Timestamp.now()
        }
      );
      this.documentsById = nextDocuments;
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

.document-main h3 {
  margin: 0 0 6px;
  color: var(--text-primary, #1f352b);
  font-size: 1.16rem;
}

.document-main p {
  margin: 0;
  color: var(--text-secondary, #485d54);
  line-height: 1.55;
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
.remove-button {
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

.upload-button:hover:not(.disabled),
.preview-link:hover,
.remove-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.upload-button.disabled,
.remove-button:disabled {
  cursor: wait;
  opacity: 0.68;
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
  .upload-progress {
    width: 100%;
    min-width: 0;
  }
}
</style>
