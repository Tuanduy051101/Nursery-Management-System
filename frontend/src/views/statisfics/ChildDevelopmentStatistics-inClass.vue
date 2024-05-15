<template>
  <div>
    <VueApexCharts
      :options="chartOptions"
      :series="chartSeries"
      type="line"
      height="600"
      v-if="y"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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
  activeChange: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
});

const x = computed(() => {
  return props.chartSeries;
});

const y = computed(() => {
  return props.activeChange;
});
console.log(x, y);

const chartSeries = ref(x);

const chartOptions = ref({
  xaxis: {
    categories: props.categories,
    title: {
      text: "Tháng",
    },
  },
  title: {
    text: props.title,
    style: {
      color: "blue",
    },
  },
  yaxis: {
    title: {
      text: "Chỉ số phát triển",
    },
    labels: {
      formatter: (value) => {
        if (value === Math.floor(value)) {
          return value.toString();
        } else {
          return "";
        }
      },
    },
  },
  tooltip: {
    y: {
      formatter: (value) => `${value}`,
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
    show: false,
    position: "top",
    labels: {
      useSeriesColors: true,
      custom: {
        // series: ["Chiều cao", "Cân nặng", "Sức khỏe1"],
        markers: {
          // fillColors: ["#008FFB", "#00E396", "#FEB019"],
        },
        // colors: ["#008FFB", "#00E396", "#FEB019"],
      },
    },
  },
  colors: [
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#B22222",
    "#775DD0",
    "#8B008B",
    "#000000",
    "#000080",
    "#FF1493",
    "#87CEEB",
    "#FF4500",
    "#2E8B57",
    "#ADFF2F",
    "#FFD700",
    "#4B0082",
    "#7CFC00",
    "#FFA07A",
    "#20B2AA",
    "#778899",
    "#B0C4DE",
    "#FFFF00",
    "#32CD32",
    "#BA55D3",
    "#F08080",
    "#4682B4",
    "#9ACD32",
    "#40E0D0",
    "#FF69B4",
    "#F0E68C",
    "#D2B48C"
],
  stroke: {
    width: 2,
    curve: "smooth",
  },
});
</script>
<!-- <template>
  <div>
    <VueApexCharts
      :options="chartOptions"
      :series="chartSeries"
      type="line"
      height="800"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

// Giả định dữ liệu về chiều cao, cân nặng, số bông hồng, và sức khỏe của 30 trẻ theo 12 tháng
const childrenData = [
  {
    name: "Trẻ 1",
    height: [80, 82, 85, 88, 90, 91, 92, 92, 92, 93, 94, 95],
    weight: [10, 11, 12, 13, 14, 14.5, 15, 15, 15, 15.5, 16, 16.5],
    roses: [2, 3, 4, 4, 5, 6, 6, 7, 8, 9, 10, 10],
    health: [4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Trẻ 2",
    height: [82, 84, 87, 90, 92, 94, 95, 96, 97, 97, 98, 98],
    weight: [11, 12, 13, 14, 15, 15, 16, 16.5, 17, 17.5, 18, 18.5],
    roses: [3, 4, 5, 5, 6, 6, 7, 8, 9, 10, 11, 12],
    health: [4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6],
  },
  {
    name: "Trẻ 3",
    height: [79, 81, 84, 87, 89, 91, 92, 93, 93, 94, 95, 95],
    weight: [9, 10, 11, 12, 13, 13.5, 14, 14, 14, 14.5, 15, 15.5],
    roses: [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6],
    health: [4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Trẻ 4",
    height: [78, 80, 82, 84, 86, 88, 89, 90, 90, 91, 92, 92],
    weight: [9, 10, 11, 11.5, 12, 12.5, 13, 13, 13, 13.5, 14, 14.5],
    roses: [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6],
    health: [4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Trẻ 5",
    height: [85, 88, 90, 92, 94, 96, 97, 98, 99, 99, 100, 100],
    weight: [12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 21, 22],
    roses: [3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 12, 12],
    health: [5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6],
  },
  {
    name: "Trẻ 6",
    height: [81, 83, 85, 88, 90, 91, 92, 93, 93, 94, 95, 95],
    weight: [11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 14.5, 15, 15, 15.5],
    roses: [2, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7],
    health: [4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6],
  },
  {
    name: "Trẻ 7",
    height: [79, 81, 84, 87, 89, 91, 92, 93, 93, 94, 95, 95],
    weight: [9, 10, 11, 12, 13, 13.5, 14, 14, 14, 14.5, 15, 15.5],
    roses: [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6],
    health: [4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Trẻ 8",
    height: [84, 86, 88, 90, 92, 94, 95, 96, 97, 97, 98, 98],
    weight: [12, 13, 14, 15, 16, 16, 17, 17.5, 18, 18.5, 19, 19.5],
    roses: [3, 4, 5, 5, 6, 6, 7, 8, 9, 10, 11, 12],
    health: [4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6],
  },
  {
    name: "Trẻ 9",
    height: [80, 82, 85, 88, 90, 91, 92, 92, 92, 93, 94, 95],
    weight: [10, 11, 12, 13, 14, 14.5, 15, 15, 15, 15.5, 16, 16.5],
    roses: [2, 3, 4, 4, 5, 6, 6, 7, 8, 9, 10, 10],
    health: [4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Trẻ 10",
    height: [83, 85, 88, 91, 93, 95, 96, 97, 97, 98, 99, 99],
    weight: [11, 12, 13, 14, 15, 15, 16, 16.5, 17, 17.5, 18, 18.5],
    roses: [3, 4, 5, 5, 6, 6, 7, 8, 9, 10, 11, 12],
    health: [4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6],
  },
  // Thêm dữ liệu cho các trẻ khác
];

// Tạo dữ liệu cho biểu đồ Scatter
const chartSeries = ref(
  childrenData.map((child, index) => ({
    name: child.name,
    data: child.height.map((height, month) => ({
      x: month + 1, // Tháng từ 1 đến 12
      y: height,
    })),
  }))
);

// Tạo tùy chọn cho biểu đồ
const chartOptions = ref({
  xaxis: {
    title: {
      text: 'Tháng',
    },
  },
  yaxis: {
    title: {
      text: 'Chiều cao (cm)',
    },
    labels: {
      formatter: value => {
        if (value === Math.floor(value)) {
          return value.toString();
        } else {
          return '';
        }
      },
    },
  },
  tooltip: {
    y: {
      formatter: value => `${value} cm`,
    },
  },
  plotOptions: {
    scatter: {
      dataLabels: {
        enabled: true,
      },
      markers: {
        size: 6,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    show: false,
    position: "top",
  },
  colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#43CEA2', '#FFD66B', '#E76F51', '#C9A7E1', '#87CEEB'],
  stroke: {
    width: 1,
    curve: "smooth",
  },
});
</script> -->
