<template>
  <div
    ref="selectRef"
    class="relative text-lg w-full flex items-center text-slate-300 flex-row-reverse border border-solid rounded-md"
    :class="[activeSearch ? 'border-slate-300' : 'border-slate-600']"
  >
    <span
      v-if="activeSearch || modelValue.length > 0"
      class="absolute -top-2 left-0 _bg-inherit text-slate-300"
      style="font-size: 12px"
      >{{ title }}</span
    >
    <input
      type="text"
      placeholder="Search"
      class="w-full py-2 pl-2 bg-inherit text-slate-300 placeholder:text-base focus:border-slate-300"
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
      class="absolute top-0 mt-14 w-full rounded-md bg-slate-800 border border-solid border-slate-300 text-slate-300 overflow-auto flex flex-col items-start justify-start z-10"
    >
      <span
        v-for="(option, index) in optionSearch"
        :key="index"
        @click="[$emit('searchWith', option)]"
        class="hover:text-slate-300 text-md cursor-pointer w-full py-1 px-2"
        :class="option.name == title ? 'text-slate-300' : 'text-slate-600'"
      >
        {{ option.name }}
      </span>
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
