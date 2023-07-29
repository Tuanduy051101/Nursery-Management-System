<template>
  <!-- Header -->
  <p class="text-slate-300 text-lg mx-5 my-5">Search Filter</p>
  <div class="flex mb-5 mx-5">
    <label for="" class="flex items-center text-slate-300 mr-2">Date:</label>
    <input
      type="date"
      v-model="dateMeal"
      class="w-40 bg-inherit flex items-center border border-solid border-slate-600 rounded-md px-2 text-slate-300 focus:border-slate-300"
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
    <FSelect
      class="w-48 mx-5"
      :options="[
        { _id: true, name: 'like' },
        { _id: false, name: 'allergy' },
      ]"
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
      <BAdd @click="activeAdd = true" class="mr-5" />
      <BSave @click="update()" />
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="['Children', 'Meal', 'Like', 'allergy', 'note']"
    :labels="['child']"
    :mode="mode"
    @deleteItem="(value) => (deleteValue = value)"
    :actionList="['Meal.view']"
  />
  <Pagination
    :numberOfPages="numberOfPages"
    :totalRow="totalRow"
    :startRow="startRow"
    :endRow="endRow"
    v-model:currentPage="currentPage"
  />
  <FormMealTicket
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Add A New Meal`"
    :placeholder="`Add a new Meal`"
    @cancel="(value) => (activeAdd = value)"
    @submit="create()"
  />
</template>

<script>
import BAdd from "../../../../components/buttons/Add.vue";
import BSave from "../../../../components/buttons/Save.vue";
import BEdit from "../../../../components/buttons/Edit.vue";
import BDelete from "../../../../components/buttons/Delete.vue";
import BCancel from "../../../../components/buttons/Cancel.vue";
import FSelect from "../../../../components/forms/Select.vue";
import FSearch from "../../../../components/forms/Search.vue";
import Table from "../../../../components/TableEvaluate.vue";
import Pagination from "../../../../components/Pagination.vue";
import FormMealTicket from "../../../../components/forms/FormMealTicket.vue";
import Children from "../../../../services/children.service";
import Classes from "../../../../services/classes.service";
import Parents from "../../../../services/parents.service";
import MealTicket from "../../../../services/mealTicket.service";
import Evaluate from "../../../../services/evaluate.service";
import ParentDetails from "../../../../services/parentDetails.service";
import ASuccess from "../../../../components/alerts/Success.vue";
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
    FormMealTicket,
    ASuccess,
    BSave,
  },
  props: {
    classId: {
      type: String,
      required: true,
      default: "",
    },
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
        classes: this.classId,
        meal: "",
        listDish: [],
        date: this.setDate(),
        children: [],
      },
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      deleteValue: "",
      classes: {},
      evaluate: [],
      activeSave: false,
      dateMeal: this.setDate(true),
      startTime: null,
      endTime: null,
      filterEvaluate: null,
    };
  },
  watch: {
    async deleteValue() {
      await this.get();
      await this.delete();
      await this.refresh();
    },

    // activeAdd() {
    //   if (this.activeAdd) {
    //     this.$router.push({
    //       name: "ClassRoom.add",
    //       params: {
    //         id: this.classId,
    //       },
    //     });
    //   }
    // },

    classId() {
      this.refresh();
    },
    dateMeal() {
      this.refresh();
    },
    startTime() {
      this.refresh();
    },
    endTime() {
      this.refresh();
    },
    filterEvaluate() {
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
        this.items = await MealTicket.getAll();
        if (this.classId.length != 0) {
          this.items = this.items.filter((value, index) => {
            return value.classes._id == this.classId;
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getClass() {
      try {
        const temp = await Classes.getAll(this.classId);
        this.classes = temp[0];
        this.itemAdd.className = this.classes.name;
        this.itemAdd.grade = this.classes.grade._id;
        this.itemAdd.checked = false;
      } catch (error) {
        console.error(error);
      }
    },

    async get() {
      try {
        this.item = await MealTicket.get(this.deleteValue);
      } catch (error) {
        console.error(error);
      }
    },

    async getEvaluate(id) {
      console.log("abc");
      try {
        const evaluate = await Evaluate.get(id);
        this.evaluate.push(evaluate);
      } catch (error) {
        console.error(error);
      }
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

    async formatTable() {
      for (let value of this.items) {
        await this.getEvaluate(value.evaluate._id);
      }
      this.items = this.items.map((item, index) => {
        if (this.evaluate.length != 0) {
          return {
            _id: item._id,
            child: item.child.name,
            classes: item.classes._id,
            meal: item.meal._id,
            dish: item.meal.dish,
            date: item.meal.date,
            timeStart: item.meal.timeStart,
            timeEnd: item.meal.timeEnd,
            like: this.evaluate[index].like,
            allergy: this.evaluate[index].allergy,
            note: this.evaluate[index].note,
            evaluate: this.evaluate[index],
          };
        }
      });

      this.items = this.items.filter((value, index) => {
        return value.date == this.dateMeal;
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

      if (this.filterEvaluate != null) {
        if (this.filterEvaluate == true) {
          this.items = this.items.filter((value, index) => {
            return value.like == true;
          });
        }

        if (this.filterEvaluate == false) {
          this.items = this.items.filter((value, index) => {
            return value.allergy == true;
          });
        }
      }

      // this.items = this.items.filter((value, index) => {
      //   var check = false;
      //   for (var i = 0; i < value.classes.length; i++) {
      //     if (value.classes[i]._id == this.classId) {
      //       check = true;
      //       // console.log("abc");
      //       break;
      //     }
      //   }
      //   if (check == true) return true;
      //   else return false;
      // });
    },

    async refresh() {
      await this.getAll();
      await this.formatTable();
      await this.getClass();
    },

    async delete() {
      const option = Swal.fire({
        background: this.background,
        color: "white",
        icon: "warning",
        html:
          "<p>I want to delete this meal ticket." +
          '<span class="text-blue-500 text-lg">' +
          "</span>" +
          "</p>",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "red",
        reverseButtons: true,
      });

      if ((await option).isConfirmed) {
        try {
          const check = await MealTicket.delete(this.deleteValue);
          if (!check.error) {
            Swal.fire({
              background: this.background,
              color: "white",
              text: "Successfull delete",
              icon: "success",
              timer: 2000,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    async create() {
      console.log("Creating");
      try {
        const mealTicket = await MealTicket.create({
          classes: this.itemAdd.classes,
          meal: this.itemAdd.meal,
          children: this.itemAdd.children,
        });

        if (mealTicket.error) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: mealTicket.message,
            icon: "error",
          });
        } else {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull added",
            icon: "success",
            timer: 2000,
          });
        }
      } catch (error) {}

      this.activeAdd = false;
      await this.refresh();
    },

    async update() {
      try {
        var i = 0;
        for (let value of this.items) {
          i++;
          console.log(value);
          const evaluate = await Evaluate.update(value.evaluate._id, {
            like: value.like,
            allergy: value.allergy,
            note: value.note,
          });
        }
        console.log(i);
        console.log(this.items.length);
        if (i == this.items.length) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull saved",
            icon: "success",
            timer: 2000,
          });
        }
        this.activeSave = false;
      } catch (error) {}
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
