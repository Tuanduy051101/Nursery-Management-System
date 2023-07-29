<template>
  <Form @submit="submit" :validation-schema="formSchema" v-slot="{ errors }">
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex overflow-auto items-center justify-center"
    >
      <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
      <div
        class="bg-slate-800 mx-5 w-6/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
        style="min-height: 100px"
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
              class="w-2/12 mr-4 flex h-full flex-col items-start justify-center"
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
            <div class="w-10/12" v-show="activeStep == 1">
              <div class="flex">
                <!-- name -->
                <div class="flex w-6/12 flex-col text-slate-300">
                  <label for="name" class="mb-1 -mt-2.5 ml-1 flex items-center"
                    >Name<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <Field
                    v-model="item.name"
                    class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                    name="name"
                    type="text"
                    placeholder=""
                    :class="!item.name ? 'border-red-500' : 'border-slate-600'"
                  />
                  <ErrorMessage
                    name="name"
                    class="text-red-500 mt-1 ml-1 text-sm"
                  />
                </div>
                <!-- gender -->
                <div class="flex w-6/12 flex-col text-slate-300 ml-3">
                  <label for="" class="mb-1 -mt-2.5 ml-1 flex items-center"
                    >Gender<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <FSelect
                    class=""
                    @update:modelValue="(value) => (item.gender = value)"
                    @update="(value) => (runGet = value)"
                    :options="[
                      {
                        _id: true,
                        name: 'nam',
                      },
                      {
                        _id: false,
                        name: 'nữ',
                      },
                    ]"
                    :modelValue="`nam`"
                  />
                </div>
              </div>
              <!-- phone -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >Phone<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.phone"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                  name="phone"
                  style=""
                  type="text"
                  placeholder=""
                  :class="
                    !item.phone || errors.phone
                      ? 'border-red-500'
                      : 'border-slate-600'
                  "
                />
                <ErrorMessage
                  name="phone"
                  class="text-red-500 mt-1 ml-1 text-sm"
                />
              </div>
              <!-- email -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >E-mail<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.email"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                  name="email"
                  style=""
                  type="text"
                  placeholder=""
                  :class="
                    !item.email || errors.email
                      ? 'border-red-500'
                      : 'border-slate-600'
                  "
                />
                <ErrorMessage
                  name="email"
                  class="text-red-500 mt-1 ml-1 text-sm"
                />
              </div>
              <!-- address -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >Address<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.address"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                  name="address"
                  id="address"
                  style=""
                  type="text"
                  placeholder=""
                  :class="
                    !item.address || errors.address
                      ? 'border-red-500'
                      : 'border-slate-600'
                  "
                />
                <ErrorMessage
                  name="address"
                  class="text-red-500 mt-1 ml-1 text-sm"
                />
              </div>
              <!-- Relationship -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >Relationship<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <FSelect
                  @update:modelValue="(value) => (item.relationship = value)"
                  @update="(value) => (runGet = value)"
                  :options="[
                    { _id: 'bố', name: 'bố' },
                    { _id: 'mẹ', name: 'mẹ' },
                    { _id: 'anh trai', name: 'anh trai' },
                    { _id: 'chị gái', name: 'chị gái' },
                    { _id: 'người giám hộ', name: 'người giám hộ' },
                  ]"
                  :modelValue="`bố`"
                  :class="
                    !item.relationship ? 'border-red-500' : 'border-slate-600'
                  "
                />
                <span
                  v-if="!item.relationship"
                  class="text-red-500 mt-1 ml-1 text-sm"
                  >Please select a value !</span
                >
              </div>
              <button
                @click=""
                class="text-slate-300 border border-solid border-green-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:bg-green-500 mt-5 hover:text-slate-100"
              >
                Add
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
      phone: yup
        .string()
        .required("Phone number must have a value !")
        .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Invalid phone number !"),
      email: yup
        .string()
        .required("Email must have a value !")
        .email("Incorrect e-mail !"),
      address: yup.string().required("Address must have a value !"),
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
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    submit() {
      if (
        this.item.name.length > 0 &&
        this.item.phone.length > 0 &&
        this.item.email.length > 0 &&
        this.item.address.length > 0
      ) {
        this.$emit("submit");
      }
    },
  },
  created() {},
};
</script>
