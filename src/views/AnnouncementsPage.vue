<template>
  <div class="announcements-page">
    <!-- Декоративні елементи фону -->
    <div class="page-bg-decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="container">
      <div class="page-header">
        <span class="page-badge">Новини</span>
        <h1 class="page-title">Оголошення</h1>
        <div class="page-line"></div>
        <p class="page-subtitle">Будьте в курсі всіх подій шкільного життя</p>
      </div>

      <div v-if="loading" class="loading-state">
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
          <div class="card-header">
            <div class="title-wrapper">
              <h2>{{ item.title }}</h2>
              <span v-if="item.important" class="important-badge">
                <span class="pulse-dot"></span>
                Важливо
              </span>
            </div>
            <div class="date-wrapper">
              <span class="date-icon">📅</span>
              <span class="date">{{ formatDate(item.date) }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="announcement-content" v-html="sanitizeHtml(item.content)"></div>
          </div>
          <div class="card-footer">
            <span class="read-more">Читати далі →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import DOMPurify from 'dompurify';

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
};
</script>

<style scoped>
/* ============================================
   ДОДАТКОВІ ЗМІННІ
   ============================================ */
:root {
  --announcement-bg-start: #f6faf9;
  --announcement-bg-end: #eaf2ee;
  --card-shadow: 0 8px 32px rgba(47, 95, 72, 0.08);
  --card-shadow-hover: 0 16px 48px rgba(47, 95, 72, 0.15);
  --card-radius: 24px;
  --card-transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ============================================
   ОСНОВНІ СТИЛІ
   ============================================ */
.announcements-page {
  position: relative;
  padding: 80px 0 100px;
  background: linear-gradient(160deg, var(--page-gradient-start, #f6faf9) 0%, var(--page-gradient-end, #eaf2ee) 100%);
  min-height: 70vh;
  overflow: hidden;
}

/* Декоративні елементи */
.page-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.shape {
  position: absolute;
  border-radius: 50%;
}
.shape-1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -100px;
  background: radial-gradient(circle, var(--decor-primary, rgba(47, 95, 72, 0.06)) 0%, transparent 70%);
}
.shape-2 {
  width: 350px;
  height: 350px;
  bottom: -120px;
  left: -80px;
  background: radial-gradient(circle, var(--decor-secondary, rgba(199, 97, 60, 0.05)) 0%, transparent 70%);
}
.shape-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: 50%;
  background: radial-gradient(circle, var(--decor-soft, rgba(47, 95, 72, 0.03)) 0%, transparent 70%);
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ============================================
   ЗАГОЛОВОК
   ============================================ */
.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-badge {
  display: inline-block;
  background: var(--primary, #2F5F48);
  color: var(--on-primary, #fff);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 6px 18px;
  border-radius: 30px;
  margin-bottom: 16px;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary, #2F5F48);
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.page-line {
  width: 80px;
  height: 4px;
  background: var(--secondary, #C7613C);
  border-radius: 2px;
  margin: 0 auto 16px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary, #4a5568);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ============================================
   СТАН ЗАВАНТАЖЕННЯ
   ============================================ */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text-muted, #8c9aad);
}
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color, #e2e8f0);
  border-top-color: var(--secondary, #C7613C);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--surface-elevated, #ffffff);
  border-radius: 24px;
  color: var(--text-muted, #8c9aad);
  font-size: 1.2rem;
  box-shadow: var(--shadow-light, 0 2px 8px rgba(0,0,0,0.04));
}

/* ============================================
   СПИСОК ОГОЛОШЕНЬ
   ============================================ */
.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ============================================
   КАРТКА
   ============================================ */
.announcement-card {
  background: var(--surface-elevated, #ffffff);
  border-radius: var(--card-radius, 24px);
  padding: 32px 36px;
  box-shadow: var(--card-shadow, 0 8px 32px rgba(47, 95, 72, 0.08));
  border: 1px solid var(--border, rgba(47, 95, 72, 0.04));
  transition: transform var(--card-transition, 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)),
              box-shadow 0.4s ease,
              border-color 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(2px);
}

.announcement-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(180deg, var(--primary, #2F5F48) 0%, var(--secondary, #C7613C) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: var(--card-radius) 0 0 var(--card-radius);
}
.announcement-card:hover::before {
  opacity: 1;
}

.announcement-card.important {
  background: linear-gradient(145deg, var(--surface-elevated, #fffcf8), var(--important-bg, #fef6f0));
  border-color: color-mix(in srgb, var(--secondary, #C7613C) 28%, var(--border, transparent));
}
.announcement-card.important::before {
  opacity: 1;
  background: linear-gradient(180deg, var(--secondary, #C7613C) 0%, var(--secondary-dark, #a64b2e) 100%);
}

.announcement-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--card-shadow-hover, 0 16px 48px rgba(47, 95, 72, 0.15));
  border-color: var(--border-strong, rgba(47, 95, 72, 0.08));
}

/* ============================================
   ЗАГОЛОВОК КАРТКИ
   ============================================ */
.card-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.title-wrapper {
  flex: 1;
  min-width: 200px;
}
.title-wrapper h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  line-height: 1.3;
  transition: color 0.3s ease;
}
.announcement-card:hover .title-wrapper h2 {
  color: var(--primary, #2F5F48);
}

.important-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--secondary, #C7613C);
  color: var(--on-secondary, #fff);
  padding: 4px 14px 4px 10px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
  animation: badgePulse 2s infinite;
}
@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.pulse-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  animation: dotPulse 1.5s infinite;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.date-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  color: var(--text-muted, #8c9aad);
  font-size: 0.85rem;
  background: var(--surface-muted, #f8fafc);
  padding: 4px 12px;
  border-radius: 30px;
  white-space: nowrap;
}
.date-icon {
  font-size: 1rem;
}
.date {
  font-weight: 500;
}

/* ============================================
   ТІЛО КАРТКИ
   ============================================ */
.card-body {
  margin-bottom: 20px;
}

.announcement-content {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary, #4a5568);
}

.announcement-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 16px 0;
}
.announcement-content :deep(ul),
.announcement-content :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.announcement-content :deep(blockquote) {
  border-left: 4px solid var(--secondary, #C7613C);
  margin: 1.2rem 0;
  padding: 0.8rem 1.2rem;
  font-style: italic;
  color: var(--text-muted, #475569);
  background: var(--primary-light, #f8fafc);
  border-radius: 0 8px 8px 0;
}
.announcement-content :deep(blockquote p:last-child) {
  margin-bottom: 0;
}
.announcement-content :deep(img.align-left:not([data-wrap="false"])) {
  float: left;
  margin: 0 1.5rem 1rem 0;
  max-width: 50%;
}
.announcement-content :deep(img.align-right:not([data-wrap="false"])) {
  float: right;
  margin: 0 0 1rem 1.5rem;
  max-width: 50%;
}
.announcement-content :deep(img.align-center),
.announcement-content :deep(img[data-wrap="false"]) {
  display: block;
  float: none;
  clear: both;
}
.announcement-content :deep(img.align-center) {
  margin-left: auto;
  margin-right: auto;
}
.announcement-content :deep(code) {
  padding: 0.15rem 0.4rem;
  color: var(--secondary, #C7613C);
  background: var(--primary-light, #f8fafc);
  border-radius: 4px;
  font-size: 0.9em;
}
.announcement-content :deep(pre) {
  margin: 1rem 0;
  padding: 1rem 1.2rem;
  overflow-x: auto;
  color: #e2e8f0;
  background: #1e293b;
  border-radius: 12px;
  font-size: 0.9rem;
}
.announcement-content :deep(pre code) {
  padding: 0;
  color: inherit;
  background: none;
  font-size: inherit;
}
.announcement-content :deep(hr) {
  margin: 1.5rem 0;
  border: 0;
  border-top: 2px solid var(--border, #e9edf2);
}
.announcement-content::after {
  content: '';
  display: block;
  clear: both;
}
.announcement-content :deep(a) {
  color: var(--secondary, #C7613C);
  text-decoration: none;
}
.announcement-content :deep(a:hover) {
  text-decoration: underline;
}

/* ============================================
   НИЖНЯ ЧАСТИНА КАРТКИ
   ============================================ */
.card-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border, rgba(47, 95, 72, 0.06));
  padding-top: 16px;
}

.read-more {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--secondary, #C7613C);
  cursor: default;
  transition: transform 0.3s ease;
  display: inline-block;
}
.announcement-card:hover .read-more {
  transform: translateX(6px);
}

/* ============================================
   АДАПТИВНІСТЬ
   ============================================ */
@media (max-width: 1024px) {
  .page-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .announcements-page {
    padding: 60px 0 80px;
  }
  .page-title {
    font-size: 2.2rem;
  }
  .page-subtitle {
    font-size: 1rem;
  }
  .announcement-card {
    padding: 24px 20px;
  }
  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .title-wrapper h2 {
    font-size: 1.4rem;
  }
  .date-wrapper {
    align-self: flex-start;
    white-space: normal;
  }
}

@media (max-width: 480px) {
  .announcements-page {
    padding: 40px 0 60px;
  }
  .page-title {
    font-size: 1.8rem;
  }
  .page-badge {
    font-size: 0.7rem;
    padding: 4px 14px;
  }
  .announcement-card {
    padding: 20px 16px;
  }
  .title-wrapper h2 {
    font-size: 1.2rem;
  }
  .announcement-content {
    font-size: 0.95rem;
  }
}
</style>
