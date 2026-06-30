<template>
  <div class="manager">
    <div class="manager-heading">
      <div>
        <h2>Вакансії</h2>
        <p>Додавайте, редагуйте та видаляйте актуальні вакансії школи.</p>
      </div>
      <button class="btn-primary" type="button" @click="startAdding">
        {{ showForm && !editingId ? 'Очистити форму' : '+ Додати вакансію' }}
      </button>
    </div>

    <div v-if="showForm" class="editor-card">
      <h3>{{ editingId ? 'Редагування вакансії' : 'Нова вакансія' }}</h3>
      <label class="field">
        <span>Назва посади</span>
        <input v-model="form.title" type="text" placeholder="Наприклад, учитель математики" />
      </label>
      <label class="field">
        <span>Коротка примітка</span>
        <input v-model="form.summary" type="text" placeholder="Навантаження, графік або інша важлива деталь" />
      </label>
      <div class="field">
        <span>Опис вакансії</span>
        <RichTextEditor
          v-model="form.content"
          content-label="Опис вакансії"
          placeholder="Опишіть вимоги, обов'язки та умови..."
          @limit-change="contentOverLimit = $event.overLimit"
        />
      </div>
      <div class="form-actions">
        <button class="btn-save" type="button" :disabled="saving || contentOverLimit" @click="saveVacancy">
          {{ saving ? 'Збереження...' : 'Зберегти' }}
        </button>
        <button class="btn-cancel" type="button" @click="closeForm">Скасувати</button>
      </div>
    </div>

    <div class="items-list">
      <article v-for="item in vacancies" :key="item.id" class="item-card">
        <div class="item-content">
          <h3>{{ item.title }}</h3>
          <p v-if="item.summary" class="summary">{{ item.summary }}</p>
          <div class="preview" v-html="sanitize(item.content)"></div>
        </div>
        <div class="item-actions">
          <button type="button" class="btn-edit" @click="editVacancy(item)">Редагувати</button>
          <button type="button" class="btn-delete" @click="removeVacancy(item)">Видалити</button>
        </div>
      </article>
      <p v-if="!vacancies.length" class="empty-state">Вакансій поки немає.</p>
    </div>
  </div>
</template>

<script>
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { sanitizeRichText } from '../../utils/sanitizeRichText';
import RichTextEditor from '../RichTextEditor.vue';

export default {
  name: 'VacanciesManager',
  components: { RichTextEditor },
  data() {
    return {
      vacancies: [],
      showForm: false,
      editingId: null,
      saving: false,
      contentOverLimit: false,
      unsubscribe: null,
      form: {
        title: '',
        summary: '',
        content: ''
      }
    };
  },
  mounted() {
    this.unsubscribe = onSnapshot(collection(db, 'vacancies'), snapshot => {
      this.vacancies = snapshot.docs
        .map(item => ({ id: item.id, ...item.data() }))
        .sort((a, b) => this.getTime(b.updatedAt || b.createdAt) - this.getTime(a.updatedAt || a.createdAt));
    });
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    sanitize: sanitizeRichText,
    getTime(value) {
      if (!value) return 0;
      return value.toMillis ? value.toMillis() : new Date(value).getTime();
    },
    resetForm() {
      this.form = { title: '', summary: '', content: '' };
      this.contentOverLimit = false;
    },
    startAdding() {
      this.editingId = null;
      this.resetForm();
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.editingId = null;
      this.resetForm();
    },
    editVacancy(item) {
      this.editingId = item.id;
      this.form = {
        title: item.title || '',
        summary: item.summary || '',
        content: item.content || ''
      };
      this.contentOverLimit = false;
      this.showForm = true;
    },
    async saveVacancy() {
      if (!this.form.title.trim()) {
        alert('Вкажіть назву посади.');
        return;
      }
      if (this.contentOverLimit) {
        alert('Опис вакансії перевищує безпечний ліміт Firebase.');
        return;
      }

      this.saving = true;
      const payload = {
        title: this.form.title.trim(),
        summary: this.form.summary.trim(),
        content: this.form.content,
        updatedAt: serverTimestamp()
      };

      try {
        if (this.editingId) {
          await updateDoc(doc(db, 'vacancies', this.editingId), payload);
        } else {
          await addDoc(collection(db, 'vacancies'), {
            ...payload,
            createdAt: serverTimestamp()
          });
        }
        this.closeForm();
      } catch (error) {
        console.error('Vacancy saving error:', error);
        alert('Не вдалося зберегти вакансію.');
      } finally {
        this.saving = false;
      }
    },
    async removeVacancy(item) {
      if (!confirm(`Видалити вакансію "${item.title}"?`)) return;

      try {
        await deleteDoc(doc(db, 'vacancies', item.id));
      } catch (error) {
        console.error('Vacancy deletion error:', error);
        alert('Не вдалося видалити вакансію.');
      }
    }
  }
};
</script>

<style scoped>
.manager {
  padding: 24px;
  background: var(--surface-elevated, #fff);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
}

.manager-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.manager-heading h2 {
  margin: 0 0 8px;
  padding-left: 16px;
  color: var(--secondary);
  border-left: 5px solid var(--secondary);
}

.manager-heading p,
.summary {
  margin: 0;
  color: var(--text-secondary);
}

.editor-card,
.item-card {
  padding: 20px;
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: 14px;
}

.editor-card {
  margin-bottom: 24px;
}

.editor-card h3 {
  margin: 0 0 18px;
  color: var(--heading);
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
  color: var(--text-primary);
}

.field > span {
  font-weight: 700;
}

.field input {
  width: 100%;
  padding: 11px 13px;
  color: var(--text-primary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 9px;
}

.form-actions,
.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: flex-start;
}

.btn-save,
.btn-cancel,
.btn-edit,
.btn-delete {
  padding: 9px 17px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.btn-edit,
.btn-delete {
  min-height: 34px;
  padding: 7px 11px;
  font-size: 0.82rem;
  white-space: nowrap;
}

.btn-save,
.btn-edit {
  color: var(--on-primary);
  background: var(--primary);
}

.btn-delete {
  color: var(--on-secondary);
  background: var(--secondary);
}

.btn-cancel {
  color: var(--text-secondary);
  background: var(--surface-muted);
}

.items-list {
  display: grid;
  gap: 14px;
}

.item-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
}

.item-content h3 {
  margin: 0 0 6px;
  color: var(--heading);
}

.preview {
  max-height: 7em;
  margin-top: 10px;
  overflow: hidden;
  color: var(--text-secondary);
  line-height: 1.55;
}

.preview :deep(img),
.preview :deep(iframe),
.preview :deep(video) {
  display: none;
}

.empty-state {
  padding: 32px;
  color: var(--text-muted);
  background: var(--surface-soft);
  border-radius: 14px;
  text-align: center;
}

@media (max-width: 700px) {
  .manager,
  .editor-card {
    padding: 16px;
  }

  .manager-heading,
  .item-card {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .form-actions,
  .item-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
