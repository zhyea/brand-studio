import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch, type InjectionKey } from 'vue';
import {
  EXPORT_SIZES,
  BG_BUILTIN_IMAGE_LIST,
  BG_SOLID_LIST,
  BG_STYLE_LIST,
  FONT_OPTIONS,
  LAYOUT_OPTIONS,
  fontCssStack,
  type BgBuiltinImageId,
  type BgCategory,
  type BgSolidId,
  type BgStyleId,
  type ExportSizeKey,
  type FontFamilyId,
  type LayoutKind,
  type CompositeOptions,
  type TextEffect,
  type TextLayerState,
  type TextLayerAlign,
  compositeToCanvas,
  canvasToPngBlob,
  downloadBlob,
  defaultSubtitleLayer,
  defaultTextBoxLayoutForKind,
  defaultTitleLayer,
  defaultArrowAnnotation,
  arrowGeometryPixels,
  arrowCurveControlPixels,
  arrowCurveControlNorm,
  normalizeArrowAnnotation,
  loadImageFromDataUrl,
  type ArrowAnnotation,
  type ArrowHeadStyleId,
  type ArrowLineStyleId,
} from '@/lib/compositor';
import { SESSION_CAPTURE, SESSION_EPOCH, SESSION_ERROR } from '@/sessionKeys';
import {
  t,
  layoutNameKey,
  layoutDescKey,
  textFxKey,
  fontLabelKey,
  bgStyleKey,
  bgSolidKey,
  bgTexKey,
} from '@/i18n';

const TEXT_LAYER_ALIGNS: TextLayerAlign[] = ['left', 'center', 'right'];

