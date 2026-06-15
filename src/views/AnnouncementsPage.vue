<template>
  <div class="announcements-page">
    <div class="container">
      <h1 class="page-title">Оголошення</h1>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Завантаження...</p>
      </div>

      <div v-else-if="sortedAnnouncements.length === 0" class="empty-state">
        <p>Наразі немає оголошень. Завітайте пізніше!</p>
      </div>

      <div v-else class="announcements-list">
        <div
          v-for="item in sortedAnnouncements"
          :key="item.id"
          class="announcement-card"
          :class="{ important: item.important }"
        >
          <div class="announcement-header">
            <h2>{{ item.title }}</h2>
            <span v-if="item.important" class="important-badge">Важливо</span>
          </div>
          <p class="announcement-content">{{ item.content }}</p>
          <div class="announcement-footer">
            <span class="date">{{ formatDate(item.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default {
  name: 'AnnouncementsPage',
  data() {
    return {
      announcements: [],
      loading: true
    };
  },
  computed: {
    sortedAnnouncements() {
      return [...this.announcements].sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
    }
  },
  mounted() {
    onSnapshot(collection(db, 'announcements'), (snapshot) => {
      this.announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.loading = false;
    });
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return 'Дата не вказана';
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
.announcements-page {
  padding: 60px 0;
  background: #f9f9f9;
  min-height: 70vh;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}
.page-title {
  font-size: 36px;
  text-align: center;
  color: #2F5F48;
  margin-bottom: 40px;
  position: relative;
}
.page-title:after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: #C7613C;
  margin: 15px auto 0;
}
.loading-spinner {
  text-align: center;
  padding: 50px;
}
.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 15px;
  border: 4px solid #e0e0e0;
  border-top-color: #2F5F48;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  color: #888;
}
.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.announcement-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-left: 5px solid #ccc;
  transition: transform 0.2s;
}
.announcement-card.important {
  border-left-color: #C7613C;
  background: #fffaf5;
}
.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
.announcement-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1a2b22;
}
.important-badge {
  background: #C7613C;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}
.announcement-content {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 20px;
}
.announcement-footer {
  text-align: right;
  border-top: 1px solid #eee;
  padding-top: 12px;
}
.date {
  color: #888;
  font-size: 13px;
}
@media (max-width: 768px) {
  .announcements-page { padding: 40px 0; }
  .page-title { font-size: 28px; }
  .announcement-header h2 { font-size: 20px; }
}
</style>