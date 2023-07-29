<template>
  <!-- Header -->
  <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
  <div class="flex justify-center items-center my-5">
    <FSelect
      class="w-full ml-5 text-md"
      :modelValue="` Select school year`"
      v-model="schoolYearValue"
    />
    <FSelect
      class="w-full ml-5 text-md"
      :modelValue="` Select grade`"
      v-model="gradeValue"
    />
    <FSelect
      v-if="gradeValue.length != 0 && schoolYearValue.length != 0"
      class="w-full ml-5 text-md"
      :options="classes"
      :modelValue="` Select class`"
      v-model="classValue"
    />
    <FSelect
      class="w-full mx-5 text-md"
      :options="[
        { _id: true, name: 'Paid' },
        { _id: false, name: 'Unpaid' },
      ]"
      :modelValue="` Select status`"
      v-model="statusValue"
    />
  </div>
  <div class="border border-solid my-5 border-slate-600 border-b-0"></div>
  <div class="flex items-center justify-between my-5 mx-5">
    <div class="w-6/12 flex">
      <FSelect
        class="w-20"
        :options="[
          { _id: 5, name: 5 },
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
      <BAdd @click="activeAdd = true" />
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="[
      'Children',
      'Class',
      'Total',
      'Start Day',
      'End Day',
      'Make Date',
      'Status',
    ]"
    :labels="['child', 'class', 'total', 'dateStart', 'dateEnd', 'datePerForm']"
    :mode="mode"
    @deleteItem="(value) => (deleteValue = value)"
    :actionList="actionList"
  />
  <Pagination
    :numberOfPages="numberOfPages"
    :totalRow="totalRow"
    :startRow="startRow"
    :endRow="endRow"
    v-model:currentPage="currentPage"
  />
  <FormReceipt
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Add A New Receipt`"
    :placeholder="`Add a new Receipt`"
    @cancel="(value) => (activeAdd = value)"
    @submit="create()"
  />
</template>

<script>
import BAdd from "../../../../components/buttons/Add.vue";
import BEdit from "../../../../components/buttons/Edit.vue";
import BDelete from "../../../../components/buttons/Delete.vue";
import BCancel from "../../../../components/buttons/Cancel.vue";
import FSelect from "../../../../components/forms/Select.vue";
import FSearch from "../../../../components/forms/Search.vue";
import Table from "../../../../components/TableReceipt.vue";
import Pagination from "../../../../components/Pagination.vue";
import FormReceipt from "../../../../components/forms/FormReceipt.vue";
import Assignment from "../../../../services/assignment.service";
import SchoolYear from "../../../../services/sYear.service";
import Receipt from "../../../../services/receipt.service";
import Grade from "../../../../services/grade.service";
import Classes from "../../../../services/classes.service";
import ASuccess from "../../../../components/alerts/Success.vue";
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
    FormReceipt,
    ASuccess,
  },
  props: {
    classId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // data
      items: [],
      item: {},
      sYear: [],
      grade: [],
      classes: [],
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
        schoolYear: "",
        grade: "",
        dateStart: "",
        dateEnd: "",
        total: 0,
      },
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      deleteValue: "",
      actionPage: 1,
      statusValue: null,
      schoolYearValue: "",
      gradeValue: "",
      classValue: "",
      actionList: ["Receipt.view"],
    };
  },
  watch: {
    async deleteValue() {
      await this.get();
      await this.delete();
      await this.refresh();
    },
    async schoolYearValue() {
      if (this.gradeValue.length != 0 && this.schoolYearValue.length != 0) {
        await this.getAllClasses();
      }
    },
    async gradeValue() {
      if (this.gradeValue.length != 0 && this.schoolYearValue.length != 0) {
        await this.getAllClasses();
      }
    },
    async classValue() {
      await this.getAll();
      await this.formatTable();
    },
    async statusValue() {
      await this.getAll();
      await this.formatTable();
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
        this.items = await Receipt.getAll();
        if (this.classId.length != 0) {
          this.items = this.items.filter((value, index) => {
            return value.classes._id == this.classId;
          });
        }
        if (this.statusValue != null) {
          this.items = this.items.filter((value, index) => {
            return value.status == this.statusValue;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async get() {
      try {
        this.item = await Receipt.get(this.deleteValue);
      } catch (error) {
        console.error(error);
      }
    },

    formatDate(value) {
      let date = new Date(value);

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return day + "-" + month + "-" + year;
    },

    formatMoney(money) {
      const fm = new FormatMoney({
        decimals: 0,
        append: true,
      });

      const temp = fm.from(money, { symbol: "vnđ" });

      return temp;
    },

    setDate() {
      let date = new Date();

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return day + "-" + month + "-" + year;
    },

    formatTable() {
      this.items = this.items.map((item, index) => {
        return {
          _id: item._id,
          child: item.child.name,
          class: item.classes.name,
          dateStart: this.formatDate(item.dateStart),
          dateEnd: this.formatDate(item.dateEnd),
          datePerForm: item.datePerForm,
          total: this.formatMoney(item.total),
          status: item.status,
        };
      });
    },

    async create() {
      try {
        const grade = await Grade.get(this.itemAdd.grade);
        for (let value of grade.classes) {
          for (let value1 of value.children) {
            await Receipt.create({
              classes: value._id,
              child: value1._id,
              status: false,
              datePerForm: this.setDate(),
              dateStart: this.itemAdd.dateStart,
              dateEnd: this.itemAdd.dateEnd,
              total: this.itemAdd.total,
            });
          }
        }
        this.activeAdd = false;
        await this.refresh();
        Swal.fire({
          background: this.background,
          color: "white",
          text: "Successfull add",
          icon: "success",
          timer: 2000,
        });
      } catch (error) {
        console.log(error);
      }
    },

    async delete() {
      const option = Swal.fire({
        background: this.background,
        color: "white",
        icon: "warning",
        html:
          "<p>I want to delete the invoice of" +
          ' "' +
          '<span class="text-blue-500 text-lg">' +
          this.item.child.name +
          "</span>" +
          '"' +
          " class " +
          ' "' +
          '<span class="text-blue-500 text-lg">' +
          this.item.classes.name +
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
          await Receipt.delete(this.deleteValue);
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

    async getAllSYear() {
      try {
        this.sYear = await SchoolYear.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getAllGrade() {
      try {
        this.grade = await Grade.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getAllClasses() {
      try {
        this.classes = await Classes.getAll();
        console.log("starting");
        this.classes = this.classes.filter((value, index) => {
          return (
            value.schoolYear._id == this.schoolYearValue &&
            value.grade._id == this.gradeValue
          );
        });
      } catch (error) {
        console.log(error);
      }
    },

    async refresh() {
      await this.getAllSYear();
      await this.getAllGrade();
      await this.getAll();
      await this.formatTable();
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
