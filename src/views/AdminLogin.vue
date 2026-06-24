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
            <div class="password-field">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? 'Приховати пароль' : 'Показати пароль'"
                :title="showPassword ? 'Приховати пароль' : 'Показати пароль'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5 9 8a10.7 10.7 0 0 1-2.1 3.5M6.3 6.3C4.3 7.7 3 10 3 12c0 3 3.5 8 9 8 1.2 0 2.3-.2 3.3-.6" />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12s3.5-8 9-8 9 8 9 8-3.5 8-9 8-9-8-9-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
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
      showPassword: false,
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
  background: linear-gradient(135deg, var(--page-gradient-start, #f0f4f8) 0%, var(--page-gradient-end, #e6ecf2) 100%);
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
  background: var(--surface-elevated, #ffffff);
  border-radius: 28px;
  box-shadow: var(--shadow-hover, 0 20px 60px rgba(0, 0, 0, 0.08));
  border: 1px solid var(--border, transparent);
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
  color: var(--text-muted, #52635d);
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
  background: var(--surface-soft, #fafcfc);
  color: var(--text, #1a2b22);
  font-weight: 500;
}

.form-group input::placeholder {
  color: var(--text-muted, #718096);
  font-weight: 400;
  opacity: 0.82;
}

.form-group input:focus {
  outline: none;
  border-color: var(--secondary, #C7613C);
  background-color: var(--surface, #ffffff);
  box-shadow: 0 0 0 4px var(--focus-ring, rgba(199, 97, 60, 0.10));
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 52px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  width: 38px;
  height: 38px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  color: var(--primary, #2F5F48);
  background: transparent;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.password-toggle:hover,
.password-toggle:focus-visible {
  color: var(--secondary, #C7613C);
  background: var(--primary-light, #eef6f2);
  outline: none;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ============================================
   КНОПКА ВХОДУ
   ============================================ */
.login-btn {
  width: 100%;
  background: var(--primary, #2F5F48);
  color: var(--on-primary, #ffffff);
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
