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
          placeholder="Enter grade's name"
          v-model="grade.name"
          class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
          :class="[errors.name ? 'border border-solid border-red-500' : 'border-violet-500']"
        />
        <p
          v-if="checkCreate(grade.name, grade.schoolYear)"
          class="text-red-500 ml-1 mt-1 text-sm"
        >
          Name already exists !
        </p>
        <ErrorMessage name="name" class="text-red-500 ml-1 mt-1 text-sm" />
      </div>
      <!-- phone -->
      <div class="mb-6 flex flex-col">
        <label for="note" class="text-white ml-1">Note</label>
        <textarea
          name="note"
          placeholder="Enter note"
          v-model="grade.note"
          class="w-full border border-solid border-violet-500 bg-inherit py-2 text-white px-2 rounded-md"
        ></textarea>
      </div>
      <!-- School Year -->
      <div class="mb-6 flex flex-col">
        <label for="" class="text-white ml-1">School Year</label>
        <Select
          :options="schoolYearList"
          class="h-10"
          @update:modelValue="(value) => (grade.schoolYear = value)"
          :class="[
            !grade.schoolYear ? 'border border-solid border-red-500' : '',
          ]"
        />
        <p
          v-if="!grade.schoolYear"
          name=""
          class="text-red-500 ml-1 mt-1 text-sm"
        >
          School Year must have a valid !
        </p>
        <p
          v-if="checkCreate(grade.name, grade.schoolYear)"
          class="text-red-500 ml-1 mt-1 text-sm"
        >
          School year already exists !
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
import SchoolYear from "../services/school-year.service";
import Grade from "../services/grade.service";
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
    grade: {
      type: Object,
      default: {},
    },
  },
  emits: ["submit:grade"],
  data() {
    const formSchema = yup.object().shape({
      name: yup
        .string()
        .required("Name must have a valid !")
        .min(2, "Name must be at least 2 characters !"),
    });
    return {
      formSchema,
      schoolYearList: [],
      schoolYearValue: "",
      grades: [],
    };
  },
  methods: {
    submitData() {
      this.$emit("submit:grade", this.grade);
    },
    async getAllSchoolYear() {
      try {
        this.schoolYearList = await SchoolYear.getAll();
      } catch (err) {
        console.log(err);
      }
    },
    async getAllGrade() {
      try {
        this.grades = await Grade.getAll();
      } catch (err) {
        console.log(err);
      }
    },
    checkCreate(value, value1) {
      // return this.teachers.filter((teacher, index) => {
      //   return this.toString[index].includes(value.toLowerCase());
      // });
      for (var grade of this.grades) {
        if (grade.name === value && grade.schoolYear._id === value1) {
          return true;
        }
      }
      return false;
    },
  },
  created() {
    this.getAllSchoolYear();
    this.getAllGrade();
  },
};
</script>
