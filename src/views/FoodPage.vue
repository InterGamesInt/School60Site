<template>
  <div class="food-page">
    <section class="food-intro">
      <div class="container intro-grid">
        <div class="intro-copy">
          <span class="page-badge">Шкільне харчування</span>
          <h1>Харчування</h1>
          <p>
            Організація харчування у школі спрямована на регулярне, безпечне
            та збалансоване харчування учнів протягом навчального дня.
          </p>
        </div>
        <figure class="intro-media">
          <img :src="foodImages[0].src" :alt="foodImages[0].alt" />
        </figure>
      </div>
    </section>

    <section class="food-section">
      <div class="container content-layout">
        <div class="section-heading">
          <span>Організація</span>
          <h2>Харчування учнів</h2>
        </div>

        <div class="info-panel">
          <p>
            Організацію харчування учнів у школі здійснює КП "ШКОЛЯР".
          </p>
          <p>
            100% учнів 1-4 класів отримують безкоштовне гаряче харчування.
          </p>
          <p>
            Також безкоштовно харчуються учні пільгових категорій відповідно
            до чинного законодавства та рішень засновника.
          </p>
          <p>
            Прийом їжі організовано відповідно до графіків харчування. Частина
            учнів користується буфетною продукцією та обідами за кошти батьків.
            Актив батьківської ради систематично контролює якість та
            естетичність харчування.
          </p>
          <p>
            Якість харчування контролюється комісією з контролю за якістю
            харчування учнів, яку очолює директор школи. У відповідності до
            меню учні вживають салати зі свіжих овочів, м'ясні, рибні, молочні
            страви та фрукти.
          </p>
          <p>
            Відповідно до плану роботи школи здійснюються перевірки стану
            харчування учнів адміністрацією школи та членами батьківського
            комітету. Питання організації харчування розглядаються на
            педрадах, нарадах при директорі, засіданнях ради школи та
            батьківських зборах.
          </p>
        </div>
      </div>
    </section>

    <section class="food-gallery">
      <div class="container gallery-grid">
        <figure class="featured-food-image">
          <img :src="foodImages[1].src" :alt="foodImages[1].alt" loading="lazy" />
        </figure>
      </div>
    </section>

    <section class="facts-section">
      <div class="container">
        <div class="section-heading centered">
          <span>Пізнавально</span>
          <h2>24 неймовірних факти про харчові продукти</h2>
        </div>

        <div class="facts-groups">
          <article v-for="section in factSections" :key="section.title" class="fact-group">
            <h3>{{ section.title }}</h3>
            <ol class="facts-list">
              <li v-for="fact in section.facts" :key="fact.number">
                <span class="fact-number">{{ fact.number }}</span>
                <div>
                  <h4>{{ fact.title }}</h4>
                  <p>{{ fact.text }}</p>
                </div>
              </li>
            </ol>
          </article>
        </div>

        <div class="conclusion">
          <h2>Їжа як джерело натхнення та науки</h2>
          <p>
            Цікаві факти про їжу демонструють, що навіть звичні продукти
            приховують несподівані властивості. Знання про походження,
            склад і культуру харчування допомагає робити щоденний вибір
            більш усвідомленим.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import foodPlate from '../assets/food-plate.png';
