<template>
  <header class="site-header">
    <div class="container header-container">
      <div class="logo-area">
        <router-link to="/" class="logo-link">
          <img :src="logo" alt="logo">
        </router-link>
        <div class="school-name">
          <h1>Середня загальноосвітня школа № 60 КРД "Росток" м. Києва</h1>
          <p>ім. Олександра Загребельного</p>
        </div>
      </div>

      <button class="burger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
        <span></span><span></span><span></span>
      </button>

      <!-- Оверлей (затемнення позаду меню) -->
      <div class="nav-overlay" v-show="menuOpen" @click="menuOpen = false"></div>

      <nav
        :class="['main-nav', { open: menuOpen, 'suppress-dropdown-hover': suppressDropdownHover }]"
        @mouseleave="suppressDropdownHover = false"
      >
        <button class="close-btn" @click="menuOpen = false" aria-label="Закрити меню">✕</button>

        <ul class="nav-list">
          <li><router-link to="/" :class="{ active: $route.path === '/' }" @click="menuOpen = false">Головна</router-link></li>
          
          <li class="dropdown" :class="{ open: openDropdown === 'school' }">
            <a href="#" @click.prevent="toggleDropdown('school')" :class="{ active: isSchoolActive }">Про школу</a>
            <ul class="dropdown-menu" @click="closeNavigationMenus">
              <li><router-link to="/team" :class="{ active: $route.path === '/team' }" @click="menuOpen = false">Команда</router-link></li>
              <li><a href="#">Кафедри</a></li>
              <li><a href="#">Вакансії</a></li>
              <li><a href="#">Правила прийому до 1 класу</a></li>
              <li><a href="#">Кодекс учня</a></li>
              <li><a href="#">Прозорість та інформаційна відкритість</a></li>
              <li><a href="#">Статут</a></li>
              <li><a href="#">Нормативні документи</a></li>
            </ul>
          </li>

          <li class="dropdown" :class="{ open: openDropdown === 'education' }">
            <a href="#" @click.prevent="toggleDropdown('education')">Виховна робота</a>
            <ul class="dropdown-menu" @click="closeNavigationMenus">
              <li><a href="#">Шкільне сьогодення</a></li>
              <li><a href="#">Школа без булінгу</a></li>
              <li><a href="#">Практичний психолог</a></li>
              <li><a href="#">Соціальний педагог</a></li>
              <li><a href="#">Домашнє насильство</a></li>
              <li><a href="#">Учнівське самоврядування</a></li>
              <li><a href="#">Безпека життєдіяльності</a></li>
            </ul>
          </li>

          <li class="dropdown" :class="{ open: openDropdown === 'study' }">
            <a href="#" @click.prevent="toggleDropdown('study')">Навчання</a>
            <ul class="dropdown-menu" @click="closeNavigationMenus">
              <li><a href="#">Освітні програми 1-4 кл.</a></li>
              <li><a href="#">Освітні програми 5-9 кл.</a></li>
              <li><a href="#">Розклад</a></li>
              <li><a href="#">Структура навчального року</a></li>
              <li><a href="#">Критерії оцінювання</a></li>
            </ul>
          </li>

          <li><router-link to="/news" @click="menuOpen = false">Харчування</router-link></li>

          <li class="dropdown" :class="{ open: openDropdown === 'news' }">
            <a href="#" @click.prevent="toggleDropdown('news')" :class="{ active: isNewsActive }">Новини</a>
            <ul class="dropdown-menu" @click="closeNavigationMenus">
              <li><router-link to="/announcements" :class="{ active: $route.path === '/announcements' }" @click="menuOpen = false">Оголошення</router-link></li>
              <li><router-link to="/news" :class="{ active: $route.path === '/news' }" @click="menuOpen = false">Новини</router-link></li>
            </ul>
          </li>

          <li class="dropdown" :class="{ open: openDropdown === 'feedback' }">
            <a href="#" @click.prevent="toggleDropdown('feedback')" :class="{ active: isFeedbackActive }">Зворотній зв'язок</a>
            <ul class="dropdown-menu" @click="closeNavigationMenus">
              <li><router-link to="/contacts" :class="{ active: $route.path === '/contacts' }" @click="menuOpen = false">Контакти</router-link></li>
              <li><router-link to="/survey-student" :class="{ active: $route.path === '/survey-student' }" @click="menuOpen = false">Анкета учня/учениці</router-link></li>
              <li><router-link to="/survey-parents" :class="{ active: $route.path === '/survey-parents' }" @click="menuOpen = false">Анкета для батьків</router-link></li>
              <li><router-link to="/survey-teachers" :class="{ active: $route.path === '/survey-teachers' }" @click="menuOpen = false">Анкета для вчителів</router-link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import logo from '@/assets/logo.png'

