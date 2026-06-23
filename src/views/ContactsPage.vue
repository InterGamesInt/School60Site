<template>
  <div class="contacts-page">
    <!-- Декоративні елементи фону -->
    <div class="page-bg-decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="container">
      <div class="page-header">
        <span class="page-badge">Зв'язок</span>
        <h1 class="page-title">Контакти</h1>
        <div class="page-line"></div>
        <p class="page-subtitle">Ми завжди на зв'язку — напишіть або зателефонуйте нам</p>
      </div>

      <div class="contacts-grid">
        <!-- Ліва колонка: інформація -->
        <div class="contacts-info">
          <!-- Адреса -->
          <div class="info-block" style="animation-delay: 0.05s">
            <div class="info-icon">📍</div>
            <h2>Адреса</h2>
            <p>вул. Романа Ратушного 1/2<br />м. Київ, Україна, 03110</p>
          </div>

          <!-- Контакти -->
          <div class="info-block" style="animation-delay: 0.15s">
            <div class="info-icon">📞</div>
            <h2>Контакти</h2>
            <p>
              <strong>Телефон:</strong>
              <a href="tel:+380441234567">+38 (044) 123-45-67</a>
            </p>
            <p>
              <strong>Email:</strong>
              <a href="mailto:school60@kyiv.ua">school60@kyiv.ua</a>
            </p>
          </div>

          <!-- Режим роботи -->
          <div class="info-block" style="animation-delay: 0.25s">
            <div class="info-icon">🕒</div>
            <h2>Режим роботи</h2>
            <p><strong>Пн – Пт:</strong> 8:00 – 20:00</p>
            <p><strong>Сб – Нд:</strong> вихідні</p>
          </div>

          <!-- Соціальні мережі -->
          <div class="info-block" style="animation-delay: 0.35s">
            <div class="info-icon">🌐</div>
            <h2>Ми в соцмережах</h2>
            <div class="social-links">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link youtube"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link tiktok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.76-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.3-.69.3-1.06.02-4.22.01-8.44.02-12.66z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>

        <!-- Права колонка: карта -->
        <div class="contacts-map-wrapper" style="animation-delay: 0.2s">
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d755.6465963109188!2d30.493294166351724!3d50.428395160498305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cee7ed8a343b%3A0x9ea925d576fd1556!2sSecondary%20school%20%E2%84%9660!5e0!3m2!1sru!2sua!4v1782109502004!5m2!1sru!2sua"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Карта школи"
            ></iframe>
          </div>
          <div class="map-label">
            <span class="map-pin">📍</span>
            <span>Знайдіть нас на карті</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactsPage',
};
</script>

<style scoped>
/* ============================================
   ДОДАТКОВІ ЗМІННІ
   ============================================ */
:root {
  --contacts-bg-start: #f6faf9;
  --contacts-bg-end: #eaf2ee;
  --card-shadow: 0 8px 24px rgba(47, 95, 72, 0.06);
  --card-shadow-hover: 0 12px 40px rgba(47, 95, 72, 0.12);
  --card-radius: 20px;
  --transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ============================================
   ОСНОВНІ СТИЛІ
   ============================================ */
.contacts-page {
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
  max-width: 1200px;
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
   СІТКА КОНТАКТІВ
   ============================================ */
.contacts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

/* ============================================
   ІНФОРМАЦІЙНІ БЛОКИ
   ============================================ */
.contacts-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-block {
  background: var(--surface-elevated, #ffffff);
  border-radius: var(--card-radius, 20px);
  padding: 24px 28px 28px;
  box-shadow: var(--card-shadow, 0 8px 24px rgba(47, 95, 72, 0.06));
  border: 1px solid var(--border, rgba(47, 95, 72, 0.04));
  transition: transform var(--transition, 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)),
              box-shadow 0.4s ease,
              border-color 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.6s ease forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--primary, #2F5F48), var(--secondary, #C7613C));
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: var(--card-radius) 0 0 var(--card-radius);
}

.info-block:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover, 0 12px 40px rgba(47, 95, 72, 0.12));
  border-color: var(--border-strong, rgba(47, 95, 72, 0.08));
}

