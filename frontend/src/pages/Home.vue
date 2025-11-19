<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createIcons, icons } from 'lucide'

const router = useRouter()
const mobileMenuOpen = ref(false)

const features = [
  {
    icon: 'graduation-cap',
    title: 'Excelencia Académica',
    description: 'Nuestro riguroso plan de estudios prepara a los estudiantes para el éxito futuro en un entorno de apoyo.'
  },
  {
    icon: 'trophy',
    title: 'Programas Deportivos',
    description: 'Fomentamos el trabajo en equipo y la condición física a través de una variedad de deportes competitivos.'
  },
  {
    icon: 'palette',
    title: 'Arte y Cultura',
    description: 'Los estudiantes pueden explorar su creatividad a través de nuestros diversos programas de arte y música.'
  }
]

const news = [
  {
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    date: '26 de Octubre, 2025',
    title: 'Ganadores de la Feria de Ciencias Anual',
    description: 'Nuestros estudiantes destacaron con proyectos innovadores en ciencia y tecnología.'
  },
  {
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
    date: '24 de Octubre, 2025',
    title: 'Equipo de Fútbol Gana Campeonato Regional',
    description: 'Celebramos el triunfo de nuestro equipo en la competencia interescolar.'
  },
  {
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    date: '22 de Octubre, 2025',
    title: 'Jornada de Limpieza Comunitaria',
    description: 'Estudiantes y profesores participaron en una actividad de servicio comunitario.'
  }
]

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function navigateToLogin() {
  router.push('/login')
}

onMounted(() => {
  createIcons({ icons })
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
    
    <!-- Header/Navbar -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center gap-3 group cursor-pointer">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <img 
                src="https://i.postimg.cc/nrQmRMvz/logo-Colegio-Arica.png" 
                alt="Colegio Arica"
                class="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">Colegio Arica</h1>
              <p class="text-xs text-slate-500">Excelencia Educativa</p>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a href="#inicio" class="text-slate-700 hover:text-blue-600 font-medium transition-colors">Inicio</a>
            
            <a href="#academico" class="text-slate-700 hover:text-blue-600 font-medium transition-colors">Académico</a>
            
            <a href="#noticias" class="text-slate-700 hover:text-blue-600 font-medium transition-colors">Noticias</a>
            <a href="#contacto" class="text-slate-700 hover:text-blue-600 font-medium transition-colors">Contacto</a>
          </div>

          <!-- Login Button Desktop -->
          <button 
            @click="navigateToLogin"
            class="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-100 transition-all group"
          >
            <i data-lucide="log-in" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"></i>
            <span>Iniciar Sesión</span>
          </button>

          <!-- Mobile menu button -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Menú"
          >
            <i :data-lucide="mobileMenuOpen ? 'x' : 'menu'" class="w-6 h-6 text-slate-700"></i>
          </button>
        </div>

        <!-- Mobile Menu -->
        <Transition name="slide-down">
          <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-200">
            <div class="flex flex-col gap-4">
              <a href="#inicio" class="text-slate-700 hover:text-blue-600 font-medium transition-colors py-2">Inicio</a>
              
              <a href="#academico" class="text-slate-700 hover:text-blue-600 font-medium transition-colors py-2">Académico</a>
              
              <a href="#noticias" class="text-slate-700 hover:text-blue-600 font-medium transition-colors py-2">Noticias</a>
              <a href="#contacto" class="text-slate-700 hover:text-blue-600 font-medium transition-colors py-2">Contacto</a>
              <button 
                @click="navigateToLogin"
                class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg mt-2"
              >
                <i data-lucide="log-in" class="w-4 h-4"></i>
                <span>Iniciar Sesión</span>
              </button>
            </div>
          </div>
        </Transition>
      </nav>
    </header>

    <!-- Hero Section -->
    <section id="inicio" class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-slide-up">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Formando el futuro desde 1950</span>
            </div>
            
            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight animate-slide-up" style="animation-delay: 100ms;">
              Bienvenidos al
              <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Colegio Arica
              </span>
            </h2>
            
            <p class="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-up" style="animation-delay: 200ms;">
              Un lugar para el crecimiento, el aprendizaje y la comunidad. Descubre nuestro compromiso con la excelencia académica y el desarrollo personal.
            </p>

            
          </div>

          <!-- Right Image -->
          <div class="relative animate-slide-up" style="animation-delay: 400ms;">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl blur-3xl opacity-20"></div>
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://i.postimg.cc/8zr17MTW/Gemini-Generated-Image-im3eppim3eppim3e.png" 
                alt="Estudiantes en el campus"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <!-- Floating Cards -->
            <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-4 border border-slate-200 animate-float">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <i data-lucide="users" class="w-6 h-6 text-green-600"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-slate-900">800+</p>
                  <p class="text-sm text-slate-500">Estudiantes</p>
                </div>
              </div>
            </div>

            <div class="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-4 border border-slate-200 animate-float" style="animation-delay: 1s;">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i data-lucide="award" class="w-6 h-6 text-blue-600"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-slate-900">75</p>
                  <p class="text-sm text-slate-500">Años</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="nosotros" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            ¿Por qué elegir el Colegio Arica?
          </h2>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto">
            Proporcionamos una educación integral que nutre el crecimiento intelectual, social y emocional de los estudiantes.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="(feature, idx) in features" 
            :key="idx"
            class="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <i :data-lucide="feature.icon" class="w-8 h-8 text-white"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ feature.title }}</h3>
            <p class="text-slate-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section id="noticias" class="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Últimas Noticias</h2>
            <p class="text-slate-600">Mantente informado sobre nuestras actividades y logros</p>
          </div>
          <a href="#" class="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group">
            <span>Ver Todas</span>
            <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="(item, idx) in news" 
            :key="idx"
            class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200"
          >
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="item.image" 
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div class="p-6">
              <p class="text-sm text-blue-600 font-semibold mb-2">{{ item.date }}</p>
              <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{{ item.title }}</h3>
              <p class="text-slate-600 text-sm mb-4">{{ item.description }}</p>
              <a href="#" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group/link">
                <span>Leer Más</span>
                <i data-lucide="arrow-right" class="w-4 h-4 group-hover/link:translate-x-1 transition-transform"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- About -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <img 
                  src="https://i.postimg.cc/nrQmRMvz/logo-Colegio-Arica.png" 
                  alt="Colegio Arica"
                  class="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Colegio Arica</h3>
                <p class="text-sm text-slate-400">Excelencia Educativa</p>
              </div>
            </div>
            <p class="text-slate-400 mb-6 max-w-md">
              Fomentando una comunidad de aprendices dedicados a la excelencia académica, el crecimiento personal y el liderazgo compasivo.
            </p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <i data-lucide="facebook" class="w-5 h-5"></i>
              </a>
              <a href="#" class="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <i data-lucide="twitter" class="w-5 h-5"></i>
              </a>
              <a href="#" class="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <i data-lucide="instagram" class="w-5 h-5"></i>
              </a>
            </div>
          </div>

          <!-- Contact -->
          <div id="contacto">
            <h4 class="text-white font-bold mb-4">Contáctanos</h4>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start gap-2">
                <i data-lucide="map-pin" class="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"></i>
                <span>123 Avenida Educación, Arica, Chile</span>
              </li>
              <li class="flex items-center gap-2">
                <i data-lucide="phone" class="w-4 h-4 text-blue-400"></i>
                <span>(56-58) 222-3344</span>
              </li>
              <li class="flex items-center gap-2">
                <i data-lucide="mail" class="w-4 h-4 text-blue-400"></i>
                <span>contacto@colegioarica.cl</span>
              </li>
            </ul>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-white font-bold mb-4">Enlaces Rápidos</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="#nosotros" class="hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="#academico" class="hover:text-white transition-colors">Académico</a></li>
              <li><a href="#admision" class="hover:text-white transition-colors">Admisión</a></li>
              <li><a href="#noticias" class="hover:text-white transition-colors">Noticias</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom -->
        <div class="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2025 Colegio Arica. Todos los derechos reservados.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" class="hover:text-white transition-colors">Términos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.slide-down-enter-active {
  animation: slide-down 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slide-down 0.3s ease-in reverse;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
</style>
