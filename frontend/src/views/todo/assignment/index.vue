<template>
  <div class="border border-solid border-slate-600 rounded-md">
    <!-- Header -->
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          class="w-20"
          :options="[
            { _id: 10, name: 10 },
            { _id: 20, name: 20 },
            { _id: 30, name: 30 },
            { _id: 40, name: 40 },
            { _id: 50, name: 50 },
          ]"
          :modelValue="entryValue"
          v-model="entryValue"
        />
        <FSelect
          class="w-28 mx-5"
          :options="[
            { _id: 0, name: 'auto' },
            { _id: 1, name: 'fixed' },
          ]"
          :modelValue="`auto`"
          v-model="mode"
        />
      </div>
      <div class="flex-1 flex">
        <FSearch class="flex-1 mx-5" v-model="searchText" />
        <BAdd @click="selectCreate()" />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Teacher', 'duty', 'school year', 'grade', 'classes', 'note']"
      :labels="['teacher', 'duty', 'schoolYear', 'grade', 'classes', 'note']"
      :mode="mode"
      @deleteItem="(value) => (deleteValue = value)"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
  </div>
  <FormAssignment
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Add A New Assignment`"
    :placeholder="`Add a new Assignment`"
    @cancel="(value) => (activeAdd = value)"
    @submit="create()"
  />
</template>

<script>
import BAdd from "../../../components/buttons/Add.vue";
import BEdit from "../../../components/buttons/Edit.vue";
import BDelete from "../../../components/buttons/Delete.vue";
import BCancel from "../../../components/buttons/Cancel.vue";
import FSelect from "../../../components/forms/Select.vue";
import FSearch from "../../../components/forms/Search.vue";
import Table from "../../../components/Table.vue";
import Pagination from "../../../components/Pagination.vue";
import FormAssignment from "../../../components/forms/FormAssignment.vue";
import Assignment from "../../../services/assignment.service";
import SchoolYear from "../../../services/sYear.service";
import ASuccess from "../../../components/alerts/Success.vue";
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
    FormAssignment,
    ASuccess,
  },
  data() {
    return {
      // data
      items: [],
      item: {},
      sYear: [],
      // search
      searchText: "",
      // entry
      entryValue: 10,
      // table
      mode: "auto",
      // pagination
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      // add
      activeAdd: false,
      itemAdd: {
        note: "",
        teacher: "",
        duty: "",
        classes: "",
        schoolYear: "",
        grade: "",
      },
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      deleteValue: "",
    };
  },
  watch: {
    async deleteValue() {
      await this.get();
      await this.delete();
      await this.refresh();
    },
  },
  computed: {
    toString() {
      return this.items.map((item, index) => {
        return [item.name].join("");
      });
    },

    filter() {
      return this.items.filter((item, index) => {
        return this.toString[index].includes(
          this.searchText.toLocaleLowerCase()
        );
      });
    },

    filtered() {
      if (!this.searchText) {
        this.totalRow = this.items.length;
        return this.items;
      } else {
        this.totalRow = this.filter.length;
        return this.filter;
      }
    },

    setNumberOfPages() {
      return Math.ceil(this.filtered.length / this.entryValue);
    },

    setPages() {
      if (this.setNumberOfPages == 0) this.numberOfPages = 1;
      else this.numberOfPages = this.setNumberOfPages;

      this.startRow = (this.currentPage - 1) * this.entryValue + 1;
      this.endRow = this.currentPage * this.entryValue;

      return this.filtered.filter((item, index) => {
        return (
          index + 1 > (this.currentPage - 1) * this.entryValue &&
          index + 1 <= this.currentPage * this.entryValue
        );
      });
    },
  },
  methods: {
    async getAll() {
      try {
        this.items = await Assignment.getAll();
        for (var i = 0; i < this.items.length; i++) {
          try {
            const temp = await SchoolYear.get(this.items[i].classes.schoolYear);
            this.sYear.push(temp);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    async get() {
      try {
        this.item = await Assignment.get(this.deleteValue);
      } catch (error) {
        console.error(error);
      }
    },

    formatTable() {
      this.items = this.items.map((item, index) => {
        if (item.classes == null) {
          return {
            _id: item._id,
            teacher: item.teacher.name,
            duty: item.duty.name,
            classes: "all",
            note: item.note,
            grade: "all",
            schoolYear: "all",
          };
        } else {
          return {
            _id: item._id,
            teacher: item.teacher.name,
            duty: item.duty.name,
            classes: item.classes.name,
            note: item.note,
            grade: item.classes.grade.name,
            schoolYear: this.sYear[index].name,
          };
        }
      });
    },

    async refresh() {
      await this.getAll();
      await this.formatTable();
    },

    async selectCreate() {
      /* inputOptions can be an object or Promise */
      const inputOptions = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            "auto": "Auto",
            "normal": "Normal",
          });
        }, 1000);
      });

      const { value: color } = await Swal.fire({
        title: "Select assignment method",
        input: "radio",
        inputOptions: inputOptions,
        inputValidator: (value) => {
          if (!value) {
            return "You need to choose something!";
          }
        },
      });
      console.log(color);
      if (color == "auto") {
        Swal.fire({ html: `You selected: ${color}` });
      } else if (color == "normal") {
        this.activeAdd = true;
      }
    },

    async create() {
      try {
        const check = await Assignment.create({
          teacher: this.itemAdd.teacher,
          duty: this.itemAdd.duty,
          note: this.itemAdd.note,
          classes: this.itemAdd.classes,
        });
        if (check.error) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: check.message,
            icon: "error",
            timer: 2000,
          });
        } else if (!check.error) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successful add",
            icon: "success",
            timer: 2000,
          });
          this.activeAdd = false;
          await this.refresh();
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    async delete() {
      const option = Swal.fire({
        background: this.background,
        color: "white",
        icon: "warning",
        html:
          "<p>I want to delete" +
          ' "' +
          '<span class="text-blue-500 text-lg">' +
          this.item.name +
          "</span>" +
          '"' +
          "</p>",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "red",
        reverseButtons: true,
      });

      if ((await option).isConfirmed) {
        try {
          await Assignment.delete(this.deleteValue);
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull delete",
            icon: "success",
            timer: 2000,
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
