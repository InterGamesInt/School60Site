import { createRouter, createWebHashHistory } from 'vue-router';   // ← використовуйте цей імпорт
import HomePage from '../views/HomePage.vue';
import AdminLogin from '../views/AdminLogin.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import AnnouncementsPage from '../views/AnnouncementsPage.vue';
import NewsPage from '../views/NewsPage.vue';
import TeamPage from '../views/TeamPage.vue';   // <-- додати
import ContactsPage from '../views/ContactsPage.vue';
import SurveyStudent from '../views/SurveyStudent.vue';
import SurveyParents from '../views/SurveyParents.vue';
import SurveyTeachers from '../views/SurveyTeachers.vue';
import FoodPage from '../views/FoodPage.vue';
import AntiBullyingPage from '../views/AntiBullyingPage.vue';
import FirstGradeAdmissionPage from '../views/FirstGradeAdmissionPage.vue';
import NormativeDocumentsPage from '../views/NormativeDocumentsPage.vue';
import VacanciesPage from '../views/VacanciesPage.vue';
import StaffInfoPage from '../views/StaffInfoPage.vue';
import { auth } from '../firebase';

const routes = [
  { path: '/', component: HomePage },
  { path: '/announcements', component: AnnouncementsPage },
  { path: '/news', component: NewsPage },
  { path: '/food', component: FoodPage },
  { path: '/anti-bullying', component: AntiBullyingPage },
  { path: '/first-grade-admission', component: FirstGradeAdmissionPage },
  { path: '/regulations', component: NormativeDocumentsPage },
  { path: '/vacancies', component: VacanciesPage },
  {
    path: '/practical-psychologist',
    component: StaffInfoPage,
    props: { pageId: 'practical-psychologist' }
  },
  {
    path: '/social-pedagogue',
    component: StaffInfoPage,
    props: { pageId: 'social-pedagogue' }
  },
  { path: '/team', component: TeamPage },        // <-- додати
  { path: '/contacts', component: ContactsPage }, // <-- додати
  { path: '/survey-student', component: SurveyStudent },
  { path: '/survey-parents', component: SurveyParents },
  { path: '/survey-teachers', component: SurveyTeachers },
  { path: '/admin', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHashHistory(),   // ← має бути саме ця функція
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = auth.currentUser;
    user ? next() : next('/admin');
  } else {
    next();
  }
});

export default router;
