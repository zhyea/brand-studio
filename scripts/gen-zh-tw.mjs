/**
 * Generates scripts/locale-data/zh_TW.cjs from zh_CN.cjs (OpenCC cn→tw + Taiwan wording tweaks).
 * Run: node scripts/gen-zh-tw.mjs
 */
import { createRequire } from 'module';
import { Converter } from 'opencc-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const zhCN = require('./locale-data/zh_CN.cjs');
const conv = Converter({ from: 'cn', to: 'tw' });

function polishTwString(s) {
  return s
    .replace(/插件/g, '擴充功能')
    .replace(/截取/g, '擷取')
    .replace(/工具欄/g, '工具列')
    .replace(/應用商店/g, '應用程式商店')
    .replace(/標籤頁/g, '分頁')
    .replace(/载入/g, '載入')
    .replace(/暗夜/g, '深色')
    .replace(/回退/g, '復原')
    .replace(/恢复/g, '重做')
    .replace(/線框三角/g, '外框三角');
}

const out = {};
for (const [k, v] of Object.entries(zhCN)) {
  out[k] = typeof v === 'string' ? polishTwString(conv(v)) : v;
}

const lines = ['/** Traditional Chinese (Taiwan) — full override (all keys). */', 'module.exports = {'];
for (const k of Object.keys(out).sort()) {
  const v = out[k];
  const esc = JSON.stringify(v);
  lines.push(`  ${k}: ${esc},`);
}
lines.push('};', '');
const target = path.join(__dirname, 'locale-data', 'zh_TW.cjs');
fs.writeFileSync(target, lines.join('\n'), 'utf8');
console.log('Wrote', target, Object.keys(out).length, 'keys');
