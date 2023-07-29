<template>
  <!-- <Form @submit="submit" :validation-schema="formSchema" v-slot="{ errors }"> -->
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-slate-800 overflow-auto mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
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
                >Name<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                  >*</span
                ></label
              >
              <input
                v-model="item.name"
                class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                type="text"
                placeholder=""
                :class="!item.name ? 'border-red-500' : 'border-slate-600'"
              />
              <span v-if="!item.name" class="text-red-500 mt-1 ml-1 text-sm">
                Name must have a value !
              </span>
            </div>
            <div class="flex flex-col text-slate-300">
              <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                >Function<span
                  class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="item.function"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2"
                :class="
                  !item.function
                    ? 'border-red-500'
                    : 'border-slate-600 focus:border-slate-300'
                "
                style="outline: none; max-height: 80px"
              ></textarea>
              <span
                v-if="!item.function"
                class="text-red-500 mt-1 ml-1 text-sm"
              >
                Function must have a value !
              </span>
            </div>
            <!-- note -->
            <div class="flex flex-col text-slate-300">
              <label for="" class="mb-4 mt-5 ml-1 flex items-center"
                >Note</label
              >
              <textarea
                v-model="item.note"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-600 focus:border-slate-300"
                style="outline: none; max-height: 80px"
              ></textarea>
            </div>
            <!-- cooking -->
            <div class="flex flex-col text-slate-300">
              <label for="" class="mb-4 mt-5 ml-1 flex items-center"
                >Cooking</label
              >
              <textarea
                v-model="item.cooking"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-600 focus:border-slate-300"
                style="outline: none; max-height: 80px"
              ></textarea>
            </div>
          </div>
          <!--! page 2 -->
          <div
            class="w-11/12"
            v-show="activeStep == index + 2"
            v-for="(value, index) in item.ingredient"
          >
            <!-- ingredient -->
            <div class="flex flex-col text-slate-300">
              <div class="flex justify-between">
                <label for="" class="mb-4 ml-1 flex items-center"
                  >Ingredient {{ index + 1 }}
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
              <input
                type="text"
                name=""
                id=""
                v-model="item.ingredient[index].foodstuff"
                class="bg-inherit rounded-md px-2 py-1.5 border-slate-600 border border-solid focus:border-slate-300"
              />
            </div>
            <!-- amount -->
            <div class="flex flex-col text-slate-300">
              <label for="" class="mb-4 mt-5 ml-1 flex items-center"
                >Amount
              </label>
              <input
                :disabled="item.ingredient[index].foodstuff.length == 0"
                type="text"
                name=""
                id=""
                v-model="item.ingredient[index].amount"
                class="bg-inherit rounded-md px-2 py-1.5 border-slate-600 border border-solid focus:border-slate-300"
              />
            </div>
            <!-- function -->
            <div class="flex flex-col text-slate-300">
              <label for="" class="mb-4 mt-5 ml-1 flex items-center"
                >Function
              </label>
              <input
                :disabled="item.ingredient[index].foodstuff.length == 0"
                type="text"
                name=""
                id=""
                v-model="item.ingredient[index].function"
                class="bg-inherit rounded-md px-2 py-1.5 border-slate-600 border border-solid focus:border-slate-300"
              />
            </div>
            <!-- making -->
            <!-- note -->
            <div class="flex flex-col text-slate-300">
              <label for="" class="mb-4 mt-5 ml-1 flex items-center"
                >Making</label
              >
              <textarea
                :disabled="item.ingredient[index].foodstuff.length == 0"
                v-model="item.ingredient[index].making"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-600 focus:border-slate-300"
                style="outline: none; max-height: 80px"
              ></textarea>
            </div>
            <!-- note -->
            <div class="flex flex-col text-slate-300">
              <label for="" class="mb-4 mt-5 ml-1 flex items-center"
                >Note</label
              >
              <textarea
                :disabled="item.ingredient[index].foodstuff.length == 0"
                v-model="item.ingredient[index].note"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-600 focus:border-slate-300"
                style="outline: none; max-height: 80px"
              ></textarea>
            </div>
            <!-- Button Add -->
            <button
              v-if="activeStep == item.ingredient.length + 1"
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
import BAdd from "../buttons/Add.vue";
import Position from "../../services/position.service";
import Diploma from "../../services/diploma.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    FSelect,
    BAdd,
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
      position: [],
      diploma: [],
      mPosition: {},
      mDiploma: {},
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
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    submit() {
      if (!this.item.name || !this.item.function) {
      } else {
        this.$emit("submit", this.item);
      }
    },

    updateStepList() {
      if (this.item.ingredient.length > 1) {
        for (var i = 0; i < this.item.ingredient - 1; i++) {
          this.stepList.push({
            id: i + 3,
            name: "",
          });
        }
      }
    },

    addIngredient() {
      this.stepList.push({
        id: this.stepList[this.stepList.length - 1].id + 1,
        name: "",
      });
      this.item.ingredient.push({
        foodstuff: "",
        amount: "",
        function: "",
        note: "",
        making: "",
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
  },
  async created() {
    this.updateStepList();
  },
};
</script>
