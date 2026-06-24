<template>
  <section class="hero">
    <!-- Декоративні елементи фону -->
    <div class="hero-bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="container hero-container">
      <div class="hero-text">
        <h2>
          <span class="highlight">Середня загальноосвітня школа № 60</span>
          <span class="sub">КРД "Росток" в Києві</span>
          <span class="name">ім. Олександра Загребельного</span>
        </h2>
        <p>
          — це не просто навчальний заклад, а справжнє місце, де ваші мрії можуть стати реальністю! Ми створюємо надихаюче та підтримуюче середовище для навчання, яке дозволяє кожному учневі розкривати свої таланти і досягати нових вершин. Наша школа пропонує широкий спектр навчальних програм, а також різноманітні позашкільні активності, які допоможуть Вам не тільки отримати знання а й стати більш впевненими в собі. Разом з нашим професійним і дружнім колективом Ви зможете впевнено крокувати до успіху, відкриваючи для себе нові можливості на кожному етапі навчання!
        </p>
        <div class="hero-cta">
          <router-link to="/about" class="btn-primary">Дізнатися більше</router-link>
        </div>
      </div>

      <!-- Карусель -->
      <div class="hero-carousel">
        <div class="carousel-container">
          <div
            class="carousel-slide"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div v-for="(image, idx) in images" :key="idx" class="carousel-image">
              <img :src="image.url" :alt="image.alt" />
            </div>
          </div>
        </div>

        <!-- Кнопки навігації -->
        <button class="carousel-btn prev" @click="prevSlide" aria-label="Попереднє фото">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button class="carousel-btn next" @click="nextSlide" aria-label="Наступне фото">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <!-- Індикатори (смужка прогресу) -->
        <div class="carousel-progress">
          <div
            class="progress-bar"
            :style="{ width: `${((currentIndex + 1) / images.length) * 100}%` }"
          ></div>
        </div>

        <!-- Точки (додатково) -->
        <div class="carousel-dots">
          <button
            v-for="(_, idx) in images"
            :key="idx"
            class="dot"
            :class="{ active: currentIndex === idx }"
            @click="goToSlide(idx)"
            :aria-label="`Перейти до фото ${idx + 1}`"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import hero1 from '../assets/hero_carusel1.png'
import hero2 from '../assets/hero_carusel2.png'
import hero3 from '../assets/hero_carusel3.png'
import hero4 from '../assets/hero_carusel4.png'
import hero5 from '../assets/hero_carusel5.png'

export default {
  name: 'HeroSection',
  data() {
    return {
      currentIndex: 0,
      intervalId: null,
      images: [
        { url: hero1, alt: 'Школа фото 1' },
        { url: hero2, alt: 'Школа фото 2' },
        { url: hero3, alt: 'Школа фото 3' },
        { url: hero4, alt: 'Школа фото 4' },
        { url: hero5, alt: 'Школа фото 5' }
      ]
    }
  },
  mounted() {
    this.startAutoPlay();
  },
  beforeUnmount() {
    this.stopAutoPlay();
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
    goToSlide(index) {
      this.currentIndex = index;
      this.resetAutoPlay();
    },
    startAutoPlay() {
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, 5000);
    },
    stopAutoPlay() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    resetAutoPlay() {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }
}
</script>

<style scoped>
/* ============================================
   ДОДАТКОВІ ЗМІННІ
   ============================================ */
:root {
  --gradient-start: #f0f7f4;
  --gradient-end: #e2eee8;
  --hero-shadow: 0 12px 40px rgba(47, 95, 72, 0.12);
  --carousel-shadow: 0 20px 60px rgba(47, 95, 72, 0.20);
}

/* ============================================
   ОСНОВНІ СТИЛІ
   ============================================ */
.hero {
  position: relative;
  padding: 80px 0 100px;
  background: linear-gradient(145deg, var(--hero-bg-start, #f0f7f4), var(--hero-bg-end, #e2eee8));
  overflow: hidden;
}

/* Декоративні кола на фоні */
.hero-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.circle {
  position: absolute;
  border-radius: 50%;
  background: var(--decor-primary, rgba(47, 95, 72, 0.04));
}
.circle-1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -100px;
}
.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -80px;
  left: -60px;
  background: var(--decor-secondary, rgba(199, 97, 60, 0.05));
}
.circle-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: 50%;
  background: var(--decor-soft, rgba(47, 95, 72, 0.03));
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-container {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 60px;
  flex-wrap: wrap;
}

