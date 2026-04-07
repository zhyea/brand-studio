<script setup lang="ts">
import { t } from '@/i18n';
import StudioNavLayout from './nav-items/StudioNavLayout.vue';
import StudioNavBackground from './nav-items/StudioNavBackground.vue';
import StudioNavCopy from './nav-items/StudioNavCopy.vue';
import StudioNavArrows from './nav-items/StudioNavArrows.vue';
import StudioNavTheme from './nav-items/StudioNavTheme.vue';
</script>

<template>
  <aside class="side-nav" :aria-label="t('aria_editor_menu')">
    <StudioNavLayout />
    <StudioNavBackground />
    <StudioNavCopy />
    <StudioNavArrows />
    <div class="nav-spacer" />
    <StudioNavTheme />
  </aside>
</template>
