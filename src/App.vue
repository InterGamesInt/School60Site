<template>
  <div id="app">
    <AppHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    HeroSection,
    AboutSection,
    ProjectsSection
  }
}
</script>

<style>
/* Глобальне скидання – прибираємо всі відступи та чорний фон */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff; /* білий фон замість чорного */
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Madefor Text', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  color: #1a2b22;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>