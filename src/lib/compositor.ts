export type ExportSizeKey = 'thumb' | 'standard' | 'large';

/** 导出尺寸（文案由 chrome.i18n 键 export_size_* 提供） */
export const EXPORT_SIZES: Record<ExportSizeKey, { width: number; height: number }> = {
  thumb: { width: 440, height: 280 },
  standard: { width: 1280, height: 800 },
  large: { width: 1920, height: 1080 },
};

/** 可扩展：新增项即可出现在版式菜单 */
export type LayoutKind =
  | 'split-text-left'
  | 'split-text-right'
  | 'centered-text-top'
  | 'centered-text-bottom'
  | 'bleed-full'
  | 'split-narrow-left'
  | 'split-narrow-right'
  | 'stack-compact-top';

export const LAYOUT_OPTIONS: { id: LayoutKind }[] = [
  { id: 'split-text-left' },
  { id: 'split-text-right' },
  { id: 'centered-text-top' },
  { id: 'centered-text-bottom' },
  { id: 'bleed-full' },
  { id: 'split-narrow-left' },
  { id: 'split-narrow-right' },
  { id: 'stack-compact-top' },
];

/** 开源字体（需在页面中加载对应 Webfont，见 editor.html） */
export type FontFamilyId =
  | 'system'
  | 'notoSansSc'
  | 'lxgwWenkai'
  | 'zcoolKuaiLe'
  | 'maShanZheng';

export const FONT_OPTIONS: { id: FontFamilyId }[] = [
  { id: 'system' },
  { id: 'notoSansSc' },
  { id: 'lxgwWenkai' },
  { id: 'zcoolKuaiLe' },
  { id: 'maShanZheng' },
];

export function fontCssStack(id: FontFamilyId): string {
  switch (id) {
    case 'notoSansSc':
      return '"Noto Sans SC", system-ui, sans-serif';
    case 'lxgwWenkai':
      return '"LXGW WenKai", "Noto Sans SC", serif';
    case 'zcoolKuaiLe':
      return '"ZCOOL KuaiLe", "Noto Sans SC", sans-serif';
    case 'maShanZheng':
      return '"Ma Shan Zheng", "Noto Sans SC", serif';
    default:
      return 'system-ui, -apple-system, "Segoe UI", sans-serif';
  }
}

export type BgCategory = 'style' | 'image' | 'solid';

/** 渐变样式（含暗色与亮色组） */
export type BgStyleId =
  | 'aurora'
  | 'sunset'
  | 'emerald'
  | 'rose'
  | 'electric'
  | 'lava'
  | 'mist'
  | 'lime'
  | 'cobalt'
  | 'daySpring'
  | 'peachGlow'
  | 'lemonFizz'
  | 'mintIce'
  | 'lavenderAir'
  | 'aquaPop'
  | 'candyFloss';

export const BG_STYLE_LIST: { id: BgStyleId }[] = [
  { id: 'aurora' },
  { id: 'sunset' },
  { id: 'emerald' },
  { id: 'rose' },
  { id: 'electric' },
  { id: 'lava' },
  { id: 'mist' },
  { id: 'lime' },
  { id: 'cobalt' },
  { id: 'daySpring' },
  { id: 'peachGlow' },
  { id: 'lemonFizz' },
  { id: 'mintIce' },
  { id: 'lavenderAir' },
  { id: 'aquaPop' },
  { id: 'candyFloss' },
];

/** 纯色预设 + 自定义 */
export type BgSolidId =
  | 'linen'
  | 'cloud'
  | 'ocean'
  | 'midnight'
  | 'ink'
  | 'blossom'
  | 'mint'
  | 'amber'
  | 'daffodil'
  | 'shellPink'
  | 'iceBlue'
  | 'sprout'
  | 'wisteria'
  | 'sand'
  | 'powder'
  | 'custom';

export const BG_SOLID_LIST: { id: BgSolidId; hex: string }[] = [
  { id: 'linen', hex: '#f5f5f4' },
  { id: 'cloud', hex: '#f8fafc' },
  { id: 'ocean', hex: '#0c4a6e' },
  { id: 'midnight', hex: '#1e293b' },
  { id: 'ink', hex: '#0f172a' },
  { id: 'blossom', hex: '#fce7f3' },
  { id: 'mint', hex: '#ecfdf5' },
  { id: 'amber', hex: '#fffbeb' },
  { id: 'daffodil', hex: '#fef9c3' },
  { id: 'shellPink', hex: '#ffe4e6' },
  { id: 'iceBlue', hex: '#e0f2fe' },
  { id: 'sprout', hex: '#dcfce7' },
  { id: 'wisteria', hex: '#ede9fe' },
  { id: 'sand', hex: '#faf5f0' },
  { id: 'powder', hex: '#fdf4ff' },
  { id: 'custom', hex: '#1e3a5f' },
];

/** 内置纹理（程序绘制） */
export type BgBuiltinImageId =
  | 'mesh1'
  | 'mesh2'
  | 'noise'
  | 'stripes'
  | 'dots'
  | 'softAurora'
  | 'softSunset'
  | 'grid'
  | 'waves'
  | 'pastelMesh'
  | 'sunSpeckle'
  | 'chalkLines'
  | 'bubbleField'
  | 'springBloom'
  | 'citrusSlice'
  | 'aquaRipple'
  | 'bearGrid';

export const BG_BUILTIN_IMAGE_LIST: { id: BgBuiltinImageId }[] = [
  { id: 'mesh1' },
  { id: 'mesh2' },
  { id: 'noise' },
  { id: 'stripes' },
  { id: 'dots' },
  { id: 'softAurora' },
  { id: 'softSunset' },
  { id: 'grid' },
  { id: 'waves' },
  { id: 'pastelMesh' },
  { id: 'sunSpeckle' },
  { id: 'chalkLines' },
  { id: 'bubbleField' },
  { id: 'springBloom' },
  { id: 'citrusSlice' },
  { id: 'aquaRipple' },
  { id: 'bearGrid' },
];

export type TextEffect =
  | 'solid'
  | 'gradient'
  | 'metallic'
  | 'crystal'
  | 'neon'
  | 'outline'
  | 'emboss'
  | 'duotone'
  | 'shadowPop';

/** 文案在文本框内的水平对齐（与 CSS text-align 一致） */
export type TextLayerAlign = 'left' | 'center' | 'right';

export interface TextLayerState {
  text: string;
  /** 左上角归一化坐标 0~1（相对整画布） */
  nx: number;
  ny: number;
  /** 文本区域宽度占画布比例 */
  nw: number;
  /** 以高度 800 为基准的像素字号，导出时按 H 缩放 */
  fontSize: number;
  fontId: FontFamilyId;
  color: string;
  opacity: number;
  effect: TextEffect;
  bold: boolean;
  /** 多行文案在框内的水平对齐 */
  textAlign: TextLayerAlign;
}

type TextBoxGeom = Pick<TextLayerState, 'nx' | 'ny' | 'nw'>;

/**
 * 与 compositeLayoutScreenshot 中的 padX/padY、split、splitNarrow 等比例一致，
 * 切换版式时用来把主/副标题框摆到对应文案区内。
 */
