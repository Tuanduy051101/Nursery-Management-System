<template>
  <!-- <div class="" v-if="item != null"> -->
  <div
    v-if="item != null"
    class="border border-solid border-slate-600 rounded-md mb-5"
  >
    <!-- class detail -->
    <div class="flex justify-center mb-5">
      <div class="px-5 py-5">
        <!-- title -->
        <p class="text-slate-300 text-lg text-center">
          <span
            class="border border-solid px-5 py-1 border-slate-600 rounded-md"
            >Information Details Of Child</span
          >
        </p>
        <div class="flex text-slate-300 mt-10">
          <div
            class="flex mx-5 border border-solid border-t-0 border-b-0 border-l-0 border-slate-600"
          >
            <div class="flex flex-col mr-5">
              <span>Child:</span>
              <span>Gender:</span>
              <span>Birthday:</span>
              <span>Address:</span>
            </div>
            <div class="flex flex-col mr-10">
              <span>{{ item.name }}</span>
              <span>{{ item.gender ? "Nam" : "Nữ" }}</span>
              <span>{{ item.birthday }}</span>
              <span>{{ item.address }}</span>
              <p @click="editChild = true" class="cursor-pointer mt-5">
                <span
                  class="border border-solid px-4 py-1 rounded-md border-yellow-600 text-slate-600 hover:border-yellow-300 hover:text-slate-300"
                  >Edit</span
                >
              </p>
            </div>
          </div>
          <div class="flex flex-1">
            <div class="flex flex-col mx-5">
              <span>Parent:</span>
              <span>Gender:</span>
              <span>Phone:</span>
              <span>Email:</span>
              <span>Relationship:</span>
              <span>Address:</span>
            </div>
            <div v-if="item.parentDetails.length != 0" class="flex flex-col">
              <span>{{ item.parentDetails[0].name }}</span>
              <span>{{
                item.parentDetails[0].gender ? "Nam" : "Nữ"
              }}</span>
              <span>{{ item.parentDetails[0].phone }}</span>
              <span>{{ item.parentDetails[0].email }}</span>
              <span>{{ item.parentDetails[0].relationship }}</span>
              <span>{{ item.parentDetails[0].address }}</span>
              <div class="flex">
                <p @click="addParent = true" class="cursor-pointer mt-5 mr-5">
                  <span
                    class="border border-solid px-4 py-1 rounded-md border-green-600 text-slate-600 hover:border-green-300 hover:text-slate-300"
                    >Add</span
                  >
                </p>
                <p class="cursor-pointer mt-5">
                  <span
                    class="border border-solid px-4 py-1 rounded-md border-yellow-600 text-slate-600 hover:border-yellow-300 hover:text-slate-300"
                    >Edit</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- class -->

  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <div class="mx-5 my-5 flex items-center justify-between">
      <div class="flex items-center">
        <label for="" class="text-slate-300 mr-5">Class: </label>
        <FSelect class="w-32" :options="classes" v-model="classValue" />
      </div>
      <p v-if="classO.length != 0" class="text-slate-300">
        Grade: {{ classO[0].grade.name }}
      </p>
      <p v-if="classO.length != 0" class="text-slate-300">
        School Year: {{ classO[0].schoolYear.name }}
      </p>
    </div>
    <!-- list of children or cdi or receipt -->
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>
    <div class="flex justify-end mx-5 mb-5 text-slate-600">
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 6 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 6"
      >
        Parent
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 1 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 1"
      >
        Teacher
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 2
            ? 'border-2 border-slate-300 text-slate-300'
            : 'border-l-0 border-r-0'
        "
        @click="actionPage = 2"
      >
        CDI
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 3 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 3"
      >
        Tuition
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 4 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 4"
      >
        Meal
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 5 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 5"
      >
        Attendance
      </div>
    </div>
    <!-- <div class="border border-solid my-5 border-slate-600 border-b-0"></div> -->
    <Table
      v-if="actionPage == 1"
      :items="assignment"
      :fields="['teacher', 'phone', 'email', 'address']"
      :labels="['name', 'phone', 'email', 'address']"
    />
    <Table
      v-if="actionPage == 2"
      :items="cdi"
      :fields="['month', 'height (cm)', 'weight (kg)', 'health', 'roses']"
      :labels="['month', 'height', 'weight', 'health', 'roses']"
    />
    <Table
      v-if="actionPage == 3"
      :items="collectionRates"
      :fields="['tuition', 'money']"
      :labels="['tuition', 'money']"
    />
    <div
      v-if="actionPage == 3"
      class="flex justify-between mx-2 my-5 text-slate-300"
    >
      <span><span class="text-blue-500">Total:</span> {{ formatMoney(receipt[0].total) }}</span>
      <span><span class="text-blue-500">Start Date:</span> {{ formatDate1(receipt[0].dateStart) }}</span>
      <span><span class="text-blue-500">End Date:</span> {{ formatDate1(receipt[0].dateEnd) }}</span>
      <span><span class="text-blue-500">Make Date:</span> {{ receipt[0].datePerForm }}</span>
      <span><span class="text-blue-500">Status:</span> {{ receipt[0].status ? "Paid" : "Pay" }}</span>
    </div>
    <div
      v-if="actionPage == 5"
      class="border border-solid my-5 border-slate-600 border-b-0"
    ></div>
    <div v-if="actionPage == 5" class="flex mb-5 mx-5">
      <input
        type="date"
        v-model="date"
        class="w-40 bg-inherit flex items-center border border-solid border-slate-600 rounded-md px-2 text-slate-300 focus:border-slate-300"
      />
      <FSelect
        class="w-48 mx-5"
        :options="[
          { _id: true, name: 'present' },
          { _id: false, name: 'absent' },
        ]"
        :modelValue="`Filter present`"
        v-model="filterPresent"
      />
    </div>
    <Table
      v-if="actionPage == 5"
      :items="attendance"
      :fields="['Date', 'Time', 'Present', 'reason']"
      :labels="['date', 'time', 'present', 'reason']"
    />
    <TableDelete
      v-if="actionPage == 6"
      :items="item.parentDetails"
      :fields="[
        'Parent',
        'gender',
        'phone',
        'email',
        'address',
        'relationship',
      ]"
      :labels="['name', 'gender', 'phone', 'email', 'address', 'relationship']"
    />

    <!-- Meal -->
    <div
      v-if="actionPage == 4"
      class="border border-solid my-5 border-slate-600 border-b-0"
    ></div>
    <div v-if="actionPage == 4" class="flex mb-5 mx-5">
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
    <TableEvaluateNoneDelete
      v-if="actionPage == 4"
      :items="mealTicket"
      :fields="['Date', 'Time', 'dish', 'like', 'allergy', 'note']"
      :labels="[]"
      :actionList="['MealTicket.view']"
    />
  </div>

  <FormEditChildren
    v-if="editChild"
    :title="`Edit Child Information`"
    :item="item"
    @cancel="(value) => (editChild = value)"
    @submit="update()"
  />
  <FormAddParent
    v-if="addParent"
    :title="`Add parent for child`"
    :item="parentValue"
    @cancel="(value) => (addParent = value)"
    @submit="create()"
  />
  <!-- </div> -->
