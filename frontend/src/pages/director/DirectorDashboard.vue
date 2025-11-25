<template>
  <div ref="dashboardRef" class="space-y-8">

    <!-- ========================================== -->
    <!-- 🟦 HEADER SUPERIOR -->
    <!-- ========================================== -->
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">Panel de Dirección</h1>
        <p class="text-sm text-slate-400">
          Monitor en tiempo real del uso de EduCom por docentes y apoderados.
        </p>
      </div>

      <div class="flex items-center gap-3">

        <!-- BOTÓN CERRAR SESIÓN -->
        <button
          @click="logout"
          class="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl border border-red-700 bg-red-900 hover:bg-red-800 text-red-200 transition shadow-sm hover:shadow-md"
        >
          <span class="i-ph-sign-out-duotone"></span>
          Cerrar sesión
        </button>

        <!-- EXPORTAR PDF -->
        <button
          @click="exportToPDF"
          class="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 transition shadow-sm hover:shadow-md"
        >
          <span class="i-ph-file-pdf-duotone"></span>
          Exportar PDF
        </button>
      </div>
    </header>

    <!-- ========================================== -->
    <!-- 🟩 FILTRO DE CURSOS -->
    <!-- ========================================== -->
    <section
      class="bg-slate-900 border border-slate-800 p-4 rounded-2xl"
    >
      <label class="block text-xs text-slate-400 mb-1">Filtrar por curso</label>

      <select
        v-model="selectedCourseId"
        @change="loadCursoDetalle"
        class="bg-slate-950 border border-slate-700 text-sm rounded-xl px-3 py-2 min-w-[240px]"
      >
        <option value="">Todos los cursos</option>
        <option
          v-for="curso in cursos"
          :key="curso.id"
          :value="curso.id"
        >
          {{ curso.nombre }}
        </option>
      </select>
    </section>

    <!-- ========================================== -->
    <!-- 🟨 TARJETAS PRINCIPALES -->
    <!-- ========================================== -->
    <section>
      <h2 class="text-sm font-semibold text-slate-300 mb-2">Indicadores generales</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Uso de profesores"
          :value="stats.usoProfesores + '%'"
          subtitle="Han enviado al menos una notificación"
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          title="Participación apoderados"
          :value="stats.participacionApoderados + '%'"
          subtitle="Lectura de comunicados"
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          title="Asistencia confirmada"
          :value="stats.asistencia + '%'"
          subtitle="Confirmación a reuniones/eventos"
          color="from-emerald-500 to-green-500"
        />
      </div>
    </section>

    <!-- ========================================== -->
    <!-- 🟧 TARJETAS SECUNDARIAS -->
    <!-- ========================================== -->
    <section>
      <h2 class="text-sm font-semibold text-slate-300 mb-2">Actividad semanal</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Notificaciones enviadas"
          :value="stats.totalNotificacionesSemana"
          subtitle="Últimos 7 días"
          color="from-sky-500 to-indigo-500"
        />
        <StatsCard
          title="Profesores activos"
          :value="stats.totalProfesoresActivosSemana"
          subtitle="Docentes que usaron la plataforma"
          color="from-fuchsia-500 to-rose-500"
        />
        <StatsCard
          title="Apoderados lectores"
          :value="stats.totalApoderadosLectoresSemana"
          subtitle="Últimos 7 días"
          color="from-amber-400 to-orange-500"
        />
      </div>
    </section>

    <!-- ========================================== -->
    <!-- 🟥 GRÁFICOS -->
    <!-- ========================================== -->
    <section>
      <h2 class="text-sm font-semibold text-slate-300 mb-2">Tendencias semanales</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageChart :data="historial" />
        <ParticipationChart :data="historial" />
      </div>
    </section>

    <!-- ========================================== -->
    <!-- 🟪 TIPOS + RANKING -->
    <!-- ========================================== -->
    <section>
      <h2 class="text-sm font-semibold text-slate-300 mb-2">Distribución y análisis</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TiposNotificacionChart class="lg:col-span-1" :data="tiposNotificacion" />
        <RankingCursosProblema class="lg:col-span-2" :data="rankingCursos" />
      </div>
    </section>

    <!-- ========================================== -->
    <!-- 🟫 MAPA DE CALOR -->
    <!-- ========================================== -->
    <section>
      <h2 class="text-sm font-semibold text-slate-300 mb-2">Mapa de calor por niveles</h2>
      <HeatmapNiveles :data="heatmapNiveles" />
    </section>

    <!-- ========================================== -->
    <!-- 🟦 COMPARACIÓN ENTRE CURSOS -->
    <!-- ========================================== -->
    <section>
      <h2 class="text-sm font-semibold text-slate-300 mb-2">Comparación entre cursos</h2>
      <CoursesCompare :cursos="cursos" />
    </section>

    <!-- ========================================== -->
    <!-- 🟩 TABLA DETALLADA -->
    <!-- ========================================== -->
    <section>
      <h2 class="text-sm font-semibold text-slate-300 mb-2">
        Detalle del curso seleccionado
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <CursoDetailCard class="lg:col-span-1" :data="detalleCurso" />

        <div class="lg:col-span-2">
          <CourseStudentsTable
            v-if="selectedCourseId"
            :curso-id="Number(selectedCourseId)"
          />

          <div
            v-else
            class="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-xs text-slate-400"
          >
            Selecciona un curso en el filtro superior para ver el detalle de alumnos,
            apoderados y nivel de riesgo.
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import html2canvas from 'html2canvas/dist/html2canvas.esm.js'
import jsPDF from 'jspdf'

import StatsCard from '../../components/director/StatsCard.vue'
import UsageChart from '../../components/director/UsageChart.vue'
import ParticipationChart from '../../components/director/ParticipationChart.vue'
import CursoDetailCard from '../../components/director/CursoDetailCard.vue'
import RankingCursosProblema from '../../components/director/RankingCursosProblema.vue'
import TiposNotificacionChart from '../../components/director/TiposNotificacionChart.vue'
import HeatmapNiveles from '../../components/director/HeatmapNiveles.vue'
import CoursesCompare from '../../components/director/CoursesCompare.vue'
import CourseStudentsTable from '../../components/director/CourseStudentsTable.vue'

const API_URL = 'http://localhost:3000/api/director'

/* 👉 Cerrar sesión */
function logout () {
  localStorage.removeItem("token")
  window.location.href = "/login"
}

const stats = ref({
  usoProfesores: 0,
  participacionApoderados: 0,
  asistencia: 0,
  totalNotificacionesSemana: 0,
  totalProfesoresActivosSemana: 0,
  totalApoderadosLectoresSemana: 0
})
const historial = ref([])
const cursos = ref([])
const selectedCourseId = ref('')
const detalleCurso = ref(null)
const rankingCursos = ref([])
const tiposNotificacion = ref({})
const heatmapNiveles = ref([])

const dashboardRef = ref(null)

const token = () => localStorage.getItem('token')

async function fetchJSON (url) {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token()}`
      }
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error('❌ Error al cargar:', url, err)
    return null
  }
}

// API LOADERS
async function loadStats () { stats.value = await fetchJSON(`${API_URL}/estadisticas`) || stats.value }
async function loadHistorial () { historial.value = await fetchJSON(`${API_URL}/historial`) || historial.value }
async function loadCursos () { cursos.value = await fetchJSON(`${API_URL}/cursos`) || cursos.value }
async function loadRankingCursos () { rankingCursos.value = await fetchJSON(`${API_URL}/ranking`) || rankingCursos.value }
async function loadTiposNotificacion () { tiposNotificacion.value = await fetchJSON(`${API_URL}/tipos-notificacion`) || tiposNotificacion.value }
async function loadHeatmap () { heatmapNiveles.value = await fetchJSON(`${API_URL}/heatmap-niveles`) || heatmapNiveles.value }
async function loadCursoDetalle () {
  if (!selectedCourseId.value) return detalleCurso.value = null
  detalleCurso.value = await fetchJSON(`${API_URL}/curso/${selectedCourseId.value}`)
}

// PDF
async function exportToPDF () {
  const canvas = await html2canvas(dashboardRef.value, { scale: 2 })
  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF("p", "mm", "a4")
  const w = pdf.internal.pageSize.width
  const h = (canvas.height * w) / canvas.width

  pdf.addImage(imgData, "PNG", 0, 0, w, h)
  pdf.save("dashboard-direccion.pdf")
}

// INIT
onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadHistorial(),
    loadCursos(),
    loadRankingCursos(),
    loadTiposNotificacion(),
    loadHeatmap()
  ])

  setInterval(async () => {
    loadStats()
    loadHistorial()
    loadRankingCursos()
    loadTiposNotificacion()
    loadHeatmap()
    if (selectedCourseId.value) loadCursoDetalle()
  }, 10000)
})
</script>