export default {
  name: 'AppHeader',
  data() {
    return {
      logo,
      menuOpen: false,
      openDropdown: null,
      suppressDropdownHover: false
    };
  },
  computed: {
    isSchoolActive() {
      const schoolRoutes = ['/team'];
      return schoolRoutes.includes(this.$route.path);
    },
    isNewsActive() {
      return ['/announcements', '/news'].includes(this.$route.path);
    },
    isFeedbackActive() {
      return ['/contacts', '/survey-student', '/survey-parents', '/survey-teachers'].includes(this.$route.path);
    }
  },
  watch: {
    '$route.path'() {
      this.openDropdown = null;
      this.menuOpen = false;
      this.$nextTick(() => document.activeElement?.blur());
    }
  },
  methods: {
    toggleDropdown(name) {
      this.suppressDropdownHover = false;
      if (this.openDropdown === name) {
        this.openDropdown = null;
      } else {
        this.openDropdown = name;
      }
    },
    closeNavigationMenus() {
      this.openDropdown = null;
      this.menuOpen = false;
      this.suppressDropdownHover = true;
      this.$nextTick(() => document.activeElement?.blur());
      window.setTimeout(() => {
        this.suppressDropdownHover = false;
      }, 250);
    }
  }
};
</script>

<style scoped>
/* ============================================
   БАЗОВІ ЗМІННІ (збережені)
   ============================================ */
:root {
  --primary: #2F5F48;
  --primary-dark: #1e4032;
  --secondary: #C7613C;
  --white: #ffffff;
  --bg: #f9f9f9;
  --light-bg: #fefcf8;
  --border-color: #e9ecef;
  --border-color-hover: #e2e8f0;
  --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.05);
  --text-primary: #1e293b;
  --text-secondary: #4a5568;
  --text-muted: #888;
  --hover-bg: #f8fafc;
  --active-bg: #fef5f0;
  --btn-cancel-bg: #e9ecef;
  --btn-cancel-hover: #dee2e6;
}

/* ============================================
   ОСНОВНІ СТИЛІ ХЕДЕРА
   ============================================ */
