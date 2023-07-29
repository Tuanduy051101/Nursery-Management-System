<template>
  <!-- Header -->
  <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
  <div class="flex justify-center items-center my-5">
    <FSelect
      class="w-full ml-5 text-md"
      :options="monthOption"
      :modelValue="` Select month`"
      v-model="monthValue"
    />
    <input
      v-model="heightValue"
      class="w-full ml-5 text-md py-1.5 px-2 rounded-md bg-inherit border border-solid border-slate-600 focus:border-slate-300 text-slate-300"
      type="number"
      name=""
      id=""
      placeholder="Enter height"
    />
    <input
      v-model="weightValue"
      class="w-full ml-5 text-md py-1.5 px-2 rounded-md bg-inherit border border-solid border-slate-600 focus:border-slate-300 text-slate-300"
      type="number"
      name=""
      id=""
      placeholder="Enter weight"
    />
    <input
      v-model="roseValue"
      class="w-full mx-5 text-md py-1.5 px-2 rounded-md bg-inherit border border-solid border-slate-600 focus:border-slate-300 text-slate-300"
      type="number"
      name=""
      id=""
      placeholder="Enter roses"
    />
  </div>
  <div class="border border-solid border-slate-600 border-t-0"></div>
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
    :fields="['Children', 'height (cm)', 'weight (kg)', 'health', 'roses']"
    :labels="['child', 'height', 'weight', 'health', 'roses']"
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
</template>

<script>
import BAdd from "../../../../components/buttons/Add.vue";
import BEdit from "../../../../components/buttons/Edit.vue";
import BDelete from "../../../../components/buttons/Delete.vue";
import BCancel from "../../../../components/buttons/Cancel.vue";
import FSelect from "../../../../components/forms/Select.vue";
import FSearch from "../../../../components/forms/Search.vue";
import Table from "../../../../components/TableCDI.vue";
import Pagination from "../../../../components/Pagination.vue";
import FormOne from "../../../../components/forms/FormOne.vue";
import FormChildren from "../../../../components/forms/FormChildren.vue";
import Children from "../../../../services/children.service";
import Month from "../../../../services/month.service";
import Classes from "../../../../services/classes.service";
import Parents from "../../../../services/parents.service";
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
    cdiL: {
      type: Array,
      required: true,
      default: [],
    },
    classId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // data
      items: [],
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
      classes: {},
      monthValue: null,
      monthOption: [],
      heightValue: null,
      weightValue: null,
      roseValue: null,
    };
  },
  watch: {
    async deleteValue() {
      await this.get();
      await this.delete();
      await this.refresh();
    },

    activeAdd() {
      if (this.activeAdd) {
        this.$router.push({
          name: "ClassRoom.cdi.add",
          params: {
            id: this.classId,
          },
        });
      }
    },
    monthValue() {
      this.refresh();
    },
    heightValue() {
      this.refresh();
    },
    weightValue() {
      this.refresh();
    },
    roseValue() {
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
    formatTable() {
      if (this.cdiL.length > 0 && this.monthValue != null) {
        this.items = this.cdiL.map((item, index) => {
          return {
            _id: item._id,
            child: item.child.name,
            height: item.height,
            weight: item.weight,
            health: item.health,
            roses: item.roses,
            month: item.month,
          };
        });
        this.items = this.items.filter((value, index) => {
          return value.month == this.monthValue;
        });
        if (this.heightValue) {
          this.items = this.items.filter((value, index) => {
            return value.height == this.heightValue;
          });
        }
        if (this.weightValue) {
          this.items = this.items.filter((value, index) => {
            return value.weight == this.weightValue;
          });
        }
        if (this.roseValue) {
          this.items = this.items.filter((value, index) => {
            return value.roses == this.roseValue;
          });
        }
      }
    },

    async getAllMonth() {
      try {
        this.monthOption = await Month.getAll();
      } catch (error) {
        console.log(error.message);
      }
    },

    async refresh() {
      await this.formatTable();
    },
  },
  async created() {
    await this.refresh();
    await this.getAllMonth();
  },
};
</script>
