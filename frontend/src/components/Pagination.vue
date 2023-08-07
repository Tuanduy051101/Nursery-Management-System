<template>
  <div class="flex justify-between items-center py-5 px-2">
    <p class="text-slate-600 text-md hover:text-slate-300">
      Showing {{ totalRow == 0 ? 0 : startRow }} to
      {{ endRow > totalRow ? totalRow : endRow }} of {{ totalRow }} entries
    </p>
    <div class="flex items-center text-md">
      <span
        class="rounded-md text-slate-600 w-8 h-8 flex items-center justify-center border border-solid border-slate-600 cursor-pointer hover:border-slate-300 hover:text-slate-300"
        @click="updatePrevPage(currentPage)"
      >
        <Prev class="" />
      </span>
      <div class="flex mx-2 rounded-md">
        <span
          v-if="numberOfPages <= 6"
          class="rounded-md w-8 h-8 flex items-center justify-center cursor-pointer my-1 mx-2"
          v-for="(numberOfPage, index) in numberOfPages"
          :key="numberOfPage"
          @click="updateCurrentPage(numberOfPage)"
          :class="[
            index === currentPage - 1
              ? 'text-slate-300 border-slate-300 border border-solid'
              : 'text-slate-600 border border-solid hover:text-slate-300 hover:border-slate-600',
          ]"
        >
          {{ numberOfPage }}
        </span>
        <div
          class=""
          v-for="(numberOfPage, index) in numberOfPages"
          :key="numberOfPage"
        >
          <span
            v-if="numberOfPages > 6 && numberOfPage <= 3"
            class="rounded-md w-8 h-8 flex items-center justify-center cursor-pointer my-1 mx-2"
            @click="updateCurrentPage(numberOfPage)"
            :class="[
              index === currentPage - 1
                ? 'text-slate-300 border-slate-300 border border-solid'
                : 'text-slate-600 border border-solid hover:text-slate-300 hover:border-slate-600',
            ]"
          >
            {{ numberOfPage }}
          </span>
        </div>
        <span
          v-if="numberOfPages > 6"
          class="rounded-md w-8 h-8 flex items-center justify-center cursor-pointer my-1 mx-2 text-slate-600"
        >
          <span class="material-symbols-outlined"> more_horiz </span>
        </span>
        <div
          class=""
          v-for="(numberOfPage, index) in numberOfPages"
          :key="numberOfPage"
        >
          <span
            v-if="numberOfPages > 6 && numberOfPage > numberOfPages - 3"
            class="rounded-md w-8 h-8 flex items-center justify-center cursor-pointer my-1 mx-2"
            @click="updateCurrentPage(numberOfPage)"
            :class="[
              index === currentPage - 1
                ? 'text-slate-300 border-slate-300 border border-solid'
                : 'text-slate-600 border border-solid hover:text-slate-300 hover:border-slate-600',
            ]"
          >
            {{ numberOfPage }}
          </span>
        </div>
      </div>
      <span
        class="rounded-md text-slate-600 w-8 h-8 flex items-center justify-center border border-solid border-slate-600 cursor-pointer hover:border-slate-300 hover:text-slate-300"
        @click="updateNextPage(currentPage)"
      >
        <Next class="" />
      </span>
    </div>
  </div>
</template>

<script>
import Next from "./icons/NavigateNext.vue";
import Prev from "./icons/NavigatePrev.vue";
export default {
  components: {
    Next,
    Prev,
  },
  props: {
    totalRow: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 2,
    },
    numberOfPages: {
      type: Number,
      default: 10,
    },
    startRow: {
      type: Number,
      default: 0,
    },
    endRow: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:currentPage"],
  methods: {
    updateCurrentPage(number) {
      this.$emit("update:currentPage", number);
    },
    updateNextPage(number) {
      if (number < this.numberOfPages && number > 0) {
        this.$emit("update:currentPage", number + 1);
      }
    },
    updatePrevPage(number) {
      if (number <= this.numberOfPages && number > 1) {
        this.$emit("update:currentPage", number - 1);
      }
    },
  },
};
</script>
