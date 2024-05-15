<template>
  <div
    ref="selectRef"
    class="relative text-lg w-full flex items-center text-slate-300 flex-row-reverse border border-solid rounded-md"
    :class="[activeSearch ? 'border-slate-900' : 'border-slate-300']"
  >
    <span
      v-if="activeSearch || modelValue.length > 0"
      class="absolute -top-2 left-0 bg-white text-slate-900 bold"
      style="font-size: 13px"
      >{{ title }}</span
    >
    <input
      type="text"
      placeholder="Tìm kiếm"
      class="w-full py-2 pl-2 bg-inherit text-slate-900 placeholder:text-base focus:border-slate-300 outline-none"
      @input="
        $emit('search', $event.target.value),
          (modelValue = $event.target.value);
        $event.target.value.length > 0
          ? (activeSelect = false)
          : (activeSelect = true);
      "
      @focus="(activeSelect = true), (activeSearch = true)"
    />
    <div
      v-if="activeSelect"
      class="absolute top-0 mt-14 w-full rounded-md bg-white border border-solid border-slate-900 overflow-auto flex flex-col items-start justify-start z-10"
    >
      <span class="mt-2"></span>
      <span
        v-for="(option, index) in optionSearch"
        :key="index"
        @click="[$emit('searchWith', option)]"
        class="text-sm cursor-pointer w-full px-2"
        :class="
          option.name == title
            ? 'text-green-500'
            : 'text-slate-900 hover:text-yellow-500'
        "
      >
        {{ option.name }}
      </span>
      <span class="mt-0.5"></span>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, onMounted, onUnmounted } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  optionSearch: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
});
const activeSelect = ref(false);
const activeSearch = ref(false);
const selectRef = ref(null);

const handleClickOutside = (event) => {
  if (selectRef.value != null) {
    if (!selectRef.value.contains(event.target)) {
      activeSelect.value = false;
      activeSearch.value = false;
    }
  }
};

// Lắng nghe sự kiện click để đóng dropdown khi bên ngoài được click
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
