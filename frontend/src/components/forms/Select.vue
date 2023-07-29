<template>
  <div
    class="relative text-lg w-full flex items-center text-slate-300 flex-row-reverse border border-solid rounded-md"
    style="padding-top: 4px; padding-bottom: 4px"
    :class="activeSelect == true ? 'border-slate-300' : 'border-slate-600'"
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
      v-if="activeSelect && disabled == 'false'"
      class="absolute top-0 mt-12 w-full rounded-md bg-slate-800 border border-solid border-slate-300 text-slate-300 overflow-auto flex flex-col items-start justify-start z-10"
    >
      <span
        v-for="(option, index) in options"
        :key="index"
        @click="
          [
            updateModelValue(option._id),
            (activeSelect = false),
            (modelValue = option.name),
            $emit('update'),
          ]
        "
        class="hover:text-slate-300 cursor-pointer w-full py-1 px-2"
        :class="modelValue == option.name ? 'text-slate-300' : 'text-slate-600'"
        >{{ option.name }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: "",
    options: {
      type: Array,
      default: [],
    },
    disabled: {
      type: String,
      default: `false`,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      activeSelect: false,
    };
  },
  methods: {
    updateModelValue(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>
