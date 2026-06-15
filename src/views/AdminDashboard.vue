<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Адмін-панель</h1>
      <button @click="logout" class="logout-btn">Вийти</button>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id">
        {{ tab.name }}
      </button>
    </div>

    <div class="tab-content">
      <UsersManager v-if="activeTab === 'users'" />
      <EmployeesManager v-if="activeTab === 'employees'" />
      <AnnouncementsManager v-if="activeTab === 'announcements'" />
      <NewsManager v-if="activeTab === 'news'" />
    </div>
  </div>
</template>

<script>
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import UsersManager from '../components/admin/UsersManager.vue';
import EmployeesManager from '../components/admin/EmployeesManager.vue';
import AnnouncementsManager from '../components/admin/AnnouncementsManager.vue';
import NewsManager from '../components/admin/NewsManager.vue';

export default {
  components: { UsersManager, EmployeesManager, AnnouncementsManager, NewsManager },
  data() {
    return {
      activeTab: 'news',
      tabs: [
        { id: 'users', name: 'Користувачі' },
        { id: 'employees', name: 'Команда' },
        { id: 'announcements', name: 'Оголошення' },
        { id: 'news', name: 'Новини' }
      ]
    };
  },
  methods: {
    async logout() {
      await signOut(auth);
      this.$router.push('/admin');
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e4e8;
}
.dashboard-header h1 {
  font-size: 28px;
  color: #2F5F48;
  margin: 0;
}
.logout-btn {
  background: #c7613c;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #a34e2e;
}
.tabs {
  display: flex;
  gap: 5px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
  border-radius: 8px 8px 0 0;
}
.tab-btn.active {
  color: #2F5F48;
  background: #f0f7ff;
  border-bottom: 2px solid #C7613C;
  font-weight: bold;
}
.tab-btn:hover:not(.active) {
  color: #C7613C;
  background: #f5f5f5;
}
</style>