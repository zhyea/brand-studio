<script setup lang="ts">
import { useStudio } from '../useStudio';

const studio = useStudio();
</script>

<template>
  <button
    type="button"
    class="nav-item"
    :class="{ active: studio.activeMenu === 'background' }"
    @click="studio.selectMenu('background')"
  >
    <span class="nav-icon" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="2" />
        <path d="M21 17l-5-5-4 4-2-2-4 4" />
      </svg>
    </span>
    <span class="nav-label">{{ studio.t('nav_bg') }}</span>
  </button>
</template>
