<script setup lang="ts">
import { useStudio } from '../useStudio';

const studio = useStudio();
</script>

<template>
  <button
    type="button"
    class="nav-item"
    :class="{ active: studio.activeMenu === 'arrows' }"
    @click="studio.selectMenu('arrows')"
  >
    <span class="nav-icon" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span class="nav-label">{{ studio.t('nav_arrows') }}</span>
  </button>
</template>
