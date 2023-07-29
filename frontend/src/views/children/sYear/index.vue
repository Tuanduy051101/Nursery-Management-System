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
        <BAdd @click="activeAdd = true" />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['School year', 'Amount classes']"
      :labels="['name', 'classes']"
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
  <FormOne
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Add A New School Year`"
    :placeholder="`Add a new School Year`"
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
import FormOne from "../../../components/forms/FormOne.vue";
import SYear from "../../../services/sYear.service";
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
    FormOne,
    ASuccess,
  },
  data() {
    return {
      // data
      items: [],
      item: {},
      // search
      searchText: "",
      // entry
      entryValue: 10,
      // table
      mode: 'auto',
      // pagination
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      // add
      activeAdd: false,
      itemAdd: {
        name: "",
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
        this.items = await SYear.getAll();
      } catch (error) {
        console.error(error);
      }
    },

    async get() {
      try {
        this.item = await SYear.get(this.deleteValue);
      } catch (error) {
        console.error(error);
      }
    },

    formatTable() {
      this.items = this.items.map((item, index) => {
        return {
          _id: item._id,
          name: item.name,
          classes: item.classes.length,
        };
      });
    },

    async refresh() {
      await this.getAll();
      await this.formatTable();
    },

    async create() {
      try {
        await SYear.create(this.itemAdd);
        Swal.fire({
          background: this.background,
          color: "white",
          text: "Successful add",
          icon: "success",
          timer: 2000,
        });
        this.activeAdd = false;
        await this.refresh();
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
          await SYear.delete(this.deleteValue);
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
