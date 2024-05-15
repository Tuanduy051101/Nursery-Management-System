<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex overflow-auto items-center justify-center"
  >
    <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-white mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
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
        <div>
          <!-- school year -->
          <div class="flex flex-col text-slate-900">
            <label for="" class="-mt-2.5 flex items-center"
              >Năm học<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.schoolYear = value)"
              @update="(value) => (runGet = value)"
              :options="sYear"
              :modelValue="mSYear.name || 'Chọn'"
              class="border-slate-300 hover:border-slate-900"
            />
            <span v-if="!item.schoolYear" class="text-red-500 mt-2 ml-0.5 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <!-- dateStart -->
          <div class="flex flex-col text-slate-900">
            <label for="" class="mt-2.5 flex items-center"
              >Ngày bắt đầu thu<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <input
              class="bg-inherit border border-solid border-slate-300 focus:border-slate-900 rounded-md py-1.5 px-2"
              type="date"
              name=""
              id=""
              v-model="item.dateStart"
            />
            <span v-if="!item.dateStart" class="text-red-500 mt-2 ml-0.5 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <!-- dateEnd -->
          <div class="flex flex-col text-slate-900">
            <label for="" class="mt-2.5 flex items-center"
              >Ngày kết thúc thu<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <input
              class="bg-inherit border border-solid border-slate-300 focus:border-slate-900 rounded-md py-1.5 px-2"
              type="date"
              name=""
              id=""
              v-model="item.dateEnd"
            />
            <span v-if="!item.dateEnd" class="text-red-500 mt-2 ml-0.5 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <button
            @click="$emit('submit')"
            class="text-white border border-solid border-blue-500 bg-blue-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg mt-5 hover:shadow-yellow-500/50"
          >
            Thêm
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
import SYear from "../../services/sYear.service";
import { FormatMoney } from "format-money-js";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    IAdd,
    FSelect,
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
    return {
      sYear: [],
      mSYear: {},
      runGet: false,
      error: false,
      childcareCenter:  sessionStorage.getItem("owner_childcareCenter"),
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },

    async getAllSYear() {
      try {
        this.sYear = await SYear.getAll();
        this.sYear = this.sYear.filter(i => i.childcareCenter._id == this.childcareCenter)
      } catch (error) {
        console.log(error);
      }
    },

    async getSYear() {
      try {
        if (this.item.schoolYear.length != 0) {
          this.mSYear = await SYear.get(this.item.schoolYear);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getAll() {
      await this.getAllSYear();
    },

    async get() {
      await this.getSYear();
    },
  },
  async created() {
    await this.getAll();
    await this.get();
  },
};
</script>
