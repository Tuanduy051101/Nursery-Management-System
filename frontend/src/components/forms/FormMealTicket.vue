<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-slate-800 mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300 overflow-auto"
      style="max-height: 100vh; min-height: 100px"
    >
      <div
        class="flex flex-row justify-between items-center px-3 py-3 text-slate-300 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
      >
        <span>{{ title }}</span>
        <span
          @click="cancel"
          class="material-symbols-outlined cursor-pointer text-slate-600 hover:text-slate-300"
        >
          close
        </span>
      </div>
      <div class="flex flex-col my-5 mx-3">
        <!-- <Form v-slot="{ errors }"> -->
        <div>
          <!-- classes -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Class<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <input
              disabled
              class="bg-inherit border border-solid border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
              type="text"
              name=""
              id=""
              v-model="item.className"
            />
          </div>
          <!-- date -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Date<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <input
              disabled
              class="bg-inherit border border-solid border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
              type="text"
              name=""
              id=""
              v-model="item.date"
            />
          </div>
          <!-- meal -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Meal<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <input
              class="bg-inherit border border-solid border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
              type="text"
              name=""
              id=""
              @click="showSelectMeal = true"
            />
            <div
              v-if="item.listDish.length != 0"
              class="bg-inherit ml-5 mt-2 mb-8"
              style="outline: none; max-height: 80px"
            >
              <span
                class="flex flex-col"
                v-for="(value, index) of item.listDish"
                >{{ index + 1 }}. {{ value.name }}</span
              >
            </div>
            <div v-if="showSelectMeal">
              <div
                class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
              >
                <div
                  class="bg-slate-800 h-screen opacity-100 flex-1 relative"
                ></div>
                <div
                  class="bg-slate-800 overflow-auto mx-5 w-5/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
                  style="max-height: 100vh"
                >
                  <div
                    class="flex flex-row justify-between items-center px-3 py-3 text-slate-300 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
                  >
                    <span>Select Meal</span>
                    <span
                      @click="cancelShowSelectMeal()"
                      class="material-symbols-outlined cursor-pointer text-slate-600 hover:text-slate-300"
                    >
                      close
                    </span>
                  </div>
                  <div class="my-5 mx-3" v-for="(value, index) of meal">
                    <div class="">
                      <input
                        :checked="addItem(value)"
                        type="checkbox"
                        name=""
                        id=""
                        v-model="value.checked"
                      />
                      <label for="" class="mx-5 text-green-500 text-xl">{{
                        index + 1
                      }}</label>
                      <span class="text-yellow-500"
                        >{{ value.timeStart }} - {{ value.timeEnd }}</span
                      >

                      <ol class="ml-8" v-for="(value1, index1) of value.dish">
                        <li>{{ index1 + 1 }}. {{ value1.name }}</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- children -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Children<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <input
              class="bg-inherit border border-solid border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
              type="text"
              name=""
              id=""
              v-model="totalChildren"
              @click="showSelectChildren = true"
            />
            <div
              v-if="item.children.length != 0"
              class="bg-inherit ml-5 mt-2"
              style="outline: none; max-height: 80px"
            ></div>
            <div class="" v-if="showSelectChildren">
              <div
                class="fixed top-0 right-0 w-screen h-screen z-50 flex overflow-auto items-center justify-center"
              >
                <div
                  class="bg-slate-800 h-screen opacity-100 flex-1 relative"
                ></div>
                <div
                  class="bg-slate-800 overflow-auto mx-5 w-5/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
                >
                  <div
                    class="flex flex-row justify-between items-center px-3 py-3 text-slate-300 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
                  >
                    <span>Select Children</span>
                    <span
                      @click="cancelShowSelectChildren()"
                      class="material-symbols-outlined cursor-pointer text-slate-600 hover:text-slate-300"
                    >
                      close
                    </span>
                  </div>
                  <Table
                    :items="children"
                    :fields="['Children', 'Like', 'allergy']"
                    :labels="['name']"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            @click="submit()"
            class="text-slate-300 border border-solid border-green-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:bg-green-500 mt-5 hover:text-slate-100"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import IAdd from "../icons/Add.vue";
