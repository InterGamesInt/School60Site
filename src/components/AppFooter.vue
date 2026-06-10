<template>
  <footer class="site-footer">
    <div class="container footer-content">
      <div class="footer-social">
        <a href="https://www.facebook.com/wix" target="_blank" aria-label="Facebook">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/960px-2023_Facebook_icon.svg.png?_=20231011122028" alt="Facebook">
        </a>
        <a href="https://www.instagram.com/wix" target="_blank" aria-label="Instagram">
          <img src="https://images.icon-icons.com/2992/PNG/512/instagram_logo_icon_187313.png" alt="Instagram">
        </a>
        <a href="https://www.tiktok.com/@wix" target="_blank" aria-label="TikTok">
          <img src="E:\DEVELOPMENT\my-school-site\src\assets\tiktok-seeklogo.png" alt="TikTok">
        </a>
      </div>
      <div class="footer-contact">
        <p>вулиця Романа Ратушного, 1/2, Київ, Україна, 03110</p>
        <a href="mailto:school60kiev@gmail.com">school60kiev@gmail.com</a>
        <p>+380 (12) 345-67-89</p>
      </div>
      <div class="footer-links">
        <ul>
          <li><a href="#">Політика конфіденційності</a></li>
          <li><a href="#">Заява про доступність</a></li>
          <li><a href="#">Умови й положення</a></li>
          <li><a href="#">Правила повернення коштів</a></li>
        </ul>
      </div>
    </div>
    <div class="copyright">
      <p>© {{ currentYear }} Середня загальноосвітня школа № 60 КРД "Росток" м. Києва ім. Олександра Загребельного.</p>
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
.site-footer {
  background: #1a2b22;
  color: #fff;
  padding: 40px 0 20px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 40px;
}
.footer-links {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.footer-links ul {
  list-style: none;
  padding: 0;
}
.footer-links li {
  margin-bottom: 10px;
}
.footer-links a {
  color: #ccc;
  text-decoration: none;
}
.footer-links a:hover {
  color: #C7613C;
}
.footer-contact {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.footer-contact p {
  margin: 5px 0;
  color: #ccc;
}
.footer-social {
  color:#fff;
  display: flex;
  gap: 15px;
  align-items: center;
}
.footer-social img {
  width: 46px;
  height: 46px;
  color:#fff;
  transition: opacity 0.3s;
}
.footer-social img:hover {
  opacity: 0.7;
}
.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #3a4f42;
  font-size: 14px;
  color: #aaa;
}
.copyright a {
  color: #C7613C;
  text-decoration: none;
}
@media (max-width: 768px) {
  .footer-content { flex-direction: column; align-items: center; text-align: center; }
  .footer-social { justify-content: center; }
}
</style>