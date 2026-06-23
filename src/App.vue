<template>
  <div id="app">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter />
    <ThemeSwitcher />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import { themes, defaultTheme } from './themes';
import { ref, provide, onMounted } from 'vue';

export default {
  components: { AppHeader, AppFooter, ThemeSwitcher },
  setup() {
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    const currentThemeName = ref(savedTheme);

    const applyTheme = (themeName) => {
      const theme = themes[themeName];
      if (!theme) return;
      currentThemeName.value = themeName;
      localStorage.setItem('theme', themeName);
      
      const root = document.documentElement;
      root.dataset.theme = themeName;
      Object.keys(theme.colors).forEach(key => {
        root.style.setProperty(key, theme.colors[key]);
      });
    };

    onMounted(() => {
      applyTheme(currentThemeName.value);
    });

    provide('theme', {
      currentThemeName,
      themes,
      applyTheme,
    });

    return { applyTheme };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  min-height: 100vh;
  background: var(--page-bg, #FAFAF8);
  color: var(--text, #1E293B);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  transition: background-color 0.35s ease, color 0.35s ease;
}

#app {
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  background: var(--page-bg, #FAFAF8);
  transition: background-color 0.35s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* Стилі для посилань, кнопок тощо – використовують змінні */
a {
  color: var(--secondary, #C7613C);
  text-decoration: none;
  transition: color 0.2s;
}
a:hover {
  color: var(--primary-dark, #1E4032);
}

.btn-primary {
  background: var(--secondary, #C7613C);
  color: var(--on-secondary, #FFFFFF);
  border: none;
  padding: 10px 20px;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: var(--primary-dark, #1E4032);
}
</style>
