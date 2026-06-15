<template>
  <div id="app">
    <AppHeader />
    <main>
      <router-view />  <!-- сюди підставлятиметься HomePage або AdminDashboard -->
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  components: { AppHeader, AppFooter }
}
</script>

<style>
/* ваші глобальні стилі залишаються */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body, #app {
  width: 100%;
  background-color: #ffffff;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>