<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-white overflow-auto mx-5 w-6/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
      style="min-height: 100px; max-height: 100vh"
    >
      <div
        class="flex flex-row justify-between items-center px-3 py-3 text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
      >
        <span>{{ title }}</span>
        <span
          @click="cancel"
          class="material-symbols-outlined cursor-pointer text-slate-900 hover:text-red-500"
        >
          close
        </span>
      </div>
      <!-- Add -->
      <div v-if="buttonName == 'Add'" class="flex flex-col my-5 mx-3">
        <div class="flex flex-row mt-5">
          <div
            class="w-4/12 mr-4 flex h-full flex-col items-start justify-center"
          >
            <div class="" v-for="(step, index) in stepList" :key="step.id">
              <div
                v-if="stepList.length <= 5"
                class="flex flex-row items-center mb-8 cursor-pointer"
                @click="activeStep = step.id"
              >
                <span
                  class="h-10 w-10 mr-3 rounded-md flex items-center justify-center"
                  :class="[
                    step.id == activeStep
                      ? 'border border-solid border-green-500 text-white bg-green-500'
                      : 'border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200',
                  ]"
                  >{{ step.id }}</span
                >
                <span
                  class="whitespace-nowrap"
                  :class="[
                    step.id == activeStep ? 'text-slate-900' : 'text-slate-900',
                  ]"
                  >{{ step.name }}</span
                >
              </div>
            </div>
            <div
              v-if="stepList.length > 5"
              class=""
              v-for="(step, index) in stepList"
              :key="step.id"
            >
              <div
                v-if="step.id == 2 || step.id == 3 || step.id == 1"
                class="flex flex-row items-center mb-8 cursor-pointer"
                @click="activeStep = step.id"
              >
                <span
                  class="h-10 w-10 mr-3 rounded-md flex items-center justify-center"
                  :class="[
                    step.id == activeStep
                      ? 'border border-solid border-green-500 text-white bg-green-500'
                      : 'border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200',
                  ]"
                  >{{ step.id }}</span
                >
                <span
                  class=""
                  :class="[
                    step.id == activeStep ? 'text-slate-900' : 'text-slate-900',
                  ]"
                  >{{ step.name }}</span
                >
              </div>
            </div>
            <div
              v-if="stepList.length > 5"
              class="flex flex-r ow items-center mb-8 cursor-pointer"
            >
              <span
                class="h-10 w-10 mr-3 rounded-md flex items-center justify-center border border-solid border-slate-300 text-slate-900"
                ><span class="material-symbols-outlined">
                  more_horiz
                </span></span
              >
            </div>
            <div
              v-if="stepList.length > 5"
              class=""
              v-for="(step, index) in stepList"
              :key="step.id"
            >
              <div
                v-if="
                  step.id == stepList.length || step.id == stepList.length - 1
                "
                class="flex flex-row items-center mb-8 cursor-pointer"
                @click="activeStep = step.id"
              >
                <span
                  class="h-10 w-10 mr-3 rounded-md flex items-center justify-center"
                  :class="[
                    step.id == activeStep
                      ? 'border border-solid border-green-500 text-white bg-green-500'
                      : 'border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200',
                  ]"
                  >{{ step.id }}</span
                >
                <span
                  class="whitespace-nowrap"
                  :class="[
                    step.id == activeStep ? 'text-slate-900' : 'text-slate-900',
                  ]"
                  >{{ step.name }}</span
                >
              </div>
            </div>
          </div>
          <div
            class="border border-solid border-t-0 border-l-0 border-b-0 border-slate-300 mx-4"
          ></div>
          <!--! page 1 -->
          <div class="w-11/12" v-show="activeStep == 1">
            <!-- name -->
            <div class="flex flex-col text-slate-900">
              <label for="name" class="-mt-2.5 flex items-center"
                >Tên món ăn<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <input
                v-model="item.name"
                class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                type="text"
                placeholder=""
                :class="!item.name ? 'border-red-500' : 'border-slate-300'"
              />
              <span v-if="!item.name" class="text-red-500 mt-2 ml-0.5 text-sm">
                Đây là trường bắt buộc.
              </span>
            </div>
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Chức năng<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="item.function"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2"
                :class="
                  !item.function
                    ? 'border-red-500'
                    : 'border-slate-300 focus:border-slate-300'
                "
                style="outline: none; min-height: 50px"
              ></textarea>
              <span
                v-if="!item.function"
                class="text-red-500 mt-2 ml-0.5 text-sm"
              >
                Đây là trường bắt buộc.
              </span>
            </div>
            <!-- note -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Ghi chú<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="item.note"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; min-height: 50px"
              ></textarea>
            </div>
            <!-- cooking -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Cách nấu món ăn<span
                  class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="item.cooking"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; min-height: 50px"
              ></textarea>
            </div>
          </div>
          <!--! page 2 -->
          <div
            class="w-11/12"
            v-show="activeStep == index + 2"
            v-for="(value, index) in item.ingredients"
          >
            <!-- ingredient -->
            <div class="flex flex-col text-slate-900 relative">
              <div class="flex justify-between">
                <label for="name" class="-mt-2.5 flex items-center"
                  >Nguyên liệu<span
                    class="text-red-500 text-xl -mt-3 relative ml-1"
                    >{{ index + 1 }}</span
                  ></label
                >
                <div class="">
                  <span
                    @click="$emit('add_i'), addIngredient()"
                    class="material-symbols-outlined text-slate-900 hover:text-blue-500 cursor-pointer mr-2"
                    title="thêm nguyên liệu"
                  >
                    add
                  </span>
                  <span
                    @click="$emit('remove_i', index), removeIngredient()"
                    class="material-symbols-outlined text-slate-900 hover:text-red-500 cursor-pointer"
                    title="xoá nguyên liệu"
                  >
                    remove
                  </span>
                </div>
              </div>
              <div
                v-if="activeHint"
                class="absolute space-y-0.5 py-2 top-10 mt-10 right-0 bg-white w-full border border-solid border-slate-900 rounded-md z-50"
              >
                <p
                  v-for="(value1, index1) in foodstuff"
                  @click="
                    () => {
                      item.ingredients[index].name_i = value1.name;
                      item.ingredients[index].function_i = value1.function;
                      activeHint = false;
                    }
                  "
                  class="px-2 hover:text-yellow-500 cursor-pointer"
                >
                  {{ value1.name }}
                </p>
              </div>
              <input
                type="text"
                name=""
                id=""
                @input="
                  async (value1) => {
                    let temp = value1.target.value;
                    item.ingredients[index].name_i = temp;
                    ingredientValue = temp;

                    temp = temp.toLowerCase().split(' ');

                    await getAllFoodStuff();

                    foodstuff = foodstuff.filter((i) => {
                      return i.name.split(' ').some((j) => {
                        return temp.some((g) => g == j);
                      });
                    });
                    if (foodstuff.length > 0) {
                      activeHint = true;
                    } else {
                      activeHint = false;
                    }
                  }
                "
                v-model="item.ingredients[index].name_i"
                class="bg-inherit rounded-md px-2 py-1.5 border-slate-300 border border-solid focus:border-slate-900"
              />
            </div>
            <!-- amount -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Số lượng<span
                  class="text-3xl relative ml-0.5"
                  :class="[
                    item.ingredients[index].name_i.length == 0
                      ? 'text-black'
                      : text - red - 500,
                  ]"
                  >*</span
                ></label
              >
              <input
                @click="activeHint = false"
                :disabled="item.ingredients[index].name_i.length == 0"
                type="text"
                name=""
                id=""
                v-model="item.ingredients[index].amount_i"
                class="bg-inherit rounded-md px-2 py-1.5 border-slate-300 border border-solid focus:border-slate-900"
              />
              <span
                v-if="
                  !item.ingredients[index].amount_i &&
                  item.ingredients[index].name_i.length != 0
                "
                class="text-red-500 mt-2 ml-0.5 text-sm"
              >
                Đây là trường bắt buộc.
              </span>
            </div>
            <!-- function -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Chức năng<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                @click="activeHint = false"
                :disabled="item.ingredients[index].name_i.length == 0"
                v-model="item.ingredients[index].function_i"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <!-- making -->
            <!-- note -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Cách chế biến<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                :disabled="item.ingredients[index].name_i.length == 0"
                v-model="item.ingredients[index].making_i"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <!-- note -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Ghi chú<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                :disabled="item.ingredients[index].name_i.length == 0"
                v-model="item.ingredients[index].note_i"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <!-- Button Add -->
            <button
              v-if="activeStep == item.ingredients.length + 1"
              @click="$emit('submit')"
              class="text-white border border-solid border-blue-500 bg-blue-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg mt-5 hover:shadow-yellow-500/50"
            >
              Thêm
            </button>
          </div>
        </div>
        <div class="flex mt-5 justify-end">
          <span
            v-if="activeStep > 1 && activeStep <= stepList.length"
            class="flex items-center px-5 py-1.5 rounded-md border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200 cursor-pointer"
            @click="activeStep = activeStep - 1"
            >Trước</span
          >
          <span
            v-if="
              stepList.length > 2 &&
              activeStep > 1 &&
              activeStep < stepList.length
            "
            class="mx-2"
          ></span>
          <span
            v-if="activeStep >= 1 && activeStep < stepList.length"
            class="flex items-center px-5 py-1.5 rounded-md border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200 cursor-pointer"
            @click="activeStep = activeStep + 1"
            >Kế tiếp
          </span>
        </div>
      </div>
      <!-- Edit -->
      <div v-if="buttonName == 'Edit'" class="flex flex-col my-5 mx-3">
        <div class="flex flex-row">
          <div class="w-full">
            <!-- name -->
            <div class="flex flex-col text-slate-900">
              <label for="name" class="-mt-2.5 flex items-center"
                >Tên món ăn<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <input
                v-model="item.name"
                class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                type="text"
                placeholder=""
                :class="!item.name ? 'border-red-500' : 'border-slate-300'"
              />
              <span v-if="!item.name" class="text-red-500 mt-2 ml-0.5 text-sm">
                Đây là trường bắt buộc.
              </span>
            </div>
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Chức năng<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="item.function"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2"
                :class="
                  !item.function
                    ? 'border-red-500'
                    : 'border-slate-300 focus:border-slate-900'
                "
                style="outline: none; height: 50px"
              ></textarea>
              <span
                v-if="!item.function"
                class="text-red-500 mt-2 ml-0.5 text-sm"
              >
                Đây là trường bắt buộc.
              </span>
            </div>
            <!-- note -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Ghi chú<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="item.note"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <!-- cooking -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Cách nấu<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="item.cooking"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <button
              @click="$emit('submit')"
              class="text-white border border-solid border-yellow-500 bg-yellow-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg hover:shadow-yellow-500/50 mt-5"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
      <!-- Add ingredient -->
      <div
        v-if="buttonName == 'Add I' || buttonName == 'Edit I'"
        class="flex flex-col my-5 mx-3"
      >
        <div class="flex flex-row">
          <div class="w-full">
            <div class="flex flex-col text-slate-900 mt-2 relative">
              <div class="flex justify-between">
                <label for="name" class="-mt-2.5 flex items-center"
                  >Tên nguyên liệu<span
                    class="text-red-500 text-3xl mb-1 relative ml-0.5"
                    >*</span
                  ></label
                >
              </div>
              <input
                type="text"
                name=""
                id=""
                :value="item.name"
                :disabled="buttonName == 'Edit I'"
                @input="
                  async (value1) => {
                    let temp = value1.target.value;
                    item.name = temp;
                    ingredientValue = temp;
                    temp = temp.toLowerCase().split(' ');

                    await getAllFoodStuff();

                    foodstuff = foodstuff.filter((i) => {
                      return i.name.split(' ').some((j) => {
                        return temp.some((g) => g == j);
                      });
                    });
                    if (foodstuff.length > 0) {
                      activeHint = true;
                    } else {
                      activeHint = false;
                    }
                  }
                "
                class="bg-inherit rounded-md px-2 py-1.5 border-slate-300 border border-solid focus:border-slate-900"
              />
              <div
                v-if="activeHint"
                class="absolute space-y-0.5 py-2 top-10 mt-10 right-0 bg-white w-full border border-solid border-slate-900 rounded-md z-50"
              >
                <p
                  v-for="(value1, index1) in foodstuff"
                  @click="
                    () => {
                      item.name = value1.name;
                      item.function = value1.function;
                      activeHint = false;
                    }
                  "
                  class="px-2 hover:text-yellow-500 cursor-pointer"
                >
                  {{ value1.name }}
                </p>
              </div>
              <span v-if="!item.name" class="text-red-500 mt-2 ml-0.5 text-sm">
                Đây là trường bắt buộc.
              </span>
            </div>
            <!-- amount -->
            <div class="flex flex-col text-slate-900">
              <label for="name" class="mt-2.5 flex items-center"
                >Số lượng<span
                  class="text-red-500 text-3xl mb-1 relative ml-0.5"
                  >*</span
                ></label
              >
              <input
                :disabled="item.name.length == 0"
                type="text"
                name=""
                id=""
                v-model="item.amount"
                class="bg-inherit rounded-md px-2 py-1.5 border-slate-300 border border-solid focus:border-slate-900"
              />
              <span
                v-if="!item.amount"
                class="text-red-500 mt-2 ml-0.5 text-sm"
              >
                Đây là trường bắt buộc.
              </span>
            </div>
            <!-- function -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Chức năng<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                :disabled="item.name.length == 0"
                v-model="item.function"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <!-- making -->
            <!-- note -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Cách chế biến<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                :disabled="item.name.length == 0"
                v-model="item.making"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <!-- note -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Ghi chú<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                :disabled="item.name.length == 0"
                v-model="item.note"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <button
              v-if="buttonName == 'Add I'"
              @click="$emit('submit')"
              class="text-white border border-solid border-blue-500 bg-blue-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg mt-5 hover:shadow-yellow-500/50"
            >
              Thêm
            </button>
            <button
              v-if="buttonName == 'Edit I'"
              @click="$emit('submit')"
              class="text-white border border-solid border-yellow-500 bg-yellow-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg mt-5 hover:shadow-yellow-500/50"
            >
              Cập nhật
            </button>
          </div>
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
import { Foodstuff } from "../../assets/js/imports";

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
    buttonName: {
      type: String,
      default: "Add",
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
      name: yup.string().required("Đây là trường bắt buộc."),
      function: yup.string().required("Đây là trường bắt buộc."),
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
          name: "Thông tin món ăn",
        },
        {
          id: 2,
          name: "Thông tin nguyên liệu",
        },
      ],
      activeStep: 1,
      foodstuff: [],
      ingredientValue: "",
      activeHint: false,
    };
  },
  watch: {
    ingredientValue() {},
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
      if (this.item.ingredient) {
        if (this.item.ingredient.length > 1) {
          for (var i = 0; i < this.item.ingredient - 1; i++) {
            this.stepList.push({
              id: i + 3,
              name: "",
            });
          }
        }
      }
    },

    addIngredient() {
      this.stepList.push({
        id: this.stepList[this.stepList.length - 1].id + 1,
        name: "Thông tin nguyên liệu",
      });
      this.activeStep = this.stepList.length;
    },
    removeIngredient() {
      this.stepList.pop();
      this.activeStep = this.stepList.length;
    },
    async getAllFoodStuff() {
      try {
        this.foodstuff = await Foodstuff.getAll();
        console.log("x", this.foodstuff);
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    this.updateStepList();
    this.getAllFoodStuff();
  },
};
</script>
