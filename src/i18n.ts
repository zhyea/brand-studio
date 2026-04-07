/**
 * Chrome extension i18n: uses chrome.i18n.getMessage (manifest default_locale + _locales).
 * @see https://developer.chrome.com/docs/extensions/reference/api/i18n
 */
export function t(messageName: string, substitutions?: string | string[]): string {
  try {
    if (typeof chrome !== 'undefined' && chrome.i18n?.getMessage) {
      const out = chrome.i18n.getMessage(messageName, substitutions);
      if (out) return out;
    }
  } catch {
    /* e.g. page opened outside extension context */
  }
  return messageName;
}

export function layoutNameKey(kind: string): string {
  return `layout_${kind.replace(/-/g, '_')}_name`;
}

export function layoutDescKey(kind: string): string {
  return `layout_${kind.replace(/-/g, '_')}_desc`;
}

export function textFxKey(id: string): string {
  return `text_fx_${id}`;
}

export function fontLabelKey(id: string): string {
  return `font_${id}`;
}

export function bgStyleKey(id: string): string {
  return `bg_style_${id}`;
}

export function bgSolidKey(id: string): string {
  return `bg_solid_${id}`;
}

export function bgTexKey(id: string): string {
  return `bg_tex_${id}`;
}