export function defaultTextBoxLayoutForKind(kind: LayoutKind): {
  title: TextBoxGeom;
  subtitle: TextBoxGeom;
} {
  const padX = 0.05;
  const padY = 0.06;
  const split = 0.46;
  const splitNarrow = 0.34;

  switch (kind) {
    case 'split-text-right': {
      const leftW = split - padX * 1.1;
      const imgEnd = padX + leftW;
      const nx = imgEnd + 0.02;
      const nw = 1 - padX - nx;
      return {
        title: { nx, ny: 0.12, nw },
        subtitle: { nx, ny: 0.48, nw },
      };
    }
    case 'split-text-left': {
      const shotX = split + padX * 0.35;
      const nx = padX + 0.01;
      const nw = shotX - nx - 0.02;
      return {
        title: { nx, ny: 0.12, nw },
        subtitle: { nx, ny: 0.48, nw },
      };
    }
    case 'centered-text-top': {
      const nx = padX + 0.01;
      const nw = 1 - padX * 2 - 0.02;
      return {
        title: { nx, ny: padY + 0.01, nw },
        subtitle: { nx, ny: padY + 0.11, nw },
      };
    }
    case 'centered-text-bottom': {
      const nx = padX + 0.01;
      const nw = 1 - padX * 2 - 0.02;
      const textH = Math.min(0.22, 160 / 800);
      const bandTop = 1 - padY - textH - 0.02;
      return {
        title: { nx, ny: bandTop, nw },
        subtitle: { nx, ny: bandTop + 0.11, nw },
      };
    }
    case 'bleed-full': {
      return {
        title: { nx: 0.05, ny: 0.06, nw: 0.9 },
        subtitle: { nx: 0.05, ny: 0.78, nw: 0.9 },
      };
    }
    case 'split-narrow-left': {
      const shotX = splitNarrow + padX * 0.35;
      const nx = padX + 0.01;
      const nw = shotX - nx - 0.025;
      return {
        title: { nx, ny: 0.1, nw },
        subtitle: { nx, ny: 0.45, nw },
      };
    }
    case 'split-narrow-right': {
      const leftW = 0.72 - padX * 1.15;
      const imgEnd = padX + leftW;
      const nx = imgEnd + 0.015;
      const nw = 1 - padX - nx;
      return {
        title: { nx, ny: 0.1, nw },
        subtitle: { nx, ny: 0.45, nw },
      };
    }
    case 'stack-compact-top': {
      const nx = padX + 0.01;
      const nw = 1 - padX * 2 - 0.02;
      return {
        title: { nx, ny: padY + 0.01, nw },
        subtitle: { nx, ny: padY + 0.095, nw },
      };
    }
  }
}

export function defaultTitleLayer(): TextLayerState {
  const g = defaultTextBoxLayoutForKind('centered-text-bottom').title;
  return {
    text: '',
    ...g,
    fontSize: 32,
    fontId: 'notoSansSc',
    color: '#ffffff',
    opacity: 1,
    effect: 'solid',
    bold: true,
    textAlign: 'left',
  };
}

export function defaultSubtitleLayer(): TextLayerState {
  const g = defaultTextBoxLayoutForKind('centered-text-bottom').subtitle;
  return {
    text: '',
    ...g,
    fontSize: 17,
    fontId: 'notoSansSc',
    color: '#e2e8f0',
    opacity: 0.92,
    effect: 'solid',
    bold: false,
    textAlign: 'left',
  };
}

/** 箭头头部形状（与线条样式独立） */
export type ArrowHeadStyleId = 'triangle' | 'barbed' | 'chevron' | 'outline' | 'compact';

export const ARROW_HEAD_IDS: ArrowHeadStyleId[] = [
  'triangle',
  'barbed',
  'chevron',
  'outline',
  'compact',
];

/** 箭杆路径样式 */
export type ArrowLineStyleId = 'straight' | 'dashed' | 'double' | 'curved';

export const ARROW_LINE_IDS: ArrowLineStyleId[] = ['straight', 'dashed', 'double', 'curved'];

export interface ArrowAnnotation {
  id: string;
  /** 归一化 0–1，相对导出画布 */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** 曲线箭杆二次贝塞尔控制点（归一化）；仅 curved 时读取，缺省为弦中点法向偏移 */
  curveControlNx?: number;
  curveControlNy?: number;
  color: string;
  /** 线宽 ≈ strokeWidthNorm × min(W,H) */
  strokeWidthNorm: number;
  headStyle: ArrowHeadStyleId;
  lineStyle: ArrowLineStyleId;
  opacity: number;
}

const HEAD_LEN_SCALE: Record<ArrowHeadStyleId, number> = {
  triangle: 1,
  barbed: 1.06,
  chevron: 1,
  outline: 1,
  compact: 0.72,
};

function clampArrowAnnotation(ann: ArrowAnnotation): ArrowAnnotation {
  if (!(ARROW_HEAD_IDS as readonly string[]).includes(ann.headStyle)) ann.headStyle = 'triangle';
  if (!(ARROW_LINE_IDS as readonly string[]).includes(ann.lineStyle)) ann.lineStyle = 'straight';
  if (typeof ann.curveControlNx === 'number')
    ann.curveControlNx = Math.min(1, Math.max(0, ann.curveControlNx));
  if (typeof ann.curveControlNy === 'number')
    ann.curveControlNy = Math.min(1, Math.max(0, ann.curveControlNy));
  return ann;
}

/** 从旧版单字段 style 迁移 */
export function normalizeArrowAnnotation(raw: Record<string, unknown>): ArrowAnnotation {
  const base = defaultArrowAnnotation();
  const headOk = (h: unknown): h is ArrowHeadStyleId =>
    typeof h === 'string' && (ARROW_HEAD_IDS as string[]).includes(h);
  const lineOk = (l: unknown): l is ArrowLineStyleId =>
    typeof l === 'string' && (ARROW_LINE_IDS as string[]).includes(l);
  const num01 = (v: unknown): number | undefined =>
    typeof v === 'number' && Number.isFinite(v) ? v : undefined;

  const rawLine = raw.lineStyle === 'coil' ? 'straight' : raw.lineStyle;
  if (headOk(raw.headStyle) && lineOk(rawLine)) {
    const cnx = num01(raw.curveControlNx as unknown);
    const cny = num01(raw.curveControlNy as unknown);
    const {
      curveControlNx: _cx,
      curveControlNy: _cy,
      ...rawRest
    } = raw as Record<string, unknown>;
    return clampArrowAnnotation({
      ...base,
      ...rawRest,
      headStyle: raw.headStyle,
      lineStyle: rawLine as ArrowLineStyleId,
      ...(cnx !== undefined && cny !== undefined ? { curveControlNx: cnx, curveControlNy: cny } : {}),
    } as ArrowAnnotation);
  }

  const old = raw.style as string | undefined;
  let headStyle: ArrowHeadStyleId = 'triangle';
  let lineStyle: ArrowLineStyleId = 'straight';
  if (old === 'outline') {
    headStyle = 'outline';
  } else if (old === 'dashed') {
    lineStyle = 'dashed';
  } else if (old === 'double') {
    lineStyle = 'double';
  } else if (old === 'curved') {
    lineStyle = 'curved';
  } else if (old === 'coil') {
    lineStyle = 'straight';
  }

  const { style: _s, ...rest } = raw as Record<string, unknown> & { style?: unknown };
  return clampArrowAnnotation({
    ...base,
    ...rest,
    headStyle,
    lineStyle,
  } as ArrowAnnotation);
}

