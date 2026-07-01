<template>
  <div class="manager">
    <h2>Фахівці школи</h2>
    <p class="manager-note">
      Представте практичного психолога та соціального педагога й розкажіть про їхню роботу у школі.
    </p>

    <div class="page-tabs">
      <button
        v-for="page in pages"
        :key="page.id"
        type="button"
        :class="{ active: activePageId === page.id }"
        @click="activePageId = page.id"
      >
        {{ page.title }}
      </button>
    </div>

    <div class="page-editor">
      <label class="field">
        <span>Ім'я та посада фахівця</span>
        <input v-model="activePage.specialistName" type="text" :placeholder="activeConfig.namePlaceholder" />
      </label>
      <label class="field">
        <span>Короткий вступ</span>
        <input v-model="activePage.intro" type="text" placeholder="Коротке речення для верхньої частини сторінки" />
      </label>
      <div class="field">
        <span>Розповідь про фахівця та його роботу</span>
        <RichTextEditor
          :key="activePageId"
          v-model="activePage.content"
          :content-label="activeConfig.editorLabel"
          placeholder="Представтеся та розкажіть, чим ви допомагаєте учням, батькам і педагогам..."
          @limit-change="contentOverLimit = $event.overLimit"
        />
      </div>
      <p v-if="message" class="message" :class="{ error: saveError }">{{ message }}</p>
      <button class="btn-save" type="button" :disabled="saving || contentOverLimit" @click="savePage">
        {{ saving ? 'Збереження...' : 'Зберегти сторінку' }}
      </button>
    </div>
  </div>
</template>

<script>
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import RichTextEditor from '../RichTextEditor.vue';

const pageConfigs = [
  {
    id: 'practical-psychologist',
    title: 'Практичний психолог',
    namePlaceholder: 'Ім’я, практичний психолог',
    editorLabel: 'Текст сторінки практичного психолога'
  },
  {
    id: 'social-pedagogue',
    title: 'Соціальний педагог',
    namePlaceholder: 'Ім’я, соціальний педагог',
    editorLabel: 'Текст сторінки соціального педагога'
  }
];

export default {
  name: 'InformationPagesManager',
  components: { RichTextEditor },
  data() {
    return {
      pages: pageConfigs,
      activePageId: pageConfigs[0].id,
      pageData: Object.fromEntries(pageConfigs.map(page => [
        page.id,
        { specialistName: '', intro: '', content: '' }
      ])),
      unsubscribers: [],
      saving: false,
      contentOverLimit: false,
      message: '',
      saveError: false
    };
  },
  computed: {
    activeConfig() {
      return this.pages.find(page => page.id === this.activePageId);
    },
    activePage() {
      return this.pageData[this.activePageId];
    }
  },
  watch: {
    activePageId() {
      this.contentOverLimit = false;
      this.message = '';
      this.saveError = false;
    }
  },
  mounted() {
    this.unsubscribers = this.pages.map(page =>
      onSnapshot(doc(db, 'sitePages', page.id), snapshot => {
        const data = snapshot.exists() ? snapshot.data() : {};
        this.pageData[page.id] = {
          specialistName: data.specialistName || '',
          intro: data.intro || '',
          content: data.content || ''
        };
      })
    );
  },
  beforeUnmount() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
  },
  methods: {
    async savePage() {
      if (this.contentOverLimit) {
        this.message = 'Текст перевищує безпечний ліміт Firebase.';
        this.saveError = true;
        return;
      }

      this.saving = true;
      this.message = '';
      this.saveError = false;

      try {
        await setDoc(doc(db, 'sitePages', this.activePageId), {
          ...this.activePage,
          updatedAt: Timestamp.now()
        });
        this.message = 'Сторінку успішно збережено.';
      } catch (error) {
        console.error('Information page saving error:', error);
        this.message = 'Не вдалося зберегти сторінку.';
        this.saveError = true;
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.manager {
  padding: 24px;
  background: var(--surface-elevated);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
}

.manager h2 {
  margin: 0 0 10px;
  padding-left: 16px;
  color: var(--secondary);
  border-left: 5px solid var(--secondary);
}

.manager-note {
  margin: 0 0 22px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.page-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.page-tabs button {
  padding: 10px 18px;
  color: var(--text-secondary);
  background: var(--surface-muted);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.page-tabs button.active {
  color: var(--on-primary);
  background: var(--primary);
}

.page-editor {
  padding: 20px;
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: 14px;
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
  color: var(--text-primary);
}

.field > span {
  font-weight: 700;
}

.field input {
  width: 100%;
  padding: 11px 13px;
  color: var(--text-primary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 9px;
}

.btn-save {
  padding: 10px 20px;
  color: var(--on-primary);
  background: var(--primary);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.btn-save:disabled {
  cursor: wait;
  opacity: 0.7;
}

.message {
  color: var(--primary);
  font-weight: 700;
}

.message.error {
  color: var(--secondary);
}

@media (max-width: 700px) {
  .manager,
  .page-editor {
    padding: 16px;
  }

  .page-tabs {
    flex-direction: column;
  }
}
</style>
