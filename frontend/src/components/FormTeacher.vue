<template>
  <Form
    @submit="submitData"
    :validation-schema="formSchema"
    v-slot="{ errors }"
  >
    <div class="flex flex-col">
      <!-- name -->
      <div class="mb-6">
        <label for="name" class="text-white ml-1">Name</label>
        <Field
          name="name"
          id="name"
          type="text"
          placeholder="Enter teacher name"
          v-model="teacher.name"
          class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
          :class="[errors.name ? 'border border-solid border-red-500' : 'border-violet-500']"
        />
        <ErrorMessage name="name" class="text-red-500 ml-1 mt-1 text-sm" />
      </div>
      <!-- gender -->
      <div class="mb-6">
        <label for="gender" class="text-white ml-1">Gender</label>
        <div class="flex items-center">
          <input
            checked
            type="radio"
            name="gender"
            id="gender"
            value="true"
            v-model="teacher.gender"
            class="border border-solid border-violet-500 outline-none"
          />
          <span class="ml-2 mr-10 text-white">male</span>
          <input
            type="radio"
            name="gender"
            id="gender"
            value="false"
            v-model="teacher.gender"
            class="border border-solid border-violet-500 outline-none"
          />
          <span class="ml-2 mr-10 text-white">female</span>
        </div>
      </div>
      <!-- dateOfBirth -->
      <div class="mb-6 flex flex-col">
        <label for="dateOfBirth" class="text-white ml-1">Date Of Birth</label>
        <Field
          required
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          v-model="teacher.dateOfBirth"
          class="border border-solid  bg-inherit text-white rounded-md p-2"
          :class="[
            errors.dateOfBirth ? 'border border-solid border-red-500' : 'border-violet-500',
          ]"
        />
        <ErrorMessage
          name="dateOfBirth"
          class="text-red-500 ml-1 mt-1 text-sm"
        />
      </div>
      <!-- phone -->
      <div class="mb-6 flex flex-col">
        <label for="phone" class="text-white ml-1">Phone Number</label>
        <Field
          name="phone"
          type="text"
          placeholder="Enter phone number"
          v-model="teacher.phone"
          class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
          :class="[errors.phone ? 'border border-solid border-red-500' : 'border-violet-500']"
        />
        <p v-if="checkCreate(teacher.phone)" class="text-red-500 ml-1 mt-1 text-sm"> Phone already exists !</p>
        <ErrorMessage name="phone" class="text-red-500 ml-1 mt-1 text-sm" />
      </div>
      <!-- mail -->
      <div class="mb-6 flex flex-col">
        <label for="mail" class="text-white ml-1">Mail</label>
        <Field
          name="mail"
          type="email"
          placeholder="Enter e-mail address"
          v-model="teacher.mail"
          class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
          :class="[errors.mail ? 'border border-solid border-red-500' : 'border-violet-500']"
        />
        <p v-if="checkCreate(teacher.mail)" class="text-red-500 ml-1 mt-1 text-sm"> Email already exists !</p>
        <ErrorMessage name="mail" class="text-red-500 ml-1 mt-1 text-sm" />
      </div>
      <!-- position -->
      <div class="mb-6 flex flex-col">
        <label for="" class="text-white ml-1">Position</label>
        <Select
          :options="positionList"
          class="h-10"
          @update:modelValue="(value) => (teacher.position = value)"
          :class="[
            !teacher.position ? 'border border-solid border-red-500' : '',
          ]"
        />
        <p
          v-if="!teacher.position"
          name=""
          class="text-red-500 ml-1 mt-1 text-sm"
        >
          Position must have a valid !
        </p>
      </div>
      <!-- diploma -->
      <div class="mb-6 flex flex-col">
        <label for="" class="text-white ml-1">Diploma</label>
        <Select
          :options="diplomaList"
          class="h-10"
          @update:modelValue="(value) => (teacher.diploma = value)"
          :class="[
            !teacher.diploma ? 'border border-solid border-red-500' : '',
          ]"
        />
        <p
          v-if="!teacher.diploma"
          name=""
          class="text-red-500 ml-1 mt-1 text-sm"
        >
          Diploma must have a valid !
        </p>
      </div>
      <!-- button -->
      <div class="mt-6 flex flex-row">
        <BAdd class="mr-6" />
        <BCancel @click="this.$emit('cancel', false)" />
      </div>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Select from "../components/forms/Select.vue";
import Position from "../services/position.service";
import Diploma from "../services/diploma.service";
import Teacher from "../services/teacher.service";
import BAdd from "../components/buttons/Add.vue";
import BCancel from "../components/buttons/Cancel.vue";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    Select,
    BAdd,
    BCancel,
  },
  props: {
    teacher: {
      type: Object,
      default: {},
    },
  },
  emits: ["submit:teacher"],
  data() {
    const formSchema = yup.object().shape({
      name: yup
        .string()
        .required("Name must have a valid !")
        .min(2, "Name must be at least 2 characters !"),
      phone: yup
        .string()
        .required("Phone number must have a valid.")
        .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Invalid phone number!"),
      mail: yup
        .string()
        .required("Email must have a valid !")
        .email("Incorrect E-mail !"),
      dateOfBirth: yup
        .date()
        .min("2001-11-05", "Date must start from 2001-11-05 !"),
    });
    return {
      formSchema,
      positionList: [],
      positionValue: "",
      diplomaList: [],
      diplomaValue: "",
      teachers: [],
    };
  },
  methods: {
    submitData() {
      this.$emit("submit:teacher", this.teacher);
    },
    async getAllPosition() {
      try {
        this.positionList = await Position.getAll();
      } catch (err) {
        console.log(err);
      }
    },
    async getAllDiploma() {
      try {
        this.diplomaList = await Diploma.getAll();
      } catch (err) {
        console.log(err);
      }
    },
    async getAllTeacher() {
      try {
        this.teachers = await Teacher.getAll();
      } catch (err) {
        console.log(err);
      }
    },
    checkCreate(value) {
      // return this.teachers.filter((teacher, index) => {
      //   return this.toString[index].includes(value.toLowerCase());
      // });
      for (var teacher of this.teachers) {
        if (teacher.phone === value || teacher.mail === value) {
          return true;
        }
      }
      return false;
    },
  },
  created() {
    this.getAllPosition();
    this.getAllDiploma();
    this.getAllTeacher();
  },
};
</script>
