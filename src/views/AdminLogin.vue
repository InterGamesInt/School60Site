<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <svg viewBox="20 20 160 160" xmlns="http://www.w3.org/2000/svg">
              <path d="M100.002 139.589h-.004L100 140c0 22.091-17.909 40-40 40s-40-17.909-40-40c0-21.953 17.685-39.776 39.586-39.998v-.003C37.685 99.776 20 81.954 20 60c0-22.092 17.909-40 40-40 21.4 0 38.875 16.805 39.948 37.938h.105C101.125 36.805 118.6 20 140 20c22.091 0 40 17.909 40 40 0 21.954-17.687 39.778-39.589 39.998v.003C162.313 100.222 180 118.045 180 140c0 22.091-17.909 40-40 40s-40-17.909-40-40l.002-.411z" fill="#2F5F48"/>
            </svg>
          </div>
          <h2>Адмін-панель</h2>
          <p>Введіть свої облікові дані для входу</p>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Електронна пошта</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="admin@school.com"
              required
              autocomplete="email"
            />
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
          </div>
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? 'Завантаження...' : 'Увійти' }}
          </button>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
        <div class="login-footer">
          <router-link to="/">← Повернутися на сайт</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default {
  name: 'AdminLogin',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/admin/dashboard');
      } catch (err) {
        console.error(err);
        if (err.code === 'auth/invalid-credential') {
          this.error = 'Невірний email або пароль';
        } else if (err.code === 'auth/user-not-found') {
          this.error = 'Користувача з таким email не існує';
        } else {
          this.error = 'Помилка входу. Спробуйте пізніше.';
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.admin-login-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f5 100%);
  padding: 40px 20px;
}
.login-container {
  width: 100%;
  max-width: 450px;
}
.login-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1);
  padding: 40px 32px;
  transition: transform 0.2s;
}
.login-header {
  text-align: center;
  margin-bottom: 32px;
}
.logo-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 16px;
}
.logo-icon svg {
  width: 100%;
  height: 100%;
}
.login-header h2 {
  font-size: 28px;
  color: #2F5F48;
  margin: 0 0 8px 0;
  font-weight: 600;
}
.login-header p {
  color: #6c7a7a;
  font-size: 14px;
  margin: 0;
}
.form-group {
  margin-bottom: 24px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1e2f2a;
  font-size: 14px;
}
.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d0d5d9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s;
  background: #ffffff;
  color: #1a2b22; /* темний текст для гарної читабельності */
}
.form-group input::placeholder {
  color: #a0abb5;
  font-weight: 400;
}
.form-group input:focus {
  outline: none;
  border-color: #C7613C;
  box-shadow: 0 0 0 3px rgba(199, 97, 60, 0.15);
  background-color: #ffffff;
}
.login-btn {
  width: 100%;
  background: #2F5F48;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
}
.login-btn:hover:not(:disabled) {
  background: #1e4032;
}
.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error-message {
  margin-top: 16px;
  padding: 10px;
  background: #fee8e6;
  color: #C7613C;
  border-radius: 12px;
  font-size: 14px;
  text-align: center;
}
.login-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #edf2f7;
}
.login-footer a {
  color: #2F5F48;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}
.login-footer a:hover {
  color: #C7613C;
  text-decoration: underline;
}
/* Адаптивність */
@media (max-width: 520px) {
  .login-card {
    padding: 32px 24px;
  }
  .login-header h2 {
    font-size: 24px;
  }
}
</style>