export default {
  name: 'FoodPage',
  data() {
    return {
      foodImages: [
        {
          src: 'https://static.wixstatic.com/media/62bea5_865bc86296a6471287d8f8e1ebb28493~mv2.webp/v1/fill/w_960,h_435,al_c,q_85,enc_auto/62bea5_865bc86296a6471287d8f8e1ebb28493~mv2.webp',
          alt: 'Добірка корисних продуктів'
        },
        {
          src: foodPlate,
          alt: 'Шкільне меню та харчові продукти'
        }
      ],
      factSections: [
        {
          title: 'Знайомі продукти по-новому',
          facts: [
            {
              number: 1,
              title: 'Яблуко - суперфрукт',
              text: 'У яблуці міститься майже 25% повітря, тому воно плаває у воді. Також воно має багато антиоксидантів.'
            },
            {
              number: 2,
              title: 'Мед майже не псується',
              text: 'За правильних умов зберігання мед може залишатися придатним до споживання дуже довго.'
            },
            {
              number: 3,
              title: 'Картопля - один із головних овочів світу',
              text: 'Картоплю вирощують у понад 100 країнах, і вона залишається важливою частиною щоденного раціону.'
            },
            {
              number: 4,
              title: 'Гострий перець і відчуття тепла',
              text: 'Капсаїцин у перці взаємодіє з больовими рецепторами та створює відчуття жару.'
            },
            {
              number: 5,
              title: 'Банани світяться в ультрафіолеті',
              text: 'Під ультрафіолетовим світлом стигла бананова шкірка може мати синє світіння через розпад хлорофілу.'
            },
            {
              number: 6,
              title: 'Морква і зір',
              text: 'Морква містить бета-каротин, з якого утворюється вітамін A, важливий для нормальної роботи зору.'
            },
            {
              number: 7,
              title: 'Сиру існує дуже багато',
              text: 'У світі виробляють тисячі сортів сиру, а їхні смак і текстура залежать від технології приготування.'
            }
          ]
        },
        {
          title: 'Еволюція кулінарних звичок',
          facts: [
            {
              number: 8,
              title: 'Люди почали готувати дуже давно',
              text: 'Використання вогню для приготування їжі змінило харчування і зробило його енергетично ефективнішим.'
            },
            {
              number: 9,
              title: 'Стародавні рецепти збереглися на табличках',
              text: 'Одні з найдавніших рецептів були записані клинописом у Месопотамії понад 4000 років тому.'
            }
          ]
        },
        {
          title: 'Незвичайні продукти на столі',
          facts: [
            {
              number: 10,
              title: 'Кетчуп колись сприймали як ліки',
              text: 'У XIX столітті томатні соуси іноді рекламували як засіб для полегшення розладів травлення.'
            },
            {
              number: 11,
              title: 'Житній хліб має багато клітковини',
              text: 'Житній хліб часто має нижчий глікемічний індекс і добре насичує.'
            },
            {
              number: 12,
              title: 'Попкорн має давню історію',
              text: 'Попкорн відомий тисячі років і задовго до кінотеатрів був частиною харчової культури.'
            },
            {
              number: 13,
              title: 'Какао-боби використовували як цінність',
              text: 'У давніх цивілізаціях какао-боби були настільки цінними, що їх використовували для обміну.'
            }
          ]
        },
        {
          title: 'Їжа у цифрах',
          facts: [
            {
              number: 14,
              title: 'Частина їжі у світі марнується',
              text: 'Втрати і марнування продуктів впливають не лише на економіку, а й на довкілля.'
            },
            {
              number: 15,
              title: 'Деякі сорти кави дуже дорогі',
              text: 'Ціна окремих рідкісних сортів кави може сягати сотень доларів за кілограм.'
            },
            {
              number: 16,
              title: 'Пшениця залишається стратегічною культурою',
              text: 'Пшениця є однією з найважливіших зернових культур у світі, а Україна входить до помітних експортерів зерна.'
            },
            {
              number: 17,
              title: 'Томат - популярна овочева культура',
              text: 'Томати вирощують у великих обсягах, і вони входять до найпоширеніших овочевих культур.'
            }
          ]
        },
        {
          title: 'Переосмислення повсякденного',
          facts: [
            {
              number: 18,
              title: 'Ананас складається з багатьох частин',
              text: 'Ананас формується з багатьох дрібних плодів, які зростаються навколо центральної осі.'
            },
            {
              number: 19,
              title: 'Вино має багато ароматичних сполук',
              text: 'Смак і аромат вина утворюються завдяки сотням різних речовин.'
            },
            {
              number: 20,
              title: 'Рослинні бургери стають складнішими',
              text: "Сучасні технології дозволяють створювати рослинні продукти з текстурою, близькою до м'ясних страв."
            },
            {
              number: 21,
              title: 'Металеві ножі можуть впливати на смак',
              text: 'Контакт деяких продуктів з металом може змінювати відчуття смаку через окислення.'
            },
            {
              number: 22,
              title: 'Колір молока залежить від складу',
              text: 'На відтінок молока впливають жири, білки та інші природні компоненти.'
            },
            {
              number: 23,
              title: 'Вода має смак',
              text: 'Мінерали у воді можуть надавати їй солодкуватого, солонуватого або нейтрального присмаку.'
            },
            {
              number: 24,
              title: 'Яйце має складну біохімічну структуру',
              text: 'Яйця містять незамінні амінокислоти, а жовток є джерелом холіну.'
            }
          ]
        }
      ]
    };
  }
};
</script>

