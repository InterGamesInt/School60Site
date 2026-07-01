<template>
  <footer class="site-footer">
    <!-- Декоративні елементи фону -->
    <div class="footer-bg-decoration">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
    </div>

    <div class="container">
      <div class="footer-content">
        <!-- Соціальні мережі -->
        <div class="footer-social">
          <a
            href="https://www.facebook.com/wix"
            target="_blank"
            aria-label="Facebook"
            class="social-link facebook"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/960px-2023_Facebook_icon.svg.png"
              alt="Facebook"
            />
          </a>
          <a
            href="https://www.instagram.com/wix"
            target="_blank"
            aria-label="Instagram"
            class="social-link instagram"
          >
            <img
              src="https://images.icon-icons.com/2992/PNG/512/instagram_logo_icon_187313.png"
              alt="Instagram"
            />
          </a>
        </div>

        <!-- Контакти -->
        <div class="footer-contact">
          <a href="https://maps.app.goo.gl/QekuKHnTLN132hdo7" target="_blank" class="contact-item">
            <span class="contact-icon">📍</span>
            вулиця Романа Ратушного, 1/2, Київ, Україна, 03110
          </a>
          <a href="mailto:60school@kyivcity.gov.ua" class="contact-item">
            <span class="contact-icon">✉️</span>
            60school@kyivcity.gov.ua
          </a>
          <p class="contact-item">
            <span class="contact-icon">📞</span>
            <a href="tel:+380442755191">+38 (044) 275-51-91</a>,
            <a href="tel:+380442757454">+38 (044) 275-74-54</a>
          </p>
        </div>
      </div>

      <!-- Копірайт -->
      <div class="copyright">
        <p>
          © {{ currentYear }} Середня загальноосвітня школа № 60 КРД "Росток" м. Києва
          <br class="mobile-break" />
          ім. Олександра Загребельного.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
/* ============================================
   ДОДАТКОВІ ЗМІННІ
   ============================================ */
:root {
  --footer-bg-start: #0f1f18;
  --footer-bg-end: #1a2b22;
  --footer-glow: rgba(47, 95, 72, 0.15);
  --footer-text: #e8f0ec;
  --footer-link: #b0c4bc;
  --footer-border: #2d4a3e;
  --footer-copyright: #8aa39a;
  --social-size: 48px;
}

/* ============================================
   ОСНОВНІ СТИЛІ
   ============================================ */
.site-footer {
  position: relative;
  background: linear-gradient(145deg, var(--footer-bg-start, #0f1f18), var(--footer-bg-end, #1a2b22));
  color: var(--footer-text, #e8f0ec);
  padding: 60px 0 30px;
  overflow: hidden;
}

/* Декоративне світіння */
.footer-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.glow-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -100px;
  background: var(--footer-glow, rgba(47, 95, 72, 0.15));
}
.glow-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -50px;
  background: var(--decor-secondary, rgba(199, 97, 60, 0.08));
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ============================================
   ОСНОВНА СІТКА
   ============================================ */
.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--footer-border, #2d4a3e);
}

/* ============================================
   СОЦІАЛЬНІ МЕРЕЖІ
   ============================================ */
.footer-social {
  display: flex;
  gap: 16px;
  align-items: center;
}

.social-link {
  display: inline-block;
  width: var(--social-size, 48px);
  height: var(--social-size, 48px);
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
}
.social-link::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary, #2F5F48);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.social-link:hover::after {
  opacity: 0.15;
}

.social-link img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.4s ease, filter 0.3s ease;
  background: #fff;
  padding: 4px;
}
.social-link:hover img {
  transform: scale(1.15) rotate(-6deg);
  filter: brightness(1.2);
}
.social-link:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Кольорові відтінки при ховері (для різних соцмереж) */
.social-link.facebook:hover {
  box-shadow: 0 8px 24px rgba(24, 119, 242, 0.4);
}
.social-link.instagram:hover {
  box-shadow: 0 8px 24px rgba(225, 48, 108, 0.4);
}
.social-link.tiktok:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

/* ============================================
   КОНТАКТИ
   ============================================ */
.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: var(--footer-link, #b0c4bc);
  text-decoration: none;
  transition: color 0.3s ease;
  margin: 0;
  line-height: 1.5;
}
.contact-item:hover {
  color: var(--footer-text, #e8f0ec);
}
.contact-item .contact-icon {
  font-size: 1.2rem;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}
.footer-contact a.contact-item {
  position: relative;
}
.footer-contact a.contact-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--secondary, #C7613C);
  transition: width 0.3s ease;
}
.footer-contact a.contact-item:hover::after {
  width: 100%;
}

/* ============================================
   ПОСИЛАННЯ
   ============================================ */
.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links li {
  margin: 0;
}
.footer-links a {
  color: var(--footer-link, #b0c4bc);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}
.footer-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--secondary, #C7613C);
  transition: width 0.3s ease;
}
.footer-links a:hover {
  color: var(--footer-text, #e8f0ec);
}
.footer-links a:hover::after {
  width: 100%;
}

/* ============================================
   КОПІРАЙТ
   ============================================ */
.copyright {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--footer-border, #2d4a3e);
  font-size: 0.9rem;
  color: var(--footer-copyright, #8aa39a);
}
.copyright p {
  margin: 0;
  line-height: 1.6;
}
.mobile-break {
  display: none;
}

/* ============================================
   АДАПТИВНІСТЬ
   ============================================ */
@media (max-width: 1024px) {
  .footer-content {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .site-footer {
    padding: 40px 0 24px;
  }
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 32px;
    padding-bottom: 24px;
  }
  .footer-social {
    justify-content: center;
  }
  .footer-contact {
    align-items: center;
  }
  .contact-item {
    justify-content: center;
  }
  .footer-links ul {
    align-items: center;
  }
  .mobile-break {
    display: inline;
  }
  .copyright {
    font-size: 0.8rem;
    padding-top: 16px;
  }
}

@media (max-width: 480px) {
  .footer-social {
    gap: 12px;
  }
  .social-link {
    width: 40px;
    height: 40px;
  }
  .contact-item {
    font-size: 0.9rem;
  }
  .footer-links a {
    font-size: 0.85rem;
  }
}
</style>