export function useStudioEditor() {
const FONT_IDS = FONT_OPTIONS.map((f) => f.id) as FontFamilyId[];

const STORAGE_KEY = 'showcase_capture_prefs';

type ExportPreset = ExportSizeKey | 'custom';
/** 左侧菜单：版式 → 背景 → 文案 → 箭头 */
type MenuId = 'layout' | 'background' | 'description' | 'arrows';
type TextRole = 'title' | 'subtitle';

const screenshotDataUrl = ref<string | null>(null);
const screenshotImg = ref<HTMLImageElement | null>(null);
const customBgDataUrl = ref<string | null>(null);
const customBgImg = ref<HTMLImageElement | null>(null);
/** 内置位图纹理（扩展包内 bg-textures/）；加载完成前合成使用程序回退 */
const builtinBearGridImg = ref<HTMLImageElement | null>(null);
const busy = ref(false);
const message = ref('');
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const boardRef = ref<HTMLElement | null>(null);

const layoutKind = ref<LayoutKind>('centered-text-top');
const bgCategory = ref<BgCategory>('style');
const bgStyleId = ref<BgStyleId>('aurora');
const bgSolidId = ref<BgSolidId>('custom');
const solidCustomHex = ref('#1e3a5f');
const bgBuiltinImageId = ref<BgBuiltinImageId>('mesh1');

const titleLayer = reactive<TextLayerState>(defaultTitleLayer());
const subtitleLayer = reactive<TextLayerState>(defaultSubtitleLayer());
const activeTextRole = ref<TextRole>('title');
const drag = ref<{
  role: TextRole;
  startClientX: number;
  startClientY: number;
  origNx: number;
  origNy: number;
  rectW: number;
  rectH: number;
} | null>(null);
const exportPreset = ref<ExportPreset>('standard');
const customExportW = ref(1280);
const customExportH = ref(800);
const showGrid = ref(false);
/** 截图区域外绘制浏览器窗口框 */
const embedBrowserFrame = ref(false);
const embedBrowserChromeColor = ref('#4b5563');
/** true = 暗夜主题，false = 亮色主题 */
const themeDark = ref(true);
const zoomPercent = ref(100);
const activeMenu = ref<MenuId>('layout');

const arrowAnnotations = ref<ArrowAnnotation[]>([]);
const activeArrowId = ref<string | null>(null);
const draftArrow = ref<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
const arrowDrawActive = ref(false);
const arrowPointerStart = ref<{ x: number; y: number } | null>(null);
type ArrowDragState = {
  id: string;
  mode: 'move' | 'tail' | 'head' | 'curve';
  startNx: number;
  startNy: number;
  orig: { x1: number; y1: number; x2: number; y2: number };
  /** mode===move 且曲线有自定义控制点时，整体平移该点 */
  moveWithCurveOrig?: { nx: number; ny: number };
  /** mode===curve 时，按下瞬间的有效控制点（归一化） */
  bendStartNorm?: { nx: number; ny: number };
};
const arrowDrag = ref<ArrowDragState | null>(null);
const arrowLayerCursor = ref('');

const arrowLayerPointerStyle = computed(() => {
  if (activeMenu.value !== 'arrows') return {} as Record<string, string>;
  if (arrowDrag.value) return { cursor: 'grabbing' };
  if (arrowLayerCursor.value) return { cursor: arrowLayerCursor.value };
  return {};
});
const arrowEditColor = ref('#ef4444');
const arrowEditStrokeNorm = ref(0.0045);
const arrowEditHeadStyle = ref<ArrowHeadStyleId>('triangle');
const arrowEditLineStyle = ref<ArrowLineStyleId>('straight');
const arrowEditOpacity = ref(1);

const boardSize = ref({ w: 0, h: 0 });
const previewMetrics = ref({ pw: 440, ph: 280 });

const exportDims = computed(() => {
  if (exportPreset.value === 'custom') {
    const w = String(Math.max(320, Math.min(4096, customExportW.value)));
    const h = String(Math.max(240, Math.min(4096, customExportH.value)));
    return {
      width: Number(w),
      height: Number(h),
      label: t('export_custom_dims', [w, h]),
    };
  }
  const e = EXPORT_SIZES[exportPreset.value];
  return {
    width: e.width,
    height: e.height,
    label: t(`export_size_${exportPreset.value}`),
  };
});

const textOverlayRef = ref<HTMLElement | null>(null);
const titleCanvasTaRef = ref<HTMLTextAreaElement | null>(null);
const subtitleCanvasTaRef = ref<HTMLTextAreaElement | null>(null);
const previewModalOpen = ref(false);
const previewModalUrl = ref<string | null>(null);

const editLayer = computed(() =>
  activeTextRole.value === 'title' ? titleLayer : subtitleLayer,
);

const canExport = computed(() => !!screenshotImg.value && !busy.value);

const fitScale = computed(() => {
  const { pw, ph } = previewMetrics.value;
  const { w, h } = boardSize.value;
  if (!w || !h || !pw || !ph) return 1;
  return Math.min((w * 0.92) / pw, (h * 0.88) / ph, 2.5);
});

const displayScale = computed(() => fitScale.value * (zoomPercent.value / 100));

let ro: ResizeObserver | null = null;

function measureBoard() {
  const el = boardRef.value;
  if (!el) return;
  boardSize.value = { w: el.clientWidth, h: el.clientHeight };
}

/** 画布内联文本框：单行起算，换行后随 scrollHeight 增高 */
function fitCanvasTextarea(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = '0';
  el.style.height = `${el.scrollHeight}px`;
}

function fitAllCanvasTextareas() {
  fitCanvasTextarea(titleCanvasTaRef.value);
  fitCanvasTextarea(subtitleCanvasTaRef.value);
}

function onCanvasTextareaInput(e: Event) {
  fitCanvasTextarea(e.target as HTMLTextAreaElement);
}

async function refreshScreenshotImage() {
  if (!screenshotDataUrl.value) {
    screenshotImg.value = null;
    return;
  }
  try {
    screenshotImg.value = await loadImageFromDataUrl(screenshotDataUrl.value);
  } catch {
    screenshotImg.value = null;
    message.value = t('err_screenshot_load');
  }
}

async function refreshCustomBg() {
  if (!customBgDataUrl.value) {
    customBgImg.value = null;
    return;
  }
  try {
    customBgImg.value = await loadImageFromDataUrl(customBgDataUrl.value);
  } catch {
    customBgImg.value = null;
  }
}

watch(screenshotDataUrl, () => void refreshScreenshotImage());
watch(customBgDataUrl, () => void refreshCustomBg());

function buildCompositeOptions(
  width: number,
  height: number,
  skipText: boolean,
  skipArrows = false,
): CompositeOptions {
  return {
    width,
    height,
    screenshot: screenshotImg.value!,
    layoutKind: layoutKind.value,
    bgCategory: bgCategory.value,
    bgStyleId: bgStyleId.value,
    bgSolidId: bgSolidId.value,
    solidCustomHex: solidCustomHex.value,
    bgBuiltinImageId: bgBuiltinImageId.value,
    builtinTextureImages: builtinBearGridImg.value ? { bearGrid: builtinBearGridImg.value } : undefined,
    customBgImage:
      bgCategory.value === 'image' && customBgImg.value ? customBgImg.value : null,
    titleLayer: { ...titleLayer },
    subtitleLayer: { ...subtitleLayer },
    arrows: arrowAnnotations.value,
    skipArrows,
    skipText,
    embedBrowserFrame: embedBrowserFrame.value,
    embedBrowserChromeColor: embedBrowserChromeColor.value,
  };
}

/** 主画布预览合成像素上限（避免极大自定义导出时卡死主线程） */
const PREVIEW_COMPOSITE_MAX_PIXELS = 6_000_000;

function drawPreview() {
  const canvas = previewCanvas.value;
  const img = screenshotImg.value;
  if (!canvas || !img) return;
  const { width: ew, height: eh } = exportDims.value;
  const maxSide = 1200;
  const r = Math.min(maxSide / ew, maxSide / eh, 1);
  const pw = Math.round(ew * r);
  const ph = Math.round(eh * r);
  const exportArea = ew * eh;
  const previewScale =
    exportArea > PREVIEW_COMPOSITE_MAX_PIXELS
      ? Math.sqrt(PREVIEW_COMPOSITE_MAX_PIXELS / exportArea)
      : 1;
  const compW = Math.max(1, Math.round(ew * previewScale));
  const compH = Math.max(1, Math.round(eh * previewScale));
  /** 文案仅「文案」页用 DOM 编辑；箭头仅「箭头」页用 SVG 交互；版式/背景页画布需含全部内容 */
  const m = activeMenu.value;
  const skipText = m === 'description';
  const skipArrows = m === 'arrows';
  const c = compositeToCanvas(buildCompositeOptions(compW, compH, skipText, skipArrows));
  canvas.width = c.width;
  canvas.height = c.height;
  canvas.style.width = `${pw}px`;
  canvas.style.height = `${ph}px`;
  previewMetrics.value = { pw, ph };
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(c, 0, 0);
  requestAnimationFrame(measureBoard);
}

watch(
  [
    screenshotImg,
    layoutKind,
    bgCategory,
    bgStyleId,
    bgSolidId,
    solidCustomHex,
    bgBuiltinImageId,
    customBgImg,
    titleLayer,
    subtitleLayer,
    exportDims,
    arrowAnnotations,
    embedBrowserFrame,
    embedBrowserChromeColor,
    activeMenu,
    builtinBearGridImg,
  ],
  () => requestAnimationFrame(drawPreview),
  { deep: true },
);

async function consumeSessionCapture() {
  const raw = await chrome.storage.session.get([
    SESSION_CAPTURE,
    SESSION_ERROR,
    SESSION_EPOCH,
  ]);
  const err = raw[SESSION_ERROR] as string | null | undefined;
  const data = raw[SESSION_CAPTURE] as string | null | undefined;

  if (err) {
    message.value = err;
    screenshotDataUrl.value = null;
    return;
  }

  if (data) {
    resetAllSettingsForNewCapture();
    screenshotDataUrl.value = data;
    message.value = t('msg_tab_capture_loaded');
  }
}

function onSessionChanged(
  changes: Record<string, chrome.storage.StorageChange>,
  area: string,
) {
  if (area !== 'session' || !changes[SESSION_EPOCH]) return;
  void consumeSessionCapture();
}

function persistPrefs() {
  try {
    void chrome.storage.local.set({
      [STORAGE_KEY]: {
        layoutKind: layoutKind.value,
        bgCategory: bgCategory.value,
        bgStyleId: bgStyleId.value,
        bgSolidId: bgSolidId.value,
        solidCustomHex: solidCustomHex.value,
        bgBuiltinImageId: bgBuiltinImageId.value,
        titleLayer: { ...titleLayer },
        subtitleLayer: { ...subtitleLayer },
        activeTextRole: activeTextRole.value,
        exportPreset: exportPreset.value,
        customExportW: customExportW.value,
        customExportH: customExportH.value,
        showGrid: showGrid.value,
        theme: themeDark.value ? 'dark' : 'light',
        activeMenu: activeMenu.value,
        arrowAnnotations: arrowAnnotations.value.map((a) => ({ ...a })),
        activeArrowId: activeArrowId.value,
        embedBrowserFrame: embedBrowserFrame.value,
        embedBrowserChromeColor: embedBrowserChromeColor.value,
      },
    });
  } catch {
    /* ignore */
  }
}

function migrateLegacyPrefs(s: Record<string, unknown>) {
  if (s.layoutKind && typeof s.layoutKind === 'string') return;
  const lt = s.layoutTemplate;
  if (lt === 'split') layoutKind.value = 'split-text-right';
  else if (lt === 'centered') layoutKind.value = 'centered-text-bottom';
  const preset = s.preset as string | undefined;
  const customColor = s.customColor != null ? String(s.customColor) : '';
  if (preset === 'upload') {
    bgCategory.value = 'image';
  } else if (preset === 'customColor' && customColor) {
    bgCategory.value = 'solid';
    bgSolidId.value = 'custom';
    solidCustomHex.value = customColor;
  } else if (preset === 'paper') {
    bgCategory.value = 'solid';
    bgSolidId.value = 'linen';
  } else if (preset === 'ocean') {
    bgCategory.value = 'solid';
    bgSolidId.value = 'ocean';
  } else if (preset === 'midnight') {
    bgCategory.value = 'solid';
    bgSolidId.value = 'midnight';
  } else if (preset && BG_STYLE_LIST.some((x) => x.id === preset)) {
    bgCategory.value = 'style';
    bgStyleId.value = preset as BgStyleId;
  }
  if (s.description != null && String(s.description).trim()) {
    subtitleLayer.text = String(s.description);
  }
}

onMounted(async () => {
  {
    const src =
      typeof chrome !== 'undefined' && chrome.runtime?.getURL
        ? chrome.runtime.getURL('bg-textures/bearGrid.png')
        : '/bg-textures/bearGrid.png';
    const img = new Image();
    img.onload = () => {
      builtinBearGridImg.value = img;
      requestAnimationFrame(drawPreview);
    };
    img.src = src;
  }
  chrome.storage.onChanged.addListener(onSessionChanged);
  try {
    const raw = await chrome.storage.local.get(STORAGE_KEY);
    const s = raw[STORAGE_KEY] as Record<string, unknown> | undefined;
    if (s) {
      migrateLegacyPrefs(s);
    }
    const rawLk = s?.layoutKind as string | undefined;
    if (rawLk === 'float-card') {
      layoutKind.value = 'centered-text-top';
    } else if (rawLk && LAYOUT_OPTIONS.some((o) => o.id === rawLk)) {
      layoutKind.value = rawLk as LayoutKind;
    }
    const bc = s?.bgCategory as BgCategory | undefined;
    if (bc === 'style' || bc === 'image' || bc === 'solid') bgCategory.value = bc;
    const bs = s?.bgStyleId as BgStyleId | undefined;
    if (bs && BG_STYLE_LIST.some((x) => x.id === bs)) bgStyleId.value = bs;
    const bso = s?.bgSolidId as BgSolidId | undefined;
    if (bso && BG_SOLID_LIST.some((x) => x.id === bso)) bgSolidId.value = bso;
    if (s?.solidCustomHex != null) solidCustomHex.value = String(s.solidCustomHex);
    const bimg = s?.bgBuiltinImageId as BgBuiltinImageId | undefined;
    if (bimg && BG_BUILTIN_IMAGE_LIST.some((x) => x.id === bimg)) bgBuiltinImageId.value = bimg;
    const tl = s?.titleLayer as Partial<TextLayerState> | undefined;
    if (tl && typeof tl === 'object') Object.assign(titleLayer, { ...defaultTitleLayer(), ...tl });
    const sl = s?.subtitleLayer as Partial<TextLayerState> | undefined;
    if (sl && typeof sl === 'object') Object.assign(subtitleLayer, { ...defaultSubtitleLayer(), ...sl });
    if (!TEXT_EFFECT_IDS.includes(titleLayer.effect)) titleLayer.effect = 'solid';
    if (!TEXT_EFFECT_IDS.includes(subtitleLayer.effect)) subtitleLayer.effect = 'solid';
    if (!FONT_IDS.includes(titleLayer.fontId)) titleLayer.fontId = 'notoSansSc';
    if (!FONT_IDS.includes(subtitleLayer.fontId)) subtitleLayer.fontId = 'notoSansSc';
    if (!TEXT_LAYER_ALIGNS.includes(titleLayer.textAlign)) titleLayer.textAlign = 'left';
    if (!TEXT_LAYER_ALIGNS.includes(subtitleLayer.textAlign)) subtitleLayer.textAlign = 'left';
    if (s?.activeTextRole === 'title' || s?.activeTextRole === 'subtitle') {
      activeTextRole.value = s.activeTextRole;
    }
    if (s?.exportPreset === 'custom' || s?.exportPreset === 'thumb' || s?.exportPreset === 'standard' || s?.exportPreset === 'large') {
      exportPreset.value = s.exportPreset as ExportPreset;
    }
    if (typeof s?.customExportW === 'number') customExportW.value = s.customExportW;
    if (typeof s?.customExportH === 'number') customExportH.value = s.customExportH;
    if (typeof s?.showGrid === 'boolean') showGrid.value = s.showGrid;
    if (s?.theme === 'light') themeDark.value = false;
    else if (s?.theme === 'dark') themeDark.value = true;
    if (
      s?.activeMenu === 'layout' ||
      s?.activeMenu === 'background' ||
      s?.activeMenu === 'description' ||
      s?.activeMenu === 'arrows'
    ) {
      activeMenu.value = s.activeMenu as MenuId;
    }
    const arr = s?.arrowAnnotations as ArrowAnnotation[] | undefined;
    if (Array.isArray(arr)) {
      arrowAnnotations.value = arr.map((a) =>
        normalizeArrowAnnotation(a as unknown as Record<string, unknown>),
      );
    }
    if (typeof s?.activeArrowId === 'string' || s?.activeArrowId === null) {
      activeArrowId.value = (s?.activeArrowId as string | null) ?? null;
    }
    if (typeof s?.embedBrowserFrame === 'boolean') embedBrowserFrame.value = s.embedBrowserFrame;
    if (typeof s?.embedBrowserChromeColor === 'string') {
      embedBrowserChromeColor.value = String(s.embedBrowserChromeColor);
    }
  } catch {
    /* ignore */
  }

  /** 在恢复本地偏好之后处理会话截图，以便「新截图」清空设置不被旧 prefs 覆盖 */
  await consumeSessionCapture();

  ro = new ResizeObserver(() => measureBoard());
  await nextTick();
  if (boardRef.value) ro.observe(boardRef.value);
  measureBoard();
  drawPreview();
  syncDocTheme();
  activeMenu.value = 'layout';
  lastPushedJson.value = JSON.stringify(captureSettingsSnapshot());
  historyReady.value = true;
  await nextTick();
  fitAllCanvasTextareas();
  undoRedoKeyHandler = onUndoRedoKeydown;
  window.addEventListener('keydown', undoRedoKeyHandler, true);
});

watch(
  () => ({
    tt: titleLayer.text,
    st: subtitleLayer.text,
    tnw: titleLayer.nw,
    snw: subtitleLayer.nw,
    tfs: titleLayer.fontSize,
    sfs: subtitleLayer.fontSize,
    tf: titleLayer.fontId,
    sf: subtitleLayer.fontId,
    tb: titleLayer.bold,
    sb: subtitleLayer.bold,
    te: titleLayer.effect,
    se: subtitleLayer.effect,
    pw: previewMetrics.value.pw,
    ph: previewMetrics.value.ph,
  }),
  () => void nextTick(() => fitAllCanvasTextareas()),
);

let previewEscapeHandler: ((e: KeyboardEvent) => void) | null = null;
let undoRedoKeyHandler: ((e: KeyboardEvent) => void) | null = null;

function isEditableKeyTarget(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (el.isContentEditable) return true;
  return false;
}

function onUndoRedoKeydown(e: KeyboardEvent) {
  if (isEditableKeyTarget(e.target)) return;
  const k = e.key.toLowerCase();
  if (k === 'y' && e.ctrlKey) {
    e.preventDefault();
    redoSettings();
    return;
  }
  const mod = e.metaKey || e.ctrlKey;
  if (!mod) return;
  if (k === 'z' && e.shiftKey) {
    e.preventDefault();
    redoSettings();
    return;
  }
  if (k === 'z' && !e.shiftKey) {
    e.preventDefault();
    undoSettings();
  }
}

onUnmounted(() => {
  chrome.storage.onChanged.removeListener(onSessionChanged);
  ro?.disconnect();
  if (previewModalUrl.value) URL.revokeObjectURL(previewModalUrl.value);
  if (previewEscapeHandler) {
    window.removeEventListener('keydown', previewEscapeHandler);
    previewEscapeHandler = null;
  }
  if (undoRedoKeyHandler) {
    window.removeEventListener('keydown', undoRedoKeyHandler, true);
    undoRedoKeyHandler = null;
  }
  if (historyDebounceTimer) {
    clearTimeout(historyDebounceTimer);
    historyDebounceTimer = null;
  }
});

watch(
  [
    layoutKind,
    bgCategory,
    bgStyleId,
    bgSolidId,
    solidCustomHex,
    bgBuiltinImageId,
    titleLayer,
    subtitleLayer,
    activeTextRole,
    exportPreset,
    customExportW,
    customExportH,
    showGrid,
    themeDark,
    activeMenu,
    arrowAnnotations,
    activeArrowId,
    embedBrowserFrame,
    embedBrowserChromeColor,
  ],
  () => persistPrefs(),
  { deep: true },
);

watch(previewModalOpen, (open) => {
  if (previewEscapeHandler) {
    window.removeEventListener('keydown', previewEscapeHandler);
    previewEscapeHandler = null;
  }
  if (!open) return;
  previewEscapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closePreviewModal();
  };
  window.addEventListener('keydown', previewEscapeHandler);
});

