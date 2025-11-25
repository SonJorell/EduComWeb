<template>
  <component
    :is="componentMap[item.component]"
    v-bind="item.props || {}"
  />
</template>

<script setup>
import StatsCard from "./StatsCard.vue";
import UsageChart from "./UsageChart.vue";
import ParticipationChart from "./ParticipationChart.vue";
import RankingCursosProblema from "./RankingCursosProblema.vue";
import TiposNotificacionChart from "./TiposNotificacionChart.vue";
import HeatmapNiveles from "./HeatmapNiveles.vue";
import CoursesCompare from "./CoursesCompare.vue";
import CursoDetailCard from "./CursoDetailCard.vue";
import CourseStudentsTable from "./CourseStudentsTable.vue";

const props = defineProps({
  item: Object
});

const componentMap = {
  StatsProfesores: StatsCard,
  StatsApoderados: StatsCard,
  StatsAsistencia: StatsCard,
  UsageChartWidget: UsageChart,
  ParticipationChartWidget: ParticipationChart,
  RankingCursosWidget: RankingCursosProblema,
  TiposNotificacionWidget: TiposNotificacionChart,
  HeatmapNivelesWidget: HeatmapNiveles,
  CoursesCompareWidget: CoursesCompare,
  CursoDetailWidget: CursoDetailCard,
  CourseStudentsWidget: CourseStudentsTable
};
</script>
