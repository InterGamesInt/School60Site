<template>
  <section class="hero">
    <div class="container hero-container">
      <div class="hero-text">
        <h2>Середня загальноосвітня школа № 60 КРД "Росток" в Києві ім. Олександра Загребельного</h2>
        <p>— це не просто навчальний заклад, а справжнє місце, де ваші мрії можуть стати реальністю! Ми створюємо надихаюче та підтримуюче середовище для навчання, яке дозволяє кожному учневі розкривати свої таланти і досягати нових вершин. Наша школа пропонує широкий спектр навчальних програм, а також різноманітні позашкільні активності, які допоможуть Вам не тільки отримати знання а й стати більш впевненими в собі. Разом з нашим професійним і дружнім колективом Ви зможете впевнено крокувати до успіху, відкриваючи для себе нові можливості на кожному етапі навчання!</p>
      </div>

      <!-- Карусель -->
      <div class="hero-carousel">
        <div class="carousel-container">
          <div class="carousel-slide" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="(image, idx) in images" :key="idx" class="carousel-image">
              <img :src="image.url" :alt="image.alt">
            </div>
          </div>
        </div>

        <!-- Кнопки навігації -->
        <button class="carousel-btn prev" @click="prevSlide" aria-label="Попереднє фото">❮</button>
        <button class="carousel-btn next" @click="nextSlide" aria-label="Наступне фото">❯</button>

        <!-- Індикатори (точки) -->
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
export default {
  name: 'HeroSection',
  data() {
    return {
      currentIndex: 0,
      intervalId: null,
      images: [
        {
          url: 'https://static.wixstatic.com/media/62bea5_0a2bfa4c8a1845c9af2fec21e9e86fdf~mv2.jpg/v1/fill/w_1421,h_1152,al_c,q_85,enc_auto/62bea5_0a2bfa4c8a1845c9af2fec21e9e86fdf~mv2.jpg',
          alt: 'Школа фото 1'
        },
        {
          url: 'https://znayshov.com/File/Schools/?sfld=Photos&f=5053f868daa74bfaa6f539c7497ac047.image!jpeg.135790.jpg.Shkola_60.jpg',
          alt: 'Школа фото 2'
        },
        {
          url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsUqSGYemAuK4-pXCHJMYM2SNxAiUe4wp09A&s',
          alt: 'Школа фото 3'
        }
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
      }, 5000); // змінює слайд кожні 5 секунд
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
.hero {
  padding: 60px 0;
  background: #f9f9f9;
}
.hero-container {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}
.hero-text {
  flex: 1;
}
.hero-text h2 {
  font-size: 28px;
  color: #2F5F48;
  margin-bottom: 20px;
}
.hero-text p {
  font-size: 18px;
  line-height: 1.6;
  color: #333;
}

/* Карусель */
.hero-carousel {
  flex: 1;
  position: relative;
  max-width: 100%;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
.carousel-container {
  overflow: hidden;
  width: 100%;
}
.carousel-slide {
  display: flex;
  transition: transform 0.5s ease-in-out;
}
.carousel-image {
  flex: 0 0 100%;
  width: 100%;
}
.carousel-image img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  aspect-ratio: 16 / 9;
}

/* Кнопки */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  font-size: 24px;
  padding: 10px 16px;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  transition: background 0.3s;
}
.carousel-btn:hover {
  background: rgba(0,0,0,0.8);
}
.prev {
  left: 10px;
}
.next {
  right: 10px;
}

/* Точки (індикатори) */
.carousel-dots {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 10;
}
.dot {
  width: 12px;
  height: 12px;
  background-color: rgba(255,255,255,0.5);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s;
}
.dot.active {
  background-color: white;
  transform: scale(1.2);
}

/* Адаптивність */
@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
  }
  .hero-text h2 {
    font-size: 24px;
  }
  .hero-text p {
    font-size: 16px;
  }
  .carousel-btn {
    font-size: 18px;
    padding: 6px 12px;
  }
  .dot {
    width: 8px;
    height: 8px;
  }
}
</style>