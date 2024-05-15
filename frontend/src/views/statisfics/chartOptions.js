import { ref } from "vue";
import { props } from "./ChildDevelopmentStatistics-inClass.vue";

export const chartOptions = ref({
xaxis: {
categories: props.categories,
title: {
text: "Tháng",
},
}, title: {
text: props.title
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
"#FF4560",
"#775DD0",
"#43CEA2",
"#FFD66B",
"#E76F51",
"#C9A7E1",
"#87CEEB",
],
stroke: {
width: 1,
curve: "smooth",
},
});
