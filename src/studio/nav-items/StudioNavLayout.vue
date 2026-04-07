<script setup lang="ts">
import { useStudio } from '../useStudio';

const studio = useStudio();
</script>

<template>
  <button
    type="button"
    class="nav-item"
    :class="{ active: studio.activeMenu === 'layout' }"
    @click="studio.selectMenu('layout')"
  >
    <span class="nav-icon" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </span>
    <span class="nav-label">{{ studio.t('nav_layout') }}</span>
  </button>
</template>
