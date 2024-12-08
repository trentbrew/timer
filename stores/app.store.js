export const useAppStore = (() => {
  const getStorageItem = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  }

  const setStorageItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const count = { value: getStorageItem('count', 0) }
  const name = { value: getStorageItem('name', 'John Doe') }
  const settings = {
    value: getStorageItem('settings', {
      theme: 'light',
      notifications: true,
      language: 'en',
    }),
  }

  const increment = () => {
    count.value++
    setStorageItem('count', count.value)
  }

  const decrement = () => {
    count.value--
    setStorageItem('count', count.value)
  }

  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings }
    setStorageItem('settings', settings.value)
  }

  return {
    count,
    name,
    settings,
    increment,
    decrement,
    updateSettings,
  }
})()
