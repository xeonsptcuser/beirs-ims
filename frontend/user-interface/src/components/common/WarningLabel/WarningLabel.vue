<script setup lang="ts">

defineProps({
  hasError: {
    type: Boolean,
    required: false,
    default: false
  },
  errors: {
    type: Array<{ error: string }>,
    required: true
  }
})

</script>
<template>
  <div class="alert alert-danger" :class="{ 'mb-4': hasError }" role="alert" v-if="hasError">
    <ul class="bg-white rounded p-2 mb-1 list-group-flush">
      <li class="list-group-item" :class="{ 'mb-1': errors.length > 1 }" style="font-size: 13px;"
        v-for="(message, index) in errors" :key="index"><i class="bi bi-exclamation-circle-fill"
          style="font-size: 13px;"></i> {{
            message.error
          }}
      </li>
    </ul>
  </div>
</template>
