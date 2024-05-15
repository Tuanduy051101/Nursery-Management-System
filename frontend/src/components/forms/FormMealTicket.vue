<template>
  <div
    class="fixed top-0 bottom-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
    <meal
      class="bg-white border border-solid border-slate-300 absolute w-3/4"
      :session="session"
      :date="date"
      :meal="meal"
      :child="child"
      @submit="(value) => $emit('submit', value)"
      @cancel="$emit('cancel')"
    />
  </div>
  <!-- </Form> -->
</template>

<script>
import meal from "../../components/common/meal.vue";

export default {
  components: {
    meal,
  },
  props: {
    session: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    meal: {
      type: String,
      required: true,
    },
    child: {
    type: String,
    required: true,
  },
  },
};
</script>