export function defaultArrowAnnotation(overrides?: Partial<ArrowAnnotation>): ArrowAnnotation {
  return {
    id: overrides?.id ?? `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    x1: 0.38,
    y1: 0.48,
    x2: 0.62,
    y2: 0.48,
    color: '#ef4444',
    strokeWidthNorm: 0.0045,
    headStyle: 'triangle',
    lineStyle: 'straight',
    opacity: 1,
    ...overrides,
  };
}

/** 箭杆末端与箭头长度（像素），导出与预览共用 */
/** 曲线箭杆控制点（像素）；无自定义控制点时与历史默认一致 */
export function arrowCurveControlPixels(a: ArrowAnnotation, pw: number, ph: number): { cx: number; cy: number } {
  const g = arrowGeometryPixels(a, pw, ph);
  const { x1, y1, bx, by, ux, uy } = g;
  const m = Math.min(pw, ph);
  if (typeof a.curveControlNx === 'number' && typeof a.curveControlNy === 'number') {
    return { cx: a.curveControlNx * pw, cy: a.curveControlNy * ph };
  }
  const mx = (x1 + bx) / 2;
  const my = (y1 + by) / 2;
  return { cx: mx - uy * m * 0.06, cy: my + ux * m * 0.06 };
}

export function arrowCurveControlNorm(a: ArrowAnnotation, pw: number, ph: number): { nx: number; ny: number } {
  const p = arrowCurveControlPixels(a, pw, ph);
  return { nx: p.cx / pw, ny: p.cy / ph };
}

export function arrowGeometryPixels(
  a: Pick<ArrowAnnotation, 'x1' | 'y1' | 'x2' | 'y2' | 'headStyle' | 'strokeWidthNorm'>,
  pw: number,
  ph: number,
): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bx: number;
  by: number;
  ux: number;
  uy: number;
  headLen: number;
  angle: number;
  sw: number;
} {
  const x1 = a.x1 * pw;
  const y1 = a.y1 * ph;
  const x2 = a.x2 * pw;
  const y2 = a.y2 * ph;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const angle = Math.atan2(dy, dx);
  const m = Math.min(pw, ph);
  const sw = Math.max(1, a.strokeWidthNorm * m);
  const baseHead = Math.max(sw * 3.2, len * 0.12);
  const headLen = baseHead * HEAD_LEN_SCALE[a.headStyle];
  const shorten = headLen * 0.92;
  const bx = x2 - ux * shorten;
  const by = y2 - uy * shorten;
  return { x1, y1, x2, y2, bx, by, ux, uy, headLen, angle, sw };
}

export interface CompositeOptions {
  width: number;
  height: number;
  screenshot: HTMLImageElement;
  layoutKind: LayoutKind;
  bgCategory: BgCategory;
  bgStyleId: BgStyleId;
  bgSolidId: BgSolidId;
  solidCustomHex: string;
  bgBuiltinImageId: BgBuiltinImageId;
  /** 预加载的内置位图纹理（如 bearGrid）；未就绪时回退到程序绘制 */
  builtinTextureImages?: Partial<Record<BgBuiltinImageId, HTMLImageElement>>;
  /** 背景图分类下用户上传；与 bgCategory==='image' 且非内置时共用 */
  customBgImage: HTMLImageElement | null;
  titleLayer: TextLayerState;
  subtitleLayer: TextLayerState;
  /** 指向、标注箭头等（画在文字图层之上） */
  arrows?: ArrowAnnotation[];
  /** 预览画布由 DOM/SVG 叠加箭头时为 true，避免与交互层重复绘制 */
  skipArrows?: boolean;
  /** 预览时只画底图+截图，文字由 DOM 叠加（便于拖动） */
  skipText?: boolean;
  /** 在版式截图区域外绘制浏览器窗口装饰（标题栏、地址栏等） */
  embedBrowserFrame?: boolean;
  /** 浏览器框主题色（外框与标题栏区域） */
  embedBrowserChromeColor?: string;
}

export type ScreenshotEmbedOptions = {
  embedBrowser: boolean;
  browserChromeColor: string;
};

function hexToRgbSafe(hex: string): { r: number; g: number; b: number } {
  let h = hex.trim();
  if (h.startsWith('#')) h = h.slice(1);
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (h.length !== 6 || !/^[0-9a-f]+$/i.test(h)) {
    return { r: 75, g: 85, b: 99 };
  }
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToCss({ r, g, b }: { r: number; g: number; b: number }, a = 1): string {
  return `rgba(${r},${g},${b},${a})`;
}

function shadeRgb(
  rgb: { r: number; g: number; b: number },
  amount: number,
): { r: number; g: number; b: number } {
  const t = amount >= 0 ? 255 : 0;
  const f = Math.abs(amount);
  return {
    r: Math.round(rgb.r + (t - rgb.r) * f),
    g: Math.round(rgb.g + (t - rgb.g) * f),
    b: Math.round(rgb.b + (t - rgb.b) * f),
  };
}

function fillStyleGradient(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  id: BgStyleId,
): void {
  let g: CanvasGradient;
  switch (id) {
    case 'aurora':
      g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#0f172a');
      g.addColorStop(0.45, '#312e81');
      g.addColorStop(1, '#5b21b6');
      break;
    case 'sunset':
      g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#f97316');
      g.addColorStop(0.5, '#ec4899');
      g.addColorStop(1, '#6366f1');
      break;
    case 'emerald':
      g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#064e3b');
      g.addColorStop(0.5, '#059669');
      g.addColorStop(1, '#a7f3d0');
      break;
    case 'rose':
      g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#4c0519');
      g.addColorStop(0.5, '#be185d');
      g.addColorStop(1, '#fbcfe8');
      break;
    case 'electric':
      g = ctx.createLinearGradient(0, 0, w, w);
      g.addColorStop(0, '#06b6d4');
      g.addColorStop(0.5, '#a855f7');
      g.addColorStop(1, '#ec4899');
      break;
    case 'lava':
      g = ctx.createRadialGradient(w * 0.3, h * 0.8, 0, w * 0.5, h * 0.5, w * 0.9);
      g.addColorStop(0, '#fbbf24');
      g.addColorStop(0.35, '#ea580c');
      g.addColorStop(1, '#1c1917');
      break;
    case 'mist':
      g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, '#4c1d95');
      g.addColorStop(0.5, '#7c3aed');
      g.addColorStop(1, '#c4b5fd');
      break;
    case 'lime':
      g = ctx.createLinearGradient(0, h, w, 0);
      g.addColorStop(0, '#14532d');
      g.addColorStop(0.5, '#84cc16');
      g.addColorStop(1, '#fef08a');
      break;
    case 'daySpring':
      g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#fffbeb');
      g.addColorStop(0.45, '#fef08a');
      g.addColorStop(1, '#a5f3fc');
      break;
    case 'peachGlow':
      g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#fff1f2');
      g.addColorStop(0.4, '#fda4af');
      g.addColorStop(1, '#ffe4e6');
      break;
    case 'lemonFizz':
      g = ctx.createLinearGradient(0, h, w, 0);
      g.addColorStop(0, '#fefce8');
      g.addColorStop(0.5, '#fde047');
      g.addColorStop(1, '#ecfccb');
      break;
    case 'mintIce':
      g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#ecfdf5');
      g.addColorStop(0.45, '#6ee7b7');
      g.addColorStop(1, '#cffafe');
      break;
    case 'lavenderAir':
      g = ctx.createLinearGradient(w, 0, 0, h);
      g.addColorStop(0, '#faf5ff');
      g.addColorStop(0.5, '#d8b4fe');
      g.addColorStop(1, '#e0e7ff');
      break;
    case 'aquaPop':
      g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, '#f0f9ff');
      g.addColorStop(0.35, '#38bdf8');
      g.addColorStop(0.7, '#a5f3fc');
      g.addColorStop(1, '#e0f2fe');
      break;
    case 'candyFloss':
      g = ctx.createRadialGradient(w * 0.35, h * 0.35, 0, w * 0.5, h * 0.5, w * 0.75);
      g.addColorStop(0, '#fdf4ff');
      g.addColorStop(0.4, '#f9a8d4');
      g.addColorStop(0.75, '#ddd6fe');
      g.addColorStop(1, '#e0f2fe');
      break;
    case 'cobalt':
      g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#172554');
      g.addColorStop(0.5, '#1d4ed8');
      g.addColorStop(1, '#38bdf8');
      break;
    default:
      g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#172554');
      g.addColorStop(0.5, '#1d4ed8');
      g.addColorStop(1, '#38bdf8');
      break;
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function solidColorFor(id: BgSolidId, customHex: string): string {
  if (id === 'custom') return customHex;
  const row = BG_SOLID_LIST.find((x) => x.id === id);
  return row?.hex ?? '#f5f5f4';
}

function drawImageCover(ctx: CanvasRenderingContext2D, w: number, h: number, img: HTMLImageElement): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawBuiltinTexture(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  id: BgBuiltinImageId,
): void {
  ctx.save();
  switch (id) {
    case 'mesh1': {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#1e1b4b');
      g.addColorStop(0.35, '#4c1d95');
      g.addColorStop(0.7, '#0e7490');
      g.addColorStop(1, '#134e4a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < 12; i++) {
        const gy = ctx.createLinearGradient(0, (i * h) / 12, w, (i * h) / 12 + 80);
        gy.addColorStop(0, 'transparent');
        gy.addColorStop(0.5, 'rgba(255,255,255,0.15)');
        gy.addColorStop(1, 'transparent');
        ctx.fillStyle = gy;
        ctx.fillRect(0, (i * h) / 12, w, 80);
      }
      break;
    }
    case 'mesh2': {
      const g = ctx.createRadialGradient(w * 0.2, h * 0.2, 0, w * 0.5, h * 0.5, w * 0.8);
      g.addColorStop(0, '#831843');
      g.addColorStop(0.4, '#3730a3');
      g.addColorStop(1, '#0f172a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'noise': {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 8000; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
      break;
    }
    case 'stripes': {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(148,163,184,0.12)';
      ctx.lineWidth = 2;
      for (let x = -h; x < w + h; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.stroke();
      }
      break;
    }
    case 'dots': {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#312e81');
      g.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      for (let y = 0; y < h; y += 20) {
        for (let x = (y % 40) / 2; x < w; x += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'softAurora': {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#1e1b4b');
      g.addColorStop(0.4, '#6366f1');
      g.addColorStop(0.7, '#a78bfa');
      g.addColorStop(1, '#38bdf8');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.4;
      const g2 = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, w * 0.5);
      g2.addColorStop(0, 'rgba(255,255,255,0.5)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'softSunset': {
      const g = ctx.createLinearGradient(0, h * 0.3, w, h);
      g.addColorStop(0, '#fef3c7');
      g.addColorStop(0.4, '#fb923c');
      g.addColorStop(0.7, '#db2777');
      g.addColorStop(1, '#4c1d95');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'grid': {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(148,163,184,0.15)';
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      break;
    }
    case 'pastelMesh': {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#fce7f3');
      g.addColorStop(0.33, '#e0f2fe');
      g.addColorStop(0.66, '#fef9c3');
      g.addColorStop(1, '#dcfce7');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(244,114,182,0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      break;
    }
    case 'sunSpeckle': {
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w * 0.75, h * 0.2, 0, w * 0.75, h * 0.2, w * 0.5);
      g.addColorStop(0, 'rgba(253,224,71,0.45)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 1200; i++) {
        ctx.fillStyle = `rgba(251,191,36,${0.08 + (i % 7) * 0.02})`;
        ctx.fillRect((i * 97) % w, (i * 53) % h, 2, 2);
      }
      break;
    }
    case 'chalkLines': {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(96,165,250,0.18)';
      ctx.lineWidth = 2;
      for (let x = -h; x < w + h; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h * 0.9, h);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(244,114,182,0.14)';
      for (let x = -h; x < w + h; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x + 16, 0);
        ctx.lineTo(x + 16 + h * 0.9, h);
        ctx.stroke();
      }
      break;
    }
    case 'bubbleField': {
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#e0f2fe');
      bg.addColorStop(1, '#fce7f3');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      for (let i = 0; i < 40; i++) {
        const cx = ((i * 137) % (w + 80)) - 20;
        const cy = ((i * 89) % (h + 80)) - 20;
        const rr = 12 + (i % 5) * 8;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'springBloom': {
      const g = ctx.createLinearGradient(0, h * 0.2, w, h);
      g.addColorStop(0, '#fef3c7');
      g.addColorStop(0.4, '#fbcfe8');
      g.addColorStop(0.75, '#a7f3d0');
      g.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 24; i++) {
        const gx = ctx.createRadialGradient(
          ((i * 173) % w) + 20,
          ((i * 97) % h) + 20,
          0,
          ((i * 173) % w) + 20,
          ((i * 97) % h) + 20,
          80 + (i % 4) * 20,
        );
        gx.addColorStop(0, 'rgba(255,255,255,0.9)');
        gx.addColorStop(1, 'transparent');
        ctx.fillStyle = gx;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;
      break;
    }
    case 'citrusSlice': {
      ctx.fillStyle = '#fff7ed';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 14; i++) {
        const g = ctx.createLinearGradient(w / 2, h / 2, w * 0.5 + Math.cos(i / 14 * Math.PI * 2) * w, h * 0.5 + Math.sin(i / 14 * Math.PI * 2) * h);
        g.addColorStop(0, 'rgba(251,146,60,0.35)');
        g.addColorStop(0.5, 'rgba(253,224,71,0.2)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      break;
    }
    case 'aquaRipple': {
      ctx.fillStyle = '#ecfeff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(6,182,212,0.22)';
      ctx.lineWidth = 2;
      for (let r = 20; r < Math.max(w, h); r += 36) {
        ctx.beginPath();
        ctx.arc(w * 0.45, h * 0.42, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case 'bearGrid': {
      ctx.fillStyle = '#fefce8';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)';
      ctx.lineWidth = 1;
      const step = Math.max(14, Math.round(Math.min(w, h) / 26));
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      break;
    }
    case 'waves': {
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const oy = (i * h) / 8;
        for (let x = 0; x <= w; x += 8) {
          const y = oy + Math.sin(x / 40 + i) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      break;
    }
    default: {
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const oy = (i * h) / 8;
        for (let x = 0; x <= w; x += 8) {
          const y = oy + Math.sin(x / 40 + i) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      break;
    }
  }
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, o: CompositeOptions): void {
  const { bgCategory, bgStyleId, bgSolidId, solidCustomHex, bgBuiltinImageId, customBgImage, builtinTextureImages } =
    o;
  if (bgCategory === 'style') {
    fillStyleGradient(ctx, w, h, bgStyleId);
    return;
  }
  if (bgCategory === 'solid') {
    ctx.fillStyle = solidColorFor(bgSolidId, solidCustomHex);
    ctx.fillRect(0, 0, w, h);
    return;
  }
  /* image */
  if (customBgImage && customBgImage.complete && customBgImage.naturalWidth) {
    drawImageCover(ctx, w, h, customBgImage);
    return;
  }
  const builtinImg = builtinTextureImages?.[bgBuiltinImageId];
  if (builtinImg && builtinImg.complete && builtinImg.naturalWidth) {
    drawImageCover(ctx, w, h, builtinImg);
    return;
  }
  drawBuiltinTexture(ctx, w, h, bgBuiltinImageId);
}

type ScreenshotRegionValign = 'center' | 'bottom';

/** 单次巨幅缩小易产生柔边；分步缩小以保留更多高频细节 */
const SCREENSHOT_DOWNSCALE_STEP = 1.72;

/**
 * 将截图绘制到目标矩形（像素对齐）。在需要明显缩小时使用中间画布分步缩小再贴到 ctx。
 */
function drawScreenshotScaled(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  destX: number,
  destY: number,
  destW: number,
  destH: number,
): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  const tw = Math.max(1, Math.round(destW));
  const th = Math.max(1, Math.round(destH));
  const dx = Math.round(destX);
  const dy = Math.round(destY);

  if (iw <= tw * SCREENSHOT_DOWNSCALE_STEP && ih <= th * SCREENSHOT_DOWNSCALE_STEP) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, iw, ih, dx, dy, tw, th);
    return;
  }

  let readFrom: CanvasImageSource = img;
  let rw = iw;
  let rh = ih;

  while (rw > tw * SCREENSHOT_DOWNSCALE_STEP || rh > th * SCREENSHOT_DOWNSCALE_STEP) {
    const nw = Math.max(tw, Math.floor(rw / 2));
    const nh = Math.max(th, Math.floor(rh / 2));
    const next = document.createElement('canvas');
    next.width = nw;
    next.height = nh;
    const nctx = next.getContext('2d');
    if (!nctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, iw, ih, dx, dy, tw, th);
      return;
    }
    nctx.imageSmoothingEnabled = true;
    nctx.imageSmoothingQuality = 'high';
    nctx.drawImage(readFrom, 0, 0, rw, rh, 0, 0, nw, nh);
    readFrom = next;
    rw = nw;
    rh = nh;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(readFrom, 0, 0, rw, rh, dx, dy, tw, th);
}

function drawScreenshotRegion(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  img: HTMLImageElement,
  x: number,
  y: number,
  regionW: number,
  regionH: number,
  embed?: ScreenshotEmbedOptions,
  screenshotValign: ScreenshotRegionValign = 'center',
): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  if (!embed?.embedBrowser) {
    /** 不超过 1，避免低分辨率截图被放大填满区域导致发糊 */
    const scale = Math.min(1, regionW / iw, regionH / ih);
    const dwFit = iw * scale;
    const dhFit = ih * scale;
    const tw = Math.max(1, Math.round(dwFit));
    const th = Math.max(1, Math.round(dhFit));
    const dx = Math.round(x + (regionW - tw) / 2);
    const dy =
      screenshotValign === 'bottom'
        ? Math.round(y + regionH - th)
        : Math.round(y + (regionH - th) / 2);
    const corner = Math.max(8, Math.min(20, W * 0.015));
    ctx.save();
    roundRect(ctx, dx, dy, tw, th, corner);
    ctx.clip();
    drawScreenshotScaled(ctx, img, dx, dy, tw, th);
    ctx.restore();
    ctx.save();
    roundRect(ctx, dx, dy, tw, th, corner);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = Math.max(1, W / 640);
    ctx.stroke();
    ctx.restore();
    return;
  }

  const chromeHex = embed.browserChromeColor?.trim() || '#4b5563';
  const base = hexToRgbSafe(chromeHex);

  /** 视口与截图同宽高比；窗口总高 = 标签栏 + 地址栏 + 间距 + 视口 + 底边距，整体在版式格内等比缩放并居中 */
  let mLR = Math.max(1, regionW * 0.006);
  let mBottom = Math.max(1, regionW * 0.006);
  let gTabUrl = Math.max(1, regionW * 0.003);
  let gUrlContent = Math.max(1, regionW * 0.004);
  let tabH = Math.min(Math.max(regionH * 0.062, 22), regionH * 0.12);
  let urlRowH = Math.min(Math.max(regionH * 0.052, 16), regionH * 0.1);

  let cw = regionW - 2 * mLR;
  let ch = cw * (ih / iw);
  let chromeH = tabH + gTabUrl + urlRowH + gUrlContent;
  let oh = chromeH + ch + mBottom;
  let ow = cw + 2 * mLR;

  if (oh > regionH || ow > regionW) {
    const f = Math.min(regionW / ow, regionH / oh);
    mLR *= f;
    mBottom *= f;
    gTabUrl *= f;
    gUrlContent *= f;
    tabH *= f;
    urlRowH *= f;
    cw *= f;
    ch *= f;
    chromeH = tabH + gTabUrl + urlRowH + gUrlContent;
    oh = chromeH + ch + mBottom;
    ow = cw + 2 * mLR;
  }

  const ox = x + (regionW - ow) / 2;
  const oy =
    screenshotValign === 'bottom' ? y + regionH - oh : y + (regionH - oh) / 2;
  const outerR = Math.max(6, Math.min(18, Math.min(ow, oh) * 0.022));
  const rTop = Math.min(outerR, tabH * 0.45, ow * 0.04);

  ctx.save();
  roundRect(ctx, ox, oy, ow, oh, outerR);
  ctx.fillStyle = rgbToCss(base);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = Math.max(1, W / 720);
  ctx.stroke();
  ctx.restore();

  const titleShade = shadeRgb(base, -0.12);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ox + rTop, oy);
  ctx.lineTo(ox + ow - rTop, oy);
  ctx.quadraticCurveTo(ox + ow, oy, ox + ow, oy + rTop);
  ctx.lineTo(ox + ow, oy + tabH);
  ctx.lineTo(ox, oy + tabH);
  ctx.lineTo(ox, oy + rTop);
  ctx.quadraticCurveTo(ox, oy, ox + rTop, oy);
  ctx.closePath();
  ctx.fillStyle = rgbToCss(titleShade);
  ctx.fill();
  ctx.restore();

  const cy = oy + tabH * 0.5;
  const lx = ox + Math.max(mLR, ow * 0.045) * 1.15;
  const dotR = Math.max(2.2, tabH * 0.11);
  const dots = ['#ef4444', '#eab308', '#22c55e'] as const;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(lx + i * dotR * 2.5, cy, dotR, 0, Math.PI * 2);
    ctx.fillStyle = dots[i];
    ctx.globalAlpha = 0.88;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const urlRowTop = oy + tabH + gTabUrl;
  const urlW = Math.min(ow * 0.52, Math.max(160, ow * 0.35));
  const urlFieldH = Math.max(urlRowH * 0.5, 11);
  const urlX = ox + (ow - urlW) / 2;
  const urlY = urlRowTop + (urlRowH - urlFieldH) / 2;
  ctx.save();
  roundRect(ctx, urlX, urlY, urlW, urlFieldH, urlFieldH * 0.5);
  ctx.fillStyle = rgbToCss(shadeRgb(base, 0.22), 0.35);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  const ix = ox + mLR;
  const iy = oy + chromeH;
  if (cw < 8 || ch < 8) return;

  const innerR = Math.max(4, Math.min(12, Math.min(cw, ch) * 0.018));
  ctx.save();
  roundRect(ctx, ix, iy, cw, ch, innerR);
  ctx.fillStyle = '#f1f5f9';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  /** 视口内「包含」截图，不放大超过截图原始像素，避免 capture 分辨率低于合成画布时糊边 */
  const fit = Math.min(1, cw / iw, ch / ih);
  const dwFit = iw * fit;
  const dhFit = ih * fit;
  const tw = Math.max(1, Math.round(dwFit));
  const th = Math.max(1, Math.round(dhFit));
  const ix0 = Math.round(ix + (cw - tw) / 2);
  const iy0 = Math.round(iy + (ch - th) / 2);
  const imgCorner = Math.max(4, Math.min(14, Math.min(tw, th) * 0.035));

  ctx.save();
  roundRect(ctx, ix, iy, cw, ch, innerR);
  ctx.clip();
  roundRect(ctx, ix0, iy0, tw, th, imgCorner);
  ctx.clip();
  drawScreenshotScaled(ctx, img, ix0, iy0, tw, th);
  ctx.restore();
}

/** 通栏·上、顶栏·窄：截图区域与画布底边的间距（px），替代原按比例 padY */
const SCREENSHOT_BOTTOM_GAP_TOP_STACK_LAYOUTS = 18;

function compositeLayoutScreenshot(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  screenshot: HTMLImageElement,
  kind: LayoutKind,
  embed?: ScreenshotEmbedOptions,
): void {
  const padX = W * 0.05;
  const padY = H * 0.06;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const split = W * 0.46;
  const splitNarrow = W * 0.34;

  switch (kind) {
    case 'split-text-right': {
      const leftW = split - padX * 1.1;
      drawScreenshotRegion(ctx, W, H, screenshot, padX, padY, leftW, innerH, embed);
      return;
    }
    case 'split-text-left': {
      const shotX = split + padX * 0.35;
      const shotW = W - shotX - padX;
      drawScreenshotRegion(ctx, W, H, screenshot, shotX, padY, shotW, innerH, embed);
      return;
    }
    case 'centered-text-top': {
      const textH = Math.min(H * 0.2, 140);
      const shotTop = padY + textH + padY * 0.35;
      const shotH = Math.max(8, H - shotTop - SCREENSHOT_BOTTOM_GAP_TOP_STACK_LAYOUTS);
      drawScreenshotRegion(ctx, W, H, screenshot, padX, shotTop, innerW, shotH, embed, 'bottom');
      return;
    }
    case 'centered-text-bottom': {
      const textH = Math.min(H * 0.22, 160);
      const shotH = innerH - textH - padY * 0.5;
      drawScreenshotRegion(ctx, W, H, screenshot, padX, padY, innerW, shotH, embed);
      return;
    }
    case 'bleed-full': {
      const m = Math.min(W, H) * 0.02;
      drawScreenshotRegion(ctx, W, H, screenshot, m, m, W - m * 2, H - m * 2, embed);
      return;
    }
    case 'split-narrow-left': {
      const shotX = splitNarrow + padX * 0.35;
      const shotW = W - shotX - padX;
      drawScreenshotRegion(ctx, W, H, screenshot, shotX, padY, shotW, innerH, embed);
      return;
    }
    case 'split-narrow-right': {
      const leftW = W * 0.72 - padX * 1.15;
      drawScreenshotRegion(ctx, W, H, screenshot, padX, padY, leftW, innerH, embed);
      return;
    }
    case 'stack-compact-top': {
      const textH = Math.min(H * 0.12, 100);
      const shotTop = padY + textH + padY * 0.25;
      const shotH = Math.max(8, H - shotTop - SCREENSHOT_BOTTOM_GAP_TOP_STACK_LAYOUTS);
      drawScreenshotRegion(ctx, W, H, screenshot, padX, shotTop, innerW, shotH, embed, 'bottom');
      return;
    }
    default: {
      const textH = Math.min(H * 0.22, 160);
      const shotH = innerH - textH - padY * 0.5;
      drawScreenshotRegion(ctx, W, H, screenshot, padX, padY, innerW, shotH, embed);
    }
  }
}

function wrapTextCjk(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const lines: string[] = [];
  let line = '';
  for (const ch of trimmed) {
    const test = line + ch;
    if (ctx.measureText(test).width <= maxWidth) line = test;
    else {
      if (line) lines.push(line);
      line = ch;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawTextLayer(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  layer: TextLayerState,
  refH = 800,
): void {
  const t = layer.text.trim();
  if (!t) return;
  const fs = Math.max(10, (layer.fontSize * H) / refH);
  const fw = layer.bold ? '700' : '500';
  const fam = fontCssStack(layer.fontId);
  ctx.font = `${fw} ${fs}px ${fam}`;
  const boxW = Math.max(40, layer.nw * W);
  const x0 = layer.nx * W;
  const y0 = layer.ny * H;
  const lines = wrapTextCjk(ctx, t, boxW - 4);
  if (!lines.length) return;
  const lh = fs * 1.35;
  const padLine = 2;
  const align = layer.textAlign ?? 'left';
  const lineXAndWidth = (ln: string): { lx: number; mw: number } => {
    const tw = ctx.measureText(ln).width;
    const mw = Math.max(tw, 1);
    const inner = boxW - padLine * 2;
    if (align === 'center') {
      return { lx: x0 + padLine + Math.max(0, (inner - tw) / 2), mw };
    }
    if (align === 'right') {
      return { lx: x0 + boxW - padLine - tw, mw };
    }
    return { lx: x0 + padLine, mw };
  };

  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  switch (layer.effect) {
    case 'solid': {
      ctx.globalAlpha = layer.opacity;
      ctx.fillStyle = layer.color;
      let yy = y0;
      for (const ln of lines) {
        const { lx } = lineXAndWidth(ln);
        ctx.fillText(ln, lx, yy);
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'gradient': {
      ctx.globalAlpha = layer.opacity;
      let yy = y0;
      for (const ln of lines) {
        const { lx, mw } = lineXAndWidth(ln);
        const g = ctx.createLinearGradient(lx, yy, lx + mw, yy + fs);
        g.addColorStop(0, layer.color);
        g.addColorStop(1, '#38bdf8');
        ctx.fillStyle = g;
        ctx.fillText(ln, lx, yy);
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'metallic': {
      ctx.globalAlpha = layer.opacity;
      let yy = y0;
      for (const ln of lines) {
        const { lx, mw } = lineXAndWidth(ln);
        const g = ctx.createLinearGradient(lx, yy, lx + mw, yy + fs);
        g.addColorStop(0, '#57534e');
        g.addColorStop(0.3, '#fde68a');
        g.addColorStop(0.55, '#fffbeb');
        g.addColorStop(0.75, '#d97706');
        g.addColorStop(1, '#78350f');
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = Math.max(1, fs / 16);
        ctx.strokeText(ln, lx, yy);
        ctx.fillStyle = g;
        ctx.fillText(ln, lx, yy);
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'crystal': {
      ctx.globalAlpha = layer.opacity;
      let yy = y0;
      for (const ln of lines) {
        const { lx, mw } = lineXAndWidth(ln);
        const g = ctx.createLinearGradient(lx, yy, lx + mw, yy + fs);
        g.addColorStop(0, '#a5f3fc');
        g.addColorStop(0.45, '#ffffff');
        g.addColorStop(0.55, '#e0f2fe');
        g.addColorStop(1, '#0284c7');
        ctx.shadowColor = 'rgba(56,189,248,0.6)';
        ctx.shadowBlur = fs / 4;
        ctx.fillStyle = g;
        ctx.fillText(ln, lx, yy);
        ctx.shadowBlur = 0;
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'neon': {
      ctx.globalAlpha = layer.opacity;
      let yy = y0;
      for (const ln of lines) {
        const { lx } = lineXAndWidth(ln);
        ctx.shadowColor = layer.color;
        ctx.shadowBlur = fs / 2.5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = layer.color;
        ctx.fillText(ln, lx, yy);
        ctx.shadowBlur = fs / 5;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(ln, lx, yy);
        ctx.shadowBlur = 0;
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'outline': {
      ctx.globalAlpha = layer.opacity;
      const lw = Math.max(2, fs / 10);
      let yy = y0;
      for (const ln of lines) {
        const { lx } = lineXAndWidth(ln);
        ctx.lineJoin = 'round';
        ctx.lineWidth = lw;
        ctx.strokeStyle = 'rgba(0,0,0,0.85)';
        ctx.strokeText(ln, lx, yy);
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = lw * 0.45;
        ctx.strokeText(ln, lx, yy);
        ctx.fillStyle = layer.color;
        ctx.fillText(ln, lx, yy);
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'emboss': {
      ctx.globalAlpha = layer.opacity;
      let yy = y0;
      for (const ln of lines) {
        const { lx, mw } = lineXAndWidth(ln);
        const g = ctx.createLinearGradient(lx, yy, lx + mw, yy + fs);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.48, layer.color);
        g.addColorStop(1, 'rgba(0,0,0,0.45)');
        ctx.fillStyle = g;
        ctx.fillText(ln, lx, yy);
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'duotone': {
      ctx.globalAlpha = layer.opacity;
      let yy = y0;
      for (const ln of lines) {
        const { lx, mw } = lineXAndWidth(ln);
        const g = ctx.createLinearGradient(lx, yy, lx + mw, yy + fs);
        g.addColorStop(0, layer.color);
        g.addColorStop(1, '#a855f7');
        ctx.fillStyle = g;
        ctx.fillText(ln, lx, yy);
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'shadowPop': {
      ctx.globalAlpha = layer.opacity;
      let yy = y0;
      for (const ln of lines) {
        const { lx } = lineXAndWidth(ln);
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = fs / 5;
        ctx.shadowOffsetX = fs / 14;
        ctx.shadowOffsetY = fs / 14;
        ctx.fillStyle = layer.color;
        ctx.fillText(ln, lx, yy);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        yy += lh;
      }
      ctx.globalAlpha = 1;
      return;
    }
    default: {
      ctx.globalAlpha = layer.opacity;
      ctx.fillStyle = layer.color;
      let yy = y0;
      for (const ln of lines) {
        const { lx } = lineXAndWidth(ln);
        ctx.fillText(ln, lx, yy);
        yy += lh;
      }
      ctx.globalAlpha = 1;
    }
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function clampCos(v: number): number {
  return Math.max(-1, Math.min(1, v));
}

function distPointSegPx(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-12) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const qx = ax + t * dx;
  const qy = ay + t * dy;
  return Math.hypot(px - qx, py - qy);
}

type CoilLoopGeom = {
  Cx: number;
  Cy: number;
  r: number;
  te: number;
  Ex: number;
  Ey: number;
  arcCCW: boolean;
};

type DoubleCoilGeom = {
  x1: number;
  y1: number;
  bx: number;
  by: number;
  loops: [CoilLoopGeom, CoilLoopGeom];
};

function tangentEntryToCircle(
  Px: number,
  Py: number,
  Cx: number,
  Cy: number,
  r: number,
  nx: number,
  ny: number,
  Mkx: number,
  Mky: number,
): { te: number; Ex: number; Ey: number } | null {
  const d = Math.hypot(Px - Cx, Py - Cy);
  if (d <= r + 0.35) return null;
  const a1 = Math.atan2(Py - Cy, Px - Cx);
  const delta = Math.acos(clampCos(r / d));
  const teA = a1 + delta;
  const teB = a1 - delta;
  const side = (te: number) => {
    const ex = Cx + r * Math.cos(te);
    const ey = Cy + r * Math.sin(te);
    return ((Px + ex) / 2 - Mkx) * nx + ((Py + ey) / 2 - Mky) * ny;
  };
  const te = side(teA) >= side(teB) ? teA : teB;
  return { te, Ex: Cx + r * Math.cos(te), Ey: Cy + r * Math.sin(te) };
}

function arcCCWForCoilLoop(
  te: number,
  Ex: number,
  Ey: number,
  towardX: number,
  towardY: number,
): boolean {
  const tanX = -Math.sin(te);
  const tanY = Math.cos(te);
  const vx = towardX - Ex;
  const vy = towardY - Ey;
  return vx * tanY - vy * tanX >= 0;
}

/**
 * 卷曲线：沿箭杆方向连续两个整圆环（手绘示意），再连向箭杆终点。
 */
function buildDoubleCoilGeometry(
  x1: number,
  y1: number,
  bx: number,
  by: number,
  W: number,
  H: number,
): DoubleCoilGeom | null {
  const dx = bx - x1;
  const dy = by - y1;
  const L = Math.hypot(dx, dy);
  if (L < 28) return null;
  const ux = dx / L;
  const uy = dy / L;
  const nx = -uy;
  const ny = ux;
  const m = Math.min(W, H);
  let r = Math.max(4.5, Math.min(L * 0.055, m * 0.05));
  const tM1 = 0.33;
  const tM2 = 0.69;
  const hMul = 2.18;

  for (let attempt = 0; attempt < 10; attempt++) {
    const hOff = r * hMul;
    const M1x = x1 + ux * L * tM1;
    const M1y = y1 + uy * L * tM1;
    const M2x = x1 + ux * L * tM2;
    const M2y = y1 + uy * L * tM2;
    const C1x = M1x + nx * hOff;
    const C1y = M1y + ny * hOff;
    const C2x = M2x + nx * hOff;
    const C2y = M2y + ny * hOff;

    const e1 = tangentEntryToCircle(x1, y1, C1x, C1y, r, nx, ny, M1x, M1y);
    if (!e1) {
      r *= 0.9;
      continue;
    }
    const e2 = tangentEntryToCircle(e1.Ex, e1.Ey, C2x, C2y, r, nx, ny, M2x, M2y);
    if (!e2) {
      r *= 0.9;
      continue;
    }

    const ccw1 = arcCCWForCoilLoop(e1.te, e1.Ex, e1.Ey, bx, by);
    const ccw2 = arcCCWForCoilLoop(e2.te, e2.Ex, e2.Ey, bx, by);

    const loop1: CoilLoopGeom = {
      Cx: C1x,
      Cy: C1y,
      r,
      te: e1.te,
      Ex: e1.Ex,
      Ey: e1.Ey,
      arcCCW: ccw1,
    };
    const loop2: CoilLoopGeom = {
      Cx: C2x,
      Cy: C2y,
      r,
      te: e2.te,
      Ex: e2.Ex,
      Ey: e2.Ey,
      arcCCW: ccw2,
    };
    return { x1, y1, bx, by, loops: [loop1, loop2] };
  }
  return null;
}

function svgFullCircleArcD(
  Ex: number,
  Ey: number,
  Cx: number,
  Cy: number,
  r: number,
  te: number,
  sweep: 0 | 1,
): string {
  const xMid = Cx - r * Math.cos(te);
  const yMid = Cy - r * Math.sin(te);
  return `A ${r} ${r} 0 0 ${sweep} ${xMid} ${yMid} A ${r} ${r} 0 0 ${sweep} ${Ex} ${Ey}`;
}

export function arrowCoilPathD(
  x1: number,
  y1: number,
  bx: number,
  by: number,
  W: number,
  H: number,
): string {
  const g = buildDoubleCoilGeometry(x1, y1, bx, by, W, H);
  if (!g) {
    return `M ${x1} ${y1} L ${bx} ${by}`;
  }
  const [L1, L2] = g.loops;
  const s1 = (L1.arcCCW ? 1 : 0) as 0 | 1;
  const s2 = (L2.arcCCW ? 1 : 0) as 0 | 1;
  return [
    `M ${x1} ${y1} L ${L1.Ex} ${L1.Ey}`,
    svgFullCircleArcD(L1.Ex, L1.Ey, L1.Cx, L1.Cy, L1.r, L1.te, s1),
    `L ${L2.Ex} ${L2.Ey}`,
    svgFullCircleArcD(L2.Ex, L2.Ey, L2.Cx, L2.Cy, L2.r, L2.te, s2),
    `L ${bx} ${by}`,
  ].join(' ');
}

function minDistToArcSamples(
  px: number,
  py: number,
  Cx: number,
  Cy: number,
  r: number,
  te: number,
  arcCCW: boolean,
  steps: number,
): number {
  let d = Infinity;
  const dir = arcCCW ? 1 : -1;
  for (let i = 0; i < steps; i++) {
    const t0 = te + dir * (i / steps) * Math.PI * 2;
    const t1 = te + dir * ((i + 1) / steps) * Math.PI * 2;
    const xa = Cx + r * Math.cos(t0);
    const ya = Cy + r * Math.sin(t0);
    const xb = Cx + r * Math.cos(t1);
    const yb = Cy + r * Math.sin(t1);
    d = Math.min(d, distPointSegPx(px, py, xa, ya, xb, yb));
  }
  return d;
}

/** 像素空间：点到卷曲线箭杆的最短距离（用于选中） */
export function distPixelToCoilShaft(
  px: number,
  py: number,
  x1: number,
  y1: number,
  bx: number,
  by: number,
  W: number,
  H: number,
): number {
  const g = buildDoubleCoilGeometry(x1, y1, bx, by, W, H);
  if (!g) return distPointSegPx(px, py, x1, y1, bx, by);

  const [L1, L2] = g.loops;
  let d = distPointSegPx(px, py, x1, y1, L1.Ex, L1.Ey);
  d = Math.min(d, distPointSegPx(px, py, L1.Ex, L1.Ey, L2.Ex, L2.Ey));
  d = Math.min(d, distPointSegPx(px, py, L2.Ex, L2.Ey, bx, by));
  d = Math.min(d, minDistToArcSamples(px, py, L1.Cx, L1.Cy, L1.r, L1.te, L1.arcCCW, 36));
  d = Math.min(d, minDistToArcSamples(px, py, L2.Cx, L2.Cy, L2.r, L2.te, L2.arcCCW, 36));
  return d;
}

function strokeCoilShaftCanvas(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  bx: number,
  by: number,
  W: number,
  H: number,
): void {
  const g = buildDoubleCoilGeometry(x1, y1, bx, by, W, H);
  if (!g) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(bx, by);
    return;
  }
  const [L1, L2] = g.loops;
  ctx.moveTo(x1, y1);
  ctx.lineTo(L1.Ex, L1.Ey);
  ctx.arc(L1.Cx, L1.Cy, L1.r, L1.te, L1.te + Math.PI * 2, L1.arcCCW);
  ctx.lineTo(L2.Ex, L2.Ey);
  ctx.arc(L2.Cx, L2.Cy, L2.r, L2.te, L2.te + Math.PI * 2, L2.arcCCW);
  ctx.lineTo(bx, by);
}

function drawArrowHeadOnCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  headLen: number,
  headStyle: ArrowHeadStyleId,
  sw: number,
): void {
  const L = headLen;
  const hw = L * 0.42;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = ctx.fillStyle;

  if (headStyle === 'chevron') {
    ctx.beginPath();
    ctx.moveTo(-L * 0.95, -hw);
    ctx.lineTo(0, 0);
    ctx.lineTo(-L * 0.95, hw);
    ctx.lineWidth = Math.max(1, sw);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
    return;
  }

  ctx.beginPath();
  if (headStyle === 'barbed') {
    ctx.moveTo(0, 0);
    ctx.lineTo(-L * 0.88, -hw);
    ctx.lineTo(-L * 1.05, 0);
    ctx.lineTo(-L * 0.88, hw);
    ctx.closePath();
  } else {
    ctx.moveTo(0, 0);
    ctx.lineTo(-L, -hw);
    ctx.lineTo(-L, hw);
    ctx.closePath();
  }

  if (headStyle === 'outline') {
    ctx.lineWidth = Math.max(1, sw * 0.95);
    ctx.stroke();
  } else {
    ctx.lineWidth = Math.max(1, sw * 0.85);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawOneArrowOnCanvas(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  a: ArrowAnnotation,
): void {
  const g = arrowGeometryPixels(a, W, H);
  const { x1, y1, x2, y2, bx, by, ux, uy, headLen, angle, sw } = g;
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return;

  ctx.save();
  ctx.globalAlpha = a.opacity;
  ctx.strokeStyle = a.color;
  ctx.fillStyle = a.color;
  ctx.lineWidth = sw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (a.lineStyle === 'dashed') ctx.setLineDash([sw * 2.8, sw * 2]);
  else ctx.setLineDash([]);

  const drawShaftLine = (ox: number, oy: number) => {
    ctx.beginPath();
    if (a.lineStyle === 'curved') {
      const { cx, cy } = arrowCurveControlPixels(a, W, H);
      ctx.moveTo(x1 + ox, y1 + oy);
      ctx.quadraticCurveTo(cx + ox, cy + oy, bx + ox, by + oy);
    } else {
      ctx.moveTo(x1 + ox, y1 + oy);
      ctx.lineTo(bx + ox, by + oy);
    }
    ctx.stroke();
  };

  if (a.lineStyle === 'double') {
    const off = sw * 0.95;
    const ox = -uy * off;
    const oy = ux * off;
    drawShaftLine(ox, oy);
    drawShaftLine(-ox, -oy);
  } else {
    drawShaftLine(0, 0);
  }

  ctx.setLineDash([]);
  drawArrowHeadOnCanvas(ctx, x2, y2, angle, headLen, a.headStyle, sw);

  ctx.restore();
}

export function drawArrowsOnCanvas(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  arrows: ArrowAnnotation[] | undefined,
): void {
  if (!arrows?.length) return;
  for (const a of arrows) {
    drawOneArrowOnCanvas(ctx, W, H, a);
  }
}

export function compositeToCanvas(opts: CompositeOptions): HTMLCanvasElement {
  const {
    width: W,
    height: H,
    screenshot,
    layoutKind,
    titleLayer,
    subtitleLayer,
    arrows,
    skipText = false,
    skipArrows = false,
    embedBrowserFrame = false,
    embedBrowserChromeColor = '#4b5563',
  } = opts;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unsupported');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  drawBackground(ctx, W, H, opts);
  const embedOpts: ScreenshotEmbedOptions | undefined = embedBrowserFrame
    ? { embedBrowser: true, browserChromeColor: embedBrowserChromeColor }
    : undefined;
  compositeLayoutScreenshot(ctx, W, H, screenshot, layoutKind, embedOpts);

  if (!skipText) {
    drawTextLayer(ctx, W, H, titleLayer);
    drawTextLayer(ctx, W, H, subtitleLayer);
  }

  if (!skipArrows) {
    drawArrowsOnCanvas(ctx, W, H, arrows);
  }

  return canvas;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('toBlob failed'));
      },
      'image/png',
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Image load failed'));
    img.onload = () => {
      const finish = () => resolve(img);
      if (typeof img.decode === 'function') {
        void img.decode().then(finish).catch(finish);
        return;
      }
      finish();
    };
    img.src = dataUrl;
  });
}
