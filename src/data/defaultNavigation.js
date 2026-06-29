export const defaultNavigation = [
  {
    id: 'home',
    label: 'Головна',
    path: '/',
    visible: true
  },
  {
    id: 'school',
    label: 'Про школу',
    visible: true,
    children: [
      { id: 'team', label: 'Команда', path: '/team', visible: true },
      { id: 'departments', label: 'Кафедри', path: '#', visible: true },
      { id: 'vacancies', label: 'Вакансії', path: '#', visible: true },
      { id: 'first-grade', label: 'Правила прийому до 1 класу', path: '/first-grade-admission', visible: true },
      { id: 'student-code', label: 'Кодекс учня', path: '#', visible: true },
      { id: 'transparency', label: 'Прозорість та інформаційна відкритість', path: '#', visible: true },
      { id: 'statute', label: 'Статут', path: '#', visible: true },
      { id: 'regulations', label: 'Нормативні документи', path: '/regulations', visible: true }
    ]
  },
  {
    id: 'education',
    label: 'Виховна робота',
    visible: true,
    children: [
      { id: 'school-today', label: 'Шкільне сьогодення', path: '#', visible: true },
      { id: 'anti-bullying', label: 'Школа без булінгу', path: '/anti-bullying', visible: true },
      { id: 'psychologist', label: 'Практичний психолог', path: '#', visible: true },
      { id: 'social-teacher', label: 'Соціальний педагог', path: '#', visible: true },
      { id: 'domestic-violence', label: 'Домашнє насильство', path: '#', visible: true },
      { id: 'student-government', label: 'Учнівське самоврядування', path: '#', visible: true },
      { id: 'life-safety', label: 'Безпека життєдіяльності', path: '#', visible: true }
    ]
  },
  {
    id: 'study',
    label: 'Навчання',
    visible: true,
    children: [
      { id: 'programs-1-4', label: 'Освітні програми 1-4 кл.', path: '#', visible: true },
      { id: 'programs-5-9', label: 'Освітні програми 5-9 кл.', path: '#', visible: true },
      { id: 'schedule', label: 'Розклад', path: '#', visible: true },
      { id: 'year-structure', label: 'Структура навчального року', path: '#', visible: true },
      { id: 'assessment', label: 'Критерії оцінювання', path: '#', visible: true }
    ]
  },
  {
    id: 'food',
    label: 'Харчування',
    path: '/food',
    visible: true
  },
  {
    id: 'news-section',
    label: 'Новини',
    visible: true,
    children: [
      { id: 'announcements', label: 'Оголошення', path: '/announcements', visible: true },
      { id: 'news', label: 'Новини', path: '/news', visible: true }
    ]
  },
  {
    id: 'feedback',
    label: "Зворотній зв'язок",
    visible: true,
    children: [
      { id: 'contacts', label: 'Контакти', path: '/contacts', visible: true },
      { id: 'survey-student', label: 'Анкета учня/учениці', path: '/survey-student', visible: true },
      { id: 'survey-parents', label: 'Анкета для батьків', path: '/survey-parents', visible: true },
      { id: 'survey-teachers', label: 'Анкета для вчителів', path: '/survey-teachers', visible: true }
    ]
  }
];

export function cloneNavigation(items = defaultNavigation) {
  return items.map(item => {
    const clonedItem = { ...item };

    if (item.children) {
      clonedItem.children = cloneNavigation(item.children);
    }

    return clonedItem;
  });
}

export function mergeNavigationVisibility(defaultItems = defaultNavigation, savedItems = []) {
  const savedById = new Map((savedItems || []).map(item => [item.id, item]));

  return defaultItems.map(item => {
    const saved = savedById.get(item.id) || {};

    const mergedItem = {
      ...item,
      visible: typeof saved.visible === 'boolean' ? saved.visible : item.visible !== false
    };

    if (item.children) {
      mergedItem.children = mergeNavigationVisibility(item.children, saved.children || []);
    }

    return mergedItem;
  });
}

export function serializeNavigationVisibility(items = []) {
  return items.map(item => {
    const serializedItem = {
      id: item.id,
      visible: item.visible !== false
    };

    if (item.children?.length) {
      serializedItem.children = serializeNavigationVisibility(item.children);
    }

    return serializedItem;
  });
}
