<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
    <div class="relative flex space-x-2">
      <div class="w-4 h-4 bg-blue-600 rounded-full animate-pulse1"></div>
      <div class="w-4 h-4 bg-blue-600 rounded-full animate-pulse2"></div>
      <div class="w-4 h-4 bg-blue-600 rounded-full animate-pulse3"></div>
    </div>
    <p class="mt-4 text-blue-800 font-semibold text-lg tracking-wide animate-fadeIn">
      Cargando, por favor espera...
    </p>
  </div>
</template>

<style scoped>
@keyframes pulse1 {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes pulse2 {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes pulse3 {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.animate-pulse1 {
  animation: pulse1 1.2s infinite ease-in-out;
}
.animate-pulse2 {
  animation: pulse2 1.2s infinite ease-in-out 0.2s;
}
.animate-pulse3 {
  animation: pulse3 1.2s infinite ease-in-out 0.4s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.6s ease-in-out forwards;
}
</style>
