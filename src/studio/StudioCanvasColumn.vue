<script setup lang="ts">
import { useStudio } from './useStudio';

const studio = useStudio();
</script>

<template>
      <main class="canvas-column">
        <p v-if="studio.message" class="toast">{{ studio.message }}</p>
        <p class="hint-bar">
          <span>{{ studio.t('hint_canvas_before') }}</span>
          <strong>{{ studio.t('hint_canvas_emphasis') }}</strong>
          <span>{{ studio.t('hint_canvas_after', [studio.exportDims.label]) }}</span>
        </p>
        <div
          :ref="studio.setBoardRef"
          class="canvas-board"
          :class="{ grid: studio.showGrid }"
        >
          <div
            class="canvas-scale"
            :style="{
              transform: `scale(${studio.displayScale})`,
              width: studio.previewMetrics.pw + 'px',
              height: studio.previewMetrics.ph + 'px',
            }"
          >
            <div class="preview-stack">
              <canvas
                v-show="studio.screenshotImg"
                :ref="studio.setPreviewCanvasRef"
                class="preview-canvas"
              />
              <svg
                v-show="
                  studio.screenshotImg &&
                  studio.previewMetrics.pw > 0 &&
                  studio.previewMetrics.ph > 0 &&
                  studio.activeMenu === 'arrows'
                "
                :ref="studio.setArrowLayerRef"
                class="arrow-layer"
                :class="{ 'arrow-layer--interactive': studio.activeMenu === 'arrows' }"
                :style="studio.arrowLayerPointerStyle"
                :width="studio.previewMetrics.pw"
                :height="studio.previewMetrics.ph"
                :viewBox="`0 0 ${studio.previewMetrics.pw} ${studio.previewMetrics.ph}`"
                preserveAspectRatio="none"
                @pointerdown="studio.onArrowSvgPointerDown"
                @pointermove="studio.onArrowSvgPointerMove"
                @pointerup="studio.onArrowSvgPointerUp"
                @pointercancel="studio.onArrowSvgPointerUp"
                @pointerleave="studio.arrowLayerCursor = ''"
              >
                <g
                  v-for="a in studio.arrowAnnotations"
                  :key="a.id"
                  :opacity="a.opacity"
                  :class="{ 'arrow-item--selected': studio.activeArrowId === a.id }"
                >
                  <template v-if="a.lineStyle === 'curved'">
                    <path
                      :d="studio.arrowCurvePathD(a, studio.previewMetrics.pw, studio.previewMetrics.ph)"
                      fill="none"
                      :stroke="a.color"
                      :stroke-width="studio.arrowStrokePx(a, studio.previewMetrics.pw, studio.previewMetrics.ph)"
                      stroke-linecap="round"
                    />
                  </template>
                  <template v-else-if="a.lineStyle === 'double'">
                    <line
                      v-for="(offs, idx) in studio.arrowDoubleOffsets(a, studio.previewMetrics.pw, studio.previewMetrics.ph)"
                      :key="idx"
                      :x1="studio.arrowShaftEnd(a, studio.previewMetrics.pw, studio.previewMetrics.ph).x1 + offs[0]"
                      :y1="studio.arrowShaftEnd(a, studio.previewMetrics.pw, studio.previewMetrics.ph).y1 + offs[1]"
                      :x2="studio.arrowShaftEnd(a, studio.previewMetrics.pw, studio.previewMetrics.ph).bx + offs[0]"
                      :y2="studio.arrowShaftEnd(a, studio.previewMetrics.pw, studio.previewMetrics.ph).by + offs[1]"
                      :stroke="a.color"
                      :stroke-width="studio.arrowStrokePx(a, studio.previewMetrics.pw, studio.previewMetrics.ph)"
                      stroke-linecap="round"
                    />
                  </template>
                  <template v-else>
                    <line
                      :x1="studio.arrowShaftEnd(a, studio.previewMetrics.pw, studio.previewMetrics.ph).x1"
                      :y1="studio.arrowShaftEnd(a, studio.previewMetrics.pw, studio.previewMetrics.ph).y1"
                      :x2="studio.arrowShaftEnd(a, studio.previewMetrics.pw, studio.previewMetrics.ph).bx"
                      :y2="studio.arrowShaftEnd(a, studio.previewMetrics.pw, studio.previewMetrics.ph).by"
                      :stroke="a.color"
                      :stroke-width="studio.arrowStrokePx(a, studio.previewMetrics.pw, studio.previewMetrics.ph)"
                      stroke-linecap="round"
                      :stroke-dasharray="a.lineStyle === 'dashed' ? '8 6' : '0'"
                    />
                  </template>
                  <polyline
                    v-if="a.headStyle === 'chevron'"
                    :points="studio.arrowHeadChevronPoints(a, studio.previewMetrics.pw, studio.previewMetrics.ph)"
                    fill="none"
                    :stroke="a.color"
                    :stroke-width="studio.arrowStrokePx(a, studio.previewMetrics.pw, studio.previewMetrics.ph)"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <polygon
                    v-else
                    :points="studio.arrowHeadPolygonPoints(a, studio.previewMetrics.pw, studio.previewMetrics.ph)"
                    :fill="a.headStyle === 'outline' ? 'none' : a.color"
                    :stroke="a.color"
                    :stroke-width="
                      a.headStyle === 'outline'
                        ? Math.max(1, studio.arrowStrokePx(a, studio.previewMetrics.pw, studio.previewMetrics.ph) * 0.95)
                        : 1
                    "
                    stroke-linejoin="round"
                  />
                  <g v-if="studio.activeMenu === 'arrows' && studio.activeArrowId === a.id" class="arrow-handles" pointer-events="none">
                    <circle
                      :cx="a.x1 * studio.previewMetrics.pw"
                      :cy="a.y1 * studio.previewMetrics.ph"
                      r="7"
                      class="arrow-handle"
                    />
                    <circle
                      v-if="a.lineStyle === 'curved'"
                      v-bind="studio.curveHandlePx(a)"
                      r="7"
                      class="arrow-handle arrow-handle--curve"
                    />
                    <circle
                      :cx="a.x2 * studio.previewMetrics.pw"
                      :cy="a.y2 * studio.previewMetrics.ph"
                      r="7"
                      class="arrow-handle"
                    />
                  </g>
                </g>
                <g v-if="studio.draftArrow" class="arrow-draft" opacity="0.75">
                  <line
                    :x1="studio.draftArrow.x1 * studio.previewMetrics.pw"
                    :y1="studio.draftArrow.y1 * studio.previewMetrics.ph"
                    :x2="studio.draftArrow.x2 * studio.previewMetrics.pw"
                    :y2="studio.draftArrow.y2 * studio.previewMetrics.ph"
                    stroke="#60a5fa"
                    stroke-width="2"
                    stroke-dasharray="4 3"
                  />
                </g>
              </svg>
              <div
                v-show="studio.screenshotImg && studio.activeMenu === 'description'"
                :ref="studio.setTextOverlayRef"
                class="text-overlay"
              >
                <div
                  class="text-box"
                  :class="{ active: studio.activeTextRole === 'title' }"
                  :style="studio.textBoxStyle('title')"
                >
                  <template v-if="studio.activeTextRole === 'title'">
                    <div
                      class="text-edge text-edge--top"
                      :title="studio.t('drag_move')"
                      @pointerdown="studio.onTextPointerDown($event, 'title')"
                    />
                    <div
                      class="text-edge text-edge--right"
                      :title="studio.t('drag_move')"
                      @pointerdown="studio.onTextPointerDown($event, 'title')"
                    />
                    <div
                      class="text-edge text-edge--bottom"
                      :title="studio.t('drag_move')"
                      @pointerdown="studio.onTextPointerDown($event, 'title')"
                    />
                    <div
                      class="text-edge text-edge--left"
                      :title="studio.t('drag_move')"
                      @pointerdown="studio.onTextPointerDown($event, 'title')"
                    />
                  </template>
                  <span
                    v-show="studio.activeTextRole === 'title'"
                    class="text-handle text-handle--tl"
                    :title="studio.t('drag_resize_width')"
                    @pointerdown="studio.onResizePointerDown($event, 'title', 'tl')"
                  />
                  <span
                    v-show="studio.activeTextRole === 'title'"
                    class="text-handle text-handle--tr"
                    :title="studio.t('drag_resize_width')"
                    @pointerdown="studio.onResizePointerDown($event, 'title', 'tr')"
                  />
                  <span
                    v-show="studio.activeTextRole === 'title'"
                    class="text-handle text-handle--bl"
                    :title="studio.t('drag_resize_width')"
                    @pointerdown="studio.onResizePointerDown($event, 'title', 'bl')"
                  />
                  <span
                    v-show="studio.activeTextRole === 'title'"
                    class="text-handle text-handle--br"
                    :title="studio.t('drag_resize_width')"
                    @pointerdown="studio.onResizePointerDown($event, 'title', 'br')"
                  />
                  <textarea
                    :ref="studio.setTitleCanvasTaRef"
                    v-model="studio.titleLayer.text"
                    class="text-canvas-ta"
                    :style="studio.textCanvasStyle('title')"
                    :placeholder="studio.t('ph_title')"
                    rows="1"
                    spellcheck="false"
                    @focus="studio.activeTextRole = 'title'"
                    @input="studio.onCanvasTextareaInput"
                    @pointerdown.stop
                  />
                </div>
                <div
                  class="text-box"
                  :class="{ active: studio.activeTextRole === 'subtitle' }"
                  :style="studio.textBoxStyle('subtitle')"
                >
                  <template v-if="studio.activeTextRole === 'subtitle'">
                    <div
                      class="text-edge text-edge--top"
                      :title="studio.t('drag_move')"
                      @pointerdown="studio.onTextPointerDown($event, 'subtitle')"
                    />
                    <div
                      class="text-edge text-edge--right"
                      :title="studio.t('drag_move')"
                      @pointerdown="studio.onTextPointerDown($event, 'subtitle')"
                    />
                    <div
                      class="text-edge text-edge--bottom"
                      :title="studio.t('drag_move')"
                      @pointerdown="studio.onTextPointerDown($event, 'subtitle')"
                    />
                    <div
                      class="text-edge text-edge--left"
                      :title="studio.t('drag_move')"
                      @pointerdown="studio.onTextPointerDown($event, 'subtitle')"
                    />
                  </template>
                  <span
                    v-show="studio.activeTextRole === 'subtitle'"
                    class="text-handle text-handle--tl"
                    :title="studio.t('drag_resize_width')"
                    @pointerdown="studio.onResizePointerDown($event, 'subtitle', 'tl')"
                  />
                  <span
                    v-show="studio.activeTextRole === 'subtitle'"
                    class="text-handle text-handle--tr"
                    :title="studio.t('drag_resize_width')"
                    @pointerdown="studio.onResizePointerDown($event, 'subtitle', 'tr')"
                  />
                  <span
                    v-show="studio.activeTextRole === 'subtitle'"
                    class="text-handle text-handle--bl"
                    :title="studio.t('drag_resize_width')"
                    @pointerdown="studio.onResizePointerDown($event, 'subtitle', 'bl')"
                  />
                  <span
                    v-show="studio.activeTextRole === 'subtitle'"
                    class="text-handle text-handle--br"
                    :title="studio.t('drag_resize_width')"
                    @pointerdown="studio.onResizePointerDown($event, 'subtitle', 'br')"
                  />
                  <textarea
                    :ref="studio.setSubtitleCanvasTaRef"
                    v-model="studio.subtitleLayer.text"
                    class="text-canvas-ta"
                    :style="studio.textCanvasStyle('subtitle')"
                    :placeholder="studio.t('ph_subtitle')"
                    rows="1"
                    spellcheck="false"
                    @focus="studio.activeTextRole = 'subtitle'"
                    @input="studio.onCanvasTextareaInput"
                    @pointerdown.stop
                  />
                </div>
              </div>
              <div v-if="!studio.screenshotImg" class="canvas-empty">
                {{ studio.t('canvas_empty_title') }}<br />
                <span class="muted">{{ studio.t('canvas_empty_hint') }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
</template>
