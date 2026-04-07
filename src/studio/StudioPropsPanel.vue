<script setup lang="ts">
import { useStudio } from './useStudio';

const studio = useStudio();
</script>

<template>
      <aside class="props-panel" :aria-label="studio.t('aria_props')">
        <div v-if="studio.activeMenu === 'layout'" class="props-scroll">
          <h3 class="props-heading">{{ studio.t('layout_heading') }}</h3>
          <div class="layout-grid-9">
            <button
              v-for="opt in studio.LAYOUT_OPTIONS"
              :key="opt.id"
              type="button"
              class="layout-card layout-card--cell layout-card--thumb-only"
              :class="{ on: studio.layoutKind === opt.id }"
              @click="studio.selectLayout(opt.id)"
            >
              <span class="layout-thumb" :class="`layout-thumb--${opt.id}`" aria-hidden="true" />
              <span class="sr-only">
                {{ studio.t(studio.layoutNameKey(opt.id)) }}，{{ studio.t(studio.layoutDescKey(opt.id)) }}
              </span>
            </button>
          </div>
          <label class="props-toggle-row">
            <span>{{ studio.t('show_grid') }}</span>
            <input v-model="studio.showGrid" type="checkbox" class="toggle-switch" />
          </label>
          <template v-if="studio.screenshotImg">
            <label class="props-toggle-row">
              <span>{{ studio.t('layout_embed_browser') }}</span>
              <input v-model="studio.embedBrowserFrame" type="checkbox" class="toggle-switch" />
            </label>
            <p class="props-hint">{{ studio.t('layout_embed_browser_hint') }}</p>
            <div v-if="studio.embedBrowserFrame" class="prop-row">
              <label class="prop-label">{{ studio.t('layout_browser_chrome_color') }}</label>
              <input v-model="studio.embedBrowserChromeColor" type="color" class="color-inp" />
              <input v-model="studio.embedBrowserChromeColor" type="text" class="hex-inp grow" maxlength="7" />
            </div>
          </template>
          <div class="props-divider" />
          <p class="props-field-label">{{ studio.t('custom_export_dims_heading') }}</p>
          <p class="props-hint">{{ studio.t('custom_export_dims_hint') }}</p>
          <div class="dim-row dim-row--stacked">
            <label class="dim-field">
              <span>{{ studio.t('dim_width') }}</span>
              <input v-model.number="studio.customExportW" type="number" min="320" max="4096" />
            </label>
            <label class="dim-field">
              <span>{{ studio.t('dim_height') }}</span>
              <input v-model.number="studio.customExportH" type="number" min="240" max="4096" />
            </label>
          </div>
        </div>

        <div v-else-if="studio.activeMenu === 'background'" class="props-scroll">
          <h3 class="props-heading">{{ studio.t('props_bg_heading') }}</h3>
          <div class="bg-cat-row">
            <button
              type="button"
              class="cat-btn"
              :class="{ on: studio.bgCategory === 'style' }"
              @click="studio.bgCategory = 'style'"
            >
              {{ studio.t('bg_cat_style') }}
            </button>
            <button
              type="button"
              class="cat-btn"
              :class="{ on: studio.bgCategory === 'image' }"
              @click="studio.bgCategory = 'image'"
            >
              {{ studio.t('bg_cat_image') }}
            </button>
            <button
              type="button"
              class="cat-btn"
              :class="{ on: studio.bgCategory === 'solid' }"
              @click="studio.bgCategory = 'solid'"
            >
              {{ studio.t('bg_cat_solid') }}
            </button>
          </div>

          <template v-if="studio.bgCategory === 'style'">
            <p class="props-field-label">{{ studio.t('bg_section_gradients') }}</p>
            <div class="chip-grid">
              <button
                v-for="p in studio.BG_STYLE_LIST"
                :key="p.id"
                type="button"
                class="chip chip--bg"
                :class="{ on: studio.bgCategory === 'style' && studio.bgStyleId === p.id }"
                @click="studio.selectBgStyle(p.id)"
              >
                {{ studio.t(studio.bgStyleKey(p.id)) }}
              </button>
            </div>
          </template>

          <template v-else-if="studio.bgCategory === 'image'">
            <p class="props-field-label">{{ studio.t('bg_section_builtin') }}</p>
            <div class="chip-grid">
              <button
                v-for="p in studio.BG_BUILTIN_IMAGE_LIST"
                :key="p.id"
                type="button"
                class="chip chip--bg"
                :class="{ on: studio.bgCategory === 'image' && studio.bgBuiltinImageId === p.id && !studio.customBgImg }"
                @click="studio.selectBuiltinImage(p.id)"
              >
                {{ studio.t(studio.bgTexKey(p.id)) }}
              </button>
            </div>
            <p class="props-field-label">{{ studio.t('bg_section_upload') }}</p>
            <p class="props-hint">{{ studio.t('bg_upload_hint') }}</p>
            <div class="prop-row file-row">
              <label class="file-btn">
                {{ studio.t('upload_bg_image') }}
                <input type="file" accept="image/*" hidden @change="studio.onBgFile" />
              </label>
              <button
                v-if="studio.customBgImg"
                type="button"
                class="pill-btn pill-btn--ghost"
                @click="studio.customBgDataUrl = null"
              >
                {{ studio.t('clear_upload') }}
              </button>
            </div>
          </template>

          <template v-else>
            <p class="props-field-label">{{ studio.t('bg_section_presets') }}</p>
            <div class="chip-grid">
              <button
                v-for="p in studio.BG_SOLID_LIST"
                :key="p.id"
                type="button"
                class="chip chip--bg"
                :class="{ on: studio.bgCategory === 'solid' && studio.bgSolidId === p.id }"
                @click="studio.selectBgSolid(p.id)"
              >
                {{ studio.t(studio.bgSolidKey(p.id)) }}
              </button>
            </div>
            <div v-if="studio.bgSolidId === 'custom'" class="props-color-row prop-row">
              <label class="prop-label">{{ studio.t('custom_color') }}</label>
              <input v-model="studio.solidCustomHex" type="color" class="color-inp" />
              <input v-model="studio.solidCustomHex" type="text" class="hex-inp grow" maxlength="7" />
            </div>
          </template>
        </div>

        <div v-else-if="studio.activeMenu === 'description'" class="props-scroll">
          <h3 class="props-heading">{{ studio.t('copy_heading') }}</h3>
          <p class="props-hint">
            {{ studio.t('copy_hint_long') }}
          </p>
          <div class="role-tabs">
            <button
              type="button"
              class="role-tab"
              :class="{ on: studio.activeTextRole === 'title' }"
              @click="studio.activeTextRole = 'title'"
            >
              {{ studio.t('role_title') }}
            </button>
            <button
              type="button"
              class="role-tab"
              :class="{ on: studio.activeTextRole === 'subtitle' }"
              @click="studio.activeTextRole = 'subtitle'"
            >
              {{ studio.t('role_subtitle') }}
            </button>
          </div>
          <p class="props-field-label">{{ studio.t('field_copy') }}</p>
          <textarea
            v-model="studio.editLayer.text"
            class="desc-ta"
            rows="3"
            :placeholder="studio.t('copy_placeholder')"
            :style="{ textAlign: studio.editLayer.textAlign }"
          />
          <div class="prop-row">
            <label class="prop-label">{{ studio.t('color') }}</label>
            <input v-model="studio.editLayer.color" type="color" class="color-inp" />
            <input v-model="studio.editLayer.color" type="text" class="hex-inp grow" maxlength="7" />
          </div>
          <p class="props-field-label">{{ studio.t('font') }}</p>
          <label class="font-select-wrap">
            <span class="sr-only">{{ studio.t('font') }}</span>
            <select v-model="studio.editLayer.fontId" class="font-select">
              <option v-for="f in studio.FONT_OPTIONS" :key="f.id" :value="f.id">
                {{ studio.t(studio.fontLabelKey(f.id)) }}
              </option>
            </select>
          </label>
          <label class="slider-row">
            <span>{{ studio.t('font_size_label', [String(studio.editLayer.fontSize)]) }}</span>
            <input v-model.number="studio.editLayer.fontSize" type="range" min="12" max="56" step="1" />
          </label>
          <label class="slider-row">
            <span>{{ studio.t('transparency_label', [String(studio.editTransparencyPercent())]) }}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="2"
              :value="studio.editTransparencyPercent()"
              @input="studio.setEditTransparencyFromSlider(Number(($event.target as HTMLInputElement).value))"
            />
          </label>
          <p class="props-field-label">{{ studio.t('copy_align_label') }}</p>
          <div class="chip-grid chip-grid--tight copy-align-chips" role="group" :aria-label="studio.t('copy_align_label')">
            <button
              type="button"
              class="chip"
              :class="{ on: studio.editLayer.textAlign === 'left' }"
              @click="studio.editLayer.textAlign = 'left'"
            >
              {{ studio.t('copy_align_left') }}
            </button>
            <button
              type="button"
              class="chip"
              :class="{ on: studio.editLayer.textAlign === 'center' }"
              @click="studio.editLayer.textAlign = 'center'"
            >
              {{ studio.t('copy_align_center') }}
            </button>
            <button
              type="button"
              class="chip"
              :class="{ on: studio.editLayer.textAlign === 'right' }"
              @click="studio.editLayer.textAlign = 'right'"
            >
              {{ studio.t('copy_align_right') }}
            </button>
          </div>
          <p class="props-field-label">{{ studio.t('text_effects_heading') }}</p>
          <div class="chip-grid chip-grid--tight">
            <button
              v-for="ef in studio.TEXT_EFFECT_IDS"
              :key="ef"
              type="button"
              class="chip"
              :class="{ on: studio.editLayer.effect === ef }"
              @mousedown.prevent
              @click.prevent="studio.setTextEffect(ef)"
            >
              {{ studio.t(studio.textFxKey(ef)) }}
            </button>
          </div>
          <label class="props-toggle-row">
            <span>{{ studio.t('bold') }}</span>
            <input v-model="studio.editLayer.bold" type="checkbox" class="toggle-switch" />
          </label>
        </div>

        <div v-else-if="studio.activeMenu === 'arrows'" class="props-scroll">
          <h3 class="props-heading">{{ studio.t('arrows_heading') }}</h3>
          <p class="props-hint">{{ studio.t('arrows_hint_draw') }}</p>
          <button
            type="button"
            class="pill-btn"
            :disabled="!studio.screenshotImg"
            @click="studio.addArrowFromPanel"
          >
            {{ studio.t('arrows_add_default') }}
          </button>
          <p class="props-field-label">{{ studio.t('arrows_head_style_label') }}</p>
          <p class="props-hint">{{ studio.t('arrows_head_style_hint') }}</p>
          <div class="arrow-head-chip-grid">
            <button
              type="button"
              class="arrow-head-chip"
              :class="{ on: studio.arrowEditHeadStyle === 'triangle' }"
              @click="studio.arrowEditHeadStyle = 'triangle'"
            >
              <svg class="arrow-style-icon" viewBox="0 0 52 16" aria-hidden="true">
                <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <polygon points="44,8 30,3 30,13" fill="currentColor" />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_head_triangle') }}</span>
            </button>
            <button
              type="button"
              class="arrow-head-chip"
              :class="{ on: studio.arrowEditHeadStyle === 'barbed' }"
              @click="studio.arrowEditHeadStyle = 'barbed'"
            >
              <svg class="arrow-style-icon" viewBox="0 0 52 16" aria-hidden="true">
                <line x1="2" y1="8" x2="24" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <polygon points="44,8 32,3 27,8 32,13" fill="currentColor" />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_head_barbed') }}</span>
            </button>
            <button
              type="button"
              class="arrow-head-chip"
              :class="{ on: studio.arrowEditHeadStyle === 'chevron' }"
              @click="studio.arrowEditHeadStyle = 'chevron'"
            >
              <svg class="arrow-style-icon" viewBox="0 0 52 16" aria-hidden="true">
                <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <polyline
                  points="30,4 44,8 30,12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_head_chevron') }}</span>
            </button>
            <button
              type="button"
              class="arrow-head-chip"
              :class="{ on: studio.arrowEditHeadStyle === 'outline' }"
              @click="studio.arrowEditHeadStyle = 'outline'"
            >
              <svg class="arrow-style-icon" viewBox="0 0 52 16" aria-hidden="true">
                <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <polygon
                  points="44,8 30,3.5 30,12.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_head_outline') }}</span>
            </button>
            <button
              type="button"
              class="arrow-head-chip"
              :class="{ on: studio.arrowEditHeadStyle === 'compact' }"
              @click="studio.arrowEditHeadStyle = 'compact'"
            >
              <svg class="arrow-style-icon" viewBox="0 0 52 16" aria-hidden="true">
                <line x1="2" y1="8" x2="30" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <polygon points="44,8 34,5 34,11" fill="currentColor" />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_head_compact') }}</span>
            </button>
          </div>
          <p class="props-field-label props-field-label--spaced">{{ studio.t('arrows_line_style_label') }}</p>
          <p class="props-hint">{{ studio.t('arrows_line_style_hint') }}</p>
          <div class="arrow-line-chip-grid">
            <button
              type="button"
              class="arrow-line-chip"
              :class="{ on: studio.arrowEditLineStyle === 'straight' }"
              @click="studio.arrowEditLineStyle = 'straight'"
            >
              <svg class="arrow-line-icon" viewBox="0 0 44 14" aria-hidden="true">
                <line x1="4" y1="7" x2="38" y2="7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                <polygon points="40,7 34,4 34,10" fill="currentColor" />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_line_straight') }}</span>
            </button>
            <button
              type="button"
              class="arrow-line-chip"
              :class="{ on: studio.arrowEditLineStyle === 'dashed' }"
              @click="studio.arrowEditLineStyle = 'dashed'"
            >
              <svg class="arrow-line-icon" viewBox="0 0 44 14" aria-hidden="true">
                <line
                  x1="4"
                  y1="7"
                  x2="36"
                  y2="7"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-dasharray="5 4"
                />
                <polygon points="40,7 35,4 35,10" fill="currentColor" />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_line_dashed') }}</span>
            </button>
            <button
              type="button"
              class="arrow-line-chip"
              :class="{ on: studio.arrowEditLineStyle === 'double' }"
              @click="studio.arrowEditLineStyle = 'double'"
            >
              <svg class="arrow-line-icon" viewBox="0 0 44 14" aria-hidden="true">
                <line x1="4" y1="4.5" x2="32" y2="4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <line x1="4" y1="9.5" x2="32" y2="9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <polygon points="40,7 34,4 34,10" fill="currentColor" />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_line_double') }}</span>
            </button>
            <button
              type="button"
              class="arrow-line-chip"
              :class="{ on: studio.arrowEditLineStyle === 'curved' }"
              @click="studio.arrowEditLineStyle = 'curved'"
            >
              <svg class="arrow-line-icon" viewBox="0 0 44 14" aria-hidden="true">
                <path
                  d="M 4 10 Q 18 2 32 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                />
                <polygon points="40,7 35,4 35,10" fill="currentColor" />
              </svg>
              <span class="sr-only">{{ studio.t('arrow_line_curved') }}</span>
            </button>
          </div>
          <div class="prop-row">
            <label class="prop-label">{{ studio.t('arrows_color') }}</label>
            <input v-model="studio.arrowEditColor" type="color" class="color-inp" />
            <input v-model="studio.arrowEditColor" type="text" class="hex-inp grow" maxlength="7" />
          </div>
          <label class="slider-row">
            <span>{{ studio.t('arrows_width') }} {{ Math.round(studio.arrowEditStrokeNorm * 1000) }}</span>
            <input v-model.number="studio.arrowEditStrokeNorm" type="range" min="0.0015" max="0.014" step="0.0005" />
          </label>
          <label class="slider-row">
            <span>{{ studio.t('arrows_opacity') }} {{ Math.round(studio.arrowEditOpacity * 100) }}%</span>
            <input v-model.number="studio.arrowEditOpacity" type="range" min="0.2" max="1" step="0.05" />
          </label>
          <p class="props-field-label">{{ studio.t('arrows_list') }}</p>
          <ul class="arrow-list">
            <li v-for="(ar, idx) in studio.arrowAnnotations" :key="ar.id">
              <button
                type="button"
                class="arrow-list-btn"
                :class="{ on: studio.activeArrowId === ar.id }"
                @click="studio.activeArrowId = ar.id"
              >
                {{ studio.t('arrows_item') }} {{ idx + 1 }}
              </button>
            </li>
          </ul>
          <button
            type="button"
            class="pill-btn pill-btn--ghost arrows-delete-btn"
            :disabled="!studio.activeArrowId"
            @click="studio.deleteActiveArrow"
          >
            {{ studio.t('arrows_delete') }}
          </button>
        </div>
      </aside>
</template>
