import { createRouter, createWebHashHistory } from 'vue-router';   // ← використовуйте цей імпорт
import HomePage from '../views/HomePage.vue';
import AdminLogin from '../views/AdminLogin.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import AnnouncementsPage from '../views/AnnouncementsPage.vue';
import NewsPage from '../views/NewsPage.vue';
import TeamPage from '../views/TeamPage.vue';   // <-- додати
import { auth } from '../firebase';

const routes = [
  { path: '/', component: HomePage },
  { path: '/announcements', component: AnnouncementsPage },
  { path: '/news', component: NewsPage },
  { path: '/team', component: TeamPage },        // <-- додати
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