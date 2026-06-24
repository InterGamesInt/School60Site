<template>
  <div class="survey-page">
    <div class="container">
      <h1 class="page-title">Анкета учня/учениці</h1>
      <p class="page-description">
        Шановний учню / Шановна ученице! Ми проводимо дослідження, щоб вивчити стан справ у школі.
        Ваша участь є дуже важливою. Анкета анонімна.
      </p>
      <div class="survey-container">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSezViHmCerbF9Vm0XBV60mbEXsPPD4qict6Q4Rd-rX1_BZ4FA/viewform?embedded=true"
          width="100%"
          height="800"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          title="Анкета учня/учениці"
        >
          Завантаження…
        </iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SurveyStudent',
};
</script>

<style scoped>
.survey-page {
  padding: 60px 0;
  background: linear-gradient(160deg, var(--page-gradient-start, #f8fafc), var(--page-gradient-end, #eef2f5));
  min-height: 70vh;
}
.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}
.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  color: var(--text, #1e293b);
  margin-bottom: 16px;
}
.page-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: var(--secondary, #C7613C);
  margin: 12px auto 0;
  border-radius: 2px;
}
.page-description {
  text-align: center;
  font-size: 1.05rem;
  color: var(--text-light, #475569);
  max-width: 700px;
  margin: 0 auto 32px;
  line-height: 1.6;
}
.survey-container {
  background: var(--surface-elevated, #ffffff);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--card-shadow, 0 4px 12px rgba(0,0,0,0.05));
  border: 1px solid var(--border, transparent);
}
.survey-container iframe {
  display: block;
  min-height: 700px;
  width: 100%;
  border: none;
}

@media (max-width: 768px) {
  .page-title { font-size: 1.8rem; }
  .survey-container iframe { min-height: 600px; }
}
@media (max-width: 480px) {
  .survey-page { padding: 40px 0; }
  .survey-container iframe { min-height: 500px; }
}
</style>
