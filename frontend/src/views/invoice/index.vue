<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <!-- <div class="flex justify-end mx-5 my-5 text-slate-600">
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 1 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 1"
      >
        Receipt
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 2
            ? 'border-2 border-slate-300 text-slate-300'
            : 'border-l-0'
        "
        @click="actionPage = 2"
      >
        Payment
      </div>
    </div> -->
    <!-- <div class="border border-solid my-5 border-slate-600 border-b-0"></div> -->
    <!-- Header -->
    <ReceiptL v-if="actionPage == 1" />
    <PaymentL v-if="actionPage == 2 " />
  </div>
</template>

<script>
import BAdd from "../../components/buttons/Add.vue";
import BEdit from "../../components/buttons/Edit.vue";
import BDelete from "../../components/buttons/Delete.vue";
import BCancel from "../../components/buttons/Cancel.vue";
import FSelect from "../../components/forms/Select.vue";
import FSearch from "../../components/forms/Search.vue";
import Table from "../../components/Table.vue";
import Pagination from "../../components/Pagination.vue";
import FormAssignment from "../../components/forms/FormAssignment.vue";
import Assignment from "../../services/assignment.service";
import SchoolYear from "../../services/sYear.service";
import Invoice from "../../services/receipt.service";
import ASuccess from "../../components/alerts/Success.vue";
import Swal from "sweetalert2";
import ReceiptL from "./receipt/index.vue";
import PaymentL from "./payment/index.vue";

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
    ReceiptL,
    PaymentL,
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
        child: "",
        classes: "",
        dateStart: "",
        dateEnd: "",
        datePerForm: "",
        total: "",
        status: "",
      },
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      deleteValue: "",
      actionPage: 1,
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
        this.items = await Invoice.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async get() {
      try {
        this.item = await Assignment.get(this.deleteValue);
      } catch (error) {
        console.error(error);
      }
    },

    formatDate(value) {
      let date = new Date(value);

      let day = date.getDay(),
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
          datePerForm: this.formatDate(item.datePerForm),
          total: item.total,
          status: item.status,
        };
      });
    },

    async refresh() {
      await this.getAll();
      await this.formatTable();
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
