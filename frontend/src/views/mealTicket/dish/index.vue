<template>
  <div class="border border-solid border-slate-600 rounded-md">
    <!-- Header -->
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
      :fields="['Dish', 'function', 'ingredient']"
      :labels="['dish', 'function', 'ingredient']"
      :mode="mode"
      @deleteItem="(value) => (deleteValue = value)"
      :actionList="['Dish.view']"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
    <FormDish
      v-if="activeAdd"
      :item="itemAdd"
      :title="`Add A New Dish`"
      :placeholder="`Add a new Meal`"
      @cancel="(value) => (activeAdd = value)"
      @submit="create()"
    />
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
import Pagination from "../../../components/Pagination.vue";
import FormDish from "../../../components/forms/FormDish.vue";
import Assignment from "../../../services/assignment.service";
import SchoolYear from "../../../services/sYear.service";
import Receipt from "../../../services/receipt.service";
import Grade from "../../../services/grade.service";
import Classes from "../../../services/classes.service";
import Meal from "../../../services/meal.service";
import Dish from "../../../services/dish.service";
import Foodstuff from "../../../services/foodstuff.service";
import Ingredient from "../../../services/ingredient.service";
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
    FormDish,
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
        name: "",
        function: "",
        note: "",
        cooking: "",
        ingredient: [
          {
            foodstuff: "",
            amount: "",
            function: "",
            note: "",
            making: "",
          },
        ],
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
        this.items = await Dish.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async get() {
      try {
        this.item = await Dish.get(this.deleteValue);
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
          dish: item.name,
          function: item.function,
          ingredient: item.ingredient.length,
        };
      });
    },

    async refresh() {
      await this.getAll();
      await this.formatTable();
    },

    async create() {
      try {
        const dish = await Dish.create({
          name: this.itemAdd.name,
          function: this.itemAdd.function,
          note: this.itemAdd.note,
          cooking: this.itemAdd.cooking,
        });
        if (!dish.error) {
          let check = false,
            i = 0;
          for (var value of this.itemAdd.ingredient) {
            i++;
            if (value.foodstuff.length != 0) {
              var foodstuff = await Foodstuff.create({
                name: value.foodstuff,
                function: value.function,
                note: value.note,
                making: value.making,
              });
              if (!foodstuff.error) {
                await Ingredient.create({
                  foodstuff: foodstuff.message._id,
                  amount: value.amount,
                  dish: dish.message._id,
                });
              }
            }
            if (i == this.itemAdd.ingredient.length - 1) check = true;
          }
          if (i == 1) check = true;
          if (check) {
            Swal.fire({
              background: this.background,
              color: "white",
              text: "Successfull added.",
              icon: "success",
              timer: 2000,
            });
          }
        } else if (dish.error) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: dish.message,
            icon: "error",
            timer: 2000,
          });
        }
      } catch (error) {
        console.log(error);
      }
      this.itemAdd = {
        name: "",
        function: "",
        note: "",
        cooking: "",
        ingredient: [
          {
            foodstuff: "",
            amount: "",
            function: "",
            note: "",
            making: "",
          },
        ],
      };
      this.activeAdd = false;
      await this.refresh();
    },

    async delete() {
      const option = Swal.fire({
        background: this.background,
        color: "white",
        icon: "warning",
        html:
          "<p>I want to delete " +
          ' "' +
          '<span class="text-blue-500 text-lg">' +
          this.item.name +
          "</span>" +
          '".' +
          "</p>",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "red",
        reverseButtons: true,
      });

      if ((await option).isConfirmed) {
        try {
          await Dish.delete(this.deleteValue);
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