.info-block:hover::before {
  opacity: 1;
}

.info-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
  display: inline-block;
}

.info-block h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary, #2F5F48);
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.info-block p {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary, #4a5568);
  margin: 4px 0;
}

.info-block p strong {
  color: var(--text-primary, #0f172a);
}

.info-block a {
  color: var(--secondary, #C7613C);
  text-decoration: none;
  transition: color 0.3s ease, border-bottom 0.3s ease;
  border-bottom: 1px solid transparent;
}

.info-block a:hover {
  color: var(--primary-dark, #1e4032);
  border-bottom-color: var(--secondary, #C7613C);
}

/* ============================================
   СОЦІАЛЬНІ МЕРЕЖІ
   ============================================ */
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-muted, #f8fafc);
  padding: 8px 16px 8px 14px;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary, #1e293b);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid transparent;
}

.social-link svg {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-card, 0 8px 24px rgba(0, 0, 0, 0.08));
}

.social-link:hover svg {
  transform: scale(1.1);
}

/* Кольори для різних соцмереж */
.social-link.facebook:hover {
  background: #1877f2;
  color: #fff;
  border-color: #1877f2;
}
.social-link.instagram:hover {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #fff;
  border-color: #dc2743;
}
.social-link.youtube:hover {
  background: #ff0000;
  color: #fff;
  border-color: #ff0000;
}
.social-link.tiktok:hover {
  background: #000000;
  color: #fff;
  border-color: #000000;
}

.social-link.facebook:hover svg,
.social-link.instagram:hover svg,
.social-link.youtube:hover svg,
.social-link.tiktok:hover svg {
  color: #fff;
}

/* ============================================
   КАРТА
   ============================================ */
.contacts-map-wrapper {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.6s ease forwards;
}

.map-container {
  background: var(--surface-elevated, #ffffff);
  border-radius: var(--card-radius, 20px);
  overflow: hidden;
  box-shadow: var(--card-shadow, 0 8px 24px rgba(47, 95, 72, 0.06));
  border: 1px solid var(--border, rgba(47, 95, 72, 0.04));
  height: 480px;
  transition: transform var(--transition, 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)),
              box-shadow 0.4s ease,
              border-color 0.3s ease;
  position: relative;
}

.map-container:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover, 0 12px 40px rgba(47, 95, 72, 0.12));
  border-color: var(--border-strong, rgba(47, 95, 72, 0.08));
}

.map-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.map-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
  font-size: 0.95rem;
  color: var(--text-secondary, #4a5568);
  font-weight: 500;
}

.map-pin {
  font-size: 1.2rem;
  animation: pinPulse 2s infinite;
}

@keyframes pinPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* ============================================
   АДАПТИВНІСТЬ
   ============================================ */
@media (max-width: 1024px) {
  .page-title {
    font-size: 2.5rem;
  }
  .contacts-grid {
    gap: 32px;
  }
  .map-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .contacts-page {
    padding: 60px 0 80px;
  }
  .page-title {
    font-size: 2.2rem;
  }
  .page-subtitle {
    font-size: 1rem;
  }
  .contacts-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .info-block {
    padding: 20px 24px 24px;
  }
  .map-container {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .contacts-page {
    padding: 40px 0 60px;
  }
  .page-title {
    font-size: 1.8rem;
  }
  .page-badge {
    font-size: 0.7rem;
    padding: 4px 14px;
  }
  .info-block {
    padding: 16px 18px 20px;
  }
  .info-block h2 {
    font-size: 1.1rem;
  }
  .info-block p {
    font-size: 0.95rem;
  }
  .social-link {
    padding: 6px 12px 6px 10px;
    font-size: 0.8rem;
  }
  .social-link svg {
    width: 16px;
    height: 16px;
  }
  .map-container {
    height: 250px;
  }
  .map-label {
    font-size: 0.85rem;
  }
}
</style>