function syncDocTheme() {
  document.documentElement.dataset.theme = themeDark.value ? 'dark' : 'light';
}

watch(themeDark, () => syncDocTheme());

watch(activeMenu, (m) => {
  if (m !== 'arrows') {
    arrowLayerCursor.value = '';
    arrowDrag.value = null;
  }
});

watch(boardRef, (el) => {
  ro?.disconnect();
  ro = null;
  if (el) {
    ro = new ResizeObserver(() => measureBoard());
    ro.observe(el);
    measureBoard();
  }
});

function onBgFile(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    message.value = t('err_pick_image_file');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    customBgDataUrl.value = reader.result as string;
    bgCategory.value = 'image';
    message.value = t('msg_bg_upload_applied');
    activeMenu.value = 'background';
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function selectMenu(id: MenuId) {
  activeMenu.value = id;
}

function applyLayoutTextPositions(kind: LayoutKind) {
  const g = defaultTextBoxLayoutForKind(kind);
  Object.assign(titleLayer, g.title);
  Object.assign(subtitleLayer, g.subtitle);
}

function selectLayout(id: LayoutKind) {
  layoutKind.value = id;
  applyLayoutTextPositions(id);
}

function toggleTheme() {
  themeDark.value = !themeDark.value;
}

function zoomOut() {
  zoomPercent.value = Math.max(25, zoomPercent.value - 10);
}

function zoomIn() {
  zoomPercent.value = Math.min(200, zoomPercent.value + 10);
}

function zoomFit() {
  zoomPercent.value = 100;
  measureBoard();
}

async function exportImage() {
  if (!screenshotImg.value) return;
  message.value = '';
  busy.value = true;
  try {
    const { width, height, label } = exportDims.value;
    const canvas = compositeToCanvas(buildCompositeOptions(width, height, false));
    const blob = await canvasToPngBlob(canvas);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    downloadBlob(blob, `${t('export_filename_prefix')}-${stamp}.png`);
    message.value = t('msg_exported', [label]);
  } catch (e) {
    message.value = e instanceof Error ? e.message : t('err_export_failed');
  } finally {
    busy.value = false;
  }
}

function layerForRole(role: TextRole): TextLayerState {
  return role === 'title' ? titleLayer : subtitleLayer;
}

function textBoxStyle(role: TextRole): Record<string, string> {
  const L = layerForRole(role);
  return {
    left: `${L.nx * 100}%`,
    top: `${L.ny * 100}%`,
    width: `${L.nw * 100}%`,
  };
}

function previewFontPx(role: TextRole): number {
  const L = layerForRole(role);
  const ph = previewMetrics.value.ph || 280;
  return Math.max(10, (L.fontSize * ph) / 800);
}

/** 画布内联编辑：用实色与 caret 保证光标可见；导出仍按图层效果渲染 */
function textCanvasStyle(role: TextRole): Record<string, string> {
  const L = layerForRole(role);
  const fs = `${previewFontPx(role)}px`;
  const base: Record<string, string> = {
    fontSize: fs,
    fontFamily: fontCssStack(L.fontId),
    fontWeight: L.bold ? '700' : '500',
    lineHeight: '1.35',
    color: L.color,
    opacity: String(L.opacity),
    caretColor: L.color,
    textAlign: L.textAlign ?? 'left',
  };
  if (L.effect === 'crystal') {
    base.textShadow =
      '0 0 4px rgba(56,189,248,0.55), 0 0 1px rgba(255,255,255,0.6)';
  } else if (L.effect === 'gradient') {
    base.textShadow = '0 0 1px rgba(56,189,248,0.35)';
  } else if (L.effect === 'metallic') {
    base.textShadow = '0 1px 0 rgba(0,0,0,0.12)';
  } else if (L.effect === 'neon') {
    base.textShadow = `0 0 8px ${L.color}, 0 0 2px #fff`;
  } else if (L.effect === 'outline') {
    base.textShadow =
      '1px 0 0 rgba(0,0,0,0.75), -1px 0 0 rgba(0,0,0,0.75), 0 1px 0 rgba(0,0,0,0.75), 0 -1px 0 rgba(0,0,0,0.75)';
  } else if (L.effect === 'emboss') {
    base.textShadow = '1px 1px 0 rgba(255,255,255,0.35), -1px -1px 0 rgba(0,0,0,0.25)';
  } else if (L.effect === 'duotone') {
    base.textShadow = '1px 1px 0 rgba(168,85,247,0.35)';
  } else if (L.effect === 'shadowPop') {
    base.textShadow = '3px 3px 0 rgba(0,0,0,0.25)';
  }
  return base;
}

/** 透明度：数值越大越透明（0=完全不透明，100=全透明） */
function editTransparencyPercent(): number {
  return Math.round((1 - layerForRole(activeTextRole.value).opacity) * 100);
}

function setEditTransparencyFromSlider(percent: number) {
  const v = Math.min(100, Math.max(0, percent));
  layerForRole(activeTextRole.value).opacity = 1 - v / 100;
}

function setTextEffect(id: TextEffect) {
  layerForRole(activeTextRole.value).effect = id;
}

const TEXT_EFFECT_IDS: TextEffect[] = [
  'solid',
  'gradient',
  'metallic',
  'crystal',
  'neon',
  'outline',
  'emboss',
  'duotone',
  'shadowPop',
];

function onTextPointerDown(e: PointerEvent, role: TextRole) {
  e.preventDefault();
  e.stopPropagation();
  activeTextRole.value = role;
  const layer = layerForRole(role);
  const el = textOverlayRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  drag.value = {
    role,
    startClientX: e.clientX,
    startClientY: e.clientY,
    origNx: layer.nx,
    origNy: layer.ny,
    rectW: r.width,
    rectH: r.height,
  };
  window.addEventListener('pointermove', onWindowPointerMove);
  window.addEventListener('pointerup', onWindowPointerUp, { once: true });
  window.addEventListener('pointercancel', onWindowPointerUp, { once: true });
}

function onWindowPointerMove(e: PointerEvent) {
  const d = drag.value;
  if (!d) return;
  const layer = layerForRole(d.role);
  const nx = d.origNx + (e.clientX - d.startClientX) / d.rectW;
  const ny = d.origNy + (e.clientY - d.startClientY) / d.rectH;
  const maxX = Math.max(0, 1 - Math.min(layer.nw, 0.98));
  layer.nx = Math.min(maxX, Math.max(0, nx));
  layer.ny = Math.min(0.96, Math.max(0, ny));
}

function onWindowPointerUp() {
  drag.value = null;
  window.removeEventListener('pointermove', onWindowPointerMove);
}

type TextResizeCorner = 'tl' | 'tr' | 'bl' | 'br';

/** 四角调整文本框宽度：右侧角固定左缘，左侧角固定右缘 */
function onResizePointerDown(e: PointerEvent, role: TextRole, corner: TextResizeCorner) {
  e.preventDefault();
  e.stopPropagation();
  activeTextRole.value = role;
  const layer = layerForRole(role);
  const el = textOverlayRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const startW = layer.nw;
  const startNx = layer.nx;
  const startClientX = e.clientX;
  const anchorRight = corner === 'tr' || corner === 'br';
  const rightEdge = Math.min(1, startNx + startW);
  const move = (ev: PointerEvent) => {
    const dw = (ev.clientX - startClientX) / r.width;
    if (anchorRight) {
      layer.nw = Math.min(0.95, Math.max(0.12, startW + dw));
      return;
    }
    let newNx = startNx + dw;
    let newNw = rightEdge - newNx;
    newNw = Math.min(0.95, Math.max(0.12, newNw));
    newNx = rightEdge - newNw;
    if (newNx < 0) {
      newNx = 0;
      newNw = Math.min(0.95, Math.max(0.12, rightEdge));
    }
    layer.nx = newNx;
    layer.nw = newNw;
  };
  const up = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
}

function selectBuiltinImage(id: BgBuiltinImageId) {
  bgBuiltinImageId.value = id;
  customBgDataUrl.value = null;
  bgCategory.value = 'image';
}

function selectBgStyle(id: BgStyleId) {
  bgCategory.value = 'style';
  bgStyleId.value = id;
}

function selectBgSolid(id: BgSolidId) {
  bgCategory.value = 'solid';
  bgSolidId.value = id;
}

const arrowLayerRef = ref<SVGSVGElement | null>(null);

function arrowDoubleOffsets(a: ArrowAnnotation, pw: number, ph: number): [number, number][] {
  const { ux, uy } = arrowShaftEnd(a, pw, ph);
  const off = arrowStrokePx(a, pw, ph) * 0.9;
  return [
    [-uy * off, ux * off],
    [uy * off, -ux * off],
  ];
}

function normFromArrowPointer(clientX: number, clientY: number): { nx: number; ny: number } | null {
  const el = arrowLayerRef.value;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return null;
  const nx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
  const ny = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
  return { nx, ny };
}

function distPointSeg(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-14) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const qx = x1 + t * dx;
  const qy = y1 + t * dy;
  return Math.hypot(px - qx, py - qy);
}

