<script setup lang="ts">
import type { PaginationLink } from '@/Types';

defineProps<{
  links: PaginationLink[];
  currentPage: number;
  disabled?: boolean;
}>();

const emit = defineEmits<(e: 'change', page: number) => void>();

</script>
<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li v-for="link in links" :key="link.label" :class="['page-item', { active: link.active, disabled: !link.page }]">
        <button class="page-link" type="button" v-html="link.label" @click="emit('change', link.page!)"
          :disabled="!link.page || disabled"></button>
      </li>
    </ul>
  </nav>
</template>
