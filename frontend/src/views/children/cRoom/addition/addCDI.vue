<template>
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
      <FSelect
        class="w-28"
        :options="monthOption"
        :modelValue="`Month`"
        v-model="monthValue"
      />
    </div>
    <div class="flex-1 flex">
      <FSearch class="flex-1" v-model="searchText" />
      <!-- <BAdd @click="activeAdd = true" /> -->
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="['Children', 'height (cm)', 'weight (kg)', 'health', 'roses']"
    :labels="['name', 'gender', 'age', 'parents']"
    :mode="mode"
    :nameAction="`Add CDI`"
    @addItem="(value) => (items = value)"
    @startAdd="(value) => (activeAdd = value)"
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
import Table from "../../../../components/TableAddCDI.vue";
import Pagination from "../../../../components/Pagination.vue";
import FormOne from "../../../../components/forms/FormOne.vue";
import FormChildren from "../../../../components/forms/FormChildren.vue";
import Children from "../../../../services/children.service";
import Parents from "../../../../services/parents.service";
import CDI from "../../../../services/cdi.service";
import Month from "../../../../services/month.service";
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
      classes: {},
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
      monthValue: null,
      monthOption: [],
    };
  },
  watch: {
    addValue() {
      this.addChild();
    },
    ageValue() {
      this.refresh();
    },
    genderValue() {
      this.refresh();
    },
    async activeAdd() {
      if (this.activeAdd == true) {
        await this.addCDI();
      }
      this.activeAdd = false;
    },
    classes() {
      this.refresh();
    },
    monthValue() {
      this.formatTable();
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
      this.items = this.classes.children.filter((item, index) => {
        var check = false;
        for (var value of item.cDI) {
          for (var value1 of this.classes.cdi) {
            if (value._id == value1._id && value.month == this.monthValue) {
              check = true;
              break;
            }
          }
        }
        return check == false;
      });

      this.items = this.items.map((value, index) => {
        return {
          _id: value._id,
          name: value.name,
          height: 0,
          weight: 0,
          health: "empty",
          roses: 0,
          addCDI: false,
          errors: {
            height: {
              error: false,
              message: "",
            },
            weight: {
              error: false,
              message: "",
            },
            health: {
              error: false,
              message: "",
            },
            roses: {
              error: false,
              message: "",
            },
          },
        };
      });
    },

    async getAllMonth() {
      try {
        this.monthOption = await Month.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async refresh() {
      await this.formatTable();
      await this.getAllMonth();
    },
    async getClass() {
      try {
        let temp = await Classes.get(this.classId);
        this.classes = temp[0];
      } catch (error) {
        console.log(error);
      }
    },

    async addCDI() {
      let check = false;
      if (this.monthValue != null) {
        for (let value of this.items) {
          if (value.addCDI && this.monthValue && this.classId) {
            try {
              await CDI.create({
                child: value._id,
                classes: this.classId,
                month: this.monthValue,
                height: value.height,
                weight: value.weight,
                health: value.health,
                roses: value.roses,
              });
              check = true;
            } catch (error) {
              console.log(error);
            }
          }
        }
        if (check == true) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successful",
            icon: "success",
            timer: 2000,
          });
          await this.getClass();
          await this.formatTable();
        } else {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Please select a child to add to the CDI.",
            icon: "error",
          });
        }
      } else if (this.monthValue == null) {
        Swal.fire({
          background: this.background,
          color: "white",
          text: "Please select the month !",
          icon: "error",
        });
      }
    },
  },
  async created() {
    await this.getClass();
    await this.refresh();
  },
};
</script>
