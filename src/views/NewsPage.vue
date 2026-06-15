<template>
  <div class="news-page">
    <NewsList />
  </div>
</template>

<script>
import NewsList from '../components/NewsList.vue';

export default {
  name: 'NewsPage',
  components: { NewsList }
}
</script>

<style scoped>
.news-page {
  min-height: 70vh;
}
</style>