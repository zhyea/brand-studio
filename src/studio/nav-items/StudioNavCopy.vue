<script setup lang="ts">
import { useStudio } from '../useStudio';

const studio = useStudio();
</script>

<template>
  <button
    type="button"
    class="nav-item"
    :class="{ active: studio.activeMenu === 'description' }"
    @click="studio.selectMenu('description')"
  >
    <span class="nav-icon nav-icon--text" aria-hidden="true">T</span>
    <span class="nav-label">{{ studio.t('nav_copy') }}</span>
  </button>
</template>
