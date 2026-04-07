<script setup lang="ts">
import { provide } from 'vue';
import { useStudioEditor, STUDIO_INJECT_KEY } from './useStudioEditor';
import StudioTopBar from './StudioTopBar.vue';
import StudioSideNav from './StudioSideNav.vue';
import StudioCanvasColumn from './StudioCanvasColumn.vue';
import StudioPropsPanel from './StudioPropsPanel.vue';
import StudioPreviewModal from './StudioPreviewModal.vue';

const studio = useStudioEditor();
provide(STUDIO_INJECT_KEY, studio);
</script>

<template>
  <div class="studio" :class="{ 'studio--light': !studio.themeDark }">
    <StudioTopBar />
    <div class="studio-body">
      <StudioSideNav />
      <StudioCanvasColumn />
      <StudioPropsPanel />
    </div>
    <StudioPreviewModal />
  </div>
</template>

<style src="./studio.css"></style>
