<template>
  <div class="content-page">
    <section class="page-intro">
      <div class="container">
        <span class="page-badge">{{ config.badge }}</span>
        <h1>{{ config.title }}</h1>
        <p>{{ page.intro || config.defaultIntro }}</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <article class="profile-card">
          <h2 v-if="page.specialistName">{{ page.specialistName }}</h2>
          <RichTextContent v-if="page.content" :html="page.content" />
          <div v-else-if="loaded" class="empty-state">Інформація незабаром з'явиться на сторінці.</div>
          <div v-else class="empty-state">Завантаження інформації...</div>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import { doc, onSnapshot } from 'firebase/firestore';
import RichTextContent from '../components/RichTextContent.vue';
import { db } from '../firebase';

const configs = {
  'practical-psychologist': {
    title: 'Практичний психолог',
    badge: 'Психологічна служба',
    defaultIntro: 'Психологічна підтримка учнів, батьків і працівників школи.'
  },
  'social-pedagogue': {
    title: 'Соціальний педагог',
    badge: 'Соціально-педагогічна підтримка',
    defaultIntro: 'Допомога у захисті прав, адаптації та добробуті учнів.'
  }
};

export default {
  name: 'StaffInfoPage',
  components: { RichTextContent },
  props: {
    pageId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      page: {
        specialistName: '',
        intro: '',
        content: ''
      },
      loaded: false,
      unsubscribe: null
    };
  },
  computed: {
    config() {
      return configs[this.pageId] || configs['practical-psychologist'];
    }
  },
  watch: {
    pageId: {
      immediate: true,
      handler() {
        this.subscribeToPage();
      }
    }
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    subscribeToPage() {
      if (this.unsubscribe) this.unsubscribe();
      this.loaded = false;
      this.page = { specialistName: '', intro: '', content: '' };
      this.unsubscribe = onSnapshot(
        doc(db, 'sitePages', this.pageId),
        snapshot => {
          const data = snapshot.exists() ? snapshot.data() : {};
          this.page = {
            specialistName: data.specialistName || '',
            intro: data.intro || '',
            content: data.content || ''
          };
          this.loaded = true;
        },
        error => {
          console.error('Staff information loading error:', error);
          this.loaded = true;
        }
      );
    }
  }
};
</script>

<style>
@import '../styles/contentPage.css';

.profile-card {
  min-width: 0;
  max-width: 100%;
  padding: clamp(24px, 5vw, 48px);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
}

.profile-card > h2 {
  margin: 0 0 26px;
  padding-bottom: 18px;
  color: var(--heading);
  border-bottom: 2px solid var(--secondary);
  font-size: clamp(1.45rem, 3vw, 2.1rem);
}
</style>
