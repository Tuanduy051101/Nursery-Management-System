<template>
  <div class="border border-solid border-slate-600 rounded-md">
    <!-- Header -->
    <p class="text-slate-300 text-lg mx-5 my-5">Search Filter</p>
    <div class="flex mb-5 mx-5">
      <label for="" class="flex items-center text-slate-300 mr-2">Date:</label>
      <input
        type="date"
        v-model="date"
        class="w-40 flex items-center bg-inherit border border-solid border-slate-600 rounded-md px-2 text-slate-300 focus:border-slate-300"
      />
      <label for="" class="flex items-center text-slate-300 ml-4"
        >Start time:</label
      >
      <input
        type="time"
        v-model="startTime"
        class="w-40 mx-5 flex items-center bg-inherit border border-solid border-slate-600 rounded-md px-2 text-slate-300 focus:border-slate-300"
      />
      <label for="" class="flex items-center text-slate-300 mr-4"
        >End time:</label
      >
      <input
        type="time"
        v-model="endTime"
        class="w-40 bg-inherit flex items-center border border-solid border-slate-600 rounded-md px-2 text-slate-300 focus:border-slate-300"
      />
      <label for="" class="flex items-center text-slate-300 ml-5">Grade:</label>
      <FSelect
        class="w-48 mx-5"
        :options="grade"
        :modelValue="`Filter`"
        v-model="filterEvaluate"
      />
    </div>
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          class="w-20"
          :options="[
            { _id: 4, name: 4 },
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
        'Dish',
        'Time',
        'Amount of Meal Tickets',
        'like',
        'Unlike',
        'allergy',
      ]"
      :labels="['dateTime', 'amountOfMealTickets']"
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
    <FormMeal
      v-if="activeAdd"
      :item="itemAdd"
      :title="`Add A New Meal`"
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
import Table from "../../../components/TableMeal.vue";
import Pagination from "../../../components/Pagination.vue";
import FormMeal from "../../../components/forms/FormMeal.vue";
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
    FormMeal,
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
        dish: [
          {
            id: "",
            name: "",
          },
        ],
        date: "",
        timeStart: "",
        timeEnd: "",
      },
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      deleteValue: "",
      actionPage: 1,
      date: this.setDate(true),
      actionList: ["Meal.view"],
      startTime: null,
      endTime: null,
      gradeValue: null,
    };
  },
  watch: {
    async deleteValue() {
      await this.get();
      await this.delete();
      await this.refresh();
    },
    async startTime() {
      await this.refresh();
    },
    async endTime() {
      await this.refresh();
    },
    async gradeValue() {
      await this.refresh();
    },
    date() {
      this.refresh();
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
        this.items = await Meal.getAll();
        this.items = this.items.filter((value, index) => {
          return value.date == this.date;
        });
        if (this.startTime != null) {
          this.items = this.items.filter((value, index) => {
            return value.timeStart == this.startTime;
          });
        }
        if (this.endTime != null) {
          this.items = this.items.filter((value, index) => {
            return value.timeEnd == this.endTime;
          });
        }
        if (this.gradeValue != null) {
          this.items = this.items.filter((value, index) => {
            var check = false;
            for(let value1 of value.grade) {
              if (value1 == this.gradeValue) {
                check = true;
                break;
              }
            }
            return check == true;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async get() {
      try {
        this.item = await Meal.get(this.deleteValue);
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

    setDate(standard = false) {
      let date = new Date();

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      if (standard) {
        if (month < 10) {
          return year + "-" + "0" + month + "-" + day;
        }
      }

      return year + "-" + month + "-" + day;
    },

    formatTable() {
      this.items = this.items.map((item, index) => {
        var like = 0,
          unlike = 0,
          allergy = 0;
        for (let value of item.mealTicket) {
          console.log(value);
          if (value.evaluate.like == true) {
            like++;
          }

          if (value.evaluate.like == false) {
            unlike++;
          }

          if (value.evaluate.allergy == true) {
            allergy++;
          }
        }
        return {
          _id: item._id,
          dish: item.dish,
          amountOfMealTickets: item.mealTicket.length,
          mealTicket: item.mealTicket,
          date: this.formatDate(item.date),
          timeEnd: item.timeEnd,
          timeStart: item.timeStart,
          dateTime: "o",
          like: like,
          unlike: unlike,
          allergy: allergy,
        };
      });
    },

    async getGrade() {
      try {
        this.grade = await Grade.getAll();
        this.grade = this.grade.map((value, index) => {
          return {
            _id: value._id,
            name: value.name,
            checked: false,
          };
        });
        this.itemAdd.grade = this.grade;
      } catch (error) {
        console.log(error);
      }
    },

    async refresh() {
      await this.getGrade();
      await this.getAll();
      await this.formatTable();
    },

    async create() {
      console.log("Creating");
      try {
        let meal = await Meal.create(this.itemAdd);
        if (!meal.error) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull added",
            icon: "success",
            timer: 2000,
          });
        }
      } catch (error) {
        console.log(error);
      }
      this.itemAdd = {
        dish: [
          {
            id: "",
            name: "",
          },
        ],
        date: "",
        timeStart: "",
        timeEnd: "",
      };
      this.activeAdd = false;
      await this.refresh();
    },

    async delete() {
      // const option = Swal.fire({
      //   background: this.background,
      //   color: "white",
      //   icon: "warning",
      //   html:
      //     "<p>I want to delete " +
      //     ' "' +
      //     '<span class="text-blue-500 text-lg">' +
      //     this.item.name +
      //     "</span>" +
      //     '".' +
      //     "</p>",
      //   showCancelButton: true,
      //   showConfirmButton: true,
      //   confirmButtonText: "Delete",
      //   confirmButtonColor: "red",
      //   reverseButtons: true,
      // });

      // if ((await option).isConfirmed) {
      //   try {
      //     await Dish.delete(this.deleteValue);
      //     Swal.fire({
      //       background: this.background,
      //       color: "white",
      //       text: "Successfull delete",
      //       icon: "success",
      //       timer: 2000,
      //     });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }

      try {
        await Meal.delete(this.deleteValue);
        // Swal.fire({
        //   background: this.background,
        //   color: "white",
        //   text: "Successfull delete",
        //   icon: "success",
        //   timer: 2000,
        // });
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
