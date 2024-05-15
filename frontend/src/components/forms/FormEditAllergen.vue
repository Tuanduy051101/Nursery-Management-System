<template>
  <Form @submit="" :validation-schema="formSchema" v-slot="{ errors }">
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
      <div
        class="bg-white mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
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
                <label for="name" class="-mt-2.5 flex items-center"
                  >Tên chất dị ứng<span
                    class="text-red-500 text-3xl ml-0.5 relative"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.name"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="name"
                  type="text"
                  placeholder=""
                  :class="errors.name ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                  disabled
                />
                <ErrorMessage
                  name="name"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <div class="flex flex-col text-slate-900">
                <label for="description" class="mt-2.5 mb-2 flex items-center"
                  >Mô tả<span class="text-black text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.description"
                  class="bg-inherit rounded-md px-2 py-1.5 -mt-2.5 border-slate-300 border border-solid focus:border-slate-900"
                  name="description"
                  type="text"
                  as="textarea"
                  placeholder=""
                  autocomplete="off"
                />
              </div>
              <div class="flex flex-col text-slate-900">
                <label for="description" class="mt-2.5 mb-2 flex items-center"
                  >Mức độ dị ứng<span class="text-red text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <select
                  v-model="item.severity"
                  class="w-full h-10 border border-solid border-slate-300 focus:border-slate-900 rounded-md outline-none"
                  @click="isDropdownOpen = -1"
                  name="severity"
                >
                  <option
                    v-for="option in ['nhẹ', 'nặng']"
                    :key="option"
                    :value="option"
                    checked
                  >
                    {{ option }}
                  </option>
                </select>
              </div>
              <div class="flex flex-col text-slate-900">
                <label for="reactionType" class="mt-2.5 mb-2 flex items-center"
                  >Phản ứng dị ứng<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.reactionType"
                  class="bg-inherit rounded-md px-2 py-1.5 -mt-2.5 border-slate-300 border border-solid focus:border-slate-900"
                  name="reactionType"
                  type="text"
                  as="textarea"
                  placeholder=""
                  autocomplete="off"
                />
                <ErrorMessage
                  name="reactionType"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <div class="flex flex-col text-slate-900">
                <label for="description" class="mt-2.5 mb-2 flex items-center"
                  >Giải pháp<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.treatment"
                  class="bg-inherit rounded-md px-2 py-1.5 -mt-2.5 border-slate-300 border border-solid focus:border-slate-900"
                  name="treatment"
                  type="text"
                  as="textarea"
                  placeholder=""
                  autocomplete="off"
                />
                <ErrorMessage
                  name="treatment"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <div class="flex flex-col text-slate-900">
                <label for="description" class="mt-2.5 mb-2 flex items-center"
                  >Ghi chú<span class="text-black text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.note"
                  class="bg-inherit rounded-md px-2 py-1.5 -mt-2.5 border-slate-300 border border-solid focus:border-slate-900"
                  name="note"
                  type="text"
                  as="textarea"
                  placeholder=""
                  autocomplete="off"
                />
              </div>
              <button
                @click="
                  () => {
                    submit();
                  }
                "
                class="text-white border-yellow-500 bg-yellow-500 border border-solid px-3 py-1.5 flex items-center justify-center rounded-md mt-5 hover:shadow-lg hover:shadow-yellow-500/50"
              >
                Cập nhật
              </button>
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
      treatment: yup.string().required("Đây là trường bắt buộc."),
      reactionType: yup.string().required("Đây là trường bắt buộc."),
      severity: yup.string().required("Đây là trường bắt buộc."),
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
  },
  async created() {
    await this.getAllChildcareCenter();
  },
};
</script>
