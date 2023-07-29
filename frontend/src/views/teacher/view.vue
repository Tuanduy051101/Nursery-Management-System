<template>
  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <div class="flex justify-center mb-5">
      <div class="px-5 py-5">
        <p class="text-slate-300 text-lg text-center">
          <span
            class="border border-solid px-5 py-1 border-slate-600 rounded-md"
            >Information Details Of Teacher</span
          >
        </p>
        <div class="flex text-slate-300 mt-10">
          <div
            class="flex mx-5 border border-solid border-t-0 border-b-0 border-l-0 border-slate-600"
          >
            <div class="flex flex-col mr-5">
              <span>Teacher:</span>
              <span>Gender:</span>
              <span>Phone:</span>
              <span>Email:</span>
              <span>Position:</span>
              <span>Address:</span>
            </div>
            <div class="flex flex-col mr-10">
              <span>{{ item.name }}</span>
              <span>{{ item.gender ? "Male" : "Female" }}</span>
              <span>{{ item.phone }}</span>
              <span>{{ item.email }}</span>
              <span>{{ item.positionName }}</span>
              <span>{{ item.address }}</span>
              <p @click="editTeacher = true" class="cursor-pointer mt-5">
                <span
                  class="border border-solid px-4 py-1 rounded-md border-yellow-600 text-slate-600 hover:border-yellow-300 hover:text-slate-300"
                  >Edit</span
                >
              </p>
            </div>
          </div>
          <div class="flex">
            <div class="flex flex-col mx-5">
              <span>Diploma:</span>
            </div>
            <div class="flex flex-col">
              <span v-for="(value, index) in item.diploma">{{
                value.name
              }}</span>
              <div class="flex">
                <p @click="addDiploma1 = true" class="cursor-pointer mt-5 mr-5">
                  <span
                    class="border border-solid px-4 py-1 rounded-md border-green-600 text-slate-600 hover:border-green-300 hover:text-slate-300"
                    >Add</span
                  >
                </p>
                <p class="cursor-pointer mt-5">
                  <span
                    class="border border-solid px-4 py-1 rounded-md border-yellow-600 text-slate-600 hover:border-yellow-300 hover:text-slate-300"
                    >Edit</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- class -->

  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <div class="mx-5 my-5 flex items-center justify-between">
      <div class="flex items-center">
        <label for="" class="text-slate-300 mr-5">School year: </label>
        <FSelect class="w-32" :options="schoolYear" v-model="schoolYearValue" />
      </div>
    </div>
    <!-- list of children or cdi or receipt -->
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>
    <div class="flex justify-end mx-5 mb-5 text-slate-600">
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 1 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 1"
      >
        Diploma
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 2 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 2"
      >
        Classes
      </div>
    </div>
    <!-- <div class="border border-solid my-5 border-slate-600 border-b-0"></div> -->
    <TableView
      v-if="actionPage == 2"
      :items="assignment"
      :actionList="['ClassRoom.view']"
      :fields="['Duty', 'note', 'class']"
      :labels="['duty', 'note', 'class']"
    />
    <TableDelete
      v-if="actionPage == 1"
      :items="item.diploma"
      :fields="['Diploma']"
      :labels="['name']"
      @deleteItem="(value) => deleteDiploma(value)"
    />
  </div>
  <FormEditTeacher
    v-if="editTeacher"
    :title="`Edit teacher information`"
    :item="item"
    @cancel="(value) => (editTeacher = value)"
    @submit="update()"
  />
  <FormAddDiploma
    v-if="addDiploma1"
    :title="`Add diploma for teacher`"
    :item="itemAdd"
    @cancel="(value, value1) => ((addDiploma1 = value), (itemAdd.diploma = ''))"
    @submit="addDiploma()"
  />
</template>

<script>
import BAdd from "../../components/buttons/Add.vue";
import BEdit from "../../components/buttons/Edit.vue";
import BDelete from "../../components/buttons/Delete.vue";
import BCancel from "../../components/buttons/Cancel.vue";
import FSelect from "../../components/forms/Select.vue";
import FSearch from "../../components/forms/Search.vue";
import Table from "../../components/TableNoneAction.vue";
import TableDelete from "../../components/TableDelete.vue";
import TableView from "../../components/TableView.vue";
import Pagination from "../../components/Pagination.vue";
import FormOne from "../../components/forms/FormOne.vue";
import FormEditTeacher from "../../components/forms/FormEditTeacher.vue";
import FormEditChildren from "../../components/forms/FormEditChildren.vue";
import FormAddDiploma from "../../components/forms/FormAddDiploma.vue";
import Classes from "../../services/classes.service";
import Children from "../../services/children.service";
import Teacher from "../../services/teacher.service";
import SchoolYear from "../../services/sYear.service";
import Assignment from "../../services/assignment.service";
import Month from "../../services/month.service";
import CollectionRates from "../../services/collectionRates.service";
import ASuccess from "../../components/alerts/Success.vue";
import Swal from "sweetalert2";
import { FormatMoney } from "format-money-js";

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
    FormEditChildren,
    FormEditTeacher,
    TableDelete,
    FormAddDiploma,
    TableView
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
      assignment: [],
      schoolYear: [],
      schoolYearValue: "",
      actionPage: 1,
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      actionList: ["ClassRoom.view"],
      editTeacher: false,
      itemAdd: {
        _id: this.id,
        diploma: "",
        other: "",
      },
      addDiploma1: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    async getAll() {
      try {
        this.item = await Teacher.get(this.id);
        this.item = [this.item];
        console.log(this.item);
        this.item = this.item.map((value, index) => {
          return {
            _id: value._id,
            name: value.name,
            gender: value.gender,
            phone: value.phone,
            email: value.email,
            address: value.address,
            position: value.position._id,
            positionName: value.position.name,
            assignment: value.assignment,
            diploma: value.diploma,
          };
        });

        console.log(this.item);

        this.item = this.item[0];

        this.assignment = this.assignment.filter((value, index) => {
          var check = false;
          for (let value1 of this.item.assignment) {
            if (value._id == value1._id) {
              check = true;
              break;
            }
          }
          return check == true;
        });

        this.assignment = this.assignment.map((value, index) => {
          return {
            _id: value.classes._id,
            note: value.note,
            duty: value.duty.name,
            class: value.classes.name,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getAllSchoolYear() {
      try {
        this.schoolYear = await SchoolYear.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getAllAssignment() {
      try {
        this.assignment = await Assignment.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async update() {
      try {
        const teacher = await Teacher.update(this.id, {
          name: this.item.name,
          gender: this.item.gender,
          phone: this.item.phone,
          email: this.item.email,
          address: this.item.address,
          position: this.item.position,
        });
        if (!teacher.error) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull edit",
            icon: "success",
            timer: 2000,
          });
          this.editTeacher = false;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async deleteDiploma(value) {
      try {
        const diploma = await Teacher.deleteDiploma(this.id, {
          diploma: value,
        });

        if (diploma.error == false) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull deleted",
            icon: "success",
            timer: 2000,
          });
          this.addDiploma1 = false;
          await this.getAll();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async addDiploma() {
      try {
        if (this.itemAdd.diploma.length > 0) {
          const diploma = await Teacher.addDiploma(this.id, {
            diploma: this.itemAdd.diploma,
          });
          if (diploma.error == false) {
            Swal.fire({
              background: this.background,
              color: "white",
              text: "Successfull add",
              icon: "success",
              timer: 2000,
            });
            await this.getAll();
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async refresh() {
      await this.getAllAssignment();
      await this.getAllSchoolYear();
      await this.getAll();
    },
  },
  async created() {
    this.refresh();
  },
};
</script>
