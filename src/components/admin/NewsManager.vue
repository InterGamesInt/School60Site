<template>
  <div class="manager">
    <h2>Новини</h2>
    <button @click="openAddForm" class="btn-add">
      {{ editingId ? 'Скасувати' : '+ Додати новину' }}
    </button>

    <div v-if="showForm" class="form-card">
      <h3>{{ editingId ? 'Редагувати новину' : 'Нова новина' }}</h3>
      <div class="form-group">
        <label>Заголовок</label>
        <input v-model="form.title" class="form-control" placeholder="Введіть заголовок" />
      </div>
      <div class="form-group">
        <label>Текст</label>
        <RichTextEditor v-model="form.content" placeholder="Введіть текст новини..." />
      </div>
      <div class="form-group">
        <label>Дата та час публікації</label>
        <input type="datetime-local" v-model="form.dateLocal" class="form-control" />
      </div>
      <div class="form-actions">
        <button @click="saveNews" class="btn-save">Зберегти</button>
        <button @click="closeForm" class="btn-cancel">Скасувати</button>
      </div>
    </div>

    <div class="items-list">
      <div v-for="item in sortedNews" :key="item.id" class="item-card">
        <div class="item-content">
          <h3>{{ item.title }}</h3>
          <!-- Відображаємо повний HTML, обмежений через CSS -->
          <div class="content-preview" v-html="sanitizeHtml(item.content)"></div>
          <small class="date">{{ formatDate(item.date) }}</small>
        </div>
        <div class="item-actions">
          <button @click="editNews(item)" class="btn-edit" title="Редагувати">✏️</button>
          <button @click="deleteNews(item.id)" class="btn-delete" title="Видалити">🗑️</button>
        </div>
      </div>
      <div v-if="sortedNews.length === 0" class="empty-state">
        Немає новин. Додайте першу!
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import RichTextEditor from '../RichTextEditor.vue';
import DOMPurify from 'dompurify';

export default {
  components: { RichTextEditor },
  data() {
    return {
      news: [],
      showForm: false,
      editingId: null,
      form: {
        title: '',
        content: '',
        dateLocal: ''
      }
    };
  },
  computed: {
    sortedNews() {
      return [...this.news].sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
    }
  },
  mounted() {
    onSnapshot(collection(db, 'news'), (snapshot) => {
      this.news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  },
  methods: {
    sanitizeHtml(html) {
      if (!html) return '';
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'blockquote',
          'p', 'br', 'h1', 'h2', 'h3', 'h4', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'style']
      });
    },
    openAddForm() {
      this.resetForm();
      this.showForm = true;
      this.editingId = null;
    },
    closeForm() {
      this.showForm = false;
      this.editingId = null;
    },
    resetForm() {
      this.form = {
        title: '',
        content: '',
        dateLocal: new Date().toISOString().slice(0, 16)
      };
    },
    editNews(item) {
      this.editingId = item.id;
      this.form = {
        title: item.title || '',
        content: item.content || '',
        dateLocal: item.date?.toDate?.()?.toISOString().slice(0, 16) || new Date().toISOString().slice(0, 16)
      };
      this.showForm = true;
    },
    async saveNews() {
      if (!this.form.title.trim()) {
        alert('Введіть заголовок');
        return;
      }
      let dateObj = new Date(this.form.dateLocal);
      if (isNaN(dateObj.getTime())) dateObj = new Date();
      const firestoreTimestamp = Timestamp.fromDate(dateObj);

      const data = {
        title: this.form.title,
        content: this.form.content,
        date: firestoreTimestamp
      };

      try {
        if (this.editingId) {
          await updateDoc(doc(db, 'news', this.editingId), data);
        } else {
          await addDoc(collection(db, 'news'), data);
        }
        this.closeForm();
      } catch (err) {
        console.error(err);
        alert('Помилка збереження');
      }
    },
    async deleteNews(id) {
      if (confirm('Видалити новину?')) {
        await deleteDoc(doc(db, 'news', id));
      }
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
/* ============================================
   ОСНОВНІ ЗМІННІ (для консистентності)
   ============================================ */
:root {
  --primary: #2F5F48;
  --primary-dark: #1e4032;
  --secondary: #C7613C;
  --white: #ffffff;
  --bg: #f9f9f9;
  --light-bg: #fefcf8;
  --border-color: #e9ecef;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.1);
  --text-primary: #1e293b;
  --text-secondary: #4a5568;
  --text-muted: #888;
  --hover-bg: #f1f5f9;
}

/* ============================================
   КОМПОНЕНТ MANAGER
   ============================================ */
.manager {
  background: var(--white, #ffffff);
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
  background: var(--light-bg, #fefcf8);
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 32px;
  border: 1px solid var(--border-color, #e9ecef);
  box-shadow: var(--shadow, 0 4px 12px rgba(0, 0, 0, 0.04));
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
  background: var(--white, #ffffff) !important;
  color: var(--text-primary, #1e293b);
}
.form-control:focus {
  outline: none;
  border-color: var(--secondary, #C7613C);
  box-shadow: 0 0 0 3px rgba(199, 97, 60, 0.1);
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
.btn-save:hover {
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
  background: var(--white, #ffffff);
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

.item-content {
  flex: 1;
  min-width: 180px;
}
.item-content h3 {
  margin: 0 0 6px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary, #1e2a3a);
}
.content-preview {
  color: var(--text-secondary, #4a5568);
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0 0 8px 0;
  max-height: 4.5em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.content-preview img {
  display: none;
}
.content-preview ul,
.content-preview ol {
  padding-left: 1.2rem;
  margin: 0.2rem 0;
}
.content-preview blockquote {
  border-left: 4px solid var(--secondary, #C7613C);
  margin: 0.3rem 0;
  padding-left: 0.8rem;
  font-style: italic;
  color: var(--text-secondary, #555);
}
.content-preview a {
  color: var(--secondary, #C7613C);
  text-decoration: underline;
}

.date {
  color: var(--text-muted, #888);
  font-size: 0.75rem;
}

.item-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.btn-edit,
.btn-delete {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 40px;
  transition: all 0.2s;
  opacity: 0.7;
}
.btn-edit:hover,
.btn-delete:hover {
  background: var(--hover-bg, #f1f5f9);
  opacity: 1;
  transform: scale(1.05);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted, #8c9aad);
  background: var(--bg-light, #fcfcfc);
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
    align-items: stretch;
  }
  .item-content {
    text-align: center;
  }
  .item-actions {
    justify-content: center;
  }
  .form-actions {
    flex-direction: column;
  }
  .btn-save,
  .btn-cancel {
    width: 100%;
    text-align: center;
  }
}
</style>