/* ============================================
   ТЕКСТОВА ЧАСТИНА
   ============================================ */
.hero-text {
  flex: 1 1 45%;
  min-width: 300px;
}

.hero-text h2 {
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 20px 0;
  color: var(--primary, #2F5F48);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-text h2 .highlight {
  font-size: 2.6rem;
  background: linear-gradient(135deg, var(--primary, #2F5F48) 0%, var(--primary-dark, #1a4032) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-text h2 .sub {
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--secondary, #C7613C);
  -webkit-text-fill-color: var(--secondary, #C7613C);
}
.hero-text h2 .name {
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--text-secondary, #4a5568);
  -webkit-text-fill-color: var(--text-secondary, #4a5568);
}

.hero-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary, #4a5568);
  margin: 0 0 30px 0;
}

.hero-cta .btn-primary {
  display: inline-block;
  background: var(--primary, #2F5F48);
  color: var(--on-primary, #fff);
  padding: 14px 36px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--shadow-strong, rgba(47, 95, 72, 0.25));
}
.hero-cta .btn-primary:hover {
  background: var(--primary-dark, #1e4032);
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover, 0 8px 24px rgba(47, 95, 72, 0.35));
}

/* ============================================
   КАРУСЕЛЬ
   ============================================ */
.hero-carousel {
  flex: 1 1 45%;
  min-width: 300px;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-hover, 0 20px 60px rgba(47, 95, 72, 0.20));
  background: var(--surface, #ffffff);
  transition: transform 0.3s ease;
}
.hero-carousel:hover {
  transform: scale(1.01);
}

.carousel-container {
  overflow: hidden;
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
}

.carousel-slide {
  display: flex;
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-image {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}
.carousel-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: none;
  image-rendering: auto;
}
.hero-carousel:hover .carousel-image img {
  transform: scale(1.02);
}

/* Кнопки навігації */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-50%) scale(1.1);
}
.carousel-btn:active {
  transform: translateY(-50%) scale(0.95);
}
.carousel-btn svg {
  stroke: #fff;
  stroke-width: 2.5;
  width: 24px;
  height: 24px;
}
.prev {
  left: 16px;
}
.next {
  right: 16px;
}

/* Індикатор прогресу (смужка) */
.carousel-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 10;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: var(--secondary, #C7613C);
  transition: width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 0%;
}

/* Точки (індикатори) */
.carousel-dots {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dot.active {
  background: var(--secondary, #C7613C);
  transform: scale(1.3);
  box-shadow: 0 0 12px rgba(199, 97, 60, 0.5);
}
.dot:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* ============================================
   АДАПТИВНІСТЬ
   ============================================ */
@media (max-width: 1024px) {
  .hero-text h2 {
    font-size: 2rem;
  }
  .hero-text h2 .highlight {
    font-size: 2.2rem;
  }
  .hero-text h2 .sub {
    font-size: 1.5rem;
  }
  .hero-text h2 .name {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 0 80px;
  }
  .hero-container {
    flex-direction: column;
    gap: 40px;
  }
  .hero-text {
    text-align: center;
  }
  .hero-text h2 {
    font-size: 1.8rem;
  }
  .hero-text h2 .highlight {
    font-size: 2rem;
  }
  .hero-text h2 .sub {
    font-size: 1.3rem;
  }
  .hero-text h2 .name {
    font-size: 1.1rem;
  }
  .hero-text p {
    font-size: 1rem;
    text-align: justify;
  }
  .hero-cta {
    text-align: center;
  }
  .carousel-btn {
    width: 40px;
    height: 40px;
  }
  .carousel-btn svg {
    width: 20px;
    height: 20px;
  }
  .prev {
    left: 8px;
  }
  .next {
    right: 8px;
  }
  .dot {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 40px 0 60px;
  }
  .hero-text h2 {
    font-size: 1.5rem;
  }
  .hero-text h2 .highlight {
    font-size: 1.7rem;
  }
  .hero-text h2 .sub {
    font-size: 1.1rem;
  }
  .hero-text h2 .name {
    font-size: 1rem;
  }
  .hero-text p {
    font-size: 0.95rem;
  }
  .carousel-btn {
    width: 32px;
    height: 32px;
  }
  .carousel-btn svg {
    width: 16px;
    height: 16px;
  }
}
</style>
