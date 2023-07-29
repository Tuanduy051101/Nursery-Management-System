<template>
  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <!-- class detail -->
    <div class="flex justify-center mb-5">
      <div class="px-5 py-5">
        <!-- title -->
        <p class="text-slate-300 text-lg text-center">
          <span
            class="border border-solid px-5 py-1 border-slate-600 rounded-md"
            >Information Details Of Receipt</span
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
              <span>Class</span>
              <span>SchoolYear:</span>
              <span>Address:</span>
            </div>
            <div class="flex flex-col mr-5">
              <span>{{ item.name }}</span>
              <span>{{ item.gender ? "Male" : "Female" }}</span>
              <span>{{ item.birthday }}</span>
              <span>{{ item.class }}</span>
              <span>{{ item.schoolYear }}</span>
              <span>{{ item.address }}</span>
            </div>
          </div>
          <div class="flex">
            <div class="flex flex-col mx-5">
              <span>Parent:</span>
              <span>Gender:</span>
              <span>Phone:</span>
              <span>Email:</span>
              <span>Relationship:</span>
              <span>Address:</span>
            </div>
            <div class="flex flex-col">
              <span>{{ item.parentDetails[0].name }}</span>
              <span>{{
                item.parentDetails[0].gender ? "Male" : "Female"
              }}</span>
              <span>{{ item.parentDetails[0].phone }}</span>
              <span>{{ item.parentDetails[0].email }}</span>
              <span>{{ item.parentDetails[0].relationship }}</span>
              <span>{{ item.parentDetails[0].address }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- class -->

  <div class="border border-solid border-slate-600 rounded-md mb-5">
    <!-- list of children or cdi or receipt -->
    <!-- <div class="border border-solid my-5 border-slate-600 border-b-0"></div> -->
    <!-- <div class="border border-solid my-5 border-slate-600 border-b-0"></div> -->
    <Table
      :items="collectionRates"
      :fields="['tuition', 'money']"
      :labels="['tuition', 'money']"
    />
    <div class="flex justify-between mx-2 my-5 text-slate-300">
      <span><span class="text-blue-500">Total:</span> {{ formatMoney(item.total) }}</span>
      <span><span class="text-blue-500">Start date:</span>  {{ formatDateReverse(item.dateStart) }}</span>
      <span><span class="text-blue-500">End date:</span>  {{ formatDateReverse(item.dateEnd) }}</span>
      <span><span class="text-blue-500">Make date:</span>  {{ item.datePerForm }}</span>
      <span><span class="text-blue-500">Status:</span>  {{ item.status ? "Paid" : "Unpaid" }}</span>
    </div>
    <div class="flex justify-center mb-5">
      <input
        class="text-slate-300 border border-solid py-2 px-4 rounded-md border-green-600 hover:border-green-300 cursor-pointer"
        type="submit"
        value="Payment confirmation"
        @click="update()"
      />
      <input @click="print = true"
        class="text-slate-300 border border-solid py-2 px-4 rounded-md border-slate-600 hover:border-slate-300 cursor-pointer mx-5"
        type="submit"
        value="Print"
      />
    </div>
  </div>
</template>

<script>
import BAdd from "../../../components/buttons/Add.vue";
import BEdit from "../../../components/buttons/Edit.vue";
import BDelete from "../../../components/buttons/Delete.vue";
import BCancel from "../../../components/buttons/Cancel.vue";
import FSelect from "../../../components/forms/Select.vue";
import FSearch from "../../../components/forms/Search.vue";
import Table from "../../../components/TableNoneAction.vue";
import Pagination from "../../../components/Pagination.vue";
import FormOne from "../../../components/forms/FormOne.vue";
import FormEditChildren from "../../../components/forms/FormEditChildren.vue";
import Classes from "../../../services/classes.service";
import Receipt from "../../../services/receipt.service";
import Children from "../../../services/children.service";
import Month from "../../../services/month.service";
import CollectionRates from "../../../services/collectionRates.service";
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
    FormOne,
    ASuccess,
    FormEditChildren,
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
      item: {},
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
      paymentConfirmation: false,
      print: false,
    };
  },
  watch: {
    print() {
      if (print) {
        this.$router.push({name: 'Receipt.print', params: {id: this.id}});
      }
    }
  },
  computed: {},
  methods: {
    async get() {
      try {
        this.item = await Receipt.get(this.id);
        this.item = [this.item];
        this.item = this.item.map((value, index) => {
          return {
            _id: value._id,
            name: value.child.name,
            gender: value.child.gender,
            birthday: value.child.birthday,
            address: value.child.address,
            class: value.classes.name,
            schoolYear: value.classes.schoolYear.name,
            schoolYearId: value.classes.schoolYear._id,
            status: value.status,
            total: value.total,
            dateStart: value.dateStart,
            dateEnd: value.dateEnd,
            datePerForm: value.datePerForm,
            classId: value.classes._id,
            gradeId: value.classes.grade,
            parentDetails: value.child.parentDetails,
          };
        });
        this.item = this.item[0];
      } catch (error) {}
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

    formatDateReverse(value) {
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

      const temp = fm.from(money, { symbol: " vnđ" });

      return temp;
    },

    async getAllCollectionRate() {
      try {
        this.collectionRates = await CollectionRates.getAll();
        this.collectionRates = this.collectionRates.filter((value, index) => {
          return (
            value.grade._id == this.item.gradeId &&
            value.schoolYear._id == this.item.schoolYearId
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

    async update() {
      try {
        if (!this.item.status) {
          const receipt = await Receipt.update(this.id, {
            makeDate: this.setDate(),
          });

          if (!receipt.error) {
            Swal.fire({
              background: this.background,
              color: "white",
              text: "Successfull payment confirmation",
              icon: "success",
              timer: 2000,
            });
            this.paymentConfirmation = false;
            await this.refresh();
          }
        } else if (this.item.status) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Has been successfully paid",
            icon: "warning",
            timer: 2000,
          });
          this.paymentConfirmation = false;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async refresh() {
      await this.get();
      await this.getAllCollectionRate();
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
