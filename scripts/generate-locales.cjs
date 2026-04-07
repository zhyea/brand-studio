/**
 * Builds public/_locales/<lang>/messages.json for Chrome extension i18n.
 * Run: node scripts/generate-locales.cjs
 */
const fs = require('fs');
const path = require('path');

const enUi = require('./locale-data/en-ui.cjs');
const enBg = require('./locale-data/en-bg.cjs');
const enFlat = { ...enBg, ...enUi };

const DESCRIPTIONS = {
  extName: 'Extension name shown in Chrome',
  extDescription: 'Short description for the Chrome Web Store and extensions page',
  extActionTitle: 'Tooltip for the toolbar button',
};

function toChromeMessages(flat) {
  const out = {};
  for (const [k, v] of Object.entries(flat)) {
    if (typeof v !== 'string') continue;
    out[k] = { message: v };
    if (DESCRIPTIONS[k]) out[k].description = DESCRIPTIONS[k];
  }
  return out;
}

const localeBuild = {
  en: enFlat,
  zh_CN: { ...enFlat, ...require('./locale-data/zh_CN.cjs') },
  zh_TW: { ...enFlat, ...require('./locale-data/zh_TW.cjs') },
  es: { ...enFlat, ...require('./locale-data/partial-es.cjs') },
  fr: { ...enFlat, ...require('./locale-data/partial-fr.cjs') },
  de: { ...enFlat, ...require('./locale-data/partial-de.cjs') },
  it: { ...enFlat, ...require('./locale-data/partial-it.cjs') },
  pt_BR: { ...enFlat, ...require('./locale-data/partial-pt_BR.cjs') },
  ru: { ...enFlat, ...require('./locale-data/partial-ru.cjs') },
  ja: { ...enFlat, ...require('./locale-data/partial-ja.cjs') },
  ko: { ...enFlat, ...require('./locale-data/partial-ko.cjs') },
  ar: { ...enFlat, ...require('./locale-data/partial-ar.cjs') },
  hi: { ...enFlat, ...require('./locale-data/partial-hi.cjs') },
};

const root = path.join(__dirname, '..', 'public', '_locales');
const enKeys = new Set(Object.keys(enFlat));

for (const [code, flat] of Object.entries(localeBuild)) {
  for (const k of enKeys) {
    if (!(k in flat) || typeof flat[k] !== 'string') {
      console.error(`Locale ${code} missing or invalid key: ${k}`);
      process.exit(1);
    }
  }
  for (const k of Object.keys(flat)) {
    if (!enKeys.has(k)) {
      console.error(`Locale ${code} has unknown key: ${k}`);
      process.exit(1);
    }
  }
  const dir = path.join(root, code);
  fs.mkdirSync(dir, { recursive: true });
  const messages = toChromeMessages(flat);
  fs.writeFileSync(path.join(dir, 'messages.json'), JSON.stringify(messages, null, 2), 'utf8');
  console.log('Wrote', code, Object.keys(messages).length, 'messages');
}
