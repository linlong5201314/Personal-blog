import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).init({
  fallbackLng: 'zh-CN',
  resources: {
    'zh-CN': {
      translation: {
        'site.title': '我的小天地 ✨',
        'nav.about': '关于我',
        'nav.skills': '技能',
        'nav.projects': '项目'
      }
    },
    'en-US': {
      translation: {
        'site.title': 'My Little World ✨',
        'nav.about': 'About Me',
        'nav.skills': 'Skills',
        'nav.projects': 'Projects'
      }
    }
  }
}).then(() => {
  updateContent();
});

function updateContent() {
  document.title = i18next.t('site.title');
  // Further DOM updates can be added here
}

export default i18next;