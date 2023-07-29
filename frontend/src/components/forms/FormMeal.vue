<template>
  <!-- <Form @submit="submit" :validation-schema="formSchema" v-slot="{ errors }"> -->
  <div
    class="fixed top-0 bottom-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-slate-800 mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
      style="min-height: 100px; max-height: 100vh"
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
        <div class="flex flex-row mt-5">
          <div
            class="w-1/12 mr-4 flex h-full flex-col items-start justify-center"
          >
            <div
              v-for="(step, index) in stepList"
              :key="step.id"
              class="flex flex-row items-center mb-8 cursor-pointer"
              @click="activeStep = step.id"
            >
              <span
                class="h-10 w-10 mr-3 rounded-md flex items-center justify-center"
                :class="[
                  step.id == activeStep
                    ? 'border border-solid border-slate-300 text-slate-300'
                    : 'border border-solid border-slate-600 text-slate-600',
                ]"
                >{{ step.id }}</span
              >
              <span
                class=""
                :class="[
                  step.id == activeStep ? 'text-slate-300' : 'text-slate-600',
                ]"
                >{{ step.name }}</span
              >
            </div>
          </div>
          <div
            class="border border-solid border-t-0 border-l-0 border-b-0 border-slate-600 mx-4"
          ></div>
          <!--! page 1 -->
          <div class="w-11/12" v-show="activeStep == 1">
            <!-- name -->
            <div class="flex flex-col text-slate-300">
              <label for="name" class="mb-1 -mt-2.5 ml-1 flex items-center"
                >Date<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                  >*</span
                ></label
              >
              <input
                v-model="item.date"
                class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                type="date"
                placeholder=""
                :class="!item.date ? 'border-red-500' : 'border-slate-600'"
              />
              <span v-if="!item.date" class="text-red-500 mt-1 ml-1 text-sm">
                Date must have a value !
              </span>
            </div>
            <!-- timeStart -->
            <div class="flex flex-col text-slate-300">
              <label for="name" class="mb-1 mt-2.5 ml-1 flex items-center"
                >Start time<span
                  class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                  >*</span
                ></label
              >
              <input
                v-model="item.timeStart"
                class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                type="time"
                placeholder=""
                :class="!item.timeStart ? 'border-red-500' : 'border-slate-600'"
              />
              <span
                v-if="!item.timeStart"
                class="text-red-500 mt-1 ml-1 text-sm"
              >
                Start time must have a value !
              </span>
            </div>
            <!-- timeEnd -->
            <!-- timeStart -->
            <div class="flex flex-col text-slate-300">
              <label for="name" class="mb-1 mt-2.5 ml-1 flex items-center"
                >End time<span
                  class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                  >*</span
                ></label
              >
              <input
                v-model="item.timeEnd"
                class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                type="time"
                placeholder=""
                :class="!item.timeEnd ? 'border-red-500' : 'border-slate-600'"
              />
              <span v-if="!item.timeEnd" class="text-red-500 mt-1 ml-1 text-sm">
                End time must have a value !
              </span>
            </div>
            <!-- grade -->
            <div class="flex flex-col text-slate-300">
              <label for="name" class="mb-1 mt-2.5 ml-1 flex items-center"
                >Grade<span
                  class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                  >*</span
                ></label
              >
              <div class="">
                <input
                  v-model="item.grade[0].checked"
                  class="mr-2"
                  type="checkbox"
                  placeholder=""
                  name="mam"
                />
                <label for="" class="mr-4">{{ item.grade[0].name }}</label>
                <input
                  v-model="item.grade[1].checked"
                  class="mr-2"
                  type="checkbox"
                  placeholder=""
                  nam="choi"
                />
                <label for="" class="mr-4">{{ item.grade[1].name }}</label>
                <input
                  v-model="item.grade[2].checked"
                  class="mr-2"
                  type="checkbox"
                  placeholder=""
                  name="la"
                />
                <label for="">{{ item.grade[2].name }}</label>
              </div>
              <span
                v-if="
                  item.grade[0].checked == false &&
                  item.grade[1].checked == false &&
                  item.grade[2].checked == false
                "
                class="text-red-500 mt-1 ml-1 text-sm"
              >
                Grade must have a value !
              </span>
            </div>
          </div>
          <!--! page 2 -->
          <div
            class="w-11/12 overflow-auto"
            style="max-height: 100vh"
            v-show="activeStep == 2"
          >
            <!-- dish -->
            <div
              class="flex flex-col text-slate-300 mr-2 mb-4"
              v-for="(value, index) in item.dish"
            >
              <div class="flex justify-between">
                <label for="" class="mb-4 ml-1 flex items-center"
                  >Dish {{ index + 1 }}
                </label>
                <div class="">
                  <span
                    @click="addIngredient()"
                    class="material-symbols-outlined text-slate-700 hover:text-slate-300 cursor-pointer mr-2"
                  >
                    add
                  </span>
                  <span
                    @click="removeIngredient(index)"
                    class="material-symbols-outlined text-slate-700 hover:text-slate-300 cursor-pointer"
                  >
                    remove
                  </span>
                </div>
              </div>
              <!-- <FSelect
                class="border-slate-600"
                @click="showSearchAdvanced = true"
                v-model="item.dish[index].name"
              /> -->
              <input
                class="bg-inherit border border-solid border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
                type="text"
                @click="showSearchAdvanced = true"
                v-model="item.dish[index].name"
              />
              <SelectAdvantaced
                v-if="showSearchAdvanced"
                @showSearchAdvanced="(value) => (showSearchAdvanced = value)"
                @addItem="
                  (value, value1) => (
                    (item.dish[index].id = value),
                    (item.dish[index].name = value1)
                  )
                "
              />
            </div>
            <!-- Button Add -->
            <button
              @click="submit()"
              class="text-slate-300 border border-solid border-green-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:bg-green-500 mt-5 hover:text-slate-100"
            >
              Add
            </button>
          </div>
        </div>
        <div
          class="flex mt-5"
          :class="stepList.length > 2 ? 'justify-between' : 'justify-end'"
        >
          <span
            v-if="activeStep > 1 && activeStep <= stepList.length"
            class="flex items-center px-5 py-1.5 rounded-md border border-solid border-slate-600 text-slate-600 hover:border-slate-300 hover:text-slate-300 cursor-pointer"
            @click="activeStep = activeStep - 1"
            ><span class="material-symbols-outlined flex items-center mr-2">
              navigate_before </span
            >Previous</span
          >
          <span
            v-if="activeStep >= 1 && activeStep < stepList.length"
            class="flex items-center px-5 py-1.5 rounded-md border border-solid border-slate-600 text-slate-600 hover:border-slate-300 hover:text-slate-300 cursor-pointer"
            @click="activeStep = activeStep + 1"
            >Next
            <span class="material-symbols-outlined flex items-center ml-2">
              navigate_next
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
  <!-- </Form> -->
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import FSelect from "./Select.vue";
import FSearch from "./Search.vue";
import BAdd from "../buttons/Add.vue";
import Table from "../Table.vue";
import Pagination from "../Pagination.vue";
import Position from "../../services/position.service";
import Diploma from "../../services/diploma.service";
import Dish from "../../services/dish.service";
import SelectAdvantaced from "../../views/mealTicket/meal/SelectAdvanced.vue";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    FSelect,
    FSearch,
    BAdd,
    Table,
    Pagination,
    SelectAdvantaced,
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
  },
  data() {
    const formSchema = yup.object().shape({
      name: yup.string().required("Name must have a value !"),
    });
    return {
      formSchema,
      runGet: false,
      error: false,
      dish: [],
      stepList: [
        {
          id: 1,
          name: "",
        },
        {
          id: 2,
          name: "",
        },
      ],
      activeStep: 1,
      showSearchAdvanced: false,
    };
  },
  methods: {
    cancelSearchAdvanced() {
      this.showSearchAdvanced = false;
    },
    cancel() {
      this.$emit("cancel", false);
    },
    submit() {
      if (
        !this.item.date ||
        !this.item.timeStart ||
        !this.item.timeEnd ||
        !this.item.dish[0].id ||
        (this.item.grade[0].checked == false &&
          this.item.grade[1].checked == false &&
          this.item.grade[2].checked == false)
      ) {
      } else {
        this.$emit("submit", this.item);
      }
    },

    updateStepList() {
      if (this.item.dish.length > 1) {
        for (var i = 0; i < this.item.dish - 1; i++) {
          this.stepList.push({
            id: i + 3,
            name: "",
          });
        }
      }
    },

    addIngredient() {
      // this.stepList.push({
      //   id: this.stepList[this.stepList.length - 1].id + 1,
      //   name: "",
      // });
      this.item.dish.push({
        id: "",
      });
    },
    removeIngredient(index) {
      // this.stepList.push({
      //   id: this.stepList[this.stepList.length - 1].id + 1,
      //   name: "",
      // });
      // this.item.ingredient.push({
      //   foodstuff: "",
      //   amount: 0,
      //   function: "",
      //   note: "",
      // });
    },

    async getAllDish() {
      try {
        this.dish = await Dish.getAll();
      } catch (error) {
        console.log(error.message);
      }
    },
  },
  async created() {
    this.updateStepList();
    await this.getAllDish();
  },
};
</script>
