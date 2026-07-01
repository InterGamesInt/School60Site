<template>
  <div class="manager">
    <h2>Навігація сайту</h2>
    <p class="manager-note">
      Позначте пункти, які мають відображатися у верхньому меню сайту.
    </p>

    <div v-if="loading" class="state-box">Завантаження меню...</div>

    <div v-else class="navigation-list">
      <section
        v-for="item in items"
        :key="item.id"
        class="navigation-group"
        :class="{ muted: item.visible === false }"
      >
        <label class="toggle-row top-row">
          <input type="checkbox" v-model="item.visible" />
          <span class="toggle-copy">
            <strong>{{ item.label }}</strong>
            <small v-if="item.path">{{ item.path }}</small>
          </span>
        </label>

        <div v-if="item.children?.length" class="children-list">
          <label
            v-for="child in item.children"
            :key="child.id"
            class="toggle-row child-row"
            :class="{ disabled: item.visible === false }"
          >
            <input
              type="checkbox"
              v-model="child.visible"
              :disabled="item.visible === false"
            />
            <span class="toggle-copy">
              <span>{{ child.label }}</span>
              <small>{{ child.path }}</small>
            </span>
          </label>
        </div>
      </section>
    </div>

    <div class="form-actions">
      <button class="btn-save" @click="saveNavigation" :disabled="saving">
        {{ saving ? 'Збереження...' : 'Зберегти' }}
      </button>
      <button class="btn-cancel" @click="showAllItems" :disabled="saving">
        Показати все
      </button>
    </div>
  </div>
</template>

<script>
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  cloneNavigation,
  defaultNavigation,
  mergeNavigationVisibility,
  serializeNavigationVisibility
} from '../../data/defaultNavigation';

export default {
  name: 'NavigationManager',
  data() {
    return {
      items: cloneNavigation(),
      loading: true,
      saving: false,
      unsubscribeNavigation: null
    };
  },
  mounted() {
    const navigationRef = doc(db, 'siteSettings', 'navigation');

    this.unsubscribeNavigation = onSnapshot(
      navigationRef,
      (snapshot) => {
        const savedItems = snapshot.exists() ? snapshot.data().items : [];
        this.items = mergeNavigationVisibility(defaultNavigation, savedItems);
        this.loading = false;
      },
      (error) => {
        console.error('Navigation settings loading error:', error);
        this.items = cloneNavigation();
        this.loading = false;
      }
    );
  },
  beforeUnmount() {
    if (this.unsubscribeNavigation) {
      this.unsubscribeNavigation();
    }
  },
  methods: {
    showAllItems() {
      const makeVisible = (items) => items.map(item => ({
        ...item,
        visible: true,
        children: item.children ? makeVisible(item.children) : undefined
      }));

      this.items = makeVisible(this.items);
    },
    async saveNavigation() {
      this.saving = true;

      try {
        await setDoc(
          doc(db, 'siteSettings', 'navigation'),
          {
            items: serializeNavigationVisibility(this.items),
            updatedAt: Timestamp.now()
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Navigation settings saving error:', error);
        alert('Не вдалося зберегти налаштування навігації.');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.manager {
  background: var(--surface-elevated, #ffffff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-light, 0 1px 3px rgba(0, 0, 0, 0.05));
}

.manager h2 {
  margin: 0 0 12px;
  color: var(--secondary, #C7613C);
  font-weight: 600;
  font-size: 1.8rem;
  border-left: 5px solid var(--secondary, #C7613C);
  padding-left: 16px;
}

.manager-note {
  margin: 0 0 24px;
  color: var(--text-secondary, #4a5568);
  line-height: 1.6;
}

.state-box {
  padding: 32px;
  text-align: center;
  color: var(--text-muted, #607168);
  background: var(--surface-soft, #f8faf7);
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
}

.navigation-list {
  display: grid;
  gap: 16px;
}

.navigation-group {
  padding: 16px;
  background: var(--surface-soft, #f8faf7);
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.navigation-group.muted {
  opacity: 0.72;
  border-color: var(--border-color, #e9ecef);
}

.toggle-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  color: var(--text-primary, #1e293b);
}

.toggle-row input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--primary, #2F5F48);
  flex: 0 0 auto;
}

.toggle-copy {
  display: grid;
  gap: 4px;
}

.toggle-copy strong,
.toggle-copy span {
  line-height: 1.35;
}

.toggle-copy small {
  color: var(--text-muted, #607168);
  font-size: 0.82rem;
}

.top-row {
  font-size: 1.05rem;
}

.children-list {
  display: grid;
  gap: 10px;
  margin: 14px 0 0 30px;
  padding-left: 18px;
  border-left: 2px solid var(--border, #d9e4dd);
}

.child-row.disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.btn-save,
.btn-cancel {
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  border: none;
}

.btn-save {
  background: var(--primary, #2F5F48);
  color: var(--white, #ffffff);
}

.btn-save:hover:not(:disabled) {
  background: var(--primary-dark, #1e4032);
  transform: translateY(-1px);
}

.btn-cancel {
  background: var(--btn-cancel-bg, #e9ecef);
  color: var(--text-secondary, #495057);
}

.btn-cancel:hover:not(:disabled) {
  background: var(--btn-cancel-hover, #dee2e6);
}

.btn-save:disabled,
.btn-cancel:disabled {
  cursor: wait;
  opacity: 0.7;
}

@media (max-width: 700px) {
  .manager {
    padding: 16px;
  }

  .children-list {
    margin-left: 6px;
    padding-left: 14px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>
