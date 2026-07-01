<template>
  <div class="manager">
    <h2>Посилання на документи</h2>
    <p class="manager-note">
      Оновлюйте назви, пояснення та адреси документів, які відображаються на інформаційних сторінках сайту.
    </p>

    <div v-if="loading" class="state-box">Завантаження посилань...</div>

    <div v-else class="sections-list">
      <section v-for="section in sections" :key="section.id" class="links-section">
        <div class="section-heading">
          <div>
            <h3>{{ section.title }}</h3>
            <p>{{ section.description }}</p>
          </div>
          <button class="btn-add-link" type="button" @click="addLink(section)">
            + Додати посилання
          </button>
        </div>

        <div class="links-list">
          <article v-for="(link, index) in section.links" :key="link.id" class="link-editor">
            <div class="link-number">{{ index + 1 }}</div>
            <button
              class="remove-link"
              type="button"
              :aria-label="`Видалити посилання ${link.title || index + 1}`"
              @click="removeLink(section, index)"
            >
              ×
            </button>

            <label>
              <span>Назва документа</span>
              <input v-model="link.title" type="text" />
            </label>

            <label>
              <span>Пояснення або статус</span>
              <textarea v-model="link.description" rows="3"></textarea>
            </label>

            <label>
              <span>Посилання</span>
              <input v-model="link.url" type="url" placeholder="https://..." />
            </label>
          </article>
          <p v-if="section.links.length === 0" class="empty-links">
            Посилань поки немає.
          </p>
        </div>
      </section>
    </div>

    <p v-if="message" class="save-message" :class="{ error: saveError }">{{ message }}</p>

    <div class="form-actions">
      <button class="btn-save" type="button" :disabled="saving || loading" @click="saveLinks">
        {{ saving ? 'Збереження...' : 'Зберегти зміни' }}
      </button>
      <button class="btn-cancel" type="button" :disabled="saving || loading" @click="restoreDefaults">
        Відновити початкові
      </button>
    </div>
  </div>
</template>

<script>
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  cloneSiteLinkSections,
  mergeSiteLinkSections,
  serializeSiteLinkSections
} from '../../data/siteLinks';

