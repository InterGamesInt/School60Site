<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <img src="/src/assets/logo.png" alt="logo">
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
/* ============================================
   ОСНОВНИЙ КОНТЕЙНЕР
   ============================================ */
.admin-login-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient, linear-gradient(135deg, #f0f4f8 0%, #e6ecf2 100%));
  padding: 40px 20px;
  width: 100%;
}

/* ============================================
   КАРТКА ВХОДУ
   ============================================ */
.login-container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: var(--white, #ffffff);
  border-radius: 28px;
  box-shadow: 0 20px 60px var(--shadow, rgba(0, 0, 0, 0.08)), 0 6px 20px rgba(0, 0, 0, 0.02);
  padding: 44px 36px 36px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  animation: fadeUp 0.4s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================
   ЗАГОЛОВОК ТА ЛОГОТИП
   ============================================ */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary-light, #f8fafc);
  padding: 8px;
  transition: transform 0.3s ease;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.logo-icon:hover {
  transform: scale(1.04);
}

.login-header h2 {
  font-size: 28px;
  color: var(--primary, #2F5F48);
  margin: 0 0 8px 0;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.login-header p {
  color: var(--text-light, #6c7a7a);
  font-size: 15px;
  margin: 0;
  font-weight: 400;
}

/* ============================================
   ПОЛЯ ФОРМИ
   ============================================ */
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text, #1e2f2a);
  font-size: 14px;
  letter-spacing: 0.2px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 14px;
  font-size: 16px;
  transition: all 0.25s ease;
  background: var(--bg, #fafcfc);
  color: var(--text, #1a2b22);
  font-weight: 500;
}

.form-group input::placeholder {
  color: var(--text-light, #a0abb5);
  font-weight: 400;
}

.form-group input:focus {
  outline: none;
  border-color: var(--secondary, #C7613C);
  background-color: var(--white, #ffffff);
  box-shadow: 0 0 0 4px rgba(199, 97, 60, 0.10);
}

/* ============================================
   КНОПКА ВХОДУ
   ============================================ */
.login-btn {
  width: 100%;
  background: var(--primary, #2F5F48);
  color: var(--white, #ffffff);
  border: none;
  padding: 14px 20px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 8px;
  letter-spacing: 0.3px;
}

.login-btn:hover:not(:disabled) {
  background: var(--primary-dark, #1e4032);
  box-shadow: 0 6px 16px var(--shadow, rgba(47, 95, 72, 0.25));
  transform: translateY(-1px);
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ============================================
   ПОВІДОМЛЕННЯ ПРО ПОМИЛКУ
   ============================================ */
.error-message {
  margin-top: 18px;
  padding: 12px 16px;
  background: var(--error-bg, #fef2ee);
  color: var(--secondary, #C7613C);
  border-radius: 14px;
  font-size: 14px;
  text-align: center;
  border-left: 4px solid var(--secondary, #C7613C);
  font-weight: 500;
}

/* ============================================
   НИЖНЯ ЧАСТИНА
   ============================================ */
.login-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 22px;
  border-top: 1.5px solid var(--border, #edf2f7);
}

.login-footer a {
  color: var(--primary, #2F5F48);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.login-footer a:hover {
  color: var(--secondary, #C7613C);
  transform: translateX(-2px);
}

/* ============================================
   АДАПТИВНІСТЬ
   ============================================ */
@media (max-width: 520px) {
  .login-card {
    padding: 32px 24px 28px;
  }
  .login-header h2 {
    font-size: 24px;
  }
  .logo-icon {
    width: 60px;
    height: 60px;
  }
  .form-group input {
    font-size: 15px;
    padding: 11px 14px;
  }
  .login-btn {
    font-size: 15px;
    padding: 12px 16px;
  }
}

@media (max-width: 400px) {
  .login-card {
    padding: 24px 16px;
  }
  .login-header h2 {
    font-size: 20px;
  }
  .logo-icon {
    width: 50px;
    height: 50px;
  }
}
</style>