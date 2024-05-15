<template>
  <div
    ref="selectRef"
    class="relative text-lg w-full flex items-center text-slate-900 flex-row-reverse border border-solid rounded-md"
    style="padding-top: 4px; padding-bottom: 4px"
    :class="
      activeSelect == true && modeAdd == false
        ? 'border-slate-900'
        : 'border-slate-300'
    "
  >
    <span
      v-if="localModelValue != title"
      class="absolute -top-2 left-0 bg-white text-slate-900 bold capitalize"
      style="font-size: 13px; height: 10px; font-weight: 500"
      >{{ title }}</span
    >
    <span
      class="material-symbols-outlined px-2 flex items-center cursor-pointer"
      @click="useDisabled"
      :class="activeSelect == true ? 'text-slate-900' : 'text-slate-300'"
    >
      {{ activeSelect == true ? "expand_less" : "expand_more" }}</span
    >
    <span
      v-if="showClose && localModelValue != title"
      class="material-symbols-outlined flex items-center cursor-pointer hover:text-red-500"
      @click="$emit('refresh'), (localModelValue = title)"
      :class="activeSelect == true ? 'text-slate-900' : 'text-slate-900'"
      style="font-size: 18px"
    >
      close</span
    >
    <input
      type="text"
      class="bg-inherit w-full px-2 outline-none capitalize"
      :class="[title ? 'mt-1.5' : '']"
      :value="localModelValue ? localModelValue : modelValue"
      @input="inputHandler"
      @focus="useDisabled"
      :disabled="disabled"
    />
    <!-- options -->
    <div
      v-if="activeSelect"
      class="absolute overflow-auto top-0 mt-12 w-full rounded-md bg-white border border-solid border-slate-900 text-slate-900 flex flex-col items-start justify-start z-10"
      :class="optionLarge ? 'width-500' : ''"
      style="max-height: 200px"
    >
      <div class="mb-3"></div>
      <div
        v-for="(option, index) in !activeSearch ? options : filteredOptions"
        :key="index"
        class=""
      >
        <span
          @click="
            [
              $emit('update:modelValue', option._id),
              (activeSelect = false),
              (localModelValue = option.name),
              $emit('update', true),
            ]
          "
          class="cursor-pointer w-full py-1 px-2 whitespace-normal capitalize"
          :class="
            localModelValue == option.name ||
            (!localModelValue && modelValue == option.name)
              ? 'text-green-500'
              : 'text-slate-900 hover:text-yellow-500'
          "
        >
          {{ option.name.toString().charAt(0).toUpperCase() + option.name.toString().slice(1) }}
        </span>
      </div>
      <span
        v-if="!options.length && !filteredOptions.length"
        class="hover:text-slate-300 text-slate-600 cursor-pointer w-full py-1 px-2 text-sm"
      >
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
  inject,
} from "vue";

// Khai báo props cần truyền vào
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
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
  modeAdd: {
    type: Boolean,
    default: false,
  },
  optionLarge: {
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

<style scoped>
.width-500 {
  width: 500px;
}
</style>
