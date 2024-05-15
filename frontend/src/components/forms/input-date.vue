<template>
  <div
    ref="selectRef"
    class="relative text-lg w-full flex items-center text-slate-900 flex-row-reverse border border-solid rounded-md hover:border-slate-900"
    style="padding-top: 4px; padding-bottom: 4px"
    :class="activeSelect == true ? 'border-slate-300' : 'border-slate-300'"
  >
    <span
      v-if="modelValue != title && showClose"
      class="absolute -top-2 left-0 bg-white text-slate-900 bold"
      style="font-size: 13px; height: 10px; font-weight: 500;"
      >{{ title }}</span
    >
    <span
      v-if="showClose && modelValue != title"
      class="material-symbols-outlined flex items-center cursor-pointer hover:text-red-500 mx-2"
      @click="$emit('refresh'), (modelValue = title)"
      :class="activeSelect == true ? 'text-slate-300' : 'text-slate-600'"
      style="font-size: 18px"
      title=""
    >
      close</span
    >
    <input
      :type="type"
      class="bg-inherit w-full px-2 placeholder:text-slate-900 mt-1.5 outline-none"
      :value="modelValue"
      @input="
        $emit('submit', $event.target.value),
          (modelValue = $event.target.value),
          $event.target.value.length == 0 ? (showClose = false) : showClose = true;
      "
      @focus="useDisabled"
      :disabled="disabled"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  onMounted,
  onUnmounted,
  watch,
  reactive,
  computed,
  inject,
} from "vue";

// Khai báo props cần truyền vào
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: [],
  },
  title: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: false,
  },
  refresh: {
    type: Boolean,
    default: false,
  },
  activeSearch: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "date",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const refreshValue = computed(() => props.refresh);
const optionValue = computed(() => props.options);
watch(refreshValue, () => {
  localModelValue.value = props.title;
  filteredOptions.splice(0, filteredOptions.length, ...props.options);
});

// Khởi tạo các biến ref để lưu trạng thái
const activeSelect = ref(false);
const selectRef = ref(null);
const filteredOptions = reactive([...optionValue.value]);
const localModelValue = ref(props.modelValue);

const handleClickOutside = (event) => {
  if (selectRef.value != null) {
    if (!selectRef.value.contains(event.target)) {
      activeSelect.value = false;
    }
  }
};

const useDisabled = () => {
  if (!props.disabled) {
    activeSelect.value = true;
  }
};

const inputHandler = (event) => {
  useDisabled();
  const inputValue = event.target.value.toLowerCase();
  localModelValue.value = inputValue;
  filteredOptions.splice(
    0,
    filteredOptions.length,
    ...props.options.filter((option) =>
      option.name.toLowerCase().includes(inputValue)
    )
  );
};

// Lắng nghe sự kiện click để đóng dropdown khi bên ngoài được click
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
