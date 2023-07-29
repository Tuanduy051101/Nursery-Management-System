<template>
  <!-- Header -->
  <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
  <div class="flex justify-center items-center my-5">
    <FSelect
      class="w-full ml-5 text-md"
      :options="[
        { _id: 0, name: 0 },
        { _id: 1, name: 1 },
        { _id: 2, name: 2 },
        { _id: 3, name: 3 },
        { _id: 4, name: 4 },
        { _id: 5, name: 5 },
        { _id: 6, name: 6 },
        { _id: 7, name: 7 },
      ]"
      :modelValue="` Select age`"
      v-model="ageValue"
    />
    <FSelect
      class="mx-5"
      :options="[
        { _id: true, name: 'nam' },
        { _id: false, name: 'nữ' },
      ]"
      :modelValue="`Select gender`"
      v-model="genderValue"
    />
  </div>
  <div class="border border-solid border-slate-600 border-t-0"></div>
  <!--  -->
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
      <FSearch class="flex-1" v-model="searchText" />
      <!-- <BAdd @click="activeAdd = true" /> -->
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="['Children', 'Gender', 'age', 'Parents']"
    :labels="['name', 'gender', 'age', 'parents']"
    :mode="mode"
    @addItem="(value) => (addValue = value)"
    @deleteItem="(value) => (deleteValue = value)"
  />
  <Pagination
    :numberOfPages="numberOfPages"
    :totalRow="totalRow"
    :startRow="startRow"
    :endRow="endRow"
    v-model:currentPage="currentPage"
  />
</template>

<script>
import BAdd from "../../../../components/buttons/Add.vue";
import BEdit from "../../../../components/buttons/Edit.vue";
import BDelete from "../../../../components/buttons/Delete.vue";
import BCancel from "../../../../components/buttons/Cancel.vue";
import FSelect from "../../../../components/forms/Select.vue";
import FSearch from "../../../../components/forms/Search.vue";
import Table from "../../../../components/TableAddOne.vue";
import Pagination from "../../../../components/Pagination.vue";
import FormOne from "../../../../components/forms/FormOne.vue";
import FormChildren from "../../../../components/forms/FormChildren.vue";
import Children from "../../../../services/children.service";
import Parents from "../../../../services/parents.service";
import Classes from "../../../../services/classes.service";
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
    FormOne,
    ASuccess,
    FormChildren,
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
      schoolYear: {},
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
      parentsAdd: {
        name: "",
        gender: true,
        phone: "",
        email: "",
        address: "",
        relationship: "bố",
        parents: "",
      },
      childAdd: {
        name: "",
        gender: true,
        birthday: "",
        address: "",
        parentDetails: "",
        warning: true,
      },
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      deleteValue: "",
      addValue: "",
      currentYear: new Date().getFullYear(),
      ageValue: null,
      genderValue: null,
    };
  },
  watch: {
    addValue() {
      this.addChild(this.addValue);
    },
    ageValue() {
      this.refresh();
    },
    genderValue() {
      this.refresh();
    }
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
        this.items = await Children.getAll();
        this.items = this.items.filter((value, index) => {
          let check = false;

          for (var i = 0; i < value.classes.length; i++) {
            if (value.classes[i].schoolYear.name == new Date().getFullYear()) {
              check = true;
              break;
            }
          }
          return check == false;
        });

        if (this.ageValue != null) {
          this.items = this.items.filter(
            (value, index) => {
              return (new Date().getFullYear()) - (new Date(value.birthday).getFullYear()) == this.ageValue;
            }
          )
        }

        if (this.genderValue != null) {
          this.items = this.items.filter(
            (value, index) => {
              return value.gender == this.genderValue;
            }
          )
        }

      } catch (error) {
        console.log(error);
      }
    },

    async get() {
      try {
        this.item = await Children.get(this.deleteValue);

      } catch (error) {
        console.log(error);
      }
    },

    async getClass() {
      try {
        const classes = await Classes.get(this.classId);
        this.schoolYear = classes.schoolYear;
      } catch (error) {
        console.log(error);
      }
    },

    formatTable() {
      this.items = this.items.map((item, index) => {
        return {
          _id: item._id,
          name: item.name,
          gender: item.gender,
          birthday: item.birthday,
          age: new Date().getFullYear() - new Date(item.birthday).getFullYear(),
          address: item.address,
          parents: item.parentDetails[0].name,
          classes: item.classes,
        };
      });
    },

    async addChild(id) {
      try {
        await Classes.update(this.classId, { child: id, object: "addChild" });
        Swal.fire({
          background: this.background,
          color: "white",
          text: "Successful",
          icon: "success",
          timer: 2000,
        });
        await this.refresh();
      } catch (error) {
        console.log(error);
      }
    },

    async refresh() {
      await this.getAll();
      await this.formatTable();
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
