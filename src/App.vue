<script setup>
  import { ref } from 'vue'
  import { useAppStore } from '../stores/app.store'
  import Timer from './components/widget/Timer.vue'
  import Settings from './components/modal/Settings.vue'
  import About from './components/modal/About.vue'

  const state = ref({
    settings: {
      theme: 'business',
      notifications: true,
      language: 'en',
    },
  })

  const saveSettings = () => {
    console.log('saveSettings')
    const appStore = useAppStore()
    appStore.updateSettings(state.value.settings)
  }
</script>

<template>
  <input type="checkbox" id="my_modal_settings" class="modal-toggle" />
  <input type="checkbox" id="my_modal_about" class="modal-toggle" />
  <div class="modal max-w-[400px] max-h-[100vh] backdrop-blur-lg" role="dialog">
    <div class="modal-box bg-base-200 max-w-[70vw]">
      <h3 class="text-lg font-bold">Settings</h3>
      <Settings v-model="state.settings" />
      <div class="modal-action">
        <label for="my_modal_settings" class="btn btn-sm">Done</label>
      </div>
    </div>
  </div>
  <div class="modal max-w-[400px] max-h-[100vh] backdrop-blur-lg" role="dialog">
    <div class="modal-box bg-base-200 max-w-[70vw]">
      <h3 class="text-lg font-bold">About</h3>
      <About />
      <div class="modal-action">
        <label for="my_modal_about" class="btn btn-sm">Done</label>
      </div>
    </div>
  </div>
  <div
    id="sidepanel"
    class="flex flex-col w-full h-full box-border bg-base-300"
  >
    <main
      id="sidepanel-content"
      class="flex-1 overflow-y-auto h-screen p-4 box-border"
    >
      <Timer />
    </main>
  </div>
</template>

<style scoped></style>
