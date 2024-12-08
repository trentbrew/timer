<script setup>
  import { reactive, defineProps } from 'vue'

  const props = defineProps({
    type: {
      type: String,
      default: 'info',
      validator: (value) =>
        ['info', 'warning', 'error', 'success'].includes(value),
    },
    message: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  })

  const state = reactive({
    name: 'Toast',
    loading: true,
    data: {
      active: false,
    },
  })
</script>

<template>
  <div
    class="toast toast-end w-full max-w-[400px] duration-[1s] pointer-events-none"
    :class="
      props.active
        ? 'opacity-1 blur-none'
        : 'opacity-0 blur-[48px] translate-y-[12px] scale-[0.7]'
    "
  >
    <!-- info (default) -->
    <div v-show="props.type === 'info' || !props.type" class="alert alert-info">
      <span>{{ props.message }}</span>
    </div>
    <!-- success -->
    <div v-show="props.type === 'success'" class="alert alert-success">
      <span>{{ props.message }}</span>
    </div>
    <!-- error -->
    <div v-show="props.type === 'error'" class="alert alert-error">
      <span>{{ props.message }}</span>
    </div>
    <!-- warning -->
    <div
      v-show="props.type === 'warning'"
      class="alert alert-warning !bg-white"
    >
      <span>{{ props.message }}</span>
    </div>
  </div>
</template>

<style scoped>
  .toast {
    @apply z-[100] font-medium;
  }
</style>
