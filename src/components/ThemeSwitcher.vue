<template>
  <div class="theme-switcher">
    <button 
      class="theme-toggle" 
      @click="isOpen = !isOpen" 
      :aria-expanded="isOpen"
      aria-label="Змінити тему сайту"
    >
      🎨
    </button>
    <div v-if="isOpen" class="theme-dropdown" role="menu">
      <h4>Оберіть тему</h4>
      <div class="theme-list">
        <button
          v-for="(theme, key) in themes"
          :key="key"
          class="theme-option"
          :class="{ active: currentThemeName === key }"
          @click="selectTheme(key)"
          role="menuitem"
        >
          <span class="theme-preview" :style="getPreviewStyle(theme.colors)"></span>
          <span class="theme-name">{{ theme.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue';
import { themes } from '../themes';

export default {
  name: 'ThemeSwitcher',
  setup() {
    const { currentThemeName, applyTheme } = inject('theme');
    const isOpen = ref(false);

    const selectTheme = (key) => {
      applyTheme(key);
      isOpen.value = false;
    };

    const getPreviewStyle = (colors) => {
      return {
        background: `linear-gradient(135deg, ${colors['--primary']} 50%, ${colors['--secondary']} 50%)`,
      };
    };

    return {
      isOpen,
      currentThemeName,
      themes,
      selectTheme,
      getPreviewStyle,
    };
  }
};
</script>

<style scoped>
.theme-switcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

.theme-toggle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary, #2F5F48);
  color: var(--white, #FFFFFF);
  border: 2px solid var(--border, rgba(255,255,255,0.2));
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px var(--shadow, rgba(0,0,0,0.15));
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px var(--shadow, rgba(0,0,0,0.2));
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-dropdown {
  position: absolute;
  bottom: 64px;
  right: 0;
  background: var(--white, #FFFFFF);
  border-radius: 16px;
  padding: 20px;
  min-width: 220px;
  box-shadow: 0 12px 40px var(--shadow, rgba(0,0,0,0.15));
  border: 1px solid var(--border, #E2E8F0);
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.theme-dropdown h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light, #64748B);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.theme-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  font-family: inherit;
}

.theme-option:hover {
  background: var(--primary-light, #E8F5E9);
}

.theme-option.active {
  border-color: var(--secondary, #C7613C);
  background: var(--primary-light, #E8F5E9);
}

.theme-preview {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid var(--border, #E2E8F0);
  transition: transform 0.2s;
}

.theme-option:hover .theme-preview {
  transform: scale(1.05);
}

.theme-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text, #1E293B);
}

/* Адаптивність для маленьких екранів */
@media (max-width: 480px) {
  .theme-switcher {
    bottom: 16px;
    right: 16px;
  }
  .theme-toggle {
    width: 44px;
    height: 44px;
    font-size: 20px;
  }
  .theme-dropdown {
    min-width: 180px;
    padding: 16px;
    bottom: 56px;
  }
}
</style>