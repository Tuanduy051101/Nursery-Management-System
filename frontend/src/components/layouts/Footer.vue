<template>
  <div class="flex items-center justify-between p-2 text-slate-900 text-base">
    <span class="pt-1.5">{{ name[0].toUpperCase() + name.slice(1) }} - {{  address.split(' ').map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(' ') }}</span>
    <span class="pt-1.5">Điện thoại: {{ phone }} - Email: {{ email }}</span>
  </div>
</template>

<script setup>
import { ref } from "../../assets/js/imports.js";
const name = ref(sessionStorage.getItem("owner_childcareCenterName"));
const email = ref(sessionStorage.getItem("owner_childcareCenterEmail"));
const phone = ref(sessionStorage.getItem("owner_childcareCenterPhone"));
const address = ref(sessionStorage.getItem("owner_childcareCenterAddress"));
</script>
