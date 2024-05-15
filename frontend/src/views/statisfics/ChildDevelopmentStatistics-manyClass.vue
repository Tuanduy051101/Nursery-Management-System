<template>
  <div>
    <VueApexCharts :options="chartOptions" :series="chartSeries" type="line" height="400" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const childDevelopmentData = ref([
  { month: 1, mầm: { height: 80 }, chồi: { height: 76 }, lá: { height: 90 } },
  { month: 2, mầm: { height: 85 }, chồi: { height: 87 }, lá: { height: 95 } },
  { month: 3, mầm: { height: 90 }, chồi: { height: 59 }, lá: { height: 100 } },
  // Thêm dữ liệu cho các tháng khác
]);

const chartOptions = ref({
  chart: {
    id: 'child-height-chart',
  },
  xaxis: {
    categories: childDevelopmentData.value.map(data => data.month),
    title: {
      text: 'Tháng',
    },
  },
  yaxis: {
    title: {
      text: 'Chiều cao (cm)',
    },
  },
  tooltip: {
    y: {
      formatter: value => `${value} cm`,
    },
  },
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true,
      },
      marker: {
        size: 6,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: 'bottom',
    show: false,
  },
});

const chartSeries = ref([
  {
    name: 'Mầm',
    data: childDevelopmentData.value.map(data => data.mầm.height),
  },
  {
    name: 'Chồi',
    data: childDevelopmentData.value.map(data => data.chồi.height),
  },
  {
    name: 'Lá',
    data: childDevelopmentData.value.map(data => data.lá.height),
  },
]);
</script>