</template>

<script>
import BAdd from "../../components/buttons/Add.vue";
import BEdit from "../../components/buttons/Edit.vue";
import BDelete from "../../components/buttons/Delete.vue";
import BCancel from "../../components/buttons/Cancel.vue";
import FSelect from "../../components/forms/Select.vue";
import FSearch from "../../components/forms/Search.vue";
import Table from "../../components/TableNoneAction.vue";
import TableDelete from "../../components/TableDelete.vue";
import TableEvaluateNoneDelete from "../../components/TableEvaluateNoneDelete.vue";
import Pagination from "../../components/Pagination.vue";
import FormOne from "../../components/forms/FormOne.vue";
import FormEditChildren from "../../components/forms/FormEditChildren.vue";
import FormAddParent from "../../components/forms/FormAddParent.vue";
import Classes from "../../services/classes.service";
import Children from "../../services/children.service";
import Month from "../../services/month.service";
import MealTicket from "../../services/mealTicket.service";
import ParentDetails from "../../services/parentDetails.service";
import CollectionRates from "../../services/collectionRates.service";
import ASuccess from "../../components/alerts/Success.vue";
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
    FormOne,
    ASuccess,
    FormEditChildren,
    TableEvaluateNoneDelete,
    FormAddParent,
    TableDelete,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // data
      items: [],
      item: null,
      teacher: [],
      classes: [],
      classO: [],
      assignment: [],
      cdi: [],
      classValue: "",
      actionPage: 1,
      month: [],
      grade: "",
      schoolYear: "",
      collectionRates: [],
      receipt: [],
      mealTicket: [],
      attendance: [],
      date: this.setDate(true),
      filterPresent: null,
      editChild: false,
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
      dateMeal: this.setDate(true),
      startTime: null,
      endTime: null,
      filterEvaluate: null,
      addParent: false,
      parentValue: {
        child: this.id,
        name: "",
        gender: true,
        phone: "",
        email: "",
        address: "",
        relationship: "bố",
      },
    };
  },
  watch: {
    async classValue() {
      await this.getClass();
      this.formatCDI();
      await this.getAllCollectionRate();
      await this.getAllMealTicket();
    },
    date() {
      this.getClass();
    },
    filterPresent() {
      this.getClass();
    },
    dateMeal() {
      this.getAllMealTicket();
    },
    startTime() {
      this.getAllMealTicket();
    },
    endTime() {
      this.getAllMealTicket();
    },
    filterEvaluate() {
      this.getAllMealTicket();
    },
  },
  computed: {},
  methods: {
    async get() {
      try {
        this.item = await Children.get(this.id);
        (this.parentValue.parents = this.item.parentDetails[0].parents),
          console.log(this.item);
        this.classes = this.item.classes;
        // await this.getAllMealTicket();
      } catch (error) {}
    },

    async getAllMealTicket() {
      try {
        this.mealTicket = await MealTicket.getAll();
        this.mealTicket = this.mealTicket.filter((value, index) => {
          return value.classes._id == this.classO[0]._id;
        });
        this.mealTicket = this.mealTicket.filter((value, index) => {
          let check = false;
          for (let value1 of this.item.mealTicket) {
            if (value._id == value1) {
              check = true;
              break;
            }
          }
          return check == true;
        });

        this.mealTicket = this.mealTicket.map((value, index) => {
          return {
            _id: value._id,
            dish: value.meal.dish,
            date: value.meal.date,
            meal: value.meal._id,
            startTime: value.meal.timeStart,
            endTime: value.meal.timeEnd,
            evaluate: value.evaluate,
            like: value.evaluate.like,
            allergy: value.evaluate.allergy,
            note: value.evaluate.note,
          };
        });

        this.mealTicket = this.mealTicket.filter((value, index) => {
          return value.date == this.dateMeal;
        });

        if (this.startTime != null) {
          this.mealTicket = this.mealTicket.filter((value, index) => {
            return value.startTime == this.startTime;
          });
        }

        if (this.endTime != null) {
          this.mealTicket = this.mealTicket.filter((value, index) => {
            return value.endTime == this.endTime;
          });
        }

        if (this.filterEvaluate != null) {
          if (this.filterEvaluate == true) {
            this.mealTicket = this.mealTicket.filter((value, index) => {
              return value.like == true;
            });
          }

          if (this.filterEvaluate == false) {
            this.mealTicket = this.mealTicket.filter((value, index) => {
              return value.allergy == true;
            });
          }
        }
      } catch (error) {
        console.log(error);
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

    formatDate(value) {
      let date = new Date(value);

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return year + "-" + month + "-" + day;
    },

    formatDate1(value) {
      let date = new Date(value);

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return day + "-" + month + "-" + year;
    },

    async getClass() {
      try {
        this.classO = await Classes.get(this.classValue);
        this.assignment = this.classO[0].assignment.map((value, index) => {
          return {
            _id: value.teacher._id,
            name: value.teacher.name,
            phone: value.teacher.phone,
            email: value.teacher.email,
            address: value.teacher.address,
          };
        });
        this.grade = this.classO[0].grade._id;
        this.schoolYear = this.classO[0].schoolYear._id;
        this.cdi = this.classO[0].cdi;

        this.cdi = this.cdi.filter((value, index) => {
          return value.child._id == this.id;
        });

        for (let value of this.cdi) {
          await this.getMonth(value.month);
        }

        this.receipt = this.classO[0].receipt;
        this.receipt = this.receipt.filter((value, index) => {
          return value.child == this.id;
        });

        this.attendance = this.classO[0].attendance;
        this.attendance = this.attendance.filter((value, index) => {
          return value.child._id == this.id;
        });
        this.attendance = this.attendance.filter((value, index) => {
          return value.date == this.formatDate(this.date);
        });
        if (this.filterPresent != null) {
          this.attendance = this.attendance.filter((value, index) => {
            return value.present == this.filterPresent;
          });
        }
        this.attendance = this.attendance.map((value, index) => {
          if (value.time) {
            var time = "Start time";
          }
          if (!value.time) {
            var time = "End time";
          }
          if (value.present) {
            var present = "present";
          }
          if (!value.present) {
            var present = "absent";
          }
          return {
            _id: value._id,
            time: time,
            present: present,
            reason: value.reason,
            date: value.date,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },

    formatMoney(money) {
      const fm = new FormatMoney({
        decimals: 0,
        append: true,
      });

      const temp = fm.from(money, { symbol: "vnđ" });

      return temp;
    },

    formatCDI() {
      this.cdi = this.cdi.map((value, index) => {
        console.log(index + "c");
        return {
          _id: value._id,
          height: value.height,
          weight: value.weight,
          health: value.health,
          roses: value.roses,
          month: this.month[index].name,
        };
      });
    },

    async getMonth(id) {
      try {
        const month = await Month.get(id);
        this.month.push(month);
      } catch (error) {}
    },

    async getAllCollectionRate() {
      try {
        this.collectionRates = await CollectionRates.getAll();
        this.collectionRates = this.collectionRates.filter((value, index) => {
          return (
            value.grade._id == this.grade &&
            value.schoolYear._id == this.schoolYear
          );
        });
        this.collectionRates = this.collectionRates.map((value, index) => {
          return {
            _id: value._id,
            tuition: value.tuitionFees.name,
            money: this.formatMoney(value.money),
          };
        });
      } catch (error) {
        console.log(error);
      }
    },

    format() {},

    async refresh() {
      await this.get();
    },

    async update() {
      console.log("starting");
      try {
        const child = await Children.update(this.id, {
          name: this.item.name,
          gender: this.item.gender,
          birthday: this.item.birthday,
          address: this.item.address,
        });

        if (!child.error) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull edit",
            icon: "success",
            timer: 2000,
          });
          this.editChild = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async create() {
      try {
        const check = await ParentDetails.create1(this.parentValue);
        if (check.error == false) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull add",
            icon: "success",
            timer: 2000,
          });
          this.addParent = false;
          await this.refresh();
        }
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
