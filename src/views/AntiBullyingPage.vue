<template>
  <div class="anti-bullying-page">
    <section class="page-intro">
      <div class="container">
        <span class="page-badge">Безпечне освітнє середовище</span>
        <h1>Школа без булінгу</h1>
        <p>Інформація для учнів, батьків та працівників школи.</p>
      </div>
    </section>

    <section class="content-section resources-section">
      <div class="container resources-container">
        <div class="section-heading centered">
          <span>Корисна інформація</span>
          <h2>Документи, матеріали школи та телефони підтримки</h2>
          <p>Усі основні матеріали зібрані на початку сторінки, щоб їх було легко знайти.</p>
        </div>

        <div class="resources-grid">
          <div class="resource-center">
            <article class="resource-card pdf-card">
              <div class="resource-card-header">
                <span>Шкільні документи</span>
                <h3>PDF-документи школи</h3>
                <p>Натисніть на назву документа, щоб відкрити PDF-переглядач прямо на сторінці.</p>
              </div>

              <div class="pdf-accordion">
                <details v-for="document in pdfDocuments" :key="document.id" class="pdf-details">
                  <summary>{{ document.title }}</summary>
                  <PdfReader
                    :src="document.src"
                    :title="document.title"
                    :loading="document.isLoading"
                    loading-text="PDF завантажується з бази даних..."
                    height="clamp(640px, 82vh, 980px)"
                  />
                </details>
              </div>
            </article>

            <figure v-if="featuredGalleryImage" class="gallery-card gallery-card-large featured-gallery-card">
              <a :href="featuredGalleryImage.src" target="_blank" rel="noopener noreferrer">
                <img :src="featuredGalleryImage.src" :alt="featuredGalleryImage.title" loading="lazy" />
              </a>
              <figcaption>{{ featuredGalleryImage.title }}</figcaption>
            </figure>
          </div>

          <article class="resource-card documents-card">
            <div class="resource-card-header">
              <span>Нормативна база</span>
              <h3>Посилання на документи</h3>
              <p>Нормативні акти та методичні матеріали відкриваються в окремій вкладці.</p>
            </div>

            <div class="document-links">
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
          </article>

          <article class="resource-card support-card">
            <div class="resource-card-header">
              <span>Допомога</span>
              <h3>Телефони підтримки</h3>
              <p>Номери служб, до яких можна звернутися по допомогу.</p>
            </div>

            <div class="phones-list">
              <component
                v-for="phone in trustPhones"
                :key="phone.title"
                :is="phone.href ? 'a' : 'div'"
                class="phone-row"
                :href="phone.href || null"
              >
                <strong>{{ phone.title }}</strong>
                <span>{{ phone.value }}</span>
              </component>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="content-section images-section">
      <div class="container wide-container">
        <div class="section-heading centered">
          <span>Пам'ятки</span>
          <h2>Інформаційні матеріали</h2>
          <p>Зображення розміщені великими блоками. Натисніть на будь-яке фото, щоб відкрити його окремо та роздивитися детальніше.</p>
        </div>

        <div class="image-gallery">
          <figure
            v-for="(image, index) in galleryImages"
            :key="image.title"
            :class="['gallery-card', { 'gallery-card-large': index === 0 }]"
          >
            <a :href="image.src" target="_blank" rel="noopener noreferrer">
              <img :src="image.src" :alt="image.title" loading="lazy" />
            </a>
            <figcaption>{{ image.title }}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { doc, onSnapshot } from 'firebase/firestore';
import PdfReader from '../components/PdfReader.vue';
import { db } from '../firebase';
import bullying2 from '../assets/bullying2.png';
import bullying3 from '../assets/bullying3.png';
import { loadPdfObjectUrlFromFirestoreChunks, mergeSchoolDocuments } from '../data/schoolDocuments';
import {
  getSiteLinksForSection,
  mergeSiteLinkSections
} from '../data/siteLinks';

