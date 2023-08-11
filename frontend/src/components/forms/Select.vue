<template>
  <div
    ref="selectRef"
    class="relative text-lg w-full flex items-center text-slate-300 flex-row-reverse border border-solid rounded-md"
    style="padding-top: 4px; padding-bottom: 4px"
    :class="activeSelect == true ? 'border-slate-300' : 'border-slate-600'"
  >
    <span
      v-if="localModelValue != title"
      class="absolute -top-2 left-0 _bg-inherit"
      style="font-size: 11px; height: 10px"
      >{{ title }}</span
    >
    <span
      class="material-symbols-outlined px-2 flex items-center cursor-pointer"
      @click="useDisabled"
      :class="activeSelect == true ? 'text-slate-300' : 'text-slate-600'"
    >
      {{ activeSelect == true ? "expand_less" : "expand_more" }}</span
    >
    <span
      v-if="showClose && localModelValue != title"
      class="material-symbols-outlined flex items-center cursor-pointer hover:text-red-500"
      @click="$emit('refresh'), (localModelValue = title)"
      :class="activeSelect == true ? 'text-slate-300' : 'text-slate-600'"
      style="font-size: 18px"
    >
      close</span
    >
    <input
      type="text"
      class="bg-inherit w-full px-2"
      :value="localModelValue"
      @input="inputHandler"
      @focus="useDisabled"
      :disabled="disabled"
    />
    <!-- options -->
    <div
      v-if="activeSelect"
      class="absolute top-0 mt-12 w-full rounded-md bg-slate-800 border border-solid border-slate-300 text-slate-300 overflow-auto flex flex-col items-start justify-start z-10"
    >
      <span
        v-for="(option, index) in !activeSearch ? options : filteredOptions"
        :key="index"
        @click="
          [
            $emit('update:modelValue', option._id),
            (activeSelect = false),
            (localModelValue = option.name),
            $emit('update', true),
          ]
        "
        class="hover:text-slate-300 cursor-pointer w-full py-1 px-2"
        :class="
          localModelValue == option.name ? 'text-slate-300' : 'text-slate-600'
        "
      >
        {{ option.name }}
      </span>
      <span v-if="!options.length && !filteredOptions.length" class="hover:text-slate-300 text-slate-600 cursor-pointer w-full py-1 px-2 text-sm">
        Data is emptying
      </span>
    </div>
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