<style scoped>
.food-page {
  background: var(--page-bg, #F7F8F3);
  color: var(--text, #1E293B);
}

.food-intro {
  padding: 72px 0;
  background: linear-gradient(135deg, var(--page-gradient-start, #F4F9F6), var(--section-bg-alt, #FBFAF6));
  border-bottom: 1px solid var(--border, #D9E4DD);
}

.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
}

.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  gap: 44px;
  align-items: center;
}

.page-badge,
.section-heading span {
  display: inline-flex;
  color: var(--secondary, #B95636);
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  margin-bottom: 12px;
}

.intro-copy h1 {
  margin: 0 0 16px;
  color: var(--heading, #1F352B);
  font-size: 3.2rem;
  line-height: 1.05;
}

.intro-copy p {
  max-width: 560px;
  margin: 0;
  color: var(--text-secondary, #485D54);
  font-size: 1.12rem;
  line-height: 1.75;
}

.intro-media,
.gallery-grid figure {
  margin: 0;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--border, #D9E4DD);
  background: var(--surface, #FFFDFC);
}

.intro-media img,
.gallery-grid img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro-media {
  aspect-ratio: 16 / 9;
}

.food-section,
.facts-section {
  padding: 72px 0;
}

.content-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

.section-heading h2 {
  margin: 0;
  color: var(--heading, #1F352B);
  font-size: 2.2rem;
  line-height: 1.15;
}

.section-heading.centered {
  max-width: 760px;
  margin: 0 auto 36px;
  text-align: center;
}

.info-panel {
  display: grid;
  gap: 16px;
  padding: 28px;
  background: var(--surface-elevated, #FFFDFC);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 8px;
  box-shadow: var(--shadow-card, 0 10px 30px rgba(47, 95, 72, 0.11));
}

.info-panel p {
  margin: 0;
  color: var(--text-secondary, #485D54);
  line-height: 1.8;
}

.food-gallery {
  padding: 0 0 72px;
}

.gallery-grid {
  display: flex;
  justify-content: center;
}

.gallery-grid figure {
  width: min(100%, 860px);
}

.featured-food-image {
  aspect-ratio: auto;
}

.featured-food-image img {
  height: auto;
  object-fit: contain;
}

.facts-section {
  background: var(--section-bg, #EAF3ED);
  border-top: 1px solid var(--border, #D9E4DD);
}

.facts-groups {
  display: grid;
  gap: 28px;
}

.fact-group {
  padding: 28px;
  background: var(--surface-elevated, #FFFDFC);
  border: 1px solid var(--border, #D9E4DD);
  border-radius: 8px;
}

.fact-group h3 {
  margin: 0 0 18px;
  color: var(--primary, #2F5F48);
  font-size: 1.45rem;
}

.facts-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.facts-list li {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  min-width: 0;
}

.fact-number {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary, #2F5F48);
  color: var(--on-primary, #fff);
  font-weight: 700;
}

.facts-list h4 {
  margin: 0 0 6px;
  color: var(--text-primary, #1F352B);
  font-size: 1.02rem;
  line-height: 1.35;
}

.facts-list p {
  margin: 0;
  color: var(--text-secondary, #485D54);
  line-height: 1.65;
}

.conclusion {
  margin-top: 36px;
  padding: 28px;
  background: var(--surface-elevated, #FFFDFC);
  border-left: 5px solid var(--secondary, #B95636);
  border-radius: 8px;
}

.conclusion h2 {
  margin: 0 0 12px;
  color: var(--heading, #1F352B);
  font-size: 1.6rem;
}

.conclusion p {
  margin: 0;
  color: var(--text-secondary, #485D54);
  line-height: 1.75;
}

@media (max-width: 900px) {
  .intro-grid,
  .content-layout {
    grid-template-columns: 1fr;
  }

  .intro-copy h1 {
    font-size: 2.5rem;
  }

  .facts-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .food-intro,
  .food-section,
  .facts-section {
    padding: 48px 0;
  }

  .container {
    padding: 0 18px;
  }

  .intro-copy h1 {
    font-size: 2rem;
  }

  .section-heading h2 {
    font-size: 1.75rem;
  }

  .info-panel,
  .fact-group,
  .conclusion {
    padding: 20px;
  }
}
</style>
