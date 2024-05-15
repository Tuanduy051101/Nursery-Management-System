<template>
  <div
    class="bg-inherit p-6 rounded-lg shadow-lg border border-solid border-slate-300"
  >
    <h3 class="text-lg font-semibold text-slate-300 mb-2">{{ title }}</h3>
    <p class="text-2xl font-bold text-slate-300">{{ value }}{{ unit }}</p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  title: String,
  value: String,
  unit: String,
});
</script>

<style scoped>
/* Your styles here */
</style>