export default {
  name: 'AntiBullyingPage',
  components: { PdfReader },
  data() {
    return {
      trustPhones: [
        {
          title: 'Гаряча лінія Національної поліції України',
          value: '0 800 500 202',
          href: 'tel:0800500202'
        },
        {
          title: 'Національна дитяча гаряча лінія "Ла Страда-Україна"',
          value: '0 800 500 225 або 116 111',
          href: 'tel:116111'
        },
        {
          title: 'Гаряча телефонна лінія щодо булінгу',
          value: '116 000',
          href: 'tel:116000'
        },
        {
          title: 'Гаряча лінія з питань запобігання насильству',
          value: '116 123 або 0 800 500 335',
          href: 'tel:116123'
        },
        {
          title: 'Уповноважений Верховної Ради України з прав людини',
          value: '0 800 50 17 20',
          href: 'tel:0800501720'
        },
        {
          title: 'Уповноважений Президента України з прав дитини',
          value: '044 255 76 75',
          href: 'tel:0442557675'
        },
        {
          title: 'Центр надання безоплатної правової допомоги',
          value: '0 800 213 103',
          href: 'tel:0800213103'
        },
        {
          title: 'Центр соціальних служб для сім\'ї, дітей та молоді Солом\'янського району',
          value: 'м. Київ, вул. М. Кривоноса, 21; 243-75-27'
        },
        {
          title: 'Відділ у справах сім\'ї, молоді та спорту Солом\'янської РДА',
          value: 'м. Київ, просп. Повітрофлотський, 41, каб. 268; 207-09-10'
        }
      ],
      documents: getSiteLinksForSection(mergeSiteLinkSections(), 'antiBullying'),
      pdfDocuments: mergeSchoolDocuments(),
      galleryImages: [
        {
          title: 'Види булінгу',
          src: 'https://static.wixstatic.com/media/62bea5_ffc3f4150e6b4fd5b7d4d718c95ec523~mv2.jpg'
        },
        {
          title: 'Як реагувати на цькування',
          src: bullying2
        },
        {
          title: 'Наслідки булінгу',
          src: bullying3
        }
      ],
      unsubscribeSchoolDocuments: null,
      unsubscribeSiteLinks: null,
      documentsLoadRequestId: 0,
      pdfObjectUrls: []
    };
  },
  computed: {
    featuredGalleryImage() {
      return this.galleryImages[0] || null;
    }
  },
  mounted() {
    this.unsubscribeSchoolDocuments = onSnapshot(
      doc(db, 'siteSettings', 'schoolDocuments'),
      (snapshot) => {
        const savedDocuments = snapshot.exists() ? snapshot.data().documents || {} : {};
        this.applySchoolDocuments(savedDocuments);
      },
      (error) => {
        console.error('School documents loading error:', error);
        this.revokePdfObjectUrls();
        this.pdfDocuments = mergeSchoolDocuments();
      }
    );

    this.unsubscribeSiteLinks = onSnapshot(
      doc(db, 'siteSettings', 'siteLinks'),
      (snapshot) => {
        const savedSections = snapshot.exists() ? snapshot.data().sections || {} : {};
        this.documents = getSiteLinksForSection(
          mergeSiteLinkSections(savedSections),
          'antiBullying'
        );
      },
      (error) => {
        console.error('Site links loading error:', error);
        this.documents = getSiteLinksForSection(mergeSiteLinkSections(), 'antiBullying');
      }
    );
  },
  beforeUnmount() {
    if (this.unsubscribeSchoolDocuments) {
      this.unsubscribeSchoolDocuments();
    }
    if (this.unsubscribeSiteLinks) {
      this.unsubscribeSiteLinks();
    }
    this.revokePdfObjectUrls();
  },
  methods: {
    revokePdfObjectUrls() {
      this.pdfObjectUrls.forEach(url => URL.revokeObjectURL(url));
      this.pdfObjectUrls = [];
    },
    async applySchoolDocuments(savedDocuments) {
      const requestId = this.documentsLoadRequestId + 1;
      this.documentsLoadRequestId = requestId;

      this.revokePdfObjectUrls();

      const documents = mergeSchoolDocuments(savedDocuments).map(documentItem => ({
        ...documentItem,
        isLoading: !documentItem.src && documentItem.sourceType === 'firestore-chunks' && Boolean(documentItem.chunkCount)
      }));
      this.pdfDocuments = documents;
      const createdObjectUrls = [];

      const hydratedDocuments = await Promise.all(
        documents.map(async documentItem => {
          if (documentItem.src || documentItem.sourceType !== 'firestore-chunks' || !documentItem.chunkCount) {
            return documentItem;
          }

          try {
            const src = await loadPdfObjectUrlFromFirestoreChunks(db, documentItem.id);

            if (src) {
              createdObjectUrls.push(src);
            }

            return {
              ...documentItem,
              src,
              isLoading: false
            };
          } catch (error) {
            console.error('PDF chunks loading error:', error);
            return {
              ...documentItem,
              isLoading: false
            };
          }
        })
      );

      if (this.documentsLoadRequestId === requestId) {
        this.pdfObjectUrls = createdObjectUrls;
        this.pdfDocuments = hydratedDocuments;
      } else {
        createdObjectUrls.forEach(url => URL.revokeObjectURL(url));
      }
    }
  }
};
</script>

