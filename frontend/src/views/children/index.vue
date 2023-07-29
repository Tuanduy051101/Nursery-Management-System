<template>
  <div class="border border-solid border-slate-600 rounded-md">
    <!-- Header --><!-- Header -->
    <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
    <div class="flex justify-center items-center my-5">
      <FSelect
        class="w-full ml-5 text-md"
        :options="sYear"
        :modelValue="` Select school year`"
        v-model="yearValue"
      />
      <FSelect
        class="w-full ml-5 text-md"
        :options="grade"
        :modelValue="` Select grade`"
        v-model="gradeValue"
      />
      <FSelect
        class="w-full ml-5 text-md"
        :options="[
          {
            _id: 3,
            name: '3 age',
          },
          {
            _id: 4,
            name: '4 tuổi',
          },
          {
            _id: 5,
            name: '5 tuổi',
          },
        ]"
        :modelValue="` Select age`"
        v-model="ageValue"
      />
      <FSelect
        class="w-full mx-5 text-md"
        :options="[
          { _id: true, name: 'Nam' },
          { _id: false, name: 'Nữ' },
        ]"
        :modelValue="` Select gender`"
        v-model="genderValue"
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
      :fields="['Children', 'Gender', 'Birthday', 'Address', 'Parents']"
      :labels="['name', 'gender', 'birthday', 'address', 'parents']"
      :actionList="actionList"
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
  <FormChildren
    v-if="activeAdd"
    :item="parentsAdd"
    :item1="childAdd"
    :item2="account"
    :title="`Add A New Child`"
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
import Table from "../../components/TableChildren.vue";
import Pagination from "../../components/Pagination.vue";
import FormOne from "../../components/forms/FormOne.vue";
import FormChildren from "../../components/forms/FormChildren.vue";
import Children from "../../services/children.service";
import Parents from "../../services/parents.service";
import SYear from "../../services/sYear.service";
import Grade from "../../services/grade.service";
import Account from "../../services/account.service";
import ParentDetails from "../../services/parentDetails.service";
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
    FormChildren,
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
      account: {
        name: "",
        password: "",
        role: "",
      },
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      // delete
      deleteValue: "",
      actionList: ["Children.view"],
      sYear: [],
      grade: [],
      yearValue: null,
      gradeValue: null,
      ageValue: null,
      genderValue: null,
    };
  },
  watch: {
    async deleteValue() {
      await this.get();
      await this.delete();
      await this.refresh();
    },
    yearValue() {
      this.refresh();
    },
    gradeValue() {
      this.refresh();
    },
    ageValue() {
      this.refresh();
    },
    genderValue() {
      this.refresh();
    },
  },
  computed: {
    toString() {
      return this.items.map((item, index) => {
        return [item.name, item.birthday].join("");
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
        this.items = this.items.map((item, index) => {
          return {
            _id: item._id,
            name: item.name,
            gender: item.gender,
            birthday: this.formatDate(item.birthday),
            address: item.address,
            parents: item.parentDetails[0].name,
            classes: item.classes,
            age:
              new Date().getFullYear() - new Date(item.birthday).getFullYear(),
          };
        });
        if (this.yearValue != null) {
          this.items = this.items.filter((value, index) => {
            var check = false;
            for (let value1 of value.classes) {
              if (value1.schoolYear._id == this.yearValue) {
                check = true;
                break;
              }
            }
            return check == true;
          });
        }

        if (this.gradeValue != null) {
          this.items = this.items.filter((value, index) => {
            var check = false;
            for (let value1 of value.classes) {
              if (value1.grade == this.gradeValue) {
                check = true;
                break;
              }
            }
            return check == true;
          });
        }

        if (this.genderValue != null) {
          this.items = this.items.filter((value, index) => {
            console.log(value);
            return value.gender == this.genderValue;
          });
        }

        if(this.ageValue != null) {
          this.items = this.items.filter(
            (value, index) => {
              return value.age == this.ageValue;
            }
          )
        }
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

    async getAllSY() {
      try {
        this.sYear = await SYear.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getAllGrade() {
      try {
        this.grade = await Grade.getAll();
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

    formatTable() {},

    async refresh() {
      await this.getAll();
      await this.formatTable();
    },

    async create() {
      try {
        const parents = await Parents.create({});
        if (!parents.error) {
          this.parentsAdd.parents = parents.message[0]._id;
          const parentDetails = await ParentDetails.create(this.parentsAdd);
          if (!parentDetails.error) {
            this.childAdd.parentDetails = parentDetails.message[0]._id;
            const child = await Children.create(this.childAdd);
            if (!child.error) {
              const account = await Account.create({
                name: this.account.name,
                password: this.account.password,
                role: this.account.role,
                user: "child",
                child: child.message[0]._id,
                teacher: "",
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
                this.childAdd.warning = true;
              }

              this.activeAdd = false;
              await this.refresh();
            } else {
              const option = Swal.fire({
                background: this.background,
                color: "white",
                text: "There already exist similar children",
                icon: "warning",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Continue",
                reverseButtons: true,
              });
              if ((await option).isConfirmed) {
                this.childAdd.warning = false;
                const child = await Children.create(this.childAdd);
                if (!child.error) {
                  Swal.fire({
                    background: this.background,
                    color: "white",
                    text: "Successful add",
                    icon: "success",
                    timer: 2000,
                  });
                }
              } else {
                await Parents.delete(parents.message[0]._id);
                await ParentDetails.delete(parentDetails.message[0]._id);
              }
            }
          }
        }
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
          await Children.delete(this.deleteValue);
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
    await this.getAllSY();
    await this.getAllGrade();
    await this.refresh();
  },
};
</script>
