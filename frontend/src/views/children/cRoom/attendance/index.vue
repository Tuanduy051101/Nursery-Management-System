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
      <input
        type="date"
        v-model="date"
        class="w-40 bg-inherit flex items-center border border-solid border-slate-600 rounded-md px-2 text-slate-300 focus:border-slate-300"
      />
    </div>
    <div class="flex-1 flex">
      <FSearch class="flex-1 mx-5" v-model="searchText" />
      <BSave @click="create()" />
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="[
      'Children',
      'Gender',
      'Age',
      'Address',
      'Parents',
      'Start time',
      'reason',
      'End time',
      'reason',
    ]"
    :labels="['name', 'gender', 'age', 'address']"
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
import BSave from "../../../../components/buttons/Save.vue";
import BDelete from "../../../../components/buttons/Delete.vue";
import BCancel from "../../../../components/buttons/Cancel.vue";
import FSelect from "../../../../components/forms/Select.vue";
import FSearch from "../../../../components/forms/Search.vue";
import Table from "../../../../components/TableAttendance.vue";
import Pagination from "../../../../components/Pagination.vue";
import FormOne from "../../../../components/forms/FormOne.vue";
import FormChildren from "../../../../components/forms/FormChildren.vue";
import Children from "../../../../services/children.service";
import Classes from "../../../../services/classes.service";
import Attendance from "../../../../services/attendance.service";
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
    BSave,
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
      attendance: [],
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
      date: this.setDate(true),
    };
  },
  watch: {
    async deleteValue() {
      await this.get();
      await this.delete();
      await this.refresh();
    },

    classId() {
      this.refresh();
    },

    date() {
      // this.items = this.items.filter(
      //   (value, index) => {
      //     console.log(value.date);
      //     console.log(this.formatDate(this.date));
      //     return value.date == this.formatDate(this.date);
      //   }
      // )
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
        this.items = await Children.getAll();
      } catch (error) {
        console.error(error);
      }
    },

    async getAllAttendance() {
      try {
        this.attendance = await Attendance.getAll();
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

    formatDate(value) {
      let date = new Date(value);

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return year + "-" + month + "-" + day;
    },

    setDate(standard = false) {
      let date = new Date();

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      if (standard) {
        if (month < 10) {
          return year + "-" + '0' + month + "-" + day;
        }
      }

      return year + "-" + month + "-" + day;
    },

    formatTable() {
      this.items = this.items.map((item, index) => {
        this.attendance = this.attendance.filter((value, index) => {
          return value.date == this.formatDate(this.date);
        });

        console.log(item);
        console.log(item.address);

        return {
          _id: item._id,
          name: item.name,
          gender: item.gender,
          birthday: item.birthday,
          age: new Date().getFullYear() - new Date(item.birthday).getFullYear(),
          address: item.address,
          parentsName: item.parentDetails[0].name,
          parentsPhone: item.parentDetails[0].phone,
          classes: item.classes,
          date: this.setDate(),
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

      this.items = this.items.map((item, index) => {
        var reasonS = "",
          reasonE = "",
          startTime = true,
          endTime = true;
        for (var value of this.attendance) {
          if (value.child == item._id) {
            if (value.time == false) {
              console.log("1");
              reasonE = value.reason;
              endTime = value.present;
            } else if (value.time == true) {
              console.log("2");
              reasonS = value.reason;
              startTime = value.present;
            }
          }
          console.log(reasonS, reasonE, startTime, endTime);
        }
        return {
          _id: item._id,
          name: item.name,
          gender: item.gender,
          birthday: item.birthday,
          age: new Date().getFullYear() - new Date(item.birthday).getFullYear(),
          address: item.address,
          parentsName: item.parentsName,
          parentsPhone: item.parentsPhone,
          classes: item.classes,
          startTime: startTime,
          endTime: endTime,
          reasonS: reasonS,
          reasonE: reasonE,
          date: this.setDate(),
        };
      });
    },

    async refresh() {
      await this.getAll();
      await this.getAllAttendance();
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

    async create() {
      /* inputOptions can be an object or Promise */
      const inputOptions = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            true: "start time",
            false: "end time",
          });
        }, 1000);
      });

      const { value: time } = await Swal.fire({
        title: "Select time",
        input: "radio",
        inputOptions: inputOptions,
        // background: this.background,
        // color: "white",
        inputValidator: (value) => {
          if (!value) {
            return "You need to choose something!";
          }
        },
      });

      if (time) {
        if (time == "true") {
          try {
            let i = 0;
            for (var value of this.setPages) {
              i++;

              const check = await Attendance.checkUpdate({
                classes: this.classId,
                time: true,
                child: value._id,
                date: value.date,
              });

              if (check.found == true) {
                await Attendance.update(check.message._id, {
                  present: value.startTime,
                  reason: value.reasonS,
                });
              } else {
                const attendance = await Attendance.create({
                  classes: this.classId,
                  time: true,
                  child: value._id,
                  reason: value.reasonS,
                  present: value.startTime,
                  date: value.date,
                });
              }
            }
            if (i == this.setPages.length) {
              Swal.fire({
                background: this.background,
                color: "white",
                text: "Successfull saved",
                icon: "success",
                timer: 2000,
              });
            }
          } catch (error) {}
        } else if (time == "false") {
          try {
            let i = 0;
            for (var value of this.setPages) {
              i++;
              const check = await Attendance.checkUpdate({
                classes: this.classId,
                time: false,
                child: value._id,
                date: value.date,
              });

              console.log("CLM");

              if (check.found == true) {
                await Attendance.update(check.message._id, {
                  present: value.endTime,
                  reason: value.reasonE,
                });
              } else {
                const attendance = await Attendance.create({
                  classes: this.classId,
                  time: false,
                  child: value._id,
                  reason: value.reasonE,
                  present: value.endTime,
                  date: value.date,
                });
              }
            }
            if (i == this.setPages.length) {
              Swal.fire({
                background: this.background,
                color: "white",
                text: "Successfull saved",
                icon: "success",
                timer: 2000,
              });
            }
          } catch (error) {}
        }
      }

      await this.refresh();
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
