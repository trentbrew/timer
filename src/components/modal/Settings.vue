<script setup>
  import { onMounted, ref } from 'vue'

  const state = ref({
    name: 'Settings',
    loading: true,
    data: {},
  })

  onMounted(() => {
    console.log(`Mounted ${state.value.name}`)
    fetchData()

    const titleElement = document.querySelector('.settings-title')
    if (titleElement) {
      titleElement.textContent = state.value.name
    }
  })

  function fetchData() {
    console.log('Fetching data...')
  }
</script>

<template>
  <div class="bg-base-100 mt-4 w-full h-full rounded-sm p-8">
    settings content
  </div>
</template>
