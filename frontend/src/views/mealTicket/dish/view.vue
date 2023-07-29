<template>
  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <!-- class detail -->
    <div class="flex justify-center">
      <div class="py-5">
        <!-- title -->
        <p class="text-slate-300 text-lg text-center">
          <span
            class="border border-solid px-5 py-1 border-slate-600 rounded-md"
            >Information Details Of Dish</span
          >
        </p>
        <div class="flex text-slate-300 mt-5">
          <div class="flex flex-col">
            <span
              class="border border-solid text-blue-500 border-slate-600 py-2 px-2 border-l-0 border-r-0"
              >Dish: <span class="text-slate-300">{{ item.name }}</span></span
            >
            <span
              class="border border-solid text-blue-500 border-slate-600 py-2 px-2 border-l-0 border-r-0 border-t-0"
              >Function: <span class="text-slate-300">{{ item.function }}</span></span
            >
            <span
              class="border border-solid text-blue-500 border-slate-600 py-2 px-2 border-l-0 border-r-0 border-t-0"
              >Note: <span class="text-slate-300">{{ item.note }}</span></span
            >
            <span
              class="py-2 px-2 -mb-5 text-blue-500"
              >Cooking: <span class="text-slate-300 ">{{ item.cooking }}</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- class -->

  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <!-- list of children or cdi or receipt -->
    <!-- <div class="border border-solid my-5 border-slate-600 border-b-0"></div> -->
    <div class="flex justify-end mx-5 mb-5 mt-5 text-slate-600">
      <!-- <div
            class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
            :class="
              actionPage == 1 ? 'border-2 border-slate-300 text-slate-300' : ''
            "
            @click="actionPage = 1"
          >
            Assignment
          </div> -->
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 2 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 2"
      >
        Ingredient
      </div>
    </div>
    <!-- <div class="border border-solid my-5 border-slate-600 border-b-0"></div> -->
    <Table
        v-if="actionPage == 2"
        :items="item.ingredient"
        :actionList="actionList"
        :fields="['ingredient', 'function', 'amount', 'making', 'note']"
        :labels="[]"
      />
  </div>
</template>

<script>
import BAdd from "../../../components/buttons/Add.vue";
import BEdit from "../../../components/buttons/Edit.vue";
import BDelete from "../../../components/buttons/Delete.vue";
import BCancel from "../../../components/buttons/Cancel.vue";
import FSelect from "../../../components/forms/Select.vue";
import FSearch from "../../../components/forms/Search.vue";
import Table from "../../../components/TableDishView.vue";
import Pagination from "../../../components/Pagination.vue";
import FormOne from "../../../components/forms/FormOne.vue";
import FormEditTeacher from "../../../components/forms/FormEditTeacher.vue";
import FormEditChildren from "../../../components/forms/FormEditChildren.vue";
import FormEditMeal from "../../../components/forms/FormEditMeal.vue";
import Classes from "../../../services/classes.service";
import Children from "../../../services/children.service";
import Teacher from "../../../services/teacher.service";
import SchoolYear from "../../../services/sYear.service";
import Assignment from "../../../services/assignment.service";
import Meal from "../../../services/meal.service";
import Month from "../../../services/month.service";
import Dish from "../../../services/dish.service";
import CollectionRates from "../../../services/collectionRates.service";
import ASuccess from "../../../components/alerts/Success.vue";
import Swal from "sweetalert2";
import { FormatMoney } from "format-money-js";

export default {
  components: {
    BAdd,
    BEdit,
    BDelete,
    BCancel,
    FSelect,
    FSearch,
    Table,
    Pagination,
    FormOne,
    ASuccess,
    FormEditChildren,
    FormEditTeacher,
    FormEditMeal,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // data
      items: [],
      item: {},
      actionPage: 2,
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      actionList: ["ClassRoom.view"],
      activeAdd: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    async get() {
      try {
        this.item = await Dish.get(this.id);
      } catch (error) {
        console.log(error.message);
      }
    },

    async update() {},

    async refresh() {
      await this.get();
    },
  },
  async created() {
    this.refresh();
  },
};
</script>
