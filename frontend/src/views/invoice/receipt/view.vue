<template>
  <div
    id="x"
    v-if="item?.name"
    class="border border-solid border-slate-300 rounded-md mb-5"
  >
    <div class="flex justify-start">
      <p
        class="text-lg border border-solid border-t-0 border-l-0 border-slate-300 px-4 py-1.5"
        style="border-radius: 0% 0% 5px 0%"
      >
        Chi tiết thông tin phiếu thu
      </p>
    </div>
    <!-- class detail -->
    <div class="flex justify-center mb-5">
      <div class="px-10 -mt-5 py-5">
        <div
          class="flex text-slate-300 mt-10 border border-solid rounded-md py-5 px-5 border-slate-300"
        >
          <div
            class="w-6/12 flex mr-5 border border-solid border-t-0 border-b-0 border-l-0 border-slate-300"
          >
            <div class="flex flex-col mr-5 text-slate-600 space-y-1">
              <span class="whitespace-nowrap">Tên trẻ:</span>
              <span>Giới tính:</span>
              <span class="whitespace-nowrap">Năm học:</span>
              <span class="whitespace-nowrap">Tên phụ huynh:</span>
              <span>Số điện thoại:</span>
              <span>Mối quan hệ:</span>
              <span class="whitespace-nowrap">Địa chỉ thường trú:</span>
            </div>
            <div class="flex flex-col mr-5 space-y-1">
              <span class="text-slate-900 whitespace-nowrap capitalize">{{
                item.name
              }}</span>
              <span class="text-slate-900 capitalize">{{ item.gender }}</span>
              <span class="text-slate-900">{{ item.schoolYear }}</span>
              <span class="text-slate-900 capitalize">{{
                item.parentDetails[0].name
              }}</span>
              <span class="text-slate-900 capitalize">{{
                item.parentDetails[0].phone
              }}</span>
              <span class="text-slate-900 capitalize">{{
                item.parentDetails[0].relationship
              }}</span>
              <span class="text-slate-900 capitalize"
                >{{ item.parentDetails[0].address }}
              </span>
            </div>
          </div>
          <!-- <div class="flex w-1/3">
            <div class="flex flex-col mr-5 text-slate-600 space-y-1">
              
            </div>
            <div class="flex flex-col space-y-1">
              <span class="text-slate-900 capitalize">{{
                item.parentDetails[0].name
              }}</span>
              <span class="text-slate-900 capitalize">{{
                item.parentDetails[0].gender ? "nam" : "nữ"
              }}</span>
              <span class="text-slate-900 capitalize">{{
                item.parentDetails[0].phone
              }}</span>
              <span class="text-slate-900 capitalize">{{
                item.parentDetails[0].relationship
              }}</span>
              <span class="text-slate-900 capitalize"
                >{{ item.parentDetails[0].address }}
              </span>
            </div>
          </div> -->
          <div class="flex w-6/12 border ml-5">
            <div class="flex flex-col mx-5 text-slate-600 space-y-1">
              <span>Tổng số tiền:</span>
              <span>Ngày bắt đầu thu:</span>
              <span>Ngày kết thúc thu:</span>
              <span>Ngày thu:</span>
              <span>Trạng thái:</span>
            </div>
            <div class="flex flex-col space-y-1">
              <span class="text-green-500">{{ item.total }}</span>
              <span class="text-slate-900">{{
                formatDateReverse(item.dateStart)
              }}</span>
              <span class="text-slate-900">{{
                formatDateReverse(item.dateEnd)
              }}</span>
              <span class="text-green-500">{{ item.datePerForm }}</span>
              <span class="text-green-500">{{
                item.status == "true" ? "Đã thanh toán" : "Chưa thanh toán"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Table
      :items="collectionRates"
      :fields="['Tên khoản thu', 'Mức thu']"
      :labels="['tuition', 'money']"
      :show-action="[false, false, false]"
      :show-checkbox="false"
    />
    <div class="flex justify-end">
      <input
        @click="exportToPDF"
        class="text-slate-900 m-5 border border-solid py-2 px-8 rounded-md border-gray-200 bg-gray-200 hover:shadow-lg hover:shadow-yellow-500/50 cursor-pointer"
        type="submit"
        value="In"
      />
    </div>
  </div>
  <!-- print -->
  <div
    ref="pdfContent"
    class="max-w-lg mx-auto text-black p-8 border border-gray-300 rounded-lg shadow-md show"
  >
    <div class="mb-4 flex justify-between">
      <img src="../../../assets/images/logo.png" alt="Logo" class="w-40 h-40" />
      <div class="text-right">
        <p class="text-lg font-semibold">BIÊN LAI THU HỌC PHÍ</p>
        <p class="text-sm text-gray-900">Mẫu số: 001</p>
      </div>
    </div>
    <div class="mb-4 space-y-3">
      <p class="text-gray-900 ">Mã trẻ: <span class="">{{ item._id }}</span></p>
      <p class="text-gray-900 ">Họ tên trẻ: <span class="capitalize">{{ item.name }}</span></p>
      <p class="text-gray-900 capitalize">Giới tính: <span class="capitalize">{{ item.gender }}</span></p>
      <p class="text-gray-900">Ngày sinh: {{ item.birthday }}</p>
      <p class="text-gray-900 capitalize">Lớp học: <span class="capitalize">{{ item.class }}</span></p>
      <p class="text-gray-900">Năm học: {{ item.schoolYear }}</p>
      <p class="text-gray-900">Tổng thanh toán: {{ item.total }}</p>
      <p class="text-gray-900">Số tiền bằng chữ: <span class="capitalize">{{ item.total_letter }}</span></p>
      <div class="flex justify-end mt-5">
        <p class="text-gray-900">{{ getDateNow }}</p>
      </div>
      <!-- Thêm các thông tin khác cần thiết -->
    </div>
    <div class="flex justify-between">
      <div>
        <p class="text-xs ml-10">Người đóng:</p>
        <p class="text-sm font-semibold">[Ký và ghi rõ họ tên]</p>
      </div>
      <div>
        <p class="text-xs ml-10">Người nhận:</p>
        <p class="text-sm font-semibold">[Ký và ghi rõ họ tên]</p>
      </div>
    </div>
    <p class="text-center text-xs text-gray-600 mt-20">
      Cảm ơn bạn đã thanh toán!
    </p>
  </div>
</template>

<script>
import BAdd from "../../../components/buttons/Add.vue";
import BEdit from "../../../components/buttons/Edit.vue";
import BDelete from "../../../components/buttons/Delete.vue";
import BCancel from "../../../components/buttons/Cancel.vue";
import FSelect from "../../../components/forms/Select.vue";
import FSearch from "../../../components/forms/Search.vue";
import Table from "../../../components/Table.vue";
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
import {
  formatDate,
  formatCurrencyVND,
  convertChunk,
} from "../../../assets/js/imports";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import "jspdf-autotable";
import pdfReceipt from "../../print/receipt.vue";

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
    pdfReceipt,
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
      activePrint: false,
    };
  },
  watch: {
    print() {
      if (print) {
        this.$router.push({ name: "Receipt.print", params: { id: this.id } });
      }
    },
  },
  computed: {
    getDateNow() {
      let date = new Date();

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return "ngày " + day + " tháng " + month + " năm " + year;
    },
  },
  methods: {
    async get() {
      try {
        this.item = await Receipt.get(this.id);
        this.item = [this.item];
        this.item = this.item.map((value, index) => {
          return {
            _id: value._id,
            name: value.child.name,
            gender: value.child.gender == "true" ? "nam" : "nữ",
            birthday: formatDate(value.child.birthday),
            address: value.child.address,
            class: value.classes.name,
            schoolYear: value.classes.schoolYear.name,
            schoolYearId: value.classes.schoolYear._id,
            status: value.status,
            total: formatCurrencyVND(value.total),
            total_letter: convertChunk(parseInt(value.total)),
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

    async exportToPDF() {
      this.$refs.pdfContent.classList.remove("show");

      // Sử dụng Vue's nextTick để đảm bảo việc hiển thị đã hoàn thành
      this.$nextTick(() => {
        html2pdf(this.$refs.pdfContent, {
          margin: 10,
          filename: "i-was-html.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        });

        // Đặt thời gian chờ nhỏ trước khi thêm class để đảm bảo nó được thêm sau khi export
        setTimeout(() => {
          this.$refs.pdfContent.classList.add("show");
        }, 100);
      });
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
            money: formatCurrencyVND(value.money),
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

<style scoped>
.show {
  display: none;
}
</style>
