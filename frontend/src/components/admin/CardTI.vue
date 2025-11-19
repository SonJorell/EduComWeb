<template>
  <div
    class="bg-slate-900/70 border border-slate-800 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer group"
    :class="hoverColor"
    @click="$emit('open')"
  >
    <div class="flex items-center gap-3 mb-3">
      <div :class="iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center">
        <i :data-lucide="icon" class="w-6 h-6" :class="iconColor"></i>
      </div>
      <h2 class="text-lg font-semibold text-white group-hover:opacity-90">{{ title }}</h2>
    </div>

    <p class="text-slate-400 text-sm mb-4">{{ desc }}</p>

    <button
      class="w-full py-2 rounded-lg font-semibold border transition-all"
      :class="buttonStyle"
    >
      Abrir módulo
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  desc: String,
  icon: String,
  color: String  // blue | green | purple | red | cyan
})

const iconColor = {
  blue: "text-blue-400",
  green: "text-green-400",
  purple: "text-purple-400",
  red: "text-red-400",
  cyan: "text-cyan-400"
}[props.color]

const iconBg = {
  blue: "bg-blue-600/20",
  green: "bg-green-600/20",
  purple: "bg-purple-600/20",
  red: "bg-red-600/20",
  cyan: "bg-cyan-600/20"
}[props.color]

const buttonStyle = {
  blue: "bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border-blue-600/40",
  green: "bg-green-600/20 hover:bg-green-600/40 text-green-300 border-green-600/40",
  purple: "bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border-purple-600/40",
  red: "bg-red-600/20 hover:bg-red-600/40 text-red-300 border-red-600/40",
  cyan: "bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border-cyan-600/40"
}[props.color]

const hoverColor = {
  blue: "hover:border-blue-500/40",
  green: "hover:border-green-500/40",
  purple: "hover:border-purple-500/40",
  red: "hover:border-red-500/40",
  cyan: "hover:border-cyan-500/40"
}[props.color]
</script>
