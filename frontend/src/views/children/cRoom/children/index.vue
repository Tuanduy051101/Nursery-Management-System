<template>
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
      <input
        @click="print = true"
        class="text-slate-300 border border-solid py-2 px-6 rounded-md border-slate-600 hover:border-slate-300 cursor-pointer ml-5"
        type="submit"
        value="Print"
      />
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="['Children', 'Gender', 'Age', 'Address', 'Parents']"
    :labels="['name', 'gender', 'age', 'address', 'parents']"
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
import Table from "../../../../components/TableClass.vue";
import Pagination from "../../../../components/Pagination.vue";
import FormOne from "../../../../components/forms/FormOne.vue";
import FormChildren from "../../../../components/forms/FormChildren.vue";
import Children from "../../../../services/children.service";
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
      print: false,
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
          name: "ClassRoom.add",
          params: {
            id: this.classId,
          },
        });
      }
    },

    classId() {
      this.refresh();
    },
    print() {
      if (print) {
        this.$router.push({ name: "Classes.children.print", params: { id: this.classId } });
      }
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
        this.items = await Children.getAll();
      } catch (error) {
        console.error(error);
      }
    },

    async getClass() {
      try {
        const temp = await Classes.getAll(this.classId);
        this.classes = temp[0];
      } catch (error) {
        console.error(error);
      }
    },

    async get() {
      try {
        this.item = await Children.get(this.deleteValue);
      } catch (error) {
        console.error(error);
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

      this.items = this.items.filter((value, index) => {
        var check = false;
        for (var i = 0; i < value.classes.length; i++) {
          if (value.classes[i]._id == this.classId) {
            check = true;
            // console.log("abc");
            break;
          }
        }
        if (check == true) return true;
        else return false;
      });
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
          await Classes.update(this.classId, {
            child: this.deleteValue,
            object: "delete",
          });
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
