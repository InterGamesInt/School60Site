export const defaultSiteLinkSections = [
  {
    id: 'antiBullying',
    title: 'Школа без булінгу',
    description: 'Нормативні акти та методичні матеріали на сторінці протидії булінгу.',
    links: [
      {
        id: 'bullying-law',
        title: 'Закон України № 2657-VIII щодо протидії булінгу (цькуванню)',
        description: 'Чинний. Поточна редакція - прийняття від 18.12.2018.',
        url: 'https://zakon.rada.gov.ua/laws/show/2657-19#Text'
      },
      {
        id: 'bullying-response-order',
        title: 'Наказ МОН України від 28.12.2019 № 1646: реагування на випадки булінгу та заходи виховного впливу',
        description: 'Чинний. Поточна редакція - прийняття від 28.12.2019.',
        url: 'https://zakon.rada.gov.ua/laws/show/z0111-20#Text'
      },
      {
        id: 'bullying-recommendations',
        title: 'Рекомендації для закладів освіти щодо застосування норм Закону України № 2657-VIII',
        description: 'Методичні рекомендації до Закону України "Про внесення змін до деяких законодавчих актів України щодо протидії булінгу (цькуванню)".',
        url: 'https://drive.google.com/file/d/1hRE8jdvVacpWYIOo9_Y4M0DM4w41AY05/view'
      },
      {
        id: 'bullying-safe-environment-letter',
        title: 'Лист МОН від 14.08.2020 № 1/9-436: безпечне освітнє середовище та протидія булінгу',
        description: 'Лист "Про створення безпечного освітнього середовища в закладі освіти та попередження і протидії булінгу (цькуванню)".',
        url: 'https://drive.google.com/file/d/1nTDyYVLH7KHAyJYV-rbSa_NZ_ZrEBDxA/view'
      }
    ]
  },
  {
    id: 'firstGradeAdmission',
    title: 'Правила прийому у 1-й клас',
    description: 'Документи для батьків майбутніх першокласників.',
    links: [
      {
        id: 'first-grade-school-document',
        title: 'Документ щодо прийому до 1 класу',
        description: 'Матеріал школи у Google Drive.',
        url: 'https://drive.google.com/file/d/1I3hNxjwg0qSARJ7DhSg9BmAYZAH_YN-Y/view?usp=sharing'
      },
      {
        id: 'first-grade-parent-document',
        title: 'Документ для батьків майбутніх першокласників',
        description: 'Матеріал школи у Google Drive.',
        url: 'https://drive.google.com/file/d/17Bjyzo6gFSWg8Wu9_Yofbp_bwpgkKjWr/view?usp=sharing'
      },
      {
        id: 'first-grade-additional-document',
        title: 'Додатковий документ щодо зарахування',
        description: 'Матеріал школи у Google Drive.',
        url: 'https://drive.google.com/file/d/1ECNJAjAZI0JI9yEaVxZRh2ZEdvyHFCfN/view?usp=sharing'
      },
      {
        id: 'first-grade-mon-order',
        title: 'Наказ МОН України від 16.04.2018 № 367',
        description: 'Про затвердження Порядку зарахування, відрахування та переведення учнів.',
        url: 'https://mon.gov.ua/static-objects/mon/sites/1/news/%D0%9D%D0%BE%D0%B2%D0%B8%D0%BD%D0%B8/2018/05/10/1_nakaz_367.pdf'
      },
      {
        id: 'first-grade-enrollment-procedure',
        title: 'Лист-роз’яснення щодо застосування окремих положень Порядку зарахування',
        description: 'Окремий лист не знайдено; посилання веде на чинну редакцію Порядку зарахування на сайті Верховної Ради України.',
        url: 'https://zakon.rada.gov.ua/laws/show/z0564-18#Text'
      }
    ]
  },
  {
    id: 'normativeDocuments',
    title: 'Нормативні документи',
    description: 'Основні законодавчі акти у сфері освіти.',
    links: [
      {
        id: 'education-law',
        title: 'Закон України «Про освіту» від 05.09.2017 № 2145-VIII',
        description: 'Чинний. Поточна редакція від 01.01.2026.',
        url: 'https://zakon.rada.gov.ua/laws/show/2145-19#Text'
      },
      {
        id: 'secondary-education-law',
        title: 'Закон України «Про повну загальну середню освіту» від 16.01.2020 № 463-IX',
        description: 'Чинний. Поточна редакція від 17.01.2026.',
        url: 'https://zakon.rada.gov.ua/laws/show/463-20#Text'
      }
    ]
  }
];

function cloneLink(link) {
  return {
    id: link.id,
    title: link.title,
    description: link.description,
    url: link.url
  };
}

export function cloneSiteLinkSections() {
  return defaultSiteLinkSections.map(section => ({
    ...section,
    links: section.links.map(cloneLink)
  }));
}

export function mergeSiteLinkSections(savedSections = {}) {
  return defaultSiteLinkSections.map(section => {
    const savedSection = savedSections?.[section.id] || {};
    const savedLinks = Array.isArray(savedSection.links) ? savedSection.links : [];

    return {
      ...section,
      links: section.links.map(link => {
        const savedLink = savedLinks.find(item => item?.id === link.id) || {};

        return {
          id: link.id,
          title: typeof savedLink.title === 'string' ? savedLink.title : link.title,
          description: typeof savedLink.description === 'string' ? savedLink.description : link.description,
          url: typeof savedLink.url === 'string' ? savedLink.url : link.url
        };
      })
    };
  });
}

export function serializeSiteLinkSections(sections) {
  return Object.fromEntries(
    sections.map(section => [
      section.id,
      {
        links: section.links.map(link => ({
          id: String(link.id),
          title: String(link.title || '').trim(),
          description: String(link.description || '').trim(),
          url: String(link.url || '').trim()
        }))
      }
    ])
  );
}

export function getSiteLinksForSection(sections, sectionId) {
  return sections.find(section => section.id === sectionId)?.links || [];
}
