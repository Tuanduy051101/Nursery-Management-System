<template>
  <div class="border border-solid border-slate-600 rounded-md">
    <!-- Header -->
    <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
    <div class="flex justify-center items-center my-5">
      <FSelect
        class="w-full ml-5 text-md"
        :options="position"
        :modelValue="` Select position`"
        v-model="positionValue"
      />
      <FSelect
        class="w-full mx-5 text-md"
        :options="diploma"
        :modelValue="` Select diploma`"
        v-model="diplomaValue"
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
        <BAdd @click="activeAdd = true" />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Teacher', 'Gender', 'Phone', 'Email', 'Address', 'Position']"
      :labels="['name', 'gender', 'phone', 'email', 'address', 'position']"
      :mode="mode"
      :actionList="actionList"
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

  <FormTeacher
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Add A New Teacher`"
    @cancel="(value) => (activeAdd = value)"
    @submit="create()"
  />
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
import FormOne from "../../components/forms/FormOne.vue";
import FormTeacher from "../../components/forms/FormTeacher.vue";
import Teacher from "../../services/teacher.service";
import Account from "../../services/account.service";
import Position from "../../services/position.service";
import Diploma from "../../services/diploma.service";
import ASuccess from "../../components/alerts/Success.vue";
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
    FormTeacher,
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
        name: "Trần Văn A",
        gender: true,
        phone: "0344740945",
        email: "a@gmail.com",
        address: "số nhà, hẻm, phường, quận, thành phố",
        position: "",
        diploma: "",
        userName: "",
        password: "",
        role: "",
      },
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      deleteValue: "",
      actionList: ["Teacher.view"],
      diploma: [],
      position: [],
      diplomaValue: null,
      positionValue: null,
    };
  },
  watch: {
    async deleteValue() {
      await this.get();
      await this.delete();
      await this.refresh();
    },
    positionValue() {
      this.refresh();
    },
    diplomaValue() {
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
        this.items = await Teacher.getAll();
        this.items = this.items.map((item, index) => {
          return {
            _id: item._id,
            name: item.name,
            gender: item.gender,
            phone: item.phone,
            email: item.email,
            address: item.address,
            position: item.position.name,
            positionValue: item.position._id,
            diploma: item.diploma,
          };
        });
        if (this.positionValue != null) {
          this.items = this.items.filter((value, index) => {
            return value.positionValue == this.positionValue;
          });
        }
        if (this.diplomaValue != null) {
          this.items = this.items.filter((value, index) => {
            var check = false;
            for (let value1 of value.diploma) {
              if (value1._id == this.diplomaValue) {
                check = true;
                break;
              }
            }
            return check == true;
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getAllPosition() {
      try {
        this.position = await Position.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getAllDiploma() {
      try {
        this.diploma = await Diploma.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async get() {
      try {
        this.item = await Teacher.get(this.deleteValue);
      } catch (error) {
        console.error(error);
      }
    },

    formatTable() {},

    async refresh() {
      await this.getAll();
      await this.formatTable();
    },

    async create() {
      console.log("Creating");
      try {
        const check = await Teacher.create(this.itemAdd);
        if (check.error == false) {
          const account = await Account.create({
            name: this.itemAdd.userName,
            password: this.itemAdd.password,
            role: this.itemAdd.role,
            user: "teacher",
            child: "",
            teacher: check.message[0]._id,
          });
          if (!account.error) {
            Swal.fire({
              background: this.background,
              color: "white",
              text: "Successful add",
              icon: "success",
              timer: 2000,
            });
            this.activeAdd = false;
            await this.refresh();
          }
        } else if (check.error) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: check.message,
            icon: "error",
          });
        }
        console.log(check);
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
          await Teacher.delete(this.deleteValue);
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
    await this.getAllPosition();
    await this.getAllDiploma();
    await this.refresh();
  },
};
</script>