<style scoped>
.anti-bullying-page {
  background: var(--page-bg, #F7F8F3);
  color: var(--text, #1E293B);
}

.container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}

.wide-container {
  max-width: 1280px;
}

.resources-container {
  max-width: 1320px;
}

.page-intro {
  padding: 72px 0 60px;
  background: linear-gradient(135deg, var(--page-gradient-start, #F4F9F6), var(--section-bg-alt, #FBFAF6));
  border-bottom: 1px solid var(--border, #D9E4DD);
}

.page-badge,
.section-heading span,
.resource-card-header span {
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
  max-width: 560px;
  margin: 0;
  color: var(--text-secondary, #485D54);
  font-size: 1.1rem;
  line-height: 1.7;
}

.content-section {
  padding: 64px 0;
}

.resources-section {
  background: var(--page-bg, #F7F8F3);
}

.images-section {
  background: var(--section-bg, #EAF3ED);
  border-top: 1px solid var(--border, #D9E4DD);
  border-bottom: 1px solid var(--border, #D9E4DD);
}

.section-heading h2 {
  margin: 0;
  color: var(--heading, #1F352B);
  font-size: 2.1rem;
  line-height: 1.16;
}

.section-heading p {
  margin: 14px 0 0;
  color: var(--text-secondary, #485D54);
  line-height: 1.65;
}

.section-heading.centered {
  max-width: 820px;
  margin: 0 auto 32px;
  text-align: center;
}

.resources-grid {
  display: grid;
  grid-template-columns: minmax(170px, 15fr) minmax(0, 70fr) minmax(170px, 15fr);
  grid-template-areas: 'documents center support';
  gap: 18px;
  align-items: start;
}

.resource-center {
  display: grid;
  grid-area: center;
  gap: 28px;
  min-width: 0;
}

.pdf-card {
  padding: 28px;
  border-color: color-mix(in srgb, var(--primary, #2F5F48) 20%, var(--border, #D9E4DD));
}

.pdf-card .resource-card-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.42fr);
  gap: 20px;
  align-items: end;
}

.pdf-card .resource-card-header span {
  grid-column: 1 / -1;
}

.pdf-card .resource-card-header p {
  margin: 0;
}

.resource-card {
  min-width: 0;
  padding: 22px;
  background: var(--surface-elevated, #FFFDFC);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(31, 53, 43, 0.08);
}

.documents-card {
  grid-area: documents;
}

.support-card {
  grid-area: support;
}

.documents-card,
.support-card {
  padding: 16px;
}

.documents-card .resource-card-header,
.support-card .resource-card-header {
  margin-bottom: 12px;
}

.documents-card .resource-card-header span,
.support-card .resource-card-header span {
  margin-bottom: 8px;
  font-size: 0.68rem;
  letter-spacing: 1px;
}

.documents-card .resource-card-header h3,
.support-card .resource-card-header h3 {
  font-size: 1.08rem;
  line-height: 1.18;
}

.documents-card .resource-card-header p,
.support-card .resource-card-header p {
  display: none;
}

.resource-card-header {
  margin-bottom: 18px;
}

.resource-card-header h3 {
  margin: 0;
  color: var(--heading, #1F352B);
  font-size: 1.35rem;
  line-height: 1.2;
}

.resource-card-header p {
  margin: 10px 0 0;
  color: var(--text-secondary, #485D54);
  line-height: 1.55;
}

.phones-list,
.document-links,
.pdf-accordion {
  display: grid;
  gap: 12px;
}

.documents-card .document-links,
.support-card .phones-list {
  gap: 10px;
}

.pdf-accordion {
  gap: 16px;
}

.phone-row,
.document-link {
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  color: var(--text-primary, #1F352B);
  background: var(--page-bg, #F7F8F3);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 10px;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.documents-card .document-link,
.support-card .phone-row {
  padding: 11px 10px;
  border-radius: 8px;
}

.support-card .phone-row {
  color: var(--on-support-accent, #ffffff);
  background: var(--support-accent, #B2324F);
  border-color: color-mix(in srgb, var(--support-accent, #B2324F) 76%, var(--heading, #1F352B));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--support-accent, #B2324F) 30%, transparent);
}

.support-card .phone-row:hover {
  border-color: color-mix(in srgb, var(--support-accent, #B2324F) 68%, var(--heading, #1F352B));
  box-shadow:
    0 12px 26px color-mix(in srgb, var(--support-accent, #B2324F) 45%, transparent);
}

.phone-row:hover,
.document-link:hover {
  border-color: var(--secondary, #B95636);
  box-shadow: 0 10px 22px rgba(185, 86, 54, 0.12);
  transform: translateY(-2px);
}

.phone-row strong,
.document-link strong {
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.phone-row span,
.document-link span {
  color: var(--text-secondary, #485D54);
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.documents-card .document-link strong,
.support-card .phone-row strong {
  font-size: 0.88rem;
}

.documents-card .document-link span,
.support-card .phone-row span {
  font-size: 0.78rem;
  line-height: 1.38;
}

.support-card .phone-row span {
  width: fit-content;
  padding: 4px 7px;
  color: var(--on-support-accent, #ffffff);
  background: color-mix(in srgb, var(--on-support-accent, #ffffff) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--on-support-accent, #ffffff) 36%, transparent);
  border-radius: 5px;
  font-weight: 800;
}

.support-card .phone-row strong {
  color: var(--on-support-accent, #ffffff);
}

.pdf-details {
  overflow: hidden;
  background: var(--page-bg, #F7F8F3);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.pdf-details[open] {
  border-color: color-mix(in srgb, var(--primary, #2F5F48) 32%, var(--border, #D9E4DD));
  box-shadow: 0 12px 28px rgba(31, 53, 43, 0.08);
}

.pdf-details summary {
  cursor: pointer;
  padding: 20px 22px;
  color: var(--text-primary, #1F352B);
  font-weight: 700;
  font-size: 1.04rem;
  list-style: none;
}

.pdf-details summary::-webkit-details-marker {
  display: none;
}

.pdf-details summary::after {
  content: '+';
  float: right;
  color: var(--secondary, #B95636);
  font-size: 1.2rem;
  line-height: 1;
}

.pdf-details[open] summary {
  border-bottom: 1px solid var(--border, #D9E4DD);
}

.pdf-details[open] summary::after {
  content: '-';
}

.pdf-details :deep(.pdf-reader) {
  border-width: 0;
  border-radius: 0;
}

.pdf-details :deep(.pdf-toolbar) {
  padding: 14px 18px;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  align-items: start;
}

.image-gallery .gallery-card:first-child {
  display: none;
}

.gallery-card {
  margin: 0;
  overflow: hidden;
  background: var(--surface-elevated, #FFFDFC);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(31, 53, 43, 0.08);
}

.gallery-card-large {
  grid-column: 1 / -1;
}

.gallery-card a {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
  padding: 20px;
  background: #ffffff;
}

.gallery-card-large a {
  min-height: 460px;
}

.featured-gallery-card a {
  min-height: 500px;
}

.gallery-card:not(.gallery-card-large) a {
  min-height: 380px;
  padding: 8px;
}

.gallery-card img {
  display: block;
  width: 100%;
  max-height: 780px;
  object-fit: contain;
  image-rendering: auto;
}

.gallery-card:not(.gallery-card-large) img {
  width: 108%;
  max-width: none;
  max-height: 700px;
}

.gallery-card figcaption {
  padding: 14px 18px;
  color: var(--text-primary, #1F352B);
  font-weight: 700;
  line-height: 1.35;
}

@media (max-width: 1100px) {
  .resources-grid {
    grid-template-columns: minmax(150px, 15fr) minmax(0, 70fr) minmax(150px, 15fr);
    gap: 14px;
  }

  .documents-card,
  .support-card {
    padding: 14px;
  }
}

@media (max-width: 900px) {
  .page-intro h1 {
    font-size: 2.4rem;
  }

  .pdf-card .resource-card-header {
    grid-template-columns: 1fr;
  }

  .resources-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'center'
      'documents'
      'support';
    gap: 18px;
  }

  .resource-center {
    gap: 18px;
  }

  .featured-gallery-card {
    display: none;
  }

  .image-gallery .gallery-card:first-child {
    display: block;
  }

  .documents-card,
  .support-card {
    padding: 22px;
  }

  .documents-card .resource-card-header p,
  .support-card .resource-card-header p {
    display: block;
  }

  .documents-card .resource-card-header h3,
  .support-card .resource-card-header h3 {
    font-size: 1.35rem;
  }

  .documents-card .document-link,
  .support-card .phone-row {
    padding: 16px 18px;
  }

  .documents-card .document-link strong,
  .support-card .phone-row strong {
    font-size: 1rem;
  }

  .documents-card .document-link span,
  .support-card .phone-row span {
    font-size: 1rem;
    line-height: 1.55;
  }

  .image-gallery {
    grid-template-columns: 1fr;
  }

  .gallery-card-large {
    grid-column: auto;
  }

  .gallery-card a,
  .gallery-card-large a {
    min-height: 260px;
  }

  .gallery-card:not(.gallery-card-large) a {
    min-height: 320px;
  }

  .gallery-card:not(.gallery-card-large) img {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 560px) {
  .page-intro,
  .content-section {
    padding: 48px 0;
  }

  .container {
    padding: 0 18px;
  }

  .page-intro h1 {
    font-size: 2rem;
  }

  .section-heading h2 {
    font-size: 1.7rem;
  }

  .resource-card {
    padding: 18px;
  }

  .pdf-details summary {
    padding: 16px;
  }

  .pdf-details :deep(.pdf-frame) {
    min-height: 480px;
  }

  .gallery-card a,
  .gallery-card-large a {
    min-height: 220px;
    padding: 12px;
  }
}
</style>