function distNormCurvedShaft(a: ArrowAnnotation, nx: number, ny: number): number {
  const pw = previewMetrics.value.pw;
  const ph = previewMetrics.value.ph;
  const { x1, y1, bx, by } = arrowShaftEnd(a, pw, ph);
  const x1n = x1 / pw;
  const y1n = y1 / ph;
  const bxn = bx / pw;
  const byn = by / ph;
  const { cx, cy } = arrowCurveControlPixels(a, pw, ph);
  const cxn = cx / pw;
  const cyn = cy / ph;
  let d = Infinity;
  for (let i = 0; i < 28; i++) {
    const t0 = i / 28;
    const t1 = (i + 1) / 28;
    const mt0 = 1 - t0;
    const mt1 = 1 - t1;
    const p0x = mt0 * mt0 * x1n + 2 * mt0 * t0 * cxn + t0 * t0 * bxn;
    const p0y = mt0 * mt0 * y1n + 2 * mt0 * t0 * cyn + t0 * t0 * byn;
    const p1x = mt1 * mt1 * x1n + 2 * mt1 * t1 * cxn + t1 * t1 * bxn;
    const p1y = mt1 * mt1 * y1n + 2 * mt1 * t1 * cyn + t1 * t1 * byn;
    d = Math.min(d, distPointSeg(nx, ny, p0x, p0y, p1x, p1y));
  }
  return d;
}