import FSelect from "../forms/Select.vue";
import Table from "../TableSelectChildren.vue";
import SYear from "../../services/sYear.service";
import Grade from "../../services/grade.service";
import Classes from "../../services/classes.service";
import Meal from "../../services/meal.service";
import TFees from "../../services/tuitionFees.service";
import Teacher from "../../services/teacher.service";
import Children from "../../services/children.service";
import Evaluate from "../../services/evaluate.service";
import Duty from "../../services/duty.service";
import { FormatMoney } from "format-money-js";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    IAdd,
    FSelect,
    Table,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      default: {},
    },
    placeholder: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  emits: ["cancel", "submit"],
  watch: {
    async runGet() {
      await this.get();
      this.runGet = false;
    },
    mSYear() {
      if (this.item.schoolYear.length != 0) {
        this.getAllGrade();
      }
    },
    mGrade() {
      if (this.item.grade.length != 0) {
        this.getAllClasses();
      }
    },
    showSelectChildren() {
      this.totalChildren = 0;
      for (let value of this.children) {
        if (value.selected == true) {
          this.totalChildren = this.totalChildren + 1;
        }
      }

      if (this.totalChildren > 1) {
        this.totalChildren = this.totalChildren + " " + "children";
      } else {
        this.totalChildren = this.totalChildren + " " + "child";
      }
    },
  },
  data() {
    return {
      meal: [],
      mealObject: {},
      children: [],
      runGet: false,
      error: false,
      showSelectMeal: false,
      showSelectChildren: false,
      cc: [false, false],
      totalChildren: 0,
      like: true,
      allergy: false,
      evaluate: [],
    };
  },
  methods: {
    formatMoney(money) {
      const fm = new FormatMoney({
        decimals: 0,
        append: true,
      });

      const temp = fm.from(money, { symbol: "vnđ" });

      return temp;
    },
    cancel() {
      this.$emit("cancel", false);
    },
    async submit() {
      console.log(this.item.children);
      this.item.children = this.item.children.filter((value, index) => {
        return value.selected == true;
      });
      console.log(this.item.children);

      if (!this.item.meal || this.item.children.length == 0) {
      } else this.$emit("submit");
    },

    async getClasses() {
      try {
        if (this.item.classes.length != 0) {
          const temp = await Classes.get(this.item.classes);
          this.mClasses = temp[0];
        }
      } catch (error) {
        console.log(error);
      }
    },

    formatDate(value) {
      let date = new Date(value);

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return day + "-" + month + "-" + year;
    },

    async getAllMeal() {
      try {
        this.meal = await Meal.getAll();

        this.meal = this.meal.map((value, index) => {
          return {
            _id: value._id,
            dish: value.dish,
            timeStart: value.timeStart,
            timeEnd: value.timeEnd,
            grade: value.grade,
            date: value.date,
            checked: false,
          };
        });

        this.meal = this.meal.filter((value, index) => {
          return (
            value.grade.includes(this.item.grade) &&
            this.formatDate(value.date) == this.formatDate(this.item.date)
          );
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getAllChildren(date, timeStart, timeEnd, dish) {
      try {
        this.children = await Children.getAll();
        this.children = this.children.filter((value, index) => {
          var check = false;
          for (var value1 of value.classes) {
            if (value1._id == this.item.classes) {
              check = true;
            }
          }
          return check == true;
        });

        // lọc ra những trẻ chưa có phiếu ăn ngày hôm đó
        this.children = this.children.filter((value, index) => {
          var check = false;
          for (let value1 of value.mealTicket) {
            if (
              value1.meal.date == date &&
              value1.meal.timeStart == timeStart &&
              value1.meal.timeEnd == timeEnd
            ) {
              check = true;
              break;
            }
          }
          console.log(check);
          return check == false;
        });

        for (let i = 0; i < this.children.length; i++) {
          this.children[i].mealTicket = this.children[i].mealTicket.filter(
            (value, index) => {
              var check = false;
              // console.log('////////////////////////////////');
              // console.log(dish);
              // console.log(value.meal.dish);
              // console.log('////////////////////////////////');
              for (var value1 of value.meal.dish) {
                for (var value2 of dish) {
                  console.table(value1, value2._id);
                  if (value1 == value2._id) {
                    check = true;
                    break;
                  } else {
                    check = false;
                  }
                }
                if (check == false) {
                  break;
                }
              }
              return check == true;
            }
          );
        }

        console.log(this.children);

        for (let value of this.children) {
          var check = false;
          var evaluate =  null;
          for (let value1 of value.mealTicket) {
            evaluate = await Evaluate.get(value1.evaluate);
            check = true;
          }
          if (check == true) {
            this.evaluate.push(evaluate);
          }
        }

        this.children = this.children.map((value, index) => {
          if (value.mealTicket.length == 0) {
            return {
              _id: value._id,
              name: value.name,
              like: true,
              allergy: false,
              selected: false,
            };
          } else {

            return {
              _id: value._id,
              name: value.name,
              like: this.evaluate[index].like,
              allergy: this.evaluate[index].allergy,
              selected: false,
            };
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getEvaluate() {
      try {
        const evaluate = await Evaluate.get();
        this.like = evaluate.like;
        this.allergy = evaluate.allergy;
      } catch (error) {
        console.log(error);
      }
    },
    async get() {
      this.getClasses();
    },
    cancelShowSelectMeal() {
      this.showSelectMeal = false;
    },
    cancelShowSelectChildren() {
      this.showSelectChildren = false;
    },
    async addItem(value) {
      if (value.checked) {
        this.item.meal = value._id;
        this.item.listDish = value.dish;
        this.showSelectMeal = false;
        this.getAllMeal();
        await this.getAllChildren(
          value.date,
          value.timeStart,
          value.timeEnd,
          value.dish
        );
        this.item.children = this.children;
      }
    },
  },
  async created() {
    await this.get();
    await this.getAllMeal();
    // await this.getAllChildren();
  },
};
</script>
