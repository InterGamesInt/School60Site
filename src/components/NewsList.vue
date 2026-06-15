<template>
  <section class="news-section">
    <div class="container">
      <h2 class="section-title">Новини школи</h2>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Завантаження новин...</p>
      </div>

      <div v-else-if="sortedNews.length === 0" class="empty-news">
        <p>Немає новин. Слідкуйте за оновленнями!</p>
      </div>

      <div v-else class="news-grid">
        <article v-for="item in sortedNews" :key="item.id" class="news-card">
          <div class="news-card-inner">
            <div class="news-date-badge">
              <span class="day">{{ formatDateDay(item.date) }}</span>
              <span class="month">{{ formatDateMonth(item.date) }}</span>
            </div>
            <div class="news-content">
              <h3 class="news-title">{{ item.title }}</h3>
              <p class="news-text">{{ truncateText(item.content, 120) }}</p>
              <div class="news-footer">
                <span class="news-time">{{ formatDateTime(item.date) }}</span>
                <!-- Кнопка "Читати далі" якщо текст довгий (опціонально) -->
                <button v-if="item.content.length > 120" class="read-more-btn" @click="openModal(item)">
                  Читати далі
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Модальне вікно для повного тексту -->
      <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal">&times;</button>
          <h3>{{ selectedNews?.title }}</h3>
          <div class="modal-date">{{ formatDateTime(selectedNews?.date) }}</div>
          <p>{{ selectedNews?.content }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default {
  name: 'NewsList',
  data() {
    return {
      news: [],
      loading: true,
      modalVisible: false,
      selectedNews: null
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
      this.loading = false;
    });
  },
  methods: {
    formatDateDay(timestamp) {
      if (!timestamp) return '?';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.getDate();
    },
    formatDateMonth(timestamp) {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('uk-UA', { month: 'short' }).replace('.', '');
    },
    formatDateTime(timestamp) {
      if (!timestamp) return 'Дата не вказана';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    },
    openModal(news) {
      this.selectedNews = news;
      this.modalVisible = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedNews = null;
      document.body.style.overflow = '';
    }
  }
}
</script>

<style scoped>
.news-section {
  padding: 60px 0;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 36px;
  text-align: center;
  color: #2F5F48;
  margin-bottom: 40px;
  position: relative;
}
.section-title:after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: #C7613C;
  margin: 15px auto 0;
  border-radius: 2px;
}

/* Сітка новин */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

/* Картка новини */
.news-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}
.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.12);
}
.news-card-inner {
  display: flex;
  padding: 20px;
  gap: 20px;
  align-items: flex-start;
}

/* Бейдж з датою */
.news-date-badge {
  flex-shrink: 0;
  width: 60px;
  background: #f0f7ff;
  border-radius: 12px;
  text-align: center;
  padding: 10px 5px;
  box-shadow: inset 0 0 0 1px rgba(47,95,72,0.1);
}
.day {
  display: block;
  font-size: 26px;
  font-weight: bold;
  color: #2F5F48;
  line-height: 1;
}
.month {
  display: block;
  font-size: 12px;
  color: #C7613C;
  text-transform: uppercase;
  margin-top: 5px;
}

/* Контент */
.news-content {
  flex: 1;
}
.news-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e2f2a;
  margin: 0 0 10px 0;
  line-height: 1.3;
}
.news-text {
  font-size: 15px;
  line-height: 1.5;
  color: #444;
  margin: 0 0 15px 0;
}
.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.news-time {
  font-size: 12px;
  color: #888;
}
.read-more-btn {
  background: none;
  border: none;
  color: #C7613C;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.read-more-btn:hover {
  color: #2F5F48;
  text-decoration: underline;
}

/* Завантаження */
.loading-spinner {
  text-align: center;
  padding: 40px;
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

/* Порожній стан */
.empty-news {
  text-align: center;
  padding: 60px 20px;
  background: #f9f9f9;
  border-radius: 20px;
  color: #888;
}

/* Модальне вікно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
}
.modal-content {
  background: white;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 25px;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 20px 35px rgba(0,0,0,0.3);
}
.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #C7613C;
}
.modal-content h3 {
  margin-top: 0;
  color: #2F5F48;
  padding-right: 30px;
}
.modal-date {
  font-size: 12px;
  color: #888;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
.modal-content p {
  line-height: 1.6;
  color: #333;
}

/* Адаптивність */
@media (max-width: 768px) {
  .news-section {
    padding: 40px 0;
  }
  .section-title {
    font-size: 28px;
  }
  .news-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .news-card-inner {
    flex-direction: column;
    gap: 12px;
  }
  .news-date-badge {
    display: flex;
    width: auto;
    gap: 8px;
    align-items: baseline;
    background: none;
    padding: 0;
    box-shadow: none;
  }
  .news-date-badge .day {
    font-size: 16px;
    font-weight: bold;
  }
  .news-date-badge .month {
    font-size: 14px;
  }
}
</style>