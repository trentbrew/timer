<script setup>
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
  import { Play, Pause, RefreshCcw } from 'lucide-vue-next'
  import Header from '../layout/Header.vue'
  import Toast from '../ui/Toast.vue'

  const props = defineProps({
    duration: {
      type: Number,
      default: 300,
    },
    onUpdated: {
      type: Function,
      default: () => {},
    },
  })

  const timeInSeconds = ref(props.duration)
  const isRunning = ref(false)
  const initialTime = ref(props.duration)
  const toast = ref({
    type: '',
    message: '',
    active: false,
  })
  const prompt = ref('')
  const customPresets = ref([1, 5, 15, 30, 60])
  let interval = null

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeInSeconds.value / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (timeInSeconds.value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  const progress = computed(
    () => (timeInSeconds.value / initialTime.value) * 100,
  )

  const timerColor = computed(() => {
    const percentage = timeInSeconds.value / initialTime.value
    const startColor = { r: 32, g: 156, b: 88 } // #209C58
    const endColor = { r: 255, g: 59, b: 78 } // #FF3B4E

    const red = Math.floor(
      startColor.r + (endColor.r - startColor.r) * (1 - percentage),
    )
    const green = Math.floor(
      startColor.g + (endColor.g - startColor.g) * (1 - percentage),
    )
    const blue = Math.floor(
      startColor.b + (endColor.b - startColor.b) * (1 - percentage),
    )

    return `rgb(${red}, ${green}, ${blue})`
  })

  const haloStroke = computed(() => 'white')

  const haloDasharray = computed(() => 2 * Math.PI * 140)

  const haloDashoffset = computed(
    () => haloDasharray.value * (1 - timeInSeconds.value / initialTime.value),
  )

  onMounted(() => {
    console.log('Timer mounted')
  })

  watch(isRunning, (newValue) => {
    if (newValue && timeInSeconds.value > 0) {
      interval = setInterval(() => {
        props.onUpdated({ current: timeInSeconds.value })
        timeInSeconds.value--

        if (timeInSeconds.value === Math.floor(initialTime.value / 2)) {
          triggerToast('warning', 'Half way done!')
        }

        if (timeInSeconds.value <= 0) {
          isRunning.value = false
          if (interval) clearInterval(interval)
        }
      }, 1000)
    } else if (!newValue && interval) {
      clearInterval(interval)
      interval = null
    }
  })

  const toggleTimer = () => {
    isRunning.value = !isRunning.value
  }

  const resetTimer = () => {
    isRunning.value = false
    timeInSeconds.value = initialTime.value
    props.onUpdated({ current: timeInSeconds.value })
  }

  const adjustTime = (minutes) => {
    if (!isRunning.value) {
      timeInSeconds.value = Math.max(0, timeInSeconds.value + minutes * 60)
      initialTime.value = timeInSeconds.value
    }
  }

  const handlePreset = (preset) => {
    if (!isRunning.value) {
      timeInSeconds.value = preset * 60
      initialTime.value = preset * 60
    }
  }

  const triggerToast = (type, message, duration = 5000) => {
    toast.value.type = type
    toast.value.message = message
    toast.value.active = true
    setTimeout(() => {
      toast.value.active = false
    }, duration)
  }

  const addCustomPreset = () => {
    const newPreset = parseInt(prompt.value)
    if (
      !isNaN(newPreset) &&
      newPreset > 0 &&
      !customPresets.value.includes(newPreset)
    ) {
      customPresets.value.push(newPreset)
      prompt.value = ''
    }
  }

  onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
  })
</script>