.site-header {
  background: linear-gradient(135deg, var(--header-bg, #ffffff) 0%, var(--header-bg-end, #f4f9f7) 100%);
  border-bottom: 1px solid color-mix(in srgb, var(--border, #e2e8f0) 70%, transparent);
  padding: 12px 0;
  width: 100%;
  box-shadow: var(--shadow-light, 0 2px 12px rgba(47, 95, 72, 0.08));
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.header-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

/* ============================================
   ЛОГОТИП І НАЗВА ШКОЛИ
   ============================================ */
.logo-area {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  border-radius: 50%;
  box-shadow: 0 2px 8px var(--shadow-color, rgba(47, 95, 72, 0.15));
}
.logo-link:hover {
  transform: scale(1.08) rotate(-2deg);
  box-shadow: 0 4px 16px var(--shadow-strong, rgba(47, 95, 72, 0.25));
}

.logo-link img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  display: block;
  border-radius: 50%;
  background: var(--header-text, #164851);
  padding: 2px;
}

.school-name {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.school-name h1 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: var(--primary, #2F5F48);
  letter-spacing: -0.3px;
  background: linear-gradient(135deg, var(--primary, #2F5F48) 0%, var(--primary-dark, #1a4032) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.school-name p {
  font-size: 16px;
  margin: 2px 0 0 0;
  color: var(--secondary, #C7613C);
  font-weight: 500;
  text-align: left;
  letter-spacing: 0.3px;
}

/* ============================================
   БУРГЕР-КНОПКА (МОБІЛЬНА)
   ============================================ */
.burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1050;
  transition: transform 0.3s ease;
}
.burger:hover {
  transform: scale(1.05);
}

.burger span {
  display: block;
  width: 100%;
  height: 3px;
  background: var(--primary, #2F5F48);
  border-radius: 2px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.burger.open span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.burger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.burger.open span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* ============================================
   НАВІГАЦІЯ (ДЕСКТОП)
   ============================================ */
.main-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 6px;
}

.nav-list > li {
  position: relative;
}

.nav-list > li > a,
.nav-list > li > router-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  text-decoration: none;
  color: var(--text-primary, #334155);
  font-weight: 500;
  font-size: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  min-width: 0;
}

/* Плавне підкреслення */
.nav-list > li > a::after,
.nav-list > li > router-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  width: 0;
  height: 2px;
  background: var(--secondary, #C7613C);
  transition: all 0.3s ease;
  margin: 0 auto;
  border-radius: 2px;
}

.nav-list > li > a:hover::after,
.nav-list > li > router-link:hover::after {
  width: 70%;
}

.nav-list > li > a.active::after,
.nav-list > li > router-link.active::after {
  width: 70%;
}

.nav-list > li > a:hover,
.nav-list > li > a:focus {
  color: var(--secondary, #C7613C);
  background: var(--hover-bg, #f8fafc);
}

.nav-list > li > a.active,
.nav-list > li > router-link.active {
  color: var(--secondary, #C7613C);
  background: var(--active-bg, #fef5f0);
}

/* ============================================
   ВИПАДАЮЧІ МЕНЮ (ДЕСКТОП)
   ============================================ */
.dropdown > a {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 20px;
}
.dropdown > a::after {
  content: '▾';
  font-size: 12px;
  margin-left: 6px;
  opacity: 0.6;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.dropdown:hover > a::after {
  transform: rotate(180deg);
  opacity: 1;
}

.dropdown-menu {
  display: block;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 240px;
  background: var(--surface-elevated, #ffffff);
  border-radius: 16px;
  box-shadow: var(--shadow-hover, 0 16px 48px rgba(47, 95, 72, 0.12));
  padding: 8px 0;
  list-style: none;
  z-index: 100;
  border: 1px solid var(--border, rgba(47, 95, 72, 0.06));
  backdrop-filter: blur(4px);
  background: color-mix(in srgb, var(--surface-elevated, #ffffff) 96%, transparent);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-8px) scale(0.98);
  transform-origin: top left;
  transition:
    opacity 0.2s ease 0.12s,
    transform 0.2s ease 0.12s,
    visibility 0s linear 0.32s;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -10px;
  height: 10px;
}

.dropdown-menu li {
  margin: 0;
  padding: 0;
}

.dropdown-menu a {
  display: block;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-primary, #334155);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.dropdown-menu a:hover {
  background: var(--hover-bg, #f8fafc);
  color: var(--secondary, #C7613C);
  border-left-color: var(--secondary, #C7613C);
  padding-left: 28px;
}

.dropdown-menu a.active {
  color: var(--secondary, #C7613C);
  background: var(--active-bg, #fef5f0);
  border-left-color: var(--secondary, #C7613C);
}

/* Десктоп: показ при ховері */
@media (min-width: 769px) {
  .main-nav:not(.suppress-dropdown-hover) .dropdown:hover .dropdown-menu,
  .main-nav:not(.suppress-dropdown-hover) .dropdown.open .dropdown-menu {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0) scale(1);
    transition-delay: 0s;
    animation: fadeDropdown 0.25s ease forwards;
  }
  
  @keyframes fadeDropdown {
    from {
      opacity: 0;
      transform: translateY(-12px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
}

/* ============================================
   КНОПКА ЗАКРИТТЯ (ХРЕСТИК) – мобільна
   ============================================ */
.close-btn {
  display: none;
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 32px;
  line-height: 1;
  color: var(--primary, #2F5F48);
  cursor: pointer;
  z-index: 1160;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: background 0.2s, transform 0.2s;
}
.close-btn:hover {
  background: var(--hover-bg, #f1f5f9);
  transform: rotate(90deg);
}

/* ============================================
   ОВЕРЛЕЙ (ЗАТЕМНЕННЯ) – НОВИЙ ЕЛЕМЕНТ
   ============================================ */
.nav-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1140;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

/* Показуємо оверлей тільки на мобільних при відкритому меню */
@media (max-width: 768px) {
  .nav-overlay {
    display: block;
    opacity: 0;
    pointer-events: none; /* щоб кліки не заважали, поки приховано */
  }
  .nav-overlay[v-show="true"] {
    opacity: 1;
    pointer-events: auto;
  }
}

/* ============================================
   МОБІЛЬНА ВЕРСІЯ (≤768px)
   ============================================ */
@media (max-width: 768px) {
  .burger {
    display: flex;
  }

  .main-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 85%;
    max-width: 360px;
    height: 100vh;
    background: var(--surface-elevated, #ffffff) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: -8px 0 32px var(--shadow-strong, rgba(0, 0, 0, 0.08));
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 80px 24px 30px;
    overflow-y: auto;
    z-index: 1150;
    display: block;
    border-left: 1px solid rgba(47, 95, 72, 0.08);
  }

  .main-nav.open {
    right: 0;
  }

  .main-nav.open .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-list {
    flex-direction: column;
    gap: 4px;
  }

  .nav-list > li > a,
  .nav-list > li > router-link {
    display: block;
    padding: 12px 16px;
    font-size: 16px;
    white-space: normal;
    border-radius: 12px;
    justify-content: flex-start;
  }

  .nav-list > li > a::after {
    display: none; /* ховаємо підкреслення на мобільних */
  }

  .dropdown .dropdown-menu {
    display: none;
    position: static;
    box-shadow: none;
    padding: 4px 0 4px 16px;
    margin-top: 4px;
    background: var(--hover-bg, #f8fafc);
    border-radius: 12px;
    border: none;
    min-width: auto;
  }

  .dropdown.open .dropdown-menu {
    display: block;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: none;
  }

  .dropdown-menu a {
    padding: 10px 16px;
    font-size: 14px;
    border-left: 2px solid transparent;
  }
  .dropdown-menu a:hover {
    padding-left: 20px;
  }
}

/* ============================================
   ПЛАНШЕТИ (769–1024px)
   ============================================ */
@media (max-width: 1024px) and (min-width: 769px) {
  .school-name h1 {
    font-size: 18px;
  }
  .school-name p {
    font-size: 13px;
  }
  .logo-link img {
    width: 48px;
    height: 48px;
  }
  .nav-list > li > a {
    padding: 8px 12px;
    font-size: 13px;
  }
}

/* ============================================
   МАЛЕНЬКІ ТЕЛЕФОНИ (≤480px)
   ============================================ */
@media (max-width: 480px) {
  .site-header {
    padding: 10px 0;
  }
  .container {
    padding: 0 16px;
  }
  .logo-area {
    gap: 10px;
  }
  .logo-link img {
    width: 44px;
    height: 44px;
  }
  .school-name h1 {
    font-size: 15px;
    -webkit-text-fill-color: var(--primary, #2F5F48);
    background: none;
  }
  .school-name p {
    font-size: 11px;
  }
  .main-nav {
    width: 100%;
    max-width: 100%;
    padding: 70px 20px 20px;
  }
  .close-btn {
    top: 12px;
    right: 16px;
    font-size: 28px;
    width: 40px;
    height: 40px;
  }
}
</style>
