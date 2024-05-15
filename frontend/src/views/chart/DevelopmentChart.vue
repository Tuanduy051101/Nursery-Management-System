<template>
  <div>
    <apexchart type="line" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import VueApexCharts from "vue3-apexcharts";

const props = defineProps({
  chartData: {
    type: Array,
    default: [],
  }
});

const chartData = props.chartData;
const chartOptions = ref({
  chart: {
    type: "line",
    height: 300,
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: chartData.categories,
  },
  series: chartData.series,
});

onMounted(() => {
  VueApexCharts.exec("chart", "updateSeries", chartOptions.series);
});
</script>
