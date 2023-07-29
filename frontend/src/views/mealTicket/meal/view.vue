<template>
  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <!-- class detail -->
    <div class="flex justify-center mb-5">
      <div class="px-5 py-5">
        <!-- title -->
        <p class="text-slate-300 text-lg text-center">
          <span
            class="border border-solid px-5 py-1 border-slate-600 rounded-md"
            >Information Details Of Meal</span
          >
        </p>
        <div class="flex text-slate-300 mt-10">
          <div
            class="flex mx-5 border border-solid border-t-0 border-b-0 border-l-0 border-slate-600"
          >
            <div class="flex flex-col mr-5">
              <span>Date:</span>
              <span>Start time:</span>
              <span>End time:</span>
              <span>Grade:</span>
            </div>
            <div class="flex flex-col mr-10">
              <span>{{ item.date }}</span>
              <span>{{ item.timeStart }}</span>
              <span>{{ item.timeEnd }}</span>
              <span
                >{{ item.grade[0].name }}, {{ item.grade[1].name }},
                {{ item.grade[2].name }}</span
              >
              <!-- <p @click="" class="cursor-pointer mt-5">
                <span
                  class="border border-solid px-4 py-1 rounded-md border-yellow-600 text-slate-600 hover:border-yellow-300 hover:text-slate-300"
                  >Edit</span
                >
              </p> -->
            </div>
          </div>
          <div class="flex">
            <div class="flex flex-col mx-5">
              <span>Like:</span>
              <span>Unlike:</span>
              <span>Allergy:</span>
              <span>Amount of meal tickets</span>
            </div>
            <div class="flex flex-col">
              <span>{{ item.like }}</span>
              <span>{{ item.unlike }}</span>
              <span>{{ item.allergy }}</span>
              <span>{{ item.total }}</span>
            </div>
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
        Dish
      </div>
    </div>
    <!-- <div class="border border-solid my-5 border-slate-600 border-b-0"></div> -->
    <Table
      v-if="actionPage == 2"
      :items="item.dish"
      :actionList="actionList"
      :fields="['dish', 'function', 'cooking', 'ingredient', 'note']"
      :labels="['name', 'function', 'cooking']"
    />
  </div>
  <FormEditMeal
    v-if="activeAdd"
    :item="item"
    :title="`Edit Meal`"
    :placeholder="`Edit Meal`"
    @cancel="(value) => (activeAdd = value)"
    @submit="update()"
  />
</template>

<script>
import BAdd from "../../../components/buttons/Add.vue";
import BEdit from "../../../components/buttons/Edit.vue";
import BDelete from "../../../components/buttons/Delete.vue";
import BCancel from "../../../components/buttons/Cancel.vue";
import FSelect from "../../../components/forms/Select.vue";
import FSearch from "../../../components/forms/Search.vue";
import Table from "../../../components/TableDishDetail.vue";
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
      actionList: ["Dish.view"],
      activeAdd: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    async get() {
      try {
        this.item = await Meal.get(this.id);
        this.item = [this.item];
        this.item = this.item.map((value, index) => {
          var like = 0,
            unlike = 0,
            allergy = 0;
          for (var value1 of value.mealTicket) {
            if (value1.evaluate.like == true) {
              console.log("condo me");
              like++;
            }

            if (value1.evaluate.like == false) {
              console.log("condo me1");
              unlike++;
            }

            if (value1.evaluate.allergy == true) {
              console.log("condo me2");
              allergy++;
            }
          }
          return {
            _id: value._id,
            date: value.date,
            timeStart: value.timeStart,
            timeEnd: value.timeEnd,
            grade: value.grade,
            dish: value.dish,
            like: like,
            unlike: unlike,
            allergy: allergy,
            total: value.mealTicket.length,
          };
        });

        this.item = this.item[0];

        this.item.grade = this.item.grade.map(
            (value, index) => {
                return {
                    _id: value._id,
                    name: value.name,
                    checked: true,
                }
            }
        )
      } catch (error) {
        console.log(error.message);
      }
    },

    async update() {

    },

    async refresh() {
      await this.get();
    },
  },
  async created() {
    this.refresh();
  },
};
</script>