function distNormToShaft(a: ArrowAnnotation, nx: number, ny: number): number {
  const pw = previewMetrics.value.pw;
  const ph = previewMetrics.value.ph;
  const { x1, y1, bx, by } = arrowShaftEnd(a, pw, ph);
  const x1n = x1 / pw;
  const y1n = y1 / ph;
  const bxn = bx / pw;
  const byn = by / ph;
  if (a.lineStyle === 'curved') return distNormCurvedShaft(a, nx, ny);
  return distPointSeg(nx, ny, x1n, y1n, bxn, byn);
}

function pickArrowAt(nx: number, ny: number): string | null {
  const thresh = 0.02;
  let best: { id: string; d: number } | null = null;
  for (const a of arrowAnnotations.value) {
    const dHead = Math.hypot(nx - a.x2, ny - a.y2);
    const dTail = Math.hypot(nx - a.x1, ny - a.y1);
    const dShaft = distNormToShaft(a, nx, ny);
    const d = Math.min(dHead, dTail, dShaft);
    if (d < thresh && (!best || d < best.d)) best = { id: a.id, d };
  }
  return best?.id ?? null;
}

function hitTestArrowPart(nx: number, ny: number): { id: string; part: 'tail' | 'head' | 'shaft' | 'curve' } | null {
  const endThresh = 0.032;
  const curveThresh = 0.034;
  const shaftThresh = 0.022;
  const pw = previewMetrics.value.pw;
  const ph = previewMetrics.value.ph;
  const list = [...arrowAnnotations.value].reverse();
  for (const a of list) {
    const dh = Math.hypot(nx - a.x2, ny - a.y2);
    if (dh < endThresh) return { id: a.id, part: 'head' };
    const dt = Math.hypot(nx - a.x1, ny - a.y1);
    if (dt < endThresh) return { id: a.id, part: 'tail' };
    if (a.lineStyle === 'curved' && pw > 0 && ph > 0) {
      const cn = arrowCurveControlNorm(a, pw, ph);
      if (Math.hypot(nx - cn.nx, ny - cn.ny) < curveThresh) return { id: a.id, part: 'curve' };
    }
    if (distNormToShaft(a, nx, ny) < shaftThresh) return { id: a.id, part: 'shaft' };
  }
  return null;
}

function arrowStrokePx(a: ArrowAnnotation, pw: number, ph: number): number {
  return Math.max(1, a.strokeWidthNorm * Math.min(pw, ph));
}

function arrowShaftEnd(
  a: ArrowAnnotation,
  pw: number,
  ph: number,
): { x1: number; y1: number; bx: number; by: number; x2: number; y2: number; ux: number; uy: number } {
  const g = arrowGeometryPixels(a, pw, ph);
  return {
    x1: g.x1,
    y1: g.y1,
    bx: g.bx,
    by: g.by,
    x2: g.x2,
    y2: g.y2,
    ux: g.ux,
    uy: g.uy,
  };
}

function headLocalToWorld(
  x2: number,
  y2: number,
  angle: number,
  lx: number,
  ly: number,
): { x: number; y: number } {
  return {
    x: x2 + lx * Math.cos(angle) - ly * Math.sin(angle),
    y: y2 + lx * Math.sin(angle) + ly * Math.cos(angle),
  };
}

