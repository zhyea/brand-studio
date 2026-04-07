import { createApp } from 'vue';
import App from '../App.vue';
import '../styles/shell.css';
import { applyChromeDocLang } from '../i18n-doc';

applyChromeDocLang();
try {
  document.title = chrome.i18n.getMessage('editorTitle') || 'BrandStudio';
} catch {
  document.title = 'BrandStudio';
}

createApp(App).mount('#app');
