<template>
  <!-- <Form @submit="submit" :validation-schema="formSchema" v-slot="{ errors }"> -->
  <div
    class="fixed top-0 bottom-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div
      v-if="activeDishes"
      class="bg-slate-900 h-screen opacity-70 flex-1 relative"
    ></div>
    <Dishes
      v-if="activeDishes"
      class="bg-white absolute w-10/12"
      @submit="
        (value) => {
          activeDishes = false;
          itemAdd.dishes = value;
        }
      "
      @cancel="activeDishes = false"
    />
    <div
      v-if="!activeDishes"
      class="bg-slate-900 h-screen opacity-70 flex-1 relative"
    ></div>
    <div
      v-if="!activeDishes"
      class="bg-white mx-5 w-6/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
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
      <div class="flex flex-col my-5 mx-3">
        <div class="flex flex-row mt-5">
          <div
            class="w-4/12 mr-4 flex h-full flex-col items-start justify-center"
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
            class="border border-solid border-t-0 border-l-0 border-b-0 border-slate-300 mx-4"
          ></div>
          <!--! page 1 -->
          <div class="w-11/12" v-show="activeStep == 1">
            <!-- name -->
            <div class="flex flex-col text-slate-700">
              <label for="name" class="-mt-2.5 flex items-center"
                >Ngày<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <input
                v-model="itemAdd.date"
                class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900 border-slate-300"
                type="date"
                placeholder=""
              />
              <span v-if="!itemAdd.date" class="text-red-500 mt-1 ml-1 text-sm">
                Đây là trường bắt buộc.
              </span>
            </div>
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 mb-2 flex items-center"
                >Buổi<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <FSelect
                @update:modelValue="(value) => (itemAdd.session = value)"
                :options="sessions"
                :modelValue="``"
                class="border-slate-300 -mt-2.5"
              />
              <span
                v-if="!itemAdd.session"
                class="text-red-500 mt-2 ml-0.5 text-sm"
                >Đây là trường bắt buộc.</span
              >
            </div>
            <!-- grade -->
            <div class="flex flex-col text-slate-900">
              <label for="name" class="mt-2.5 flex items-center"
                >Khối học<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <div class="">
                <div class="" v-for="(value, index) in itemAdd.grade">
                  <input
                    v-model="itemAdd.grade[index].checked"
                    class="mr-2"
                    type="checkbox"
                    placeholder=""
                    name="mam"
                  />
                  <label for="" class="mr-4">{{
                    itemAdd.grade[index].name
                  }}</label>
                </div>
                <!-- <input
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
                <label for="">{{ item.grade[2].name }}</label> -->
              </div>
              <span
                v-if="
                  itemAdd.grade[0].checked == false &&
                  itemAdd.grade[1].checked == false &&
                  itemAdd.grade[2].checked == false
                "
                class="text-red-500 mt-2 ml-0.5 text-sm"
              >
                Đây là trường bắt buộc.
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
            <div class="flex flex-col text-slate-900 mr-2 mb-4">
              <div class="flex justify-between">
                <label for="" class="flex items-center"
                  >Món ăn<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
              </div>
              <input
                class="bg-inherit border border-solid border-slate-300 focus:border-slate-900 rounded-md py-1.5 px-2"
                type="text"
                @focus="activeDishes = true"
              />
              <span
                v-if="!itemAdd.dishes.length"
                class="text-red-500 mt-2 ml-0.5 text-sm"
                >Đây là trường bắt buộc.</span
              >

              <div class="mt-2 flex flex-col" v-if="itemAdd.dishes.length > 0">
                <span
                  v-for="(value, index) in itemAdd.dishes"
                  class="text-slate-900 ml-0.5 text-md"
                  >{{ index + 1 }}. {{ value.name }}</span
                >
              </div>
            </div>
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Ghi chú<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="itemAdd.note"
                class="bg-inherit overflow-auto border border-solid rounded-md p-2 border-slate-300 focus:border-slate-900"
                style="outline: none; height: 50px"
              ></textarea>
            </div>
            <!-- Button Add -->
            <button
              @click.prevent="$emit('submit')"
              class="text-white border border-solid border-blue-500 bg-blue-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg mt-5 hover:shadow-yellow-500/50"
            >
              Thêm
            </button>
          </div>
        </div>
        <div
          class="flex mt-5"
          :class="stepList.length > 2 ? 'justify-between' : 'justify-end'"
        >
          <span
            v-if="activeStep > 1 && activeStep <= stepList.length"
            class="flex items-center px-5 py-1.5 rounded-md border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200 cursor-pointer"
            @click="activeStep = activeStep - 1"
            >Trước</span
          >
          <span
            v-if="activeStep >= 1 && activeStep < stepList.length"
            class="flex items-center px-5 py-1.5 rounded-md border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200 cursor-pointer"
            @click="activeStep = activeStep + 1"
            >Kế tiếp
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
import { Session, http_getAll } from "../../assets/js/imports";
import Dishes from "../../components/common/dishes.vue";

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
    Dishes,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    itemAdd: {
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
          name: "Thông tin khẩu phần ăn",
        },
        {
          id: 2,
          name: "Thông tin món ăn",
        },
      ],
      activeStep: 1,
      showSearchAdvanced: false,
      sessions: [],
      activeDishes: false,
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
        !this.itemAdd.date ||
        !this.itemAdd.timeStart ||
        !this.itemAdd.timeEnd ||
        !this.itemAdd.dish[0].id ||
        (this.itemAdd.grade[0].checked == false &&
          this.itemAdd.grade[1].checked == false &&
          this.itemAdd.grade[2].checked == false)
      ) {
      } else {
        this.$emit("submit", this.itemAdd);
      }
    },

    updateStepList() {
      if (this.itemAdd.dish.length > 1) {
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
      this.itemAdd.dish.push({
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
    this.sessions = await http_getAll(Session);
    console.log(this.sessions);
    const childcareCenter = sessionStorage.getItem("owner_childcareCenter");
    this.sessions = this.sessions.filter((i) =>
      i.childcareCenter.some((j) => j._id == childcareCenter)
    );
    console.log(this.sessions);
    this.sessions = this.sessions.map((i) => ({
      _id: i._id,
      name: i.name + "_" + i.startTime + "_" + i.endTime,
    }));
    console.log("chay ne");
    console.log(this.sessions);
  },
};
</script>
