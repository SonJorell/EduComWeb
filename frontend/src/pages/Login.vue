<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-blue-700 mb-6">Iniciar Sesión</h1>
      <form>
        <label class="block mb-2 font-semibold text-gray-700">Usuario</label>
        <input type="text" placeholder="Correo institucional"
               class="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

        <label class="block mb-2 font-semibold text-gray-700">Contraseña</label>
        <input type="password" placeholder="••••••••"
               class="w-full px-3 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

        <button type="submit" class="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800">
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>
