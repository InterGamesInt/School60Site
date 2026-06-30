<template>
  <div class="content-page">
    <section class="page-intro">
      <div class="container">
        <span class="page-badge">Робота у нашій школі</span>
        <h1>Вакансії</h1>
        <p>Актуальні пропозиції для фахівців, які хочуть долучитися до нашої команди.</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container vacancies-list">
        <article v-for="vacancy in vacancies" :key="vacancy.id" class="vacancy-card">
          <header>
            <h2>{{ vacancy.title }}</h2>
            <p v-if="vacancy.summary">{{ vacancy.summary }}</p>
          </header>
          <RichTextContent :html="vacancy.content" />
        </article>
        <div v-if="loaded && !vacancies.length" class="empty-state">
          Наразі відкритих вакансій немає.
        </div>
        <div v-else-if="!loaded" class="empty-state">Завантаження вакансій...</div>
      </div>
    </section>
  </div>
</template>

<script>
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import RichTextContent from '../components/RichTextContent.vue';

export default {
  name: 'VacanciesPage',
  components: { RichTextContent },
  data() {
    return {
      vacancies: [],
      loaded: false,
      unsubscribe: null
    };
  },
  mounted() {
    this.unsubscribe = onSnapshot(
      collection(db, 'vacancies'),
      snapshot => {
        this.vacancies = snapshot.docs
          .map(item => ({ id: item.id, ...item.data() }))
          .sort((a, b) => this.getTime(b.updatedAt || b.createdAt) - this.getTime(a.updatedAt || a.createdAt));
        this.loaded = true;
      },
      error => {
        console.error('Vacancies loading error:', error);
        this.loaded = true;
      }
    );
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    getTime(value) {
      if (!value) return 0;
      return value.toMillis ? value.toMillis() : new Date(value).getTime();
    }
  }
};
</script>

<style>
@import '../styles/contentPage.css';

.vacancies-list {
  display: grid;
  gap: 20px;
}

.vacancy-card {
  padding: clamp(22px, 4vw, 36px);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
}

.vacancy-card header {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border);
}

.vacancy-card > header > h2 {
  margin: 0 0 8px;
  color: var(--heading);
  font-size: clamp(1.4rem, 3vw, 2rem);
}

.vacancy-card header p {
  margin: 0;
  color: var(--secondary);
  font-weight: 700;
}
</style>
