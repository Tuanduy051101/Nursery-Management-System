<template>
  <div>
    <VueApexCharts
      type="line"
      :options="chartOptions"
      :series="chartSeries"
      height="600px"
    ></VueApexCharts>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";

const props = defineProps({
  categories: {
    type: Array,
    default: [],
  },
  chartSeries: {
    type: Array,
    default: [],
  },
});

const x = computed(() => {
  return props.chartSeries;
});

const chartOptions = ref({
  chart: {
    id: "my-chart",
  },
  // title: {
  //   text: "Biểu đồ thể hiện chỉ số phát triển của trẻ theo tháng",
  //   style: {
  //     color: "blue",
  //     fontSize: "20px",
  //     fontWeight: "bold",
  //     fontStyle: "italic",
  //     textTransform: "uppercase",
  //     margin: "20px 20px 20px 20px",
  //     fontFamily: "Arial, sans-serif",
  //   },
  // },
  xaxis: {
    categories: props.categories,
    title: {
      text: "Tháng",
    },
  },
  yaxis: {
    title: {
      text: "Chỉ số phát triển",
    },
  },
  legend: {
    show: true,
    position: "top",
    labels: {
      useSeriesColors: true,
      custom: {
        // series: ["Chiều cao", "Cân nặng", "Sức khỏe1"],
        markers: {
          fillColors: ["#008FFB", "#00E396", "#FEB019"],
        },
        colors: ["#008FFB", "#00E396", "#FEB019"],
      },
    },
  },
  stroke: {
    width: 2,
    curve: "smooth",
  },
});

const chartSeries = ref(x);
</script>
