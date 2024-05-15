<template>
  <Form @submit="" :validation-schema="formSchema" v-slot="{ errors }">
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
      <div
        class="bg-white mx-5 w-5/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
        style="min-height: 100px"
      >
        <div
          class="flex flex-row justify-between items-center px-3 py-3 text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
        >
          <span>{{ title }}</span>
          <span
            @click="cancel"
            class="material-symbols-outlined cursor-pointer text-slate-900 hover:text-red-500"
            title="Đóng"
          >
            close
          </span>
        </div>
        <div class="flex flex-col mt-2 mx-3">
          <div class="flex flex-row">
            <div
              class="w-full overflow-auto pr-3 py-3"
              v-show="activeStep == 1"
              style="max-height: calc(100vh - 250px)"
            >
              <!-- name -->
              <div class="flex flex-col text-slate-900">
                <label
                  for="name"
                  class="flex text-lg items-center bold text-blue-500"
                  >Tiêu đề:
                  <span class="ml-2 text-black">{{
                    capitalizeOneWord(item.title)
                  }}</span></label
                >
              </div>
              <div class="flex flex-col text-slate-900">
                <label
                  for="name"
                  class="flex text-lg items-center my-2 bold text-blue-500"
                  >Ngày gửi:
                  <span class="ml-2 text-black">{{
                    formatDate1(item.dateSent)
                  }}</span></label
                >
              </div>
              <div class="flex flex-col text-slate-900">
                <label
                  for="name"
                  class="flex text-lg items-start whitespace-nowrap bold text-blue-500"
                  >Nội dung:
                  <span
                    class="ml-2 whitespace-normal text-black"
                    style="text-align: justify"
                    >{{
                      capitalizeAfterDot(capitalizeOneWord(item.content))
                    }}</span
                  ></label
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import FSelect from "./Select.vue";
import BAdd from "../buttons/Add.vue";
import Account from "../../services/account.service";
import LocationPicker from "../../components/forms/LocationPicker.vue";
import ChildcareCenter from "../../services/childcareCenter.service";
import { formatDate } from "../../assets/js/imports.js";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    FSelect,
    BAdd,
    LocationPicker,
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
    item1: {
      type: Object,
      default: {},
    },
    item2: {
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
      startDate: yup
        .date()
        .required(`Đây là trường bắt buộc.`)
        .min(new Date(), "Ngày bắt đầu năm học không nhỏ hơn ngày hiện tại."),
      // .test("age", "Tuổi trẻ phải từ 0-6 tuổi.", (value) => {
      //   if (value) {
      //     const today = new Date();
      //     const age = today.getFullYear() - value.getFullYear();
      //     return age >= 0 && age <= 6;
      //   }
      //   return false;
      // }),
      endDate: yup
        .date()
        .required(`Đây là trường bắt buộc.`)
        .min(new Date(), "Ngày kết thúc năm học không nhỏ hơn ngày hiện tại."),
      // .test("age", "Tuổi trẻ phải từ 0-6 tuổi.", (value) => {
      //   if (value) {
      //     const today = new Date();
      //     const age = today.getFullYear() - value.getFullYear();
      //     return age >= 0 && age <= 6;
      //   }
      //   return false;
      // }),
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
          name: "Parents",
        },
      ],
      activeStep: 1,
      showPassword: false,
      accounts: [],
      checkUser: true,
      modeAdd: true,
      checks: {
        province: true,
        district: true,
        ward: true,
      },
      childcareCenter: [],
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    capitalizeOneWord(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    submit() {
      this.$emit("submit");
    },
    async getAllChildcareCenter() {
      try {
        this.childcareCenter = await ChildcareCenter.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    formatDate1(value) {
      return formatDate(value);
    },
    capitalizeAfterDot(inputString) {
      let resultString = inputString
        .trim()
        .split(". ")
        .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
        .join(". ");

      return resultString;
    },
  },
  async created() {
    await this.getAllChildcareCenter();
  },
};
</script>
