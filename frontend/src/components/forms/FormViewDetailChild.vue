<template>
      <div
        class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
      >
        <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
        <div
          class="bg-white mx-5 w-10/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
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
                style="max-height: calc(100vh - 250px)"
              >
                <ViewChild :id="id" />
              </div>
            </div>
          </div>
        </div>
      </div>
  </template>
  
  <script>
  import * as yup from "yup";
  import { Form, Field, ErrorMessage } from "vee-validate";
  import FSelect from "./Select.vue";
  import BAdd from "../buttons/Add.vue";
  import Account from "../../services/account.service";
  import LocationPicker from "../../components/forms/LocationPicker.vue";
  import ChildcareCenter from "../../services/childcareCenter.service";
  import ViewChild from '../../views/children/view1.vue';
  
  export default {
    components: {
      Form,
      Field,
      ErrorMessage,
      FSelect,
      BAdd,
      LocationPicker,
      ViewChild,
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
      id: {
        type: String,
        required: true,
      }
    },
    emits: ["cancel", "submit"],
    data() {
      return {
        
      };
    },
    methods: {
      cancel() {
        this.$emit("cancel", false);
      },
    },
    async created() {
    },
  };
  </script>
  