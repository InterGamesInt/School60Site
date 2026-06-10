<template>
  <header class="site-header">
    <div class="container header-container">
      <div class="logo-area">
        <a href="/" class="logo-link">
          <svg class="logo-svg" viewBox="20 20 160 160" xmlns="http://www.w3.org/2000/svg">
            <path d="M100.002 139.589h-.004L100 140c0 22.091-17.909 40-40 40s-40-17.909-40-40c0-21.953 17.685-39.776 39.586-39.998v-.003C37.685 99.776 20 81.954 20 60c0-22.092 17.909-40 40-40 21.4 0 38.875 16.805 39.948 37.938h.105C101.125 36.805 118.6 20 140 20c22.091 0 40 17.909 40 40 0 21.954-17.687 39.778-39.589 39.998v.003C162.313 100.222 180 118.045 180 140c0 22.091-17.909 40-40 40s-40-17.909-40-40l.002-.411z" fill="#2F5F48"/>
          </svg>
        </a>
        <div class="school-name">
          <h1>Середня загальноосвітня школа № 60 КРД "Росток" м. Києва</h1>
          <p>ім. Олександра Загребельного</p>
        </div>
      </div>

      <button class="burger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
        <span></span><span></span><span></span>
      </button>

      <nav :class="['main-nav', { open: menuOpen }]">
        <ul class="nav-list">
          <li><a href="#" class="active">Головна</a></li>
          
          <li class="dropdown" :class="{ open: openDropdown === 'school' }">
            <a href="#" @click.prevent="toggleDropdown('school')">Про школу</a>
            <ul class="dropdown-menu">
              <li><a href="#">Команда</a></li>
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
            <ul class="dropdown-menu">
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
            <ul class="dropdown-menu">
              <li><a href="#">Освітні програми 1-4 кл.</a></li>
              <li><a href="#">Освітні програми 5-9 кл.</a></li>
              <li><a href="#">Розклад</a></li>
              <li><a href="#">Структура навчального року</a></li>
              <li><a href="#">Критерії оцінювання</a></li>
            </ul>
          </li>

          <li><a href="#">Харчування</a></li>

          <li class="dropdown" :class="{ open: openDropdown === 'news' }">
            <a href="#" @click.prevent="toggleDropdown('news')">Новини</a>
            <ul class="dropdown-menu">
              <li><a href="#">Оголошення</a></li>
              <li><a href="#">Новини</a></li>
            </ul>
          </li>

          <li class="dropdown" :class="{ open: openDropdown === 'feedback' }">
            <a href="#" @click.prevent="toggleDropdown('feedback')">Зворотній зв'язок</a>
            <ul class="dropdown-menu">
              <li><a href="#">Контакти</a></li>
              <li><a href="#">Анкета-опитувальник для учнів</a></li>
              <li><a href="#">Анкета-опитувальник для батьків</a></li>
              <li><a href="#">Анкета-опитувальник для вчителів</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      menuOpen: false,
      openDropdown: null
    }
  },
  methods: {
    toggleDropdown(name) {
      if (this.openDropdown === name) {
        this.openDropdown = null;
      } else {
        this.openDropdown = name;
      }
    }
  }
}
</script>

<style scoped>
.site-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 0;
  width: 100%;
}
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}
.logo-area {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.logo-svg {
  width: 60px;
  height: 60px;
}
.school-name h1 {
  font-size: 26px;
  font-weight: bold;
  margin: 0;
  color: #2F5F48;
}
.school-name p {
  font-size: 18px;
  margin: 0;
  color: #C7613C;
  text-align: left;
}
.burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1100;
}
.burger span {
  width: 100%;
  height: 3px;
  background: #2F5F48;
  transition: 0.3s;
}
.burger.open span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.burger.open span:nth-child(2) {
  opacity: 0;
}
.burger.open span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}
.main-nav ul {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
}
.main-nav li {
  position: relative;
}
.main-nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}
.main-nav a:hover,
.main-nav a.active {
  color: #C7613C;
}

/* ----- ПОКРАЩЕНЕ ВИПАДАЮЧЕ МЕНЮ ----- */
@media (min-width: 769px) {
  .dropdown .dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    padding: 8px 0;
    min-width: 250px;
    list-style: none;
    z-index: 100;
    border-radius: 8px;
    border: 1px solid #eee;
  }
  .dropdown:hover .dropdown-menu {
    display: block;
  }
  .dropdown-menu li {
    margin: 0;
    padding: 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .dropdown-menu li:last-child {
    border-bottom: none;
  }
  .dropdown-menu a {
    display: block;
    padding: 10px 20px;
    font-size: 15px;
    font-weight: normal;
    color: #2c3e2f;
    transition: all 0.2s ease;
    white-space: normal;
    line-height: 1.4;
  }
  .dropdown-menu a:hover {
    background-color: #f5f5f5;
    color: #C7613C;
    padding-left: 25px; /* легке зміщення при ховері для акценту */
  }
}

/* Мобільна версія */
@media (max-width: 768px) {
  .burger {
    display: flex;
  }
  .main-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    transition: right 0.3s;
    padding: 80px 20px 20px;
    overflow-y: auto;
    z-index: 1050;
  }
  .main-nav.open {
    right: 0;
  }
  .main-nav ul {
    flex-direction: column;
    gap: 15px;
  }
  .dropdown .dropdown-menu {
    display: none;
    position: static;
    box-shadow: none;
    padding-left: 20px;
    margin-top: 8px;
    background: #fafafa;
    border-radius: 6px;
  }
  .dropdown.open .dropdown-menu {
    display: block;
  }
  .dropdown-menu li {
    margin-bottom: 5px;
  }
  .dropdown-menu a {
    display: block;
    padding: 8px 12px;
    font-size: 14px;
    border-left: 2px solid transparent;
  }
  .dropdown-menu a:hover {
    border-left-color: #C7613C;
    background: #f0f0f0;
  }
}

/* Адаптація для планшетів */
@media (max-width: 1024px) and (min-width: 769px) {
  .header-container {
    justify-content: space-between;
  }
  .school-name h1 {
    font-size: 18px;
  }
  .school-name p {
    font-size: 12px;
  }
  .main-nav ul {
    gap: 12px;
  }
}
</style>