function arrowHeadChevronPoints(a: ArrowAnnotation, pw: number, ph: number): string {
  const { x2, y2, headLen, angle } = arrowGeometryPixels(a, pw, ph);
  const L = headLen;
  const hw = L * 0.42;
  const p1 = headLocalToWorld(x2, y2, angle, -L * 0.95, -hw);
  const p2 = headLocalToWorld(x2, y2, angle, 0, 0);
  const p3 = headLocalToWorld(x2, y2, angle, -L * 0.95, hw);
  return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
}

function arrowHeadPolygonPoints(a: ArrowAnnotation, pw: number, ph: number): string {
  const { x2, y2, headLen, angle } = arrowGeometryPixels(a, pw, ph);
  const L = headLen;
  const hw = L * 0.42;
  if (a.headStyle === 'barbed') {
    const t = headLocalToWorld(x2, y2, angle, 0, 0);
    const r = headLocalToWorld(x2, y2, angle, -L * 0.88, -hw);
    const n = headLocalToWorld(x2, y2, angle, -L * 1.05, 0);
    const l = headLocalToWorld(x2, y2, angle, -L * 0.88, hw);
    return `${t.x},${t.y} ${r.x},${r.y} ${n.x},${n.y} ${l.x},${l.y}`;
  }
  const t = headLocalToWorld(x2, y2, angle, 0, 0);
  const r = headLocalToWorld(x2, y2, angle, -L, -hw);
  const l = headLocalToWorld(x2, y2, angle, -L, hw);
  return `${t.x},${t.y} ${r.x},${r.y} ${l.x},${l.y}`;
}

function arrowCurvePathD(a: ArrowAnnotation, pw: number, ph: number): string {
  const { x1, y1, bx, by } = arrowShaftEnd(a, pw, ph);
  const { cx, cy } = arrowCurveControlPixels(a, pw, ph);
  return `M ${x1} ${y1} Q ${cx} ${cy} ${bx} ${by}`;
}

function curveHandlePx(a: ArrowAnnotation): { cx: number; cy: number } {
  return arrowCurveControlPixels(a, previewMetrics.value.pw, previewMetrics.value.ph);
}

function addArrowFromPanel() {
  const na = defaultArrowAnnotation({
    color: arrowEditColor.value,
    strokeWidthNorm: arrowEditStrokeNorm.value,
    headStyle: arrowEditHeadStyle.value,
    lineStyle: arrowEditLineStyle.value,
    opacity: arrowEditOpacity.value,
  });
  arrowAnnotations.value = [...arrowAnnotations.value, na];
  activeArrowId.value = na.id;
}

