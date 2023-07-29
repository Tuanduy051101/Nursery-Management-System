<template>
  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <!-- class detail -->
    <div class="flex justify-center mb-5">
      <div
        class="border border-solid border-t-0 border-slate-600 rounded-br-md rounded-bl-md px-5 py-5"
      >
        <!-- title -->
        <p class="text-slate-300 text-lg text-center">
          <span
            class="border border-solid px-5 py-1 border-slate-600 rounded-md"
            >Class Details</span
          >
        </p>
        <div class="flex text-slate-300 mt-5">
          <!-- class info -->
          <div class="flex mx-5">
            <div class="flex-col">
              <p class="">ClassName:</p>
              <p class="">Grade:</p>
              <p class="">School Year:</p>
              <p class="">Total Children:</p>
            </div>
            <div class="flex-col ml-2 text-blue-500">
              <p class="">{{ item.name }}</p>
              <p class="">{{ item.grade }}</p>
              <p class="">{{ item.schoolYear }}</p>
              <p class="">{{ item.children }}</p>
            </div>
          </div>
          <!-- teacher info -->
          <!-- <div class="flex ml-5" v-for="(value, index) of teacher">
            <div
              class="flex-col pl-5 border border-solid border-t-0 border-b-0 border-r-0 border-slate-600"
            >
              <p class="">Teacher's Name:</p>
              <p class="">Phone Number:</p>
              <p class="">Email Address:</p>
              <p class="">Position:</p>
            </div>
            <div class="flex-col ml-2 text-blue-500">
              <p class="">{{ value.name }}</p>
              <p class="">{{ value.phone }}</p>
              <p class="">{{ value.email }}</p>
              <p class="">{{ value.position }}</p>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <!-- list of children or cdi or receipt -->
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>
    <div class="flex justify-end mx-5 mb-5 text-slate-600">
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 6 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 6"
      >
        Teacher
      </div>
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
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 4 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 4"
      >
        Meal Ticket
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 5 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 5"
      >
        Attendance
      </div>
    </div>
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>

    <!-- children -->
    <ChildrenList v-if="actionPage == 1" :classId="item._id" />
    <CDIList v-if="actionPage == 2" :cdiL="item.cdiL" :classId="item._id" />
    <MealTicket v-if="actionPage == 4" :classId="item._id" />
    <Attendance v-if="actionPage == 5" :classId="item._id" />
    <Receipt v-if="actionPage == 3" :classId="item._id" />
    <TableNoneAction :items="teacher" :fields="['Teacher', 'phone', 'email', 'address', 'position']" :labels="['name', 'phone', 'email', 'address', 'position']" v-if="actionPage == 6" />
  </div>
</template>

<script>
import BAdd from "../../../components/buttons/Add.vue";
import BEdit from "../../../components/buttons/Edit.vue";
import BDelete from "../../../components/buttons/Delete.vue";
import BCancel from "../../../components/buttons/Cancel.vue";
import FSelect from "../../../components/forms/Select.vue";
import FSearch from "../../../components/forms/Search.vue";
import Table from "../../../components/Table.vue";
import TableNoneAction from "../../../components/TableNoneAction.vue";
import Pagination from "../../../components/Pagination.vue";
import FormOne from "../../../components/forms/FormOne.vue";
import Classes from "../../../services/classes.service";
import ASuccess from "../../../components/alerts/Success.vue";
import ChildrenList from "./children/index.vue";
import CDIList from "./cdi/index.vue";
import MealTicket from "./mealTicket/index.vue";
import Attendance from "./attendance/index.vue";
import Receipt from "./receipt/index.vue";
import Swal from "sweetalert2";

export default {
  components: {
    BAdd,
    BEdit,
    BDelete,
    BCancel,
    FSelect,
    FSearch,
    Table,
    Pagination,
    FormOne,
    ASuccess,
    ChildrenList,
    CDIList,
    MealTicket,
    Attendance,
    Receipt,
    TableNoneAction,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // data
      items: [],
      item: {},
      teacher: [],
      actionPage: 1,
      actionList: [1, 2, 3, 4, 5],
    };
  },
  watch: {},
  computed: {},
  methods: {
    async get() {
      try {
        this.items = await Classes.get(this.id);
      } catch (error) {
        console.error(error);
      }
    },

    format() {
      this.items = this.items.map((value, index) => {
        this.teacher = value.assignment.map((value1, index1) => {
          return {
            _id: value1.teacher._id,
            name: value1.teacher.name,
            phone: value1.teacher.phone,
            email: value1.teacher.email,
            address: value1.teacher.address,
            position: value1.teacher.position.name,
          };
        });
        return {
          _id: value._id,
          name: value.name,
          grade: value.grade.name,
          schoolYear: value.schoolYear.name,
          children: value.children.length,
          cdi: value.cdi.length,
          cdiL: value.cdi,
          receipt: value.receipt.length,
          assignment: value.assignment.length,
        };
      });

      this.item = this.items[0];
    },

    async refresh() {
      await this.get();
      this.format();
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
