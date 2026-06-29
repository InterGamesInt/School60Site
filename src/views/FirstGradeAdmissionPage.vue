<template>
  <div class="info-page first-grade-page">
    <section class="page-intro">
      <div class="container">
        <span class="page-badge">Майбутнім першокласникам</span>
        <h1>Правила прийому у 1-й клас</h1>
        <p>До уваги батьків майбутніх першокласників {{ academicYear }} н.р.</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="section-heading">
          <span>Документація</span>
          <h2>Матеріали для ознайомлення</h2>
        </div>

        <div class="document-list">
          <a
            v-for="document in documents"
            :key="document.url"
            class="document-link"
            :href="document.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{{ document.title }}</strong>
            <span>{{ document.description }}</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import {
  getSiteLinksForSection,
  mergeSiteLinkSections
} from '../data/siteLinks';

export default {
  name: 'FirstGradeAdmissionPage',
  data() {
    return {
      documents: getSiteLinksForSection(mergeSiteLinkSections(), 'firstGradeAdmission'),
      unsubscribeSiteLinks: null
    };
  },
  computed: {
    academicYear() {
      const now = new Date();
      const year = now.getFullYear();
      const startYear = now.getMonth() >= 8 ? year + 1 : year;

      return `${startYear}-${startYear + 1}`;
    }
  },
  mounted() {
    this.unsubscribeSiteLinks = onSnapshot(
      doc(db, 'siteSettings', 'siteLinks'),
      (snapshot) => {
        const savedSections = snapshot.exists() ? snapshot.data().sections || {} : {};
        this.documents = getSiteLinksForSection(
          mergeSiteLinkSections(savedSections),
          'firstGradeAdmission'
        );
      },
      (error) => {
        console.error('Site links loading error:', error);
        this.documents = getSiteLinksForSection(
          mergeSiteLinkSections(),
          'firstGradeAdmission'
        );
      }
    );
  },
  beforeUnmount() {
    if (this.unsubscribeSiteLinks) {
      this.unsubscribeSiteLinks();
    }
  }
};
</script>

<style scoped>
.info-page {
  min-height: 100%;
  background: var(--page-bg, #F7F8F3);
  color: var(--text, #1E293B);
}

.container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-intro {
  padding: 72px 0 56px;
  background: linear-gradient(135deg, var(--page-gradient-start, #F4F9F6), var(--section-bg-alt, #FBFAF6));
  border-bottom: 1px solid var(--border, #D9E4DD);
}

.page-badge,
.section-heading span {
  display: inline-flex;
  margin-bottom: 12px;
  color: var(--secondary, #B95636);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.page-intro h1 {
  margin: 0 0 12px;
  color: var(--heading, #1F352B);
  font-size: 3rem;
  line-height: 1.1;
}

.page-intro p {
  max-width: 720px;
  margin: 0;
  color: var(--text-secondary, #485D54);
  font-size: 1.15rem;
  line-height: 1.7;
}

.content-section {
  padding: 64px 0;
}

.section-heading {
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 0;
  color: var(--heading, #1F352B);
  font-size: 2rem;
  line-height: 1.16;
}

.document-list {
  display: grid;
  gap: 14px;
}

.document-link {
  display: grid;
  gap: 8px;
  padding: 18px 20px;
  color: var(--text-primary, #1F352B);
  background: var(--surface-elevated, #FFFDFC);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 12px 30px rgba(31, 53, 43, 0.08);
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.document-link:hover {
  border-color: var(--secondary, #B95636);
  box-shadow: 0 16px 34px rgba(185, 86, 54, 0.12);
  transform: translateY(-2px);
}

.document-link strong {
  line-height: 1.35;
}

.document-link span {
  color: var(--text-secondary, #485D54);
  line-height: 1.55;
}

@media (max-width: 640px) {
  .page-intro,
  .content-section {
    padding: 48px 0;
  }

  .container {
    padding: 0 18px;
  }

  .page-intro h1 {
    font-size: 2.1rem;
  }

  .section-heading h2 {
    font-size: 1.6rem;
  }
}
</style>
