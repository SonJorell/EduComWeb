export const defaultLayout = [
  // ========================
  //   Stats Principales
  // ========================
  {
    i: "stat-profesores",
    x: 0, y: 0, w: 4, h: 3,
    component: "StatsProfesores"
  },
  {
    i: "stat-apoderados",
    x: 4, y: 0, w: 4, h: 3,
    component: "StatsApoderados"
  },
  {
    i: "stat-asistencia",
    x: 8, y: 0, w: 4, h: 3,
    component: "StatsAsistencia"
  },

  // ========================
  //   Gráficos principales
  // ========================
  {
    i: "chart-usage",
    x: 0, y: 3, w: 6, h: 7,
    component: "UsageChartWidget"
  },
  {
    i: "chart-participation",
    x: 6, y: 3, w: 6, h: 7,
    component: "ParticipationChartWidget"
  },

  // ========================
  //   Tipos + Ranking
  // ========================
  {
    i: "chart-tipos",
    x: 0, y: 10, w: 4, h: 6,
    component: "TiposNotificacionWidget"
  },
  {
    i: "ranking-cursos",
    x: 4, y: 10, w: 8, h: 6,
    component: "RankingCursosWidget"
  },

  // ========================
  //   Mapa calor
  // ========================
  {
    i: "heatmap-niveles",
    x: 0, y: 16, w: 12, h: 6,
    component: "HeatmapNivelesWidget"
  },

  // ========================
  //   Comparación
  // ========================
  {
    i: "compare-cursos",
    x: 0, y: 22, w: 12, h: 8,
    component: "CoursesCompareWidget"
  },

  // ========================
  //   Detalle curso + tabla
  // ========================
  {
    i: "detalle-curso",
    x: 0, y: 30, w: 4, h: 6,
    component: "CursoDetailWidget"
  },
  {
    i: "alumnos-curso",
    x: 4, y: 30, w: 8, h: 10,
    component: "CourseStudentsWidget"
  }
];
