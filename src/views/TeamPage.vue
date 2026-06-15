<template>
  <div class="team-page">
    <div class="container">
      <h1 class="page-title">Наша команда</h1>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Завантаження...</p>
      </div>

      <div v-else-if="sortedEmployees.length === 0" class="empty-state">
        <p>Сторінка команди готується. Завітайте пізніше!</p>
      </div>

      <div v-else class="team-grid">
        <div 
          v-for="emp in sortedEmployees" 
          :key="emp.id" 
          class="team-card"
          @click="openModal(emp)"
        >
          <div class="photo-wrapper">
            <img 
              :src="emp.photoUrl || getPlaceholderImage(emp.fullName)" 
              :alt="emp.fullName"
              class="employee-photo"
            >
          </div>
          <div class="card-content">
            <h3 class="employee-name">{{ emp.fullName }}</h3>
            <p class="employee-position">{{ emp.position }}</p>
            <!-- Прев'ю опису: простий текст без HTML, обрізаний до 120 символів -->
            <p class="employee-description">{{ truncatePlainText(emp.description, 120) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальне вікно -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <button class="modal-close" @click="closeModal" aria-label="Закрити">✕</button>
        <div class="modal-content">
          <div class="modal-info">
            <h2>{{ selectedEmployee?.fullName }}</h2>
            <p class="modal-position">{{ selectedEmployee?.position }}</p>
            <!-- Повний HTML-опис, очищений через DOMPurify -->
            <div class="modal-description" v-html="sanitizeHtml(selectedEmployee?.description)"></div>
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
  name: 'TeamPage',
  data() {
    return {
      employees: [],
      loading: true,
      unsubscribe: null,
      modalOpen: false,
      selectedEmployee: null
    };
  },
  computed: {
    sortedEmployees() {
      return [...this.employees].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  },
  mounted() {
    this.unsubscribe = onSnapshot(collection(db, 'employees'), (snapshot) => {
      this.employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.loading = false;
    });
    window.addEventListener('keydown', this.handleEscKey);
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    window.removeEventListener('keydown', this.handleEscKey);
    document.body.style.overflow = '';
  },
  methods: {
    getPlaceholderImage(fullName) {
      const initials = fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="#f0f2f5"/>
          <circle cx="100" cy="100" r="80" fill="#C7613C" opacity="0.15"/>
          <text x="100" y="115" text-anchor="middle" fill="#C7613C" font-family="Arial, sans-serif" font-size="64" font-weight="bold" dominant-baseline="middle">${initials}</text>
        </svg>
      `;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    },

    // Очищує HTML і додає стиль до всіх зображень
    sanitizeHtml(html) {
      if (!html) return '';
      const clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'blockquote', 'p', 'br', 'img', 'h1', 'h2', 'h3', 'h4', 'span', 'div'],
        ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'style']
      });
      // Додаємо стиль до всіх img через DOM парсер
      const parser = new DOMParser();
      const doc = parser.parseFromString(clean, 'text/html');
      const imgs = doc.querySelectorAll('img');
      imgs.forEach(img => {
        let style = img.getAttribute('style') || '';
        // Додаємо обмеження, якщо їх немає
        if (!style.includes('max-width:100%')) {
          style = style + '; max-width: 100%; height: auto;';
        }
        img.setAttribute('style', style);
      });
      return doc.body.innerHTML;
    },

    // Видаляє HTML-теги і обрізає простий текст до maxLength
    truncatePlainText(html, maxLength) {
      if (!html) return '';
      // Очищуємо HTML, а потім видаляємо всі теги
      const cleanHtml = DOMPurify.sanitize(html);
      const div = document.createElement('div');
      div.innerHTML = cleanHtml;
      const plainText = div.textContent || div.innerText || '';
      if (plainText.length <= maxLength) return plainText;
      return plainText.slice(0, maxLength).trim() + '…';
    },

    openModal(emp) {
      this.selectedEmployee = emp;
      this.modalOpen = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.modalOpen = false;
      this.selectedEmployee = null;
      document.body.style.overflow = '';
    },
    handleEscKey(e) {
      if (e.key === 'Escape' && this.modalOpen) {
        this.closeModal();
      }
    }
  }
};
</script>

<style scoped>
.team-page {
  padding: 80px 0;
  background: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  color: #1e293b;
  position: relative;
}
.page-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: #C7613C;
  margin: 16px auto 0;
  border-radius: 2px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #C7613C;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 24px;
  color: #64748b;
  font-size: 1.2rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
}

.team-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}
.team-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
}

.photo-wrapper {
  background: #f1f5f9;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 24px 0 24px;
}
.employee-photo {
  width: 100%;
  max-width: 220px;
  height: 220px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}
.team-card:hover .employee-photo {
  transform: scale(1.02);
}

.card-content {
  padding: 20px 24px 28px;
  text-align: center;
}

.employee-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.3;
}

.employee-position {
  font-size: 1rem;
  font-weight: 600;
  color: #C7613C;
  margin-bottom: 16px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.employee-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #334155;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Модальне вікно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 32px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  animation: fadeInUp 0.3s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: #f1f5f9;
  border: none;
  font-size: 24px;
  line-height: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
  color: #1e293b;
}
.modal-close:hover {
  background: #e2e8f0;
  transform: scale(1.05);
}

.modal-content {
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.modal-info {
  text-align: center;
}
.modal-info h2 {
  font-size: 2rem;
  margin-bottom: 8px;
  color: #0f172a;
}
.modal-position {
  font-size: 1.2rem;
  font-weight: 600;
  color: #C7613C;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.modal-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #334155;
  overflow-x: auto;
  word-wrap: break-word;
  max-width: 100%;
}

@media (min-width: 768px) {
  .modal-content {
    flex-direction: row;
    align-items: center;
    text-align: left;
    gap: 40px;
  }
  .modal-info {
    text-align: left;
  }
  .modal-position {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 95%;
  }
  .modal-content {
    padding: 24px;
  }
  .modal-info h2 {
    font-size: 1.6rem;
  }
}
.modal-description img {
  max-width: 100% !important;
  max-height: 400px !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain;
  border-radius: 12px;
  margin: 16px 0;
  display: block;
}

/* Додаткові стилі для списків, цитат тощо */
.modal-description ul,
.modal-description ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
.modal-description blockquote {
  border-left: 4px solid #C7613C;
  margin: 1rem 0;
  padding-left: 1rem;
  font-style: italic;
  color: #475569;
}
.modal-description img {
  max-width: 100px;   /* не ширше контейнера */
  height: auto;      /* пропорційне масштабування */
  display: block;    /* прибирає зайві відступи */
  margin: 0 auto;    /* центрує фото */
  border-radius: 12px; /* необов’язково: округлення країв */
}
</style>