<script setup lang="ts">
import { useStudio } from './useStudio';

const studio = useStudio();
</script>

<template>
    <Teleport to="body">
      <div
        v-if="studio.previewModalOpen"
        class="preview-modal-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-label="studio.t('preview')"
        @click.self="studio.closePreviewModal"
      >
        <div class="preview-modal" tabindex="-1" @keydown.escape.prevent="studio.closePreviewModal">
          <div class="preview-modal-head">
            <span>{{ studio.t('preview_modal_title', [studio.exportDims.label]) }}</span>
            <button type="button" class="preview-modal-close" @click="studio.closePreviewModal">
              {{ studio.t('close') }}
            </button>
          </div>
          <div class="preview-modal-body">
            <img
              v-if="studio.previewModalUrl"
              :src="studio.previewModalUrl"
              :alt="studio.t('preview_image_alt')"
              class="preview-modal-img"
            />
          </div>
        </div>
      </div>
    </Teleport>
</template>
