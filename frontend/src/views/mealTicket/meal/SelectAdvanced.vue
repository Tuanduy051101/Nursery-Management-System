<template>
  <div class="">
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      <div class="bg-slate-800 h-screen opacity-100 flex-1 relative"></div>
      <div
        class="bg-slate-800 overflow-auto mx-5 w-10/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
        style="min-height: 100px; max-height: 100vh"
      >
        <div
          class="flex flex-row justify-between items-center px-3 py-3 text-slate-300 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
        >
          <span>Select Dish</span>
          <span
          @click="cancel()"
            class="material-symbols-outlined cursor-pointer text-slate-600 hover:text-slate-300"
          >
            close
          </span>
        </div>
        <div class="flex flex-col my-5 mx-3">
          <div class="flex mb-5">
            <FSearch class="flex-1 mr-5" v-model="searchText" />
            <BAdd @click="activeAdd = true" />
          </div>
          <Table
            :items="setPages"
            :fields="['Dish', 'Function', 'note']"
            :labels="['name', 'function', 'note']"
            :mode="mode"
            @addItem="(value, value1) => (addItem(value, value1))"
          />
          <Pagination
            :numberOfPages="numberOfPages"
            :totalRow="totalRow"
            :startRow="startRow"
            :endRow="endRow"
            v-model:currentPage="currentPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BAdd from "../../../components/buttons/Add.vue";
import BEdit from "../../../components/buttons/Edit.vue";
import BDelete from "../../../components/buttons/Delete.vue";
import BCancel from "../../../components/buttons/Cancel.vue";
import FSelect from "../../../components/forms/Select.vue";
import FSearch from "../../../components/forms/Search.vue";
import Table from "../../../components/TableToggle.vue";
import Pagination from "../../../components/Pagination.vue";
import Assignment from "../../../services/assignment.service";
import SchoolYear from "../../../services/sYear.service";
import Receipt from "../../../services/receipt.service";
import Grade from "../../../services/grade.service";
import Classes from "../../../services/classes.service";
import Meal from "../../../services/meal.service";
import Dish from "../../../services/dish.service";
import ASuccess from "../../../components/alerts/Success.vue";
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
    ASuccess,
  },
  data() {
    return {
      // data
      items: [],
      item: {},
      sYear: [],
      grade: [],
      // search
      searchText: "",
      // entry
      entryValue: 5,
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
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      actionPage: 1,
    };
  },
  watch: {

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
        this.items = await Dish.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    formatDate(value) {
      let date = new Date(value);

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return day + "-" + month + "-" + year;
    },

    formatTable() {
      this.items = this.items.map((item, index) => {
        return {
          _id: item._id,
          name: item.name,
          function: item.function,
          note: item.note,
        };
      });
    },

    addItem(id, name) {
      this.$emit("addItem", id, name);
      this.$emit("showSearchAdvanced", false);
    },
    cancel() {
      this.$emit("showSearchAdvanced", false);
    }
  },
  async created() {
    await this.getAll();
  },
};
</script>