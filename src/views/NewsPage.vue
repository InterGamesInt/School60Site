<template>
  <div class="news-page">
    <!-- Декоративні елементи фону -->
    <div class="page-bg-decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="container">
      <div class="page-header">
        <span class="page-badge">Актуальне</span>
        <h1 class="page-title">Новини</h1>
        <div class="page-line"></div>
        <p class="page-subtitle">Слідкуйте за останніми подіями та досягненнями нашої школи</p>
      </div>

      <!-- Тепер NewsList без власного заголовка та фону -->
      <NewsList />
    </div>
  </div>
</template>

<script>
import NewsList from '../components/NewsList.vue';

export default {
  name: 'NewsPage',
  components: { NewsList }
}
</script>

<style scoped>
/* ============================================
   ДОДАТКОВІ ЗМІННІ
   ============================================ */
:root {
  --news-bg-start: #f0f7f4;
  --news-bg-end: #e2eee8;
}

/* ============================================
   ОСНОВНІ СТИЛІ
   ============================================ */
.news-page {
  position: relative;
  padding: 80px 0 100px;
  background: linear-gradient(160deg, var(--page-gradient-start, #f0f7f4) 0%, var(--page-gradient-end, #e2eee8) 100%);
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
   ЗАГОЛОВОК СТОРІНКИ
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
   АДАПТИВНІСТЬ
   ============================================ */
@media (max-width: 1024px) {
  .page-title {
    font-size: 2.5rem;
  }
}
@media (max-width: 768px) {
  .news-page {
    padding: 60px 0 80px;
  }
  .page-title {
    font-size: 2.2rem;
  }
  .page-subtitle {
    font-size: 1rem;
  }
}
@media (max-width: 480px) {
  .news-page {
    padding: 40px 0 60px;
  }
  .page-title {
    font-size: 1.8rem;
  }
  .page-badge {
    font-size: 0.7rem;
    padding: 4px 14px;
  }
}
</style>