<template>
  <div
    class="absolute z-[100] top-0 left-0 w-full duration-[1s]"
    :class="
      isRunning
        ? 'opacity-0 scale-[0.9] translate-y-[-12px] blur-[32px] pointer-events-none'
        : 'opacity-1 scale-[1] blur-none'
    "
  >
    <Header />
  </div>
  <div class="absolute bottom-0 left-0 w-full p-8 bg-transparent">
    <Toast :type="toast.type" :message="toast.message" :active="toast.active" />
  </div>
  <div
    class="flex flex-col items-center justify-center p-8 text-white h-full w-full overflow-hidden duration-[2s]"
    :class="isRunning ? 'gap-0' : 'gap-4'"
  >
    <div
      class="w-full h-[100vh] absolute top-0 left-0 z-[0] duration-[3s] border-white/[0.16] rounded-[16px]"
      :class="isRunning ? 'border-[8px]' : 'border-[4px]'"
      :style="{ background: isRunning ? timerColor : 'transparent' }"
    ></div>
    <!-- Timer Display -->
    <div
      class="relative w-72 h-72 flex items-center justify-center rounded-full !aspect-square z-[10] duration-[1s]"
      :class="isRunning ? 'mb-6 scale-[0.88]' : 'mb-8 scale-[0.78]'"
      :style="`rotate: ${progress}%`"
    >
      <!-- Animated Halo -->
      <svg
        class="absolute w-full h-full -rotate-90 duration-300 rounded-full scale-[1] slow-rotation"
      >
        <circle
          cx="144"
          cy="144"
          r="140"
          class="opacity-100 transition-all duration-[1s]"
          :stroke-width="isRunning ? 8 : 0"
          :class="isRunning ? 'animate-pulse' : ''"
          :style="{
            stroke: isRunning ? '#ffffff' : '#ffffff11',
            fill: isRunning ? '#ffffff0f' : '#ffffff11',
            strokeDasharray: haloDasharray,
            strokeDashoffset: haloDashoffset,
            transition: 'all linear 1000ms !important',
          }"
        />
      </svg>

      <!-- Timer Text -->
      <div
        class="relative font-light tracking-wider duration-[1s]"
        :class="isRunning ? 'scale-[1] opacity-1' : 'scale-[0.88] opacity-1'"
        style="transition-timing-function: cubic-bezier(0, 0.55, 0.45, 1)"
      >
        <div
          class="countdown font-mono text-4xl flex items-center text-white/[0.33]"
        >
          <span
            class="!text-white duration-[1s]"
            :style="{ '--value': Math.floor(timeInSeconds / 3600) }"
            :class="timeInSeconds < 3600 ? 'opacity-[0.33]' : 'opacity-1'"
          ></span>
          :
          <span
            class="!text-white duration-[1s]"
            :style="{ '--value': Math.floor((timeInSeconds % 3600) / 60) }"
            :class="timeInSeconds < 60 ? 'opacity-[0.33]' : ''"
          ></span>
          :
          <span
            class="!text-white duration-[1s]"
            :style="{ '--value': timeInSeconds % 60 }"
          ></span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-4 mb-4 z-[10]">
      <button
        @click="toggleTimer"
        :aria-label="isRunning ? 'Pause timer' : 'Start timer'"
        :style="`color: ${timerColor}`"
        class="btn hover:bg-white rounded-full hover:scale-[1.1] active:scale-[0.9] flex justify-center items-center btn-ghost bg-white !duration-[300ms]"
        :class="isRunning ? '' : '!text-base-300'"
        style="width: 56px; height: 56px"
      >
        <div v-if="isRunning" name="pause">
          <Pause />
        </div>
        <div v-else name="play">
          <Play />
        </div>
      </button>

      <!-- Reset Button -->
      <button
        @click="resetTimer"
        aria-label="Reset timer"
        class="group btn btn-ghost bg-white/[0.1] !border-[1px] !border-white/[0.25] flex justify-center items-center rounded-full hover:base-white/[0.4] !duration-[300ms] active:scale-[0.98] active:bg-white/[0.3] !text-white"
        style="width: 56px; height: 56px"
      >
        <RefreshCcw
          class="!text-white stroke-white group-hover:rotate-[-90deg] duration-[300ms] group-active:rotate-[-110deg]"
          style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)"
        />
      </button>
    </div>

    <!-- Presets -->
    <div
      class="absolute z-[50] bottom-8 left-0 right-0 flex justify-center items-center"
    >
      <ul
        class="menu menu-horizontal rounded-full bg-white/[0.1] border-[1px] border-white/[0] !text-white gap-0 max-w-[100vw] px-3 !duration-[1s]"
        :class="
          isRunning
            ? 'opacity-0 scale-[0.9] translate-y-[12px] blur-[32px] pointer-events-none'
            : 'opacity-1 scale-[1] translate-y-[0px] blur-none'
        "
      >
        <li v-for="preset in customPresets" :key="preset">
          <button
            @click="handlePreset(preset)"
            :class="{
              'border-white bg-white/10': initialTime === preset * 60,
              'border-white/25 hover:bg-white/10': initialTime !== preset * 60,
            }"
            class="btn btn-ghost border-none rounded-full text-xs transition-all duration-[200ms] font-medium !gap-[3px]"
            :data-tip="
              preset >= 60
                ? `${Math.floor(preset / 60)}h ${
                    preset % 60 > 0 ? `${preset % 60}m` : ''
                  }`
                : `${preset}m`
            "
          >
            <template v-if="preset >= 60" class="flex items-end gap-0">
              {{ Math.floor(preset / 60) }}
              <span class="text-xs opacity-[0.4] !font-normal ml-[-2px]">
                h
              </span>
              {{ preset % 60 > 0 ? `${preset % 60}m` : '' }}
            </template>
            <template v-else class="flex items-end gap-0">
              {{ preset }}
              <span class="text-xs opacity-[0.4] !font-normal ml-[-2px]">
                m
              </span>
            </template>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  :root .countdown {
    line-height: 1em;
  }

  .countdown {
    display: inline-flex;
  }

  .countdown > * {
    height: 1em;
    display: inline-block;
    overflow-y: hidden;
  }

  .countdown > :before {
    position: relative;
    content: '00\A 01\A 02\A 03\A 04\A 05\A 06\A 07\A 08\A 09\A 10\A 11\A 12\A 13\A 14\A 15\A 16\A 17\A 18\A 19\A 20\A 21\A 22\A 23\A 24\A 25\A 26\A 27\A 28\A 29\A 30\A 31\A 32\A 33\A 34\A 35\A 36\A 37\A 38\A 39\A 40\A 41\A 42\A 43\A 44\A 45\A 46\A 47\A 48\A 49\A 50\A 51\A 52\A 53\A 54\A 55\A 56\A 57\A 58\A 59\A 60\A 61\A 62\A 63\A 64\A 65\A 66\A 67\A 68\A 69\A 70\A 71\A 72\A 73\A 74\A 75\A 76\A 77\A 78\A 79\A 80\A 81\A 82\A 83\A 84\A 85\A 86\A 87\A 88\A 89\A 90\A 91\A 92\A 93\A 94\A 95\A 96\A 97\A 98\A 99\A';
    white-space: pre;
    top: calc(var(--value) * -1em);
    text-align: center;
    transition: all 1s cubic-bezier(0.76, 0, 0.24, 1);
  }
</style>
