<script setup lang="ts">
import { useStudio } from './useStudio';

const studio = useStudio();
</script>

<template>
  <header class="topbar">
      <div class="topbar-left">
        <span class="brand">{{ studio.t('brandName') }}</span>
      </div>
      <div class="topbar-center">
        <div class="zoom-group">
          <button type="button" class="icon-btn" :title="studio.t('zoom_out')" @click="studio.zoomOut">−</button>
          <span class="zoom-label">{{ studio.zoomPercent }}%</span>
          <button type="button" class="icon-btn" :title="studio.t('zoom_in')" @click="studio.zoomIn">+</button>
          <button type="button" class="pill-btn" :title="studio.t('zoom_fit')" @click="studio.zoomFit">
            {{ studio.t('zoom_fit') }}
          </button>
        </div>
        <label class="preset-select-wrap">
          <span class="sr-only">{{ studio.t('sr_canvas_preset') }}</span>
          <select v-model="studio.exportPreset" class="preset-select">
            <option value="thumb">{{ studio.t('export_size_thumb') }}</option>
            <option value="standard">{{ studio.t('export_size_standard') }}</option>
            <option value="large">{{ studio.t('export_size_large') }}</option>
            <option value="custom">{{ studio.t('export_size_custom') }}</option>
          </select>
        </label>
      </div>
      <div class="topbar-right">
        <div class="topbar-icon-group" role="group" :aria-label="studio.t('aria_history')">
          <button
            type="button"
            class="icon-btn icon-btn--toolbar"
            :title="`${studio.t('undo')} — ${studio.t('undo_shortcut_hint')}`"
            :aria-label="studio.t('undo')"
            :disabled="!studio.canUndo"
            @click="studio.undoSettings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn icon-btn--toolbar"
            :title="`${studio.t('redo')} — ${studio.t('redo_shortcut_hint')}`"
            :aria-label="studio.t('redo')"
            :disabled="!studio.canRedo"
            @click="studio.redoSettings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3-2.3" />
            </svg>
          </button>
        </div>
        <button type="button" class="toolbar-action" @click="studio.clearWorkspace">
          {{ studio.t('clear_workspace') }}
        </button>
        <button
          type="button"
          class="toolbar-action"
          :disabled="!studio.screenshotImg"
          @click="studio.openExportPreview"
        >
          {{ studio.t('preview') }}
        </button>
        <button
          type="button"
          class="export-btn"
          :disabled="!studio.canExport"
          @click="studio.exportImage"
        >
          {{ studio.busy ? studio.t('exporting') : studio.t('export') }}
        </button>
      </div>
  </header>
</template>
