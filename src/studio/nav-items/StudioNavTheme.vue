<script setup lang="ts">
import { useStudio } from '../useStudio';

const studio = useStudio();
</script>

<template>
  <button
    type="button"
    class="nav-item nav-item--theme"
    :title="studio.themeDark ? studio.t('theme_to_light') : studio.t('theme_to_dark')"
    @click="studio.toggleTheme"
  >
    <span class="nav-icon" aria-hidden="true">
      <svg
        v-if="studio.themeDark"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg
        v-else
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        />
      </svg>
    </span>
  </button>
</template>
