<template>
  <div @click="activeSearch = true" class="relative flex items-center">
    <input
      type="text"
      placeholder="Search"
      class="w-full py-2 pl-2 bg-inherit text-slate-300 border border-solid border-slate-600 rounded-md placeholder:text-base focus:border-slate-300"
      :value="modelValue"
      @input="updateModelValue"
      @focusout="activeSearch = false"
    />
  </div>
</template>

<script>
import ISearch from "../icons/Search.vue";
export default {
  components: {
    ISearch,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeSearch: false,
    }
  },
  emits: ["update:modelValue"],
  methods: {
    updateModelValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>
