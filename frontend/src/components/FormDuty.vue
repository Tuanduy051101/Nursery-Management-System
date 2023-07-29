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
            placeholder="Enter mission's name"
            v-model="mission.name"
            class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
            :class="[errors.name ? 'border border-solid border-red-500' : 'border-violet-500']"
          />
          <p
            v-if="checkCreate(mission.name)"
            class="text-red-500 ml-1 mt-1 text-sm"
          >
            Name already exists !
          </p>
          <ErrorMessage name="name" class="text-red-500 ml-1 mt-1 text-sm" />
        </div>
        <!-- phone -->
        <div class="mb-6 flex flex-col">
          <label for="note" class="text-white ml-1">Description</label>
          <textarea
            rows="4" cols="50"
            name="note"
            placeholder="Enter description"
            v-model="mission.description"
            class="w-full border border-solid border-violet-500 bg-inherit py-2 text-white px-2 rounded-md"
          ></textarea>
          <p
            v-if="mission.description.length == 0"
            class="text-red-500 ml-1 mt-1 text-sm"
          >
            Description must have a valid!
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
  import Mission from "../services/mission.service";
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
      mission: {
        type: Object,
        default: {},
      },
    },
    emits: ["submit:form"],
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
        missions: [],
      };
    },
    methods: {
      submitData() {
        this.$emit("submit:form", this.mission);
      },
      async getAllMission() {
        try {
          this.missions = await Mission.getAll();
        } catch (err) {
          console.log(err);
        }
      },
      checkCreate(value) {
        for (var mission of this.missions) {
          if (mission.name === value) {
            return true;
          }
        }
        return false;
      },
    },
    created() {
      this.getAllMission();
    },
  };
  </script>
  