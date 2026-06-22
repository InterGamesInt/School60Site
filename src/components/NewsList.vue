<template>
  <section class="news-section">
    <div class="container">
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Завантаження новин...</p>
      </div>

      <div v-else-if="sortedNews.length === 0" class="empty-news">
        <p>Немає новин. Слідкуйте за оновленнями!</p>
      </div>

      <div v-else class="news-grid">
        <article v-for="item in sortedNews" :key="item.id" class="news-card" @click="openModal(item)">
          <div class="news-card-inner">
            <div class="news-date-badge">
              <span class="day">{{ formatDateDay(item.date) }}</span>
              <span class="month">{{ formatDateMonth(item.date) }}</span>
            </div>
            <div class="news-content">
              <h3 class="news-title">{{ item.title }}</h3>
              <div class="news-text" v-html="sanitizeHtml(truncateContent(item.content, 120))"></div>
              <div class="news-footer">
                <span class="news-time">{{ formatTime(item.date) }}</span>
                <button class="read-more-btn" @click.stop="openModal(item)">Детальніше →</button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Модальне вікно -->
    <Teleport to="body">
      <div v-if="modalVisible" class="modal-overlay" @mousedown.self="closeModal" @touchstart.self="closeModal">
        <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button class="modal-close" @click="closeModal" aria-label="Закрити модальне вікно">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h3 id="modal-title">{{ selectedNews?.title }}</h3>
          <div class="modal-date">{{ formatDateTime(selectedNews?.date) }}</div>
          <div class="modal-body" v-html="sanitizeHtml(selectedNews?.content)"></div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script>
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import DOMPurify from 'dompurify';

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
    window.addEventListener('keydown', this.handleEscKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleEscKey);
    document.body.style.overflow = '';
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
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit'
      });
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
    truncateContent(html, maxLength) {
      if (!html) return '';
      const div = document.createElement('div');
      div.innerHTML = html;
      const text = div.textContent || div.innerText || '';
      if (text.length <= maxLength) return html;
      const truncated = text.slice(0, maxLength).trim() + '…';
      return truncated;
    },
    sanitizeHtml(html) {
      if (!html) return '';
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'blockquote',
          'p', 'br', 'img', 'h1', 'h2', 'h3', 'h4', 'span', 'div',
          'iframe', 'video', 'source'
        ],
        ALLOWED_ATTR: [
          'href', 'target', 'src', 'alt', 'class', 'style',
          'width', 'height', 'frameborder', 'allowfullscreen', 'allow',
          'controls', 'autoplay', 'muted', 'loop'
        ]
      });
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
    },
    handleEscKey(e) {
      if (e.key === 'Escape' && this.modalVisible) {
        this.closeModal();
      }
    }
  }
};
</script>

<style scoped>
/* ============================================
   ОСНОВНІ СТИЛІ (без фону та декорацій)
   ============================================ */