export default {
  name: 'SiteLinksManager',
  data() {
    return {
      sections: cloneSiteLinkSections(),
      loading: true,
      saving: false,
      message: '',
      saveError: false,
      unsubscribeLinks: null
    };
  },
  mounted() {
    this.unsubscribeLinks = onSnapshot(
      doc(db, 'siteSettings', 'siteLinks'),
      (snapshot) => {
        const savedSections = snapshot.exists() ? snapshot.data().sections || {} : {};
        this.sections = mergeSiteLinkSections(savedSections);
        this.loading = false;
      },
      (error) => {
        console.error('Site links loading error:', error);
        this.sections = cloneSiteLinkSections();
        this.loading = false;
        this.message = 'Не вдалося завантажити збережені посилання.';
        this.saveError = true;
      }
    );
  },
  beforeUnmount() {
    if (this.unsubscribeLinks) {
      this.unsubscribeLinks();
    }
  },
  methods: {
    createId(prefix = 'link') {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return `${prefix}-${crypto.randomUUID()}`;
      }

      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    },
    addLink(section) {
      section.links.push({
        id: this.createId(section.id),
        title: '',
        description: '',
        url: ''
      });
      this.message = '';
      this.saveError = false;
    },
    removeLink(section, index) {
      const link = section.links[index];
      if (!confirm(`Видалити посилання "${link?.title || 'Без назви'}"?`)) return;

      section.links.splice(index, 1);
      this.message = 'Посилання видалено у формі. Натисніть «Зберегти зміни».';
      this.saveError = false;
    },
    restoreDefaults() {
      if (!confirm('Відновити початкові значення всіх посилань?')) return;

      this.sections = cloneSiteLinkSections();
      this.message = 'Початкові значення відновлено у формі. Натисніть «Зберегти зміни».';
      this.saveError = false;
    },
    async saveLinks() {
      const hasEmptyFields = this.sections.some(section =>
        section.links.some(link => !link.title.trim() || !link.url.trim())
      );

      if (hasEmptyFields) {
        this.message = 'Заповніть назву та адресу кожного посилання.';
        this.saveError = true;
        return;
      }

      const hasInvalidUrl = this.sections.some(section =>
        section.links.some(link => !this.isValidUrl(link.url))
      );

      if (hasInvalidUrl) {
        this.message = 'Перевірте адреси: кожне посилання має починатися з http:// або https://.';
        this.saveError = true;
        return;
      }

      this.saving = true;
      this.message = '';
      this.saveError = false;

      try {
        await setDoc(
          doc(db, 'siteSettings', 'siteLinks'),
          {
            sections: serializeSiteLinkSections(this.sections),
            updatedAt: Timestamp.now()
          }
        );
        this.message = 'Посилання успішно збережено.';
      } catch (error) {
        console.error('Site links saving error:', error);
        this.message = 'Не вдалося зберегти посилання.';
        this.saveError = true;
      } finally {
        this.saving = false;
      }
    },
    isValidUrl(value) {
      try {
        const url = new URL(String(value || '').trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.manager {
  padding: 24px;
  background: var(--surface-elevated, #ffffff);
  border-radius: 8px;
  box-shadow: var(--shadow-light, 0 1px 3px rgba(0, 0, 0, 0.05));
}

.manager h2 {
  margin: 0 0 12px;
  padding-left: 16px;
  color: var(--secondary, #C7613C);
  border-left: 5px solid var(--secondary, #C7613C);
  font-size: 1.8rem;
  font-weight: 600;
}

.manager-note {
  margin: 0 0 24px;
  color: var(--text-secondary, #4a5568);
  line-height: 1.6;
}

.state-box {
  padding: 32px;
  color: var(--text-muted, #607168);
  background: var(--surface-soft, #f8faf7);
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
  text-align: center;
}

.sections-list,
.links-list {
  display: grid;
  gap: 16px;
}

.links-section {
  overflow: hidden;
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  background: var(--surface-soft, #f8faf7);
  border-bottom: 1px solid var(--border, #d9e4dd);
}

.btn-add-link {
  flex: 0 0 auto;
  padding: 9px 16px;
  color: var(--on-primary, #ffffff);
  background: var(--primary, #2F5F48);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.section-heading h3 {
  margin: 0 0 5px;
  color: var(--text-primary, #1f352b);
  font-size: 1.2rem;
}

.section-heading p {
  margin: 0;
  color: var(--text-secondary, #485d54);
  line-height: 1.5;
}

.links-list {
  padding: 16px;
}

.link-editor {
  position: relative;
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(260px, 1fr) minmax(260px, 1fr);
  gap: 14px;
  padding: 18px 18px 18px 52px;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border, #d9e4dd);
  border-radius: 8px;
}

.link-number {
  position: absolute;
  top: 18px;
  left: 16px;
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  color: var(--on-primary, #ffffff);
  background: var(--primary, #2F5F48);
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: 700;
}

.remove-link {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 32px;
  height: 32px;
  color: var(--secondary, #C7613C);
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.55rem;
  line-height: 1;
}

.remove-link:hover {
  background: color-mix(in srgb, var(--secondary, #C7613C) 10%, transparent);
}

.empty-links {
  margin: 0;
  padding: 22px;
  color: var(--text-muted, #607168);
  text-align: center;
}

.link-editor label {
  display: grid;
  align-content: start;
  gap: 7px;
  min-width: 0;
}

.link-editor label span {
  color: var(--text-secondary, #485d54);
  font-size: 0.82rem;
  font-weight: 700;
}

.link-editor input,
.link-editor textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  color: var(--text-primary, #1f352b);
  background: var(--input-bg, #ffffff);
  border: 1px solid var(--border, #cdd9d2);
  border-radius: 6px;
  font: inherit;
}

.link-editor textarea {
  min-height: 84px;
  resize: vertical;
}

.link-editor input:focus,
.link-editor textarea:focus {
  border-color: var(--primary, #2F5F48);
  outline: 2px solid color-mix(in srgb, var(--primary, #2F5F48) 18%, transparent);
}

.save-message {
  margin: 18px 0 0;
  color: var(--primary, #2F5F48);
  font-weight: 600;
}

.save-message.error {
  color: var(--secondary, #C7613C);
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
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save {
  color: var(--on-primary, #ffffff);
  background: var(--primary, #2F5F48);
}

.btn-cancel {
  color: var(--text-secondary, #495057);
  background: var(--btn-cancel-bg, #e9ecef);
}

.btn-save:disabled,
.btn-cancel:disabled {
  cursor: wait;
  opacity: 0.7;
}

@media (max-width: 1100px) {
  .link-editor {
    grid-template-columns: 1fr 1fr;
  }

  .link-editor label:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 700px) {
  .manager {
    padding: 16px;
  }

  .link-editor {
    grid-template-columns: 1fr;
    padding: 52px 14px 14px;
  }

  .link-editor label:last-child {
    grid-column: auto;
  }

  .section-heading {
    align-items: stretch;
    flex-direction: column;
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