function deleteActiveArrow() {
  const id = activeArrowId.value;
  if (!id) return;
  arrowAnnotations.value = arrowAnnotations.value.filter((x) => x.id !== id);
  activeArrowId.value = null;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function onArrowSvgPointerDown(e: PointerEvent) {
  if (activeMenu.value !== 'arrows' || !screenshotImg.value) return;
  e.preventDefault();
  const svg = e.currentTarget as SVGSVGElement;
  const p = normFromArrowPointer(e.clientX, e.clientY);
  if (!p) return;

  const hit = hitTestArrowPart(p.nx, p.ny);
  if (hit) {
    const a = arrowAnnotations.value.find((x) => x.id === hit.id);
    if (!a) return;
    activeArrowId.value = hit.id;
    const pw0 = previewMetrics.value.pw;
    const ph0 = previewMetrics.value.ph;
    const moveWithCurveOrig =
      hit.part === 'shaft' &&
      a.lineStyle === 'curved' &&
      typeof a.curveControlNx === 'number' &&
      typeof a.curveControlNy === 'number'
        ? { nx: a.curveControlNx, ny: a.curveControlNy }
        : undefined;
    const bendStartNorm =
      hit.part === 'curve' && pw0 > 0 && ph0 > 0 ? arrowCurveControlNorm(a, pw0, ph0) : undefined;
    arrowDrag.value = {
      id: hit.id,
      mode:
        hit.part === 'shaft'
          ? 'move'
          : hit.part === 'tail'
            ? 'tail'
            : hit.part === 'curve'
              ? 'curve'
              : 'head',
      startNx: p.nx,
      startNy: p.ny,
      orig: { x1: a.x1, y1: a.y1, x2: a.x2, y2: a.y2 },
      moveWithCurveOrig,
      bendStartNorm,
    };
    draftArrow.value = null;
    arrowPointerStart.value = null;
    arrowDrawActive.value = false;
    svg.setPointerCapture(e.pointerId);
    return;
  }

  svg.setPointerCapture(e.pointerId);
  arrowPointerStart.value = { x: e.clientX, y: e.clientY };
  arrowDrawActive.value = false;
  draftArrow.value = { x1: p.nx, y1: p.ny, x2: p.nx, y2: p.ny };
}

function onArrowSvgPointerMove(e: PointerEvent) {
  if (activeMenu.value !== 'arrows') return;

  if (arrowDrag.value) {
    const p = normFromArrowPointer(e.clientX, e.clientY);
    if (!p) return;
    const d = arrowDrag.value;
    const dnx = p.nx - d.startNx;
    const dny = p.ny - d.startNy;
    arrowAnnotations.value = arrowAnnotations.value.map((a) => {
      if (a.id !== d.id) return a;
      if (d.mode === 'move') {
        const moved = {
          ...a,
          x1: clamp01(d.orig.x1 + dnx),
          y1: clamp01(d.orig.y1 + dny),
          x2: clamp01(d.orig.x2 + dnx),
          y2: clamp01(d.orig.y2 + dny),
        };
        if (d.moveWithCurveOrig) {
          moved.curveControlNx = clamp01(d.moveWithCurveOrig.nx + dnx);
          moved.curveControlNy = clamp01(d.moveWithCurveOrig.ny + dny);
        }
        return moved;
      }
      if (d.mode === 'curve' && d.bendStartNorm) {
        return {
          ...a,
          curveControlNx: clamp01(d.bendStartNorm.nx + dnx),
          curveControlNy: clamp01(d.bendStartNorm.ny + dny),
        };
      }
      if (d.mode === 'tail') {
        return { ...a, x1: clamp01(d.orig.x1 + dnx), y1: clamp01(d.orig.y1 + dny) };
      }
      return { ...a, x2: clamp01(d.orig.x2 + dnx), y2: clamp01(d.orig.y2 + dny) };
    });
    return;
  }

  if (!draftArrow.value) {
    const p = normFromArrowPointer(e.clientX, e.clientY);
    if (!p) {
      arrowLayerCursor.value = '';
      return;
    }
    const h = hitTestArrowPart(p.nx, p.ny);
    if (!h) arrowLayerCursor.value = 'crosshair';
    else if (h.part === 'shaft' || h.part === 'curve') arrowLayerCursor.value = 'grab';
    else arrowLayerCursor.value = 'pointer';
    return;
  }

  const st = arrowPointerStart.value;
  if (st) {
    const dx = e.clientX - st.x;
    const dy = e.clientY - st.y;
    if (Math.hypot(dx, dy) > 5) arrowDrawActive.value = true;
  }
  const p2 = normFromArrowPointer(e.clientX, e.clientY);
  if (!p2) return;
  draftArrow.value = { ...draftArrow.value, x2: p2.nx, y2: p2.ny };
}

function onArrowSvgPointerUp(e: PointerEvent) {
  if (activeMenu.value !== 'arrows') return;
  const svg = e.currentTarget as SVGSVGElement;
  try {
    svg.releasePointerCapture(e.pointerId);
  } catch {
    /* already released */
  }

  if (arrowDrag.value) {
    arrowDrag.value = null;
    arrowLayerCursor.value = '';
    return;
  }

  const d = draftArrow.value;
  const clickNx = d?.x1 ?? 0;
  const clickNy = d?.y1 ?? 0;
  const wasDraw = arrowDrawActive.value;
  draftArrow.value = null;
  arrowPointerStart.value = null;
  arrowDrawActive.value = false;
  if (!d) return;
  const len = Math.hypot(d.x2 - d.x1, d.y2 - d.y1);
  if (wasDraw && len >= 0.012) {
    const na = defaultArrowAnnotation({
      x1: d.x1,
      y1: d.y1,
      x2: d.x2,
      y2: d.y2,
      color: arrowEditColor.value,
      strokeWidthNorm: arrowEditStrokeNorm.value,
      headStyle: arrowEditHeadStyle.value,
      lineStyle: arrowEditLineStyle.value,
      opacity: arrowEditOpacity.value,
    });
    arrowAnnotations.value = [...arrowAnnotations.value, na];
    activeArrowId.value = na.id;
  } else {
    activeArrowId.value = pickArrowAt(clickNx, clickNy);
  }
}

watch(activeArrowId, (id) => {
  const a = arrowAnnotations.value.find((x) => x.id === id);
  if (a) {
    arrowEditColor.value = a.color;
    arrowEditStrokeNorm.value = a.strokeWidthNorm;
    arrowEditHeadStyle.value = a.headStyle;
    arrowEditLineStyle.value = a.lineStyle;
    arrowEditOpacity.value = a.opacity;
  }
});

watch(
  [arrowEditColor, arrowEditStrokeNorm, arrowEditHeadStyle, arrowEditLineStyle, arrowEditOpacity],
  () => {
    const id = activeArrowId.value;
    if (!id) return;
    const a = arrowAnnotations.value.find((x) => x.id === id);
    if (!a) return;
    a.color = arrowEditColor.value;
    a.strokeWidthNorm = arrowEditStrokeNorm.value;
    a.headStyle = arrowEditHeadStyle.value;
    a.lineStyle = arrowEditLineStyle.value;
    a.opacity = arrowEditOpacity.value;
  },
);

/** 可撤销的编辑设置（不含截图、导出预设、主题、当前菜单） */
interface EditorSettingsSnapshot {
  layoutKind: LayoutKind;
  bgCategory: BgCategory;
  bgStyleId: BgStyleId;
  bgSolidId: BgSolidId;
  solidCustomHex: string;
  bgBuiltinImageId: BgBuiltinImageId;
  customBgDataUrl: string | null;
  titleLayer: TextLayerState;
  subtitleLayer: TextLayerState;
  activeTextRole: TextRole;
  showGrid: boolean;
  zoomPercent: number;
  arrowAnnotations: ArrowAnnotation[];
  activeArrowId: string | null;
  embedBrowserFrame: boolean;
  embedBrowserChromeColor: string;
}

const undoStack = ref<EditorSettingsSnapshot[]>([]);
const redoStack = ref<EditorSettingsSnapshot[]>([]);
const historyReady = ref(false);
const isApplyingHistory = ref(false);
const lastPushedJson = ref<string | null>(null);
let historyDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const HISTORY_DEBOUNCE_MS = 320;
const HISTORY_MAX = 50;

/** 新截图载入：默认版式/背景/文案/箭头/导出等待办项，并清空撤销栈与箭头绘制草稿 */
function resetAllSettingsForNewCapture() {
  closePreviewModal();
  if (historyDebounceTimer) {
    clearTimeout(historyDebounceTimer);
    historyDebounceTimer = null;
  }
  draftArrow.value = null;
  arrowPointerStart.value = null;
  arrowDrawActive.value = false;
  arrowDrag.value = null;
  arrowLayerCursor.value = '';
  isApplyingHistory.value = true;
  resetEditorSettingsToDefault();
  exportPreset.value = 'standard';
  customExportW.value = 1280;
  customExportH.value = 800;
  activeMenu.value = 'layout';
  undoStack.value = [];
  redoStack.value = [];
  lastPushedJson.value = JSON.stringify(captureSettingsSnapshot());
  void nextTick(() => {
    isApplyingHistory.value = false;
  });
}

function captureSettingsSnapshot(): EditorSettingsSnapshot {
  return {
    layoutKind: layoutKind.value,
    bgCategory: bgCategory.value,
    bgStyleId: bgStyleId.value,
    bgSolidId: bgSolidId.value,
    solidCustomHex: solidCustomHex.value,
    bgBuiltinImageId: bgBuiltinImageId.value,
    customBgDataUrl: customBgDataUrl.value,
    titleLayer: { ...titleLayer },
    subtitleLayer: { ...subtitleLayer },
    activeTextRole: activeTextRole.value,
    showGrid: showGrid.value,
    zoomPercent: zoomPercent.value,
    arrowAnnotations: arrowAnnotations.value.map((a) => ({ ...a })),
    activeArrowId: activeArrowId.value,
    embedBrowserFrame: embedBrowserFrame.value,
    embedBrowserChromeColor: embedBrowserChromeColor.value,
  };
}

function applySettingsSnapshot(s: EditorSettingsSnapshot) {
  layoutKind.value = s.layoutKind;
  bgCategory.value = s.bgCategory;
  bgStyleId.value = s.bgStyleId;
  bgSolidId.value = s.bgSolidId;
  solidCustomHex.value = s.solidCustomHex;
  bgBuiltinImageId.value = s.bgBuiltinImageId;
  customBgDataUrl.value = s.customBgDataUrl;
  Object.assign(titleLayer, s.titleLayer);
  Object.assign(subtitleLayer, s.subtitleLayer);
  activeTextRole.value = s.activeTextRole;
  showGrid.value = s.showGrid;
  zoomPercent.value = s.zoomPercent;
  arrowAnnotations.value =
    s.arrowAnnotations?.map((a) =>
      normalizeArrowAnnotation({ ...(a as unknown as Record<string, unknown>) }),
    ) ?? [];
  activeArrowId.value = s.activeArrowId ?? null;
  embedBrowserFrame.value = s.embedBrowserFrame ?? false;
  embedBrowserChromeColor.value = s.embedBrowserChromeColor ?? '#4b5563';
}

function recordHistoryTransitionIfNeeded() {
  if (isApplyingHistory.value || !historyReady.value) return;
  const newVal = JSON.stringify(captureSettingsSnapshot());
  if (lastPushedJson.value !== null && lastPushedJson.value !== newVal) {
    undoStack.value.push(JSON.parse(lastPushedJson.value) as EditorSettingsSnapshot);
    if (undoStack.value.length > HISTORY_MAX) undoStack.value.shift();
    redoStack.value = [];
  }
  lastPushedJson.value = newVal;
}

function flushHistoryCommit() {
  if (historyDebounceTimer) {
    clearTimeout(historyDebounceTimer);
    historyDebounceTimer = null;
  }
  recordHistoryTransitionIfNeeded();
}

function scheduleHistoryRecord() {
  if (!historyReady.value || isApplyingHistory.value) return;
  if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
  historyDebounceTimer = setTimeout(() => {
    historyDebounceTimer = null;
    recordHistoryTransitionIfNeeded();
  }, HISTORY_DEBOUNCE_MS);
}

const settingsHistoryFingerprint = computed(() =>
  JSON.stringify(captureSettingsSnapshot()),
);

watch(settingsHistoryFingerprint, () => {
  if (isApplyingHistory.value) {
    lastPushedJson.value = JSON.stringify(captureSettingsSnapshot());
    return;
  }
  if (!historyReady.value) return;
  scheduleHistoryRecord();
});

const canUndo = computed(() => undoStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);

function undoSettings() {
  flushHistoryCommit();
  if (!undoStack.value.length) return;
  const current = captureSettingsSnapshot();
  const prev = undoStack.value.pop()!;
  redoStack.value.push(current);
  isApplyingHistory.value = true;
  applySettingsSnapshot(prev);
  lastPushedJson.value = JSON.stringify(captureSettingsSnapshot());
  void nextTick(() => {
    isApplyingHistory.value = false;
  });
  message.value = '';
}

function redoSettings() {
  flushHistoryCommit();
  if (!redoStack.value.length) return;
  const current = captureSettingsSnapshot();
  const next = redoStack.value.pop()!;
  undoStack.value.push(current);
  isApplyingHistory.value = true;
  applySettingsSnapshot(next);
  lastPushedJson.value = JSON.stringify(captureSettingsSnapshot());
  void nextTick(() => {
    isApplyingHistory.value = false;
  });
  message.value = '';
}

function resetEditorSettingsToDefault() {
  layoutKind.value = 'centered-text-top';
  bgCategory.value = 'style';
  bgStyleId.value = 'aurora';
  bgSolidId.value = 'custom';
  solidCustomHex.value = '#1e3a5f';
  bgBuiltinImageId.value = 'mesh1';
  customBgDataUrl.value = null;
  Object.assign(titleLayer, defaultTitleLayer());
  Object.assign(subtitleLayer, defaultSubtitleLayer());
  /** defaultTitle/Subtitle 的几何来自 centered-text-bottom，须与当前 layoutKind 对齐 */
  applyLayoutTextPositions(layoutKind.value);
  activeTextRole.value = 'title';
  showGrid.value = false;
  zoomPercent.value = 100;
  arrowAnnotations.value = [];
  activeArrowId.value = null;
  embedBrowserFrame.value = false;
  embedBrowserChromeColor.value = '#4b5563';
}

function clearWorkspace() {
  message.value = '';
  closePreviewModal();
  if (historyDebounceTimer) {
    clearTimeout(historyDebounceTimer);
    historyDebounceTimer = null;
  }
  isApplyingHistory.value = true;
  resetEditorSettingsToDefault();
  undoStack.value = [];
  redoStack.value = [];
  lastPushedJson.value = JSON.stringify(captureSettingsSnapshot());
  void nextTick(() => {
    isApplyingHistory.value = false;
  });
  message.value = t('msg_settings_reset');
}

function closePreviewModal() {
  previewModalOpen.value = false;
  if (previewModalUrl.value) {
    URL.revokeObjectURL(previewModalUrl.value);
    previewModalUrl.value = null;
  }
}

async function openExportPreview() {
  if (!screenshotImg.value) {
    message.value = t('err_screenshot_required_first');
    return;
  }
  message.value = '';
  try {
    const { width, height } = exportDims.value;
    const canvas = compositeToCanvas(buildCompositeOptions(width, height, false));
    const blob = await canvasToPngBlob(canvas);
    if (previewModalUrl.value) URL.revokeObjectURL(previewModalUrl.value);
    previewModalUrl.value = URL.createObjectURL(blob);
    previewModalOpen.value = true;
  } catch (e) {
    message.value = e instanceof Error ? e.message : t('err_preview_failed');
  }
}

  /** `ref="studio.xxxRef"` breaks when API is reactive (nested refs auto-unwrap). Use callback refs. */
  function setBoardRef(el: unknown) {
    boardRef.value = el instanceof HTMLElement ? el : null;
  }
  function setPreviewCanvasRef(el: unknown) {
    previewCanvas.value = el instanceof HTMLCanvasElement ? el : null;
  }
  function setArrowLayerRef(el: unknown) {
    arrowLayerRef.value = el instanceof SVGSVGElement ? el : null;
  }
  function setTextOverlayRef(el: unknown) {
    textOverlayRef.value = el instanceof HTMLElement ? el : null;
  }
  function setTitleCanvasTaRef(el: unknown) {
    titleCanvasTaRef.value = el instanceof HTMLTextAreaElement ? el : null;
  }
  function setSubtitleCanvasTaRef(el: unknown) {
    subtitleCanvasTaRef.value = el instanceof HTMLTextAreaElement ? el : null;
  }

  return reactive({
    BG_BUILTIN_IMAGE_LIST,
    BG_SOLID_LIST,
    BG_STYLE_LIST,
    FONT_OPTIONS,
    LAYOUT_OPTIONS,
    TEXT_EFFECT_IDS,
    activeArrowId,
    activeMenu,
    activeTextRole,
    addArrowFromPanel,
    arrowAnnotations,
    arrowCurvePathD,
    arrowDoubleOffsets,
    arrowEditColor,
    arrowEditHeadStyle,
    arrowEditLineStyle,
    arrowEditOpacity,
    arrowEditStrokeNorm,
    arrowHeadChevronPoints,
    arrowHeadPolygonPoints,
    arrowLayerCursor,
    arrowLayerPointerStyle,
    arrowShaftEnd,
    arrowStrokePx,
    bgBuiltinImageId,
    bgCategory,
    bgSolidId,
    bgSolidKey,
    bgStyleId,
    bgStyleKey,
    bgTexKey,
    busy,
    canExport,
    canRedo,
    canUndo,
    clearWorkspace,
    closePreviewModal,
    curveHandlePx,
    customBgDataUrl,
    customBgImg,
    customExportH,
    customExportW,
    deleteActiveArrow,
    displayScale,
    draftArrow,
    editLayer,
    editTransparencyPercent,
    embedBrowserChromeColor,
    embedBrowserFrame,
    exportDims,
    exportImage,
    exportPreset,
    fontLabelKey,
    layoutDescKey,
    layoutKind,
    layoutNameKey,
    message,
    onArrowSvgPointerDown,
    onArrowSvgPointerMove,
    onArrowSvgPointerUp,
    onBgFile,
    onCanvasTextareaInput,
    onResizePointerDown,
    onTextPointerDown,
    openExportPreview,
    previewMetrics,
    previewModalOpen,
    previewModalUrl,
    redoSettings,
    screenshotImg,
    selectBgSolid,
    selectBgStyle,
    selectBuiltinImage,
    selectLayout,
    selectMenu,
    setArrowLayerRef,
    setBoardRef,
    setEditTransparencyFromSlider,
    setPreviewCanvasRef,
    setSubtitleCanvasTaRef,
    setTextEffect,
    setTextOverlayRef,
    setTitleCanvasTaRef,
    showGrid,
    solidCustomHex,
    subtitleLayer,
    t,
    textBoxStyle,
    textCanvasStyle,
    textFxKey,
    themeDark,
    titleLayer,
    toggleTheme,
    undoSettings,
    zoomFit,
    zoomIn,
    zoomOut,
    zoomPercent,
  });
}

export type StudioEditorApi = ReturnType<typeof useStudioEditor>;

export const STUDIO_INJECT_KEY: InjectionKey<StudioEditorApi> = Symbol('studioEditor');