.news-section {
  padding: 0;
  background: transparent;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ============================================
   СТАН ЗАВАНТАЖЕННЯ / ПОРОЖНІЙ СТАН
   ============================================ */
.loading-spinner {
  text-align: center;
  padding: 60px 20px;
}
.spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border: 4px solid var(--border-color, #e2e8f0);
  border-top-color: var(--secondary, #C7613C);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-news {
  text-align: center;
  padding: 80px 20px;
  background: var(--white, #ffffff);
  border-radius: 24px;
  color: var(--text-muted, #8c9aad);
  font-size: 1.2rem;
  box-shadow: var(--shadow-light, 0 2px 8px rgba(0,0,0,0.04));
}

/* ============================================
   СІТКА НОВИН
   ============================================ */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
}

/* ============================================
   КАРТКА НОВИНИ
   ============================================ */
.news-card {
  background: var(--white, #ffffff);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(47, 95, 72, 0.06);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease;
  overflow: hidden;
  border: 1px solid rgba(47, 95, 72, 0.04);
  cursor: pointer;
}
.news-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(47, 95, 72, 0.12);
}
.news-card-inner {
  display: flex;
  padding: 24px 28px 28px;
  gap: 20px;
  align-items: flex-start;
}

/* Бейдж дати */
.news-date-badge {
  flex-shrink: 0;
  width: 64px;
  background: var(--bg, #f8fafc);
  border-radius: 14px;
  text-align: center;
  padding: 10px 6px;
  border: 1px solid rgba(47, 95, 72, 0.06);
  transition: background 0.3s;
}
.news-card:hover .news-date-badge {
  background: var(--primary-light, #f0f7f0);
}
.day {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary, #2F5F48);
  line-height: 1;
}
.month {
  display: block;
  font-size: 12px;
  color: var(--secondary, #C7613C);
  text-transform: uppercase;
  margin-top: 4px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Контент */
.news-content {
  flex: 1;
  min-width: 0;
}
.news-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  margin: 0 0 10px 0;
  line-height: 1.3;
  transition: color 0.3s;
}
.news-card:hover .news-title {
  color: var(--primary, #2F5F48);
}
.news-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary, #4a5568);
  margin: 0 0 16px 0;
  max-height: 4.5em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.news-text :deep(img) {
  display: none;
}
.news-text :deep(ul),
.news-text :deep(ol) {
  padding-left: 1.2rem;
  margin: 0.2rem 0;
}
.news-text :deep(blockquote) {
  border-left: 4px solid var(--secondary, #C7613C) !important;
  margin: 0.3rem 0 !important;
  padding-left: 0.8rem !important;
  font-style: italic !important;
  color: var(--text-secondary, #555) !important;
  background: var(--bg, #f8fafc);
  border-radius: 0 8px 8px 0;
}
.news-text :deep(a) {
  color: var(--secondary, #C7613C);
  text-decoration: underline;
}
.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  border-top: 1px solid rgba(47, 95, 72, 0.06);
  padding-top: 14px;
}
.news-time {
  font-size: 0.85rem;
  color: var(--text-muted, #8c9aad);
}
.read-more-btn {
  background: none;
  border: none;
  color: var(--secondary, #C7613C);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.read-more-btn:hover {
  color: var(--primary, #2F5F48);
  transform: translateX(4px);
}

/* ============================================
   МОДАЛЬНЕ ВІКНО (залишається без змін)
   ============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: overlayFade 0.3s ease;
}
@keyframes overlayFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: var(--white, #ffffff);
  border-radius: 32px;
  max-width: 720px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 40px 44px 48px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
  animation: modalSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  outline: none;
}
@keyframes modalSlide {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.modal-container::-webkit-scrollbar {
  width: 6px;
}
.modal-container::-webkit-scrollbar-track {
  background: var(--bg, #f1f5f9);
  border-radius: 3px;
}
.modal-container::-webkit-scrollbar-thumb {
  background: var(--secondary, #C7613C);
  border-radius: 3px;
}

.modal-close {
  position: sticky;
  float: right;
  top: 0;
  margin-top: -8px;
  margin-right: -8px;
  background: rgba(0, 0, 0, 0.04);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--text-primary, #1e293b);
  z-index: 10;
}
.modal-close:hover {
  background: var(--secondary, #C7613C);
  color: #fff;
  transform: rotate(90deg);
}
.modal-close svg {
  width: 22px;
  height: 22px;
}

.modal-container h3 {
  clear: both;
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  line-height: 1.3;
  padding-right: 20px;
}
.modal-date {
  font-size: 0.9rem;
  color: var(--text-muted, #8c9aad);
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(47, 95, 72, 0.06);
  padding-bottom: 16px;
}
.modal-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary, #4a5568);
}
.modal-body :deep(p) {
  margin: 0 0 0.8em 0;
}
.modal-body :deep(blockquote) {
  border-left: 4px solid var(--secondary, #C7613C) !important;
  margin: 1rem 0 !important;
  padding-left: 1rem !important;
  font-style: italic !important;
  color: var(--text-secondary, #475569) !important;
  background: var(--bg, #f8fafc);
  border-radius: 0 8px 8px 0;
}
.modal-body :deep(ul),
.modal-body :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
.modal-body :deep(img) {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 12px;
  margin: 16px 0;
}
.modal-body :deep(a) {
  color: var(--secondary, #C7613C);
  text-decoration: none;
}
.modal-body :deep(a:hover) {
  text-decoration: underline;
}
.modal-body :deep(iframe) {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* ============================================
   АДАПТИВНІСТЬ
   ============================================ */
@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .news-card-inner {
    flex-direction: column;
    padding: 20px;
    gap: 12px;
  }
  .news-date-badge {
    display: flex;
    width: auto;
    gap: 10px;
    align-items: baseline;
    background: none;
    padding: 0;
    border: none;
  }
  .news-date-badge .day {
    font-size: 18px;
  }
  .news-date-badge .month {
    font-size: 14px;
    margin-top: 0;
  }
  .modal-container {
    padding: 28px 24px 32px;
    max-height: 90vh;
  }
  .modal-container h3 {
    font-size: 1.6rem;
  }
  .modal-close {
    width: 36px;
    height: 36px;
  }
  .modal-close svg {
    width: 18px;
    height: 18px;
  }
}
@media (max-width: 480px) {
  .news-card-inner {
    padding: 16px;
  }
  .modal-container {
    padding: 20px 16px 24px;
  }
  .modal-container h3 {
    font-size: 1.3rem;
  }
}
</style>