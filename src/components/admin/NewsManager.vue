<template>
  <div class="manager">
    <h2>Новини</h2>
    <button @click="showAddForm = !showAddForm" class="btn-add">
      {{ showAddForm ? 'Скасувати' : '+ Додати новину' }}
    </button>

    <div v-if="showAddForm" class="form-card">
      <h3>Нова новина</h3>
      <div class="form-group">
        <label>Заголовок</label>
        <input v-model="newTitle" class="form-control">
      </div>
      <div class="form-group">
        <label>Текст</label>
        <textarea v-model="newContent" rows="4" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label>Дата та час публікації</label>
        <input type="datetime-local" v-model="newDateLocal" class="form-control">
      </div>
      <div class="form-actions">
        <button @click="addNews" class="btn-save">Зберегти</button>
        <button @click="showAddForm = false" class="btn-cancel">Скасувати</button>
      </div>
    </div>

    <div class="items-list">
      <div v-for="item in sortedNews" :key="item.id" class="item-card">
        <div class="item-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
          <small class="date">{{ formatDate(item.date) }}</small>
        </div>
        <div class="item-actions">
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
import { collection, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

export default {
  data() {
    return {
      news: [],
      showAddForm: false,
      newTitle: '',
      newContent: '',
      newDateLocal: new Date().toISOString().slice(0, 16)
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
    async addNews() {
      if (!this.newTitle.trim()) return;
      let dateObj = new Date(this.newDateLocal);
      if (isNaN(dateObj.getTime())) dateObj = new Date();
      const firestoreTimestamp = Timestamp.fromDate(dateObj);
      await addDoc(collection(db, 'news'), {
        title: this.newTitle,
        content: this.newContent,
        date: firestoreTimestamp
      });
      this.newTitle = '';
      this.newContent = '';
      this.showAddForm = false;
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
}
</script>

<style scoped>
.manager {
  background: white;
  border-radius: 12px;
  padding: 20px;
}
.manager h2 {
  margin-top: 0;
  color: #C7613C;
  font-weight: 600;
  font-size: 24px;
}
.btn-add {
  background: #2F5F48;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
}
.form-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.btn-save {
  background: #2F5F48;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-cancel {
  background: #ccc;
  color: #333;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
}
.items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.item-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}
.item-content {
  flex: 1;
}
.item-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}
.item-content p {
  margin: 0 0 10px 0;
  color: #444;
}
.date {
  color: #888;
  font-size: 12px;
}
.item-actions {
  display: flex;
  gap: 8px;
}
.btn-delete {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}
.btn-delete:hover {
  background: #e0e0e0;
}
.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
}
</style>