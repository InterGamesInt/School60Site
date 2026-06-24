<template>
  <div class="anti-bullying-page">
    <section class="page-intro">
      <div class="container">
        <span class="page-badge">Безпечне освітнє середовище</span>
        <h1>Школа без булінгу</h1>
        <p>Інформація для учнів, батьків та працівників школи.</p>
      </div>
    </section>

    <section class="content-section trust-section">
      <div class="container two-column">
        <div class="section-heading">
          <span>Допомога</span>
          <h2>Телефони довіри</h2>
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
      </div>
    </section>

    <section class="content-section documents-section">
      <div class="container two-column">
        <div class="section-heading">
          <span>Нормативна база</span>
          <h2>Чинні документи</h2>
          <p>Нормативні акти відкриваються у базі Верховної Ради України, методичні матеріали - за посиланнями з попередньої сторінки школи.</p>
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
            <span>{{ document.status }}</span>
          </a>
        </div>
      </div>
    </section>

    <section class="content-section pdf-section">
      <div class="container">
        <div class="section-heading centered">
          <span>Шкільні документи</span>
          <h2>Документи для перегляду</h2>
        </div>

        <div class="pdf-accordion">
          <details v-for="document in pdfDocuments" :key="document.id" class="pdf-details">
            <summary>{{ document.title }}</summary>
            <PdfReader :src="document.src" :title="document.title" />
          </details>
        </div>
      </div>
    </section>

    <section class="content-section images-section">
      <div class="container">
        <div class="section-heading centered">
          <span>Пам'ятки</span>
          <h2>Інформаційні матеріали</h2>
        </div>

        <div class="image-list">
          <figure v-for="image in galleryImages" :key="image.title">
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
import PdfReader from '../components/PdfReader.vue';
import bullying2 from '../assets/bullying2.png';
import bullying3 from '../assets/bullying3.png';

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
      documents: [
        {
          title: 'Закон України № 2657-VIII щодо протидії булінгу (цькуванню)',
          status: 'Чинний. Поточна редакція - прийняття від 18.12.2018.',
          url: 'https://zakon.rada.gov.ua/laws/show/2657-19#Text'
        },
        {
          title: 'Наказ МОН України від 28.12.2019 № 1646: реагування на випадки булінгу та заходи виховного впливу',
          status: 'Чинний. Поточна редакція - прийняття від 28.12.2019.',
          url: 'https://zakon.rada.gov.ua/laws/show/z0111-20#Text'
        },
        {
          title: 'Рекомендації для закладів освіти щодо застосування норм Закону України № 2657-VIII',
          status: 'Методичні рекомендації до Закону України "Про внесення змін до деяких законодавчих актів України щодо протидії булінгу (цькуванню)".',
          url: 'https://drive.google.com/file/d/1hRE8jdvVacpWYIOo9_Y4M0DM4w41AY05/view'
        },
        {
          title: 'Лист МОН від 14.08.2020 № 1/9-436: безпечне освітнє середовище та протидія булінгу',
          status: 'Лист "Про створення безпечного освітнього середовища в закладі освіти та попередження і протидії булінгу (цькуванню)".',
          url: 'https://drive.google.com/file/d/1nTDyYVLH7KHAyJYV-rbSa_NZ_ZrEBDxA/view'
        }
      ],
      pdfDocuments: [
        {
          id: 'commission',
          title: 'Створення комісії',
          src: ''
        },
        {
          id: 'response',
          title: 'Порядок реагування',
          src: ''
        },
        {
          id: 'submission',
          title: 'Процедура подання',
          src: ''
        },
        {
          id: 'statement',
          title: 'Заява про випадок',
          src: ''
        }
      ],
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
      ]
    };
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

.page-intro {
  padding: 72px 0 60px;
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
  max-width: 560px;
  margin: 0;
  color: var(--text-secondary, #485D54);
  font-size: 1.1rem;
  line-height: 1.7;
}

.content-section {
  padding: 64px 0;
}

.documents-section,
.images-section {
  background: var(--section-bg, #EAF3ED);
  border-top: 1px solid var(--border, #D9E4DD);
  border-bottom: 1px solid var(--border, #D9E4DD);
}

.two-column {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
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
  max-width: 720px;
  margin: 0 auto 32px;
  text-align: center;
}

.phones-list,
.document-links,
.pdf-accordion {
  display: grid;
  gap: 12px;
}

.phone-row,
.document-link {
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  color: var(--text-primary, #1F352B);
  background: var(--surface-elevated, #FFFDFC);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 8px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.phone-row:hover,
.document-link:hover {
  border-color: var(--secondary, #B95636);
  transform: translateY(-2px);
}

.phone-row strong,
.document-link strong {
  line-height: 1.35;
}

.phone-row span,
.document-link span {
  color: var(--text-secondary, #485D54);
  line-height: 1.55;
}

.pdf-details {
  overflow: hidden;
  background: var(--surface-elevated, #FFFDFC);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 8px;
}

.pdf-details summary {
  cursor: pointer;
  padding: 18px 20px;
  color: var(--text-primary, #1F352B);
  font-weight: 700;
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

.image-list {
  display: grid;
  gap: 32px;
  justify-items: center;
}

.image-list figure {
  width: min(100%, 920px);
  margin: 0;
  overflow: hidden;
  background: var(--surface-elevated, #FFFDFC);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 8px;
}

.image-list a {
  display: block;
  padding: 18px;
  background: #ffffff;
}

.image-list img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.image-list figcaption {
  padding: 12px 14px;
  color: var(--text-primary, #1F352B);
  font-weight: 700;
  line-height: 1.35;
}

@media (max-width: 900px) {
  .two-column {
    grid-template-columns: 1fr;
  }

  .page-intro h1 {
    font-size: 2.4rem;
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

  .pdf-details summary {
    padding: 16px;
  }
}
</style>
