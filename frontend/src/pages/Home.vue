<template>
  <div class="bg-gray-50 min-h-screen">
    <Navbar />
    <main class="container mx-auto px-6 py-12 text-center">
      <h2 class="text-4xl font-bold text-blue-800 mb-4">Bienvenido al Colegio Arica</h2>
      <p class="text-gray-600 mb-8">
        Nuestra misión es formar estudiantes con valores, conocimientos y habilidades para el futuro.  
        EduCom facilita la comunicación entre el colegio, los profesores y los apoderados.
      </p>

      <img src="../assets/colegio.jpg" alt="Colegio Arica" class="mx-auto rounded-lg shadow-md w-3/4 mb-8">

      <section class="mt-10">
        <h3 class="text-2xl font-semibold text-blue-700 mb-3">Contáctanos</h3>
        <p class="text-gray-700">📍 Av. Santa María 2175, Arica, Chile</p>
        <p class="text-gray-700">☎️ +56 9 8765 4321</p>
        <p class="text-gray-700">✉️ contacto@colegioarica.cl</p>
      </section>
    </main>

    <footer class="bg-blue-900 text-white py-4 mt-12">
      <p class="text-center text-sm">© 2025 Colegio Arica | Desarrollado por J2N Software</p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
</script>
