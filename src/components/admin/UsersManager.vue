<template>
  <div class="manager">
    <h2>Користувачі адмін-панелі</h2>
    <div class="info-box">
      <p>🔐 Для безпеки, керування адміністраторами виконується через <strong>Firebase Console</strong>.</p>
      <p>Поточний адміністратор: <strong>{{ currentUserEmail }}</strong></p>
      <p><a href="https://console.firebase.google.com/" target="_blank" class="link">Перейти до Firebase Console →</a></p>
    </div>
  </div>
</template>

<script>
import { auth } from '../../firebase';

export default {
  data() {
    return {
      currentUserEmail: ''
    };
  },
  mounted() {
    const user = auth.currentUser;
    this.currentUserEmail = user ? user.email : 'невідомо';
  }
}
</script>

<style scoped>
.manager {
  background: var(--white, #ffffff);
  border-radius: 12px;
  padding: 20px;
}
.manager h2 {
  margin-top: 0;
  color: var(--secondary, #C7613C);
  font-weight: 600;
  font-size: 24px;
}
.info-box {
  background: var(--light-bg, #e8f0fe);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid var(--primary, #2F5F48);
}
.link {
  color: var(--secondary, #C7613C);
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>