<template>
  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <!-- list of children or cdi or receipt -->
    <div class="flex justify-between mx-5 my-5 text-slate-600">
      <div class="flex items-center text-lg text-slate-300">
        <div class="flex items-center">
          <label for="">ClassName:</label>
          <span class="border border-solid px-2 py-1 ml-2">{{
            classes.name
          }}</span>
        </div>
        <div class="flex items-center ml-5">
          <label for="">Number:</label>
          <span class="border border-solid px-2 py-1 ml-2">{{
            classes.totalChildren
          }}</span>
        </div>
      </div>
      <div class="flex">
        <div
          class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
          :class="
            actionPage == 1 ? 'border-2 border-slate-300 text-slate-300' : ''
          "
          @click="actionPage = 1"
        >
          Children
        </div>
        <div
          class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
          :class="
            actionPage == 2
              ? 'border-2 border-slate-300 text-slate-300'
              : 'border-l-0 border-r-0'
          "
          @click="actionPage = 2"
        >
          CDI
        </div>
        <div
          class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
          :class="
            actionPage == 3 ? 'border-2 border-slate-300 text-slate-300' : ''
          "
          @click="actionPage = 3"
        >
          Receipt
        </div>
      </div>
    </div>
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>

    <div class="flex items-start">
      <!-- table -->
      <div
        class="flex-1 -mt-5 border border-solid border-t-0 border-b-0 border-l-0 border-slate-600"
      >
        <!--  -->
        <AddCDI v-if="actionMenu == 1" :classId="id" />
        <EditCDI v-if="actionMenu == 2" :classId="id" />
      </div>
      <!-- menu -->
      <div
        class="flex-col mb-5 mx-5 border border-solid border-slate-600 text-slate-600"
      >
        <div
          class="border border-solid mx-10 mt-10 text-center pt-2 pb-1 rounded-md cursor-pointer border-slate-600 hover:text-slate-300"
          :class="actionMenu == 1 ? 'border-slate-300 text-slate-300' : ''"
          @click="actionMenu = 1"
        >
          Add
        </div>
        <div
          class="border border-solid mx-10 mt-5 text-center pt-2 pb-1 rounded-md cursor-pointer border-slate-600 hover:text-slate-300"
          :class="actionMenu == 2 ? 'border-slate-300 text-slate-300' : ''"
          @click="actionMenu = 2"
        >
          Edit
        </div>
        <div
          class="border border-solid mx-10 mb-10 mt-5 text-center px-5 pt-2 pb-1 rounded-md cursor-pointer border-slate-600 hover:text-slate-300"
          :class="actionMenu == 4 ? 'border-slate-300 text-slate-300' : ''"
          @click="actionMenu = 4"
        >
          List of Class
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Children from "../../../../services/children.service";
import Classes from "../../../../services/classes.service";
import Search from "../../../../components/forms/Search.vue";
import BAdd from "../../../../components/buttons/Add.vue";
import Select from "../../../../components/forms/Select.vue";
import Pagination from "../../../../components/Pagination.vue";
import AddCDI from "../addition/addCDI.vue";
import EditCDI from "./edit.vue";
import Swal from "sweetalert2";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Search,
    BAdd,
    Select,
    Pagination,
    Form,
    Field,
    ErrorMessage,
    AddCDI,
    EditCDI,
  },
  props: {
    activeAdd: {
      type: Number,
      default: 1,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      actionPage: 2,
      actionMenu: 1,
      classes: {},
    };
  },
  watch: {
    actionMenu() {
      if (this.actionMenu == 4) {
        this.$router.push({
          name: "ClassRoom.view",
          params: {
            classId: this.id,
          },
        });
      }
    },
    actionPage() {
      if (this.actionPage == 1) {
        this.$router.push({
          name: "ClassRoom.add",
          params: {
            id: this.id,
          },
        });
      } else if (this.actionPage == 3) {
      }
    },
  },
  methods: {
    async getClass() {
      try {
        let temp = await Classes.get(this.id);
        temp = temp.map((value, index) => {
          return {
            _id: value._id,
            totalChildren: value.children.length,
            name: value.name,
            children: value.children,
            cdi: value.cdi,
          };
        });
        this.classes = temp[0];
      } catch (error) {
        console.error(error);
      }
    },
  },
  async created() {
    await this.getClass();
  },
};
</script>
