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
    description: 'Nuestro riguroso plan de estudios prepara a los estudiantes para el éxito futuro en un entorno de apoyo y desafío intelectual.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: 'trophy',
    title: 'Programas Deportivos',
    description: 'Fomentamos el trabajo en equipo, la disciplina y la condición física a través de una variedad de deportes competitivos.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: 'palette',
    title: 'Arte y Cultura',
    description: 'Los estudiantes exploran su creatividad y expresión a través de nuestros diversos y premiados programas de arte y música.',
    color: 'from-pink-500 to-rose-500'
  }
]

const news = [
  {
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    date: '26 Oct, 2025',
    category: 'Académico',
    title: 'Ganadores de la Feria de Ciencias Anual',
    description: 'Nuestros estudiantes destacaron con proyectos innovadores en ciencia y tecnología, llevándose los primeros lugares regionales.'
  },
  {
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
    date: '24 Oct, 2025',
    category: 'Deportes',
    title: 'Equipo de Fútbol Gana Campeonato Regional',
    description: 'Celebramos el triunfo histórico de nuestro equipo en la competencia interescolar, demostrando garra y espíritu deportivo.'
  },
  {
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    date: '22 Oct, 2025',
    category: 'Comunidad',
    title: 'Jornada de Limpieza Comunitaria',
    description: 'Más de 200 estudiantes y profesores participaron en una exitosa actividad de servicio comunitario para embellecer nuestro entorno.'
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
  <div class="min-h-screen font-sans bg-slate-50 overflow-x-hidden">
    
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/70 supports-[backdrop-filter]:bg-white/60">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-3 group cursor-pointer">
            <div class="w-12 h-12 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 ease-out">
                <img 
                src="https://i.postimg.cc/nrQmRMvz/logo-Colegio-Arica.png" 
                alt="Colegio Arica"
                class="w-full h-full object-contain p-1.5"
              />
            </div>
            <div>
              <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Colegio Arica</h1>
              <p class="text-xs font-medium text-blue-600 uppercase tracking-wider">Excelencia Educativa</p>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-10">
            <a v-for="item in ['Inicio', 'Nosotros', 'Noticias', 'Contacto']" :key="item" :href="`#${item.toLowerCase()}`" class="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300">
              {{ item }}
            </a>
          </div>

          <div class="hidden md:flex items-center gap-4">
            <button 
              @click="navigateToLogin"
              class="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span class="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span class="relative flex items-center gap-2">
                <i data-lucide="log-in" class="w-5 h-5 group-hover:translate-x-0.5 transition-transform"></i>
                Iniciar Sesión
              </span>
            </button>
          </div>

          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-label="Menú"
          >
            <i :data-lucide="mobileMenuOpen ? 'x' : 'menu'" class="w-7 h-7"></i>
          </button>
        </div>
      </nav>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-slate-200/70 px-4 pt-4 pb-6 shadow-lg rounded-b-3xl">
          <div class="flex flex-col gap-2">
            <a v-for="item in ['Inicio', 'Nosotros', 'Noticias', 'Contacto']" :key="item" :href="`#${item.toLowerCase()}`" class="px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-colors" @click="mobileMenuOpen = false">
              {{ item }}
            </a>
            <button 
              @click="navigateToLogin"
              class="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform"
            >
              <i data-lucide="log-in" class="w-5 h-5"></i>
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <section id="inicio" class="relative pt-20 pb-32 lg:pt-32 lg:pb-44 overflow-hidden bg-slate-50">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-3xl opacity-50 animate-blob"></div>
        <div class="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-indigo-400/20 blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-12 gap-16 items-center">
          <div class="lg:col-span-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-fade-in">
              <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span class="tracking-wide">Formando líderes desde 1950</span>
            </div>
            
            <h2 class="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight animate-fade-in animation-delay-200">
              Bienvenidos al
              <span class="relative whitespace-nowrap text-blue-600">
                <span class="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Colegio Arica</span>
                <svg aria-hidden="true" viewBox="0 0 418 42" class="absolute left-0 top-2/3 h-[0.5em] w-full fill-blue-200/60 z-0" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.073 1.246.677 1.462 3.09 1.123 13.56-1.9 55.349-8.736 121.195-19.83 67.626-11.4 124.156-18.628 166.412-21.284 4.151-.26 8.125-1.502 12.523-3.904 6.04-3.287 10.828-4.881 14.271-4.754 8.524.315 21.85 2.712 45.087 8.108 4.695 1.095 9.78 2.539 14.857 4.21 10.246 3.373 14.891 5.145 19.866 7.569 5.129 2.496 9.467 4.614 13.47 6.574 4.662 2.278 7.084 2.888 10.332 2.58 3.418-.324 4.891-1.422 5.912-4.388.58-1.69.017-2.853-1.496-3.108-1.172-.198-5.606-1.355-14.271-3.744-4.285-1.184-11.726-3.148-22.692-5.996-14.108-3.659-31.655-7.845-52.934-12.525C306.43 7.11 268.356.916 203.371.916z"></path></svg>
              </span>
            </h2>
            
            <p class="text-xl text-slate-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in animation-delay-400">
              Un espacio donde la excelencia académica se encuentra con el desarrollo humano. Descubre una comunidad comprometida con tu crecimiento integral.
            </p>

            <div class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-fade-in animation-delay-600">
                <a href="#nosotros" class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1">
                    Explorar Más
                    <i data-lucide="arrow-right" class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                </a>
                <a href="#contacto" class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-700 transition-all duration-300 bg-blue-50 border-2 border-blue-100 rounded-full hover:bg-blue-100 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-50">
                    Contactar
                </a>
            </div>
          </div>

          <div class="lg:col-span-6 relative animate-fade-in animation-delay-500">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-40 -z-10"></div>

            <div class="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20 border-[10px] border-white transform hover:scale-[1.02] transition-transform duration-500 z-20">
              <img 
                src="https://i.postimg.cc/8zr17MTW/Gemini-Generated-Image-im3eppim3eppim3e.png" 
                alt="Estudiantes felices en el campus"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent mix-blend-overlay pointer-events-none"></div>
            </div>
            
            <div class="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] p-5 border border-white/50 animate-float z-30">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <i data-lucide="users" class="w-7 h-7 text-white"></i>
                </div>
                <div>
                  <p class="text-3xl font-black text-slate-900 leading-none">800+</p>
                  <p class="text-sm font-semibold text-slate-500">Estudiantes Felices</p>
                </div>
              </div>
            </div>

            <div class="absolute -top-10 -right-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(99,_102,_241,_0.15)] p-5 border border-white/50 animate-float animation-delay-2000 z-30">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <i data-lucide="award" class="w-7 h-7 text-white"></i>
                </div>
                <div>
                  <p class="text-3xl font-black text-slate-900 leading-none">75</p>
                  <p class="text-sm font-semibold text-slate-500">Años de Historia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="nosotros" class="py-24 lg:py-32 bg-white relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Nuestra Propuesta</h2>
          <h3 class="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            ¿Por qué elegir el Colegio Arica?
          </h3>
          <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Proporcionamos una educación integral que nutre el crecimiento intelectual, social y emocional, preparando a los estudiantes para un mundo en constante cambio.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div 
            v-for="(feature, idx) in features" 
            :key="idx"
            class="group relative bg-slate-50 p-1 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 ease-out"
          >
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] -z-10" :class="feature.color"></div>
            
            <div class="h-full bg-white rounded-[2.3rem] p-8 lg:p-10 relative overflow-hidden z-10 shadow-xl shadow-slate-200/50 group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-shadow">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br opacity-10 rounded-full blur-3xl transition-all group-hover:scale-150 duration-700" :class="feature.color"></div>

              <div class="w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out" :class="feature.color">
                <i :data-lucide="feature.icon" class="w-10 h-10 text-white"></i>
              </div>
              <h3 class="text-2xl font-bold text-slate-900 mb-4">{{ feature.title }}</h3>
              <p class="text-slate-600 text-lg leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="noticias" class="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 class="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Actualidad</h2>
            <h3 class="text-4xl sm:text-5xl font-black text-slate-900 mb-2 tracking-tight">Últimas Noticias</h3>
            <p class="text-xl text-slate-600">Mantente informado sobre nuestras actividades y logros.</p>
          </div>
          <a href="#" class="hidden sm:inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 group transition-colors text-lg">
            <span>Ver Todas</span>
            <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>

        <div class="grid md:grid-cols-3 gap-8 lg:gap-10">
          <div 
            v-for="(item, idx) in news" 
            :key="idx"
            class="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ease-out hover:-translate-y-2 cursor-pointer border border-slate-100"
          >
            <div class="relative h-64 overflow-hidden">
              <img 
                :src="item.image" 
                :alt="item.title"
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="absolute top-4 left-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600/90 text-white backdrop-blur-sm shadow-sm">
                  {{ item.category }}
                </span>
              </div>
            </div>

            <div class="flex-1 p-8 flex flex-col">
              <div class="flex items-center gap-2 text-sm text-slate-500 font-medium mb-4">
                <i data-lucide="calendar" class="w-4 h-4 text-blue-500"></i>
                <span>{{ item.date }}</span>
              </div>
              <h3 class="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                {{ item.title }}
              </h3>
              <p class="text-slate-600 text-base mb-8 line-clamp-3 flex-1 leading-relaxed">{{ item.description }}</p>
              <div class="mt-auto">
                <span class="inline-flex items-center gap-2 text-blue-600 font-bold group/link">
                  <span>Leer Más</span>
                  <i data-lucide="arrow-right" class="w-5 h-5 group-hover/link:translate-x-2 transition-transform"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
         <div class="mt-12 text-center sm:hidden">
            <a href="#" class="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 group transition-colors text-lg">
            <span>Ver Todas las Noticias</span>
            <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </a>
         </div>
      </div>
    </section>

    <footer id="contacto" class="bg-slate-900 text-slate-300 pt-24 pb-12 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none mix-blend-overlay"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          <div class="md:col-span-5 lg:col-span-4">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <img 
                  src="https://i.postimg.cc/nrQmRMvz/logo-Colegio-Arica.png" 
                  alt="Colegio Arica"
                  class="w-12 h-12 object-contain p-1"
                />
              </div>
              <div>
                <h3 class="text-2xl font-extrabold text-white tracking-tight">Colegio Arica</h3>
                <p class="text-sm font-medium text-blue-400 uppercase tracking-wider">Excelencia Educativa</p>
              </div>
            </div>
            <p class="text-slate-400 mb-8 text-lg leading-relaxed">
              Fomentando una comunidad de aprendices dedicados a la excelencia académica, el crecimiento personal y el liderazgo compasivo para un futuro brillante.
            </p>
            <div class="flex gap-4">
              <a v-for="social in ['facebook', 'twitter', 'instagram', 'linkedin']" :key="social" href="#" class="w-12 h-12 bg-slate-800/50 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-transparent hover:shadow-blue-600/30 group">
                <i :data-lucide="social" class="w-6 h-6 text-slate-400 group-hover:text-white transition-colors"></i>
              </a>
            </div>
          </div>

          <div class="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
              <h4 class="text-white text-lg font-bold mb-8 relative inline-block after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-500 after:rounded-full">Enlaces Rápidos</h4>
              <ul class="space-y-4">
                <li><a href="#nosotros" class="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"><i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors"></i>Nosotros</a></li>
                <li><a href="#academico" class="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"><i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors"></i>Académico</a></li>
                <li><a href="#admision" class="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"><i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors"></i>Admisión</a></li>
                <li><a href="#noticias" class="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"><i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors"></i>Noticias</a></li>
              </ul>
            </div>

            <div class="sm:col-span-2 lg:col-span-2">
              <h4 class="text-white text-lg font-bold mb-8 relative inline-block after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-500 after:rounded-full">Información de Contacto</h4>
              <ul class="space-y-6">
                <li class="flex items-start gap-4 group">
                  <div class="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                      <i data-lucide="map-pin" class="w-5 h-5 text-blue-400"></i>
                  </div>
                  <div>
                      <p class="text-white font-semibold mb-1">Dirección</p>
                      <span class="text-slate-400 leading-relaxed">123 Avenida Educación, Arica, Chile. Código Postal 1000000.</span>
                  </div>
                </li>
                <li class="flex items-start gap-4 group">
                   <div class="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                      <i data-lucide="phone" class="w-5 h-5 text-blue-400"></i>
                  </div>
                  <div>
                      <p class="text-white font-semibold mb-1">Teléfono</p>
                      <span class="text-slate-400">(56-58) 222-3344</span>
                  </div>
                </li>
                <li class="flex items-start gap-4 group">
                   <div class="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                      <i data-lucide="mail" class="w-5 h-5 text-blue-400"></i>
                  </div>
                  <div>
                      <p class="text-white font-semibold mb-1">Email</p>
                      <a href="mailto:contacto@colegioarica.cl" class="text-slate-400 hover:text-blue-400 transition-colors">contacto@colegioarica.cl</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p class="text-center md:text-left">© 2025 <strong class="text-white">Colegio Arica</strong>. Todos los derechos reservados.</p>
          <div class="flex gap-8 font-medium">
            <a href="#" class="hover:text-blue-400 transition-colors">Política de Privacidad</a>
            <a href="#" class="hover:text-blue-400 transition-colors">Términos de Uso</a>
            <a href="#" class="hover:text-blue-400 transition-colors">Mapa del Sitio</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Custom Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes blob-spin {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-fade-in {
  animation: fade-in-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0; /* Start hidden */
}

.animate-float {
  animation: float-slow 4s ease-in-out infinite;
}

.animate-blob {
  animation: blob-spin 20s infinite;
}

.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }
.animation-delay-500 { animation-delay: 0.5s; }
.animation-delay-600 { animation-delay: 0.6s; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

/* Smooth Scroll */
html {
  scroll-behavior: smooth;
}

/* Line Clamp Utilities (if not using @tailwindcss/line-clamp plugin) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>