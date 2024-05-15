<template>
  <div class="flex justify-between items-center py-5 px-2">
    <p class="text-slate-900 text-md hover:text-slate-900">
      Hiển thị {{ totalRow == 0 ? 0 : startRow }} đến
      {{ endRow > totalRow ? totalRow : endRow }} trong tổng số
      {{ totalRow }} mục
    </p>

    <div class="flex items-center text-md">
      <span
        class="rounded-md text-slate-900 w-8 h-8 flex items-center justify-center border border-solid border-slate-900 cursor-pointer hover:border-gray-200 hover:bg-gray-200"
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
              ? ' border-green-500 border border-solid bg-green-500 text-white'
              : 'text-slate-900 border border-solid border-slate-900 hover:border-gray-200 hover:bg-gray-200',
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
                ? ' border-green-500 border border-solid bg-green-500 text-white'
              : 'text-slate-900 border border-solid border-slate-900 hover:border-gray-200 hover:bg-gray-200',
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
            :class="[index === currentPage - 1 ? ' border-green-500 border border-solid bg-green-500 text-white'
              : 'text-slate-900 border border-solid border-slate-900 hover:border-gray-200 hover:bg-gray-200']"
          >
            {{ numberOfPage }}
          </span>
        </div>
      </div>
      <span
        class="rounded-md text-slate-900 w-8 h-8 flex items-center justify-center border border-solid border-slate-900 cursor-pointer hover:border-gray-200 hover:bg-gray-200"
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
      default: 1,
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
