<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div class="px-6 py-5 border-b border-slate-800">
        <h1 class="text-xl font-bold">EduCom · Director</h1>
        <p class="text-xs text-slate-400 mt-1">Panel de control</p>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-1">
        <RouterLink
          to="/director"
          class="block px-3 py-2 rounded-xl text-sm hover:bg-slate-800"
          active-class="bg-slate-800 text-white font-semibold"
        >
          📊 Resumen general
        </RouterLink>
        <!-- Más secciones a futuro -->
        <!--
        <RouterLink
          to="/director/otra"
          class="block px-3 py-2 rounded-xl text-sm hover:bg-slate-800"
          active-class="bg-slate-800 text-white font-semibold"
        >
          🧑‍🏫 Profesores
        </RouterLink>
        -->
      </nav>

      <div class="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
        Sesión de Director
      </div>
    </aside>

    <!-- Contenido -->
    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
