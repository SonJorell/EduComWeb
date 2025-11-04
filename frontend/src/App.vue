<template>
  <div>
    <Loader v-if="loading" />

    <router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Loader from './components/Loader.vue'

const loading = ref(false)
const router = useRouter()

router.beforeEach((to, from, next) => {
  loading.value = true
  next()
})
router.afterEach(() => {
  setTimeout(() => (loading.value = false), 400)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
