<template>
  <section class="projects">
    <div class="container">
      <h2 class="section-title">Проекти</h2>
      <div class="project-card">
        <div class="project-image">
          <img src="https://static.wixstatic.com/media/62bea5_0a2bfa4c8a1845c9af2fec21e9e86fdf~mv2.jpg" alt="Sample course">
        </div>
        <div class="project-info">
          <h3>Sample course</h3>
          <p class="price">Безкоштовно</p>
          <a href="#" class="btn">Переглянути деталі</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProjectsSection'
}
</script>

<style scoped>
.projects {
  padding: 60px 0;
  background: #f0f7ff;
}
.section-title {
  font-size: 38px;
  text-align: center;
  margin-bottom: 40px;
  color: #2F5F48;
}
.project-card {
  display: flex;
  flex-wrap: wrap;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  max-width: 800px;
  margin: 0 auto;
}
.project-image {
  flex: 1;
  min-width: 250px;
}
.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.project-info {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.project-info h3 {
  font-size: 28px;
  margin-bottom: 15px;
  color: #2F5F48;
}
.price {
  font-size: 20px;
  font-weight: bold;
  color: #C7613C;
  margin-bottom: 25px;
}
.btn {
  display: inline-block;
  background: #2F5F48;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.3s;
  text-align: center;
  width: fit-content;
}
.btn:hover {
  background: #C7613C;
}
@media (max-width: 600px) {
  .project-card {
    flex-direction: column;
  }
}
</style>