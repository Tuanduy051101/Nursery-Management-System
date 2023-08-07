<template>
  <div
    ref="selectRef"
    class="relative text-lg w-full flex items-center text-slate-300 flex-row-reverse border border-solid rounded-md"
    style="padding-top: 4px; padding-bottom: 4px"
    :class="activeSelect == true ? 'border-slate-300' : 'border-slate-600'"
  >
    <span
      v-if="modelValue != title"
      class="absolute -top-2 left-0 _bg-inherit"
      style="font-size: 12px"
      >{{ title }}</span
    >
    <span
      class="material-symbols-outlined px-2 flex items-center cursor-pointer"
      @click="activeSelect = !activeSelect"
      :class="activeSelect == true ? 'text-slate-300' : 'text-slate-600'"
    >
      {{ activeSelect == true ? "expand_less" : "expand_more" }}</span
    >
    <input
      type="text"
      class="bg-inherit w-full px-2 text-md"
      :value="modelValue"
      @input="activeSelect = true"
      @focus="activeSelect = true"
    />
    <!-- options -->
    <div
      v-if="activeSelect"
      class="absolute top-0 mt-12 w-full rounded-md bg-slate-800 border border-solid border-slate-300 text-slate-300 overflow-auto flex flex-col items-start justify-start z-10"
    >
      <span
        v-for="(option, index) in options"
        :key="index"
        @click="
          [
            $emit('update:modelValue', option._id),
            (activeSelect = false),
            (modelValue = option.name),
            $emit('update'),
          ]
        "
        class="hover:text-slate-300 cursor-pointer w-full py-1 px-2"
        :class="modelValue == option.name ? 'text-slate-300' : 'text-slate-600'"
      >
        {{ option.name }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, onUnmounted } from "vue";

// Khai báo props cần truyền vào
const props = defineProps({
  modelValue: String,
  options: Array,
  title: String,
});

// Khởi tạo các biến ref để lưu trạng thái
const activeSelect = ref(false);
const selectRef = ref(null);

const handleClickOutside = (event) => {
  if (selectRef.value != null) {
    if (!selectRef.value.contains(event.target)) {
      activeSelect.value = false;
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
