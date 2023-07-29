<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    style="
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    "
  >
    <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-white mx-5 overflow-auto absolute shadow-xl border border-solid border-slate-300"
      style="height: 20.99cm; width: 29.7cm"
    >
      <div class="flex justify-between items-center mx-10">
        <img
          src="../../assets/images/logo.png"
          alt=""
          style="width: 150px"
          class=""
        />
        <span
          class="text-2xl font-bold"
          style="
            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman',
              serif;
          "
          >Biên Lai Thu Học Phí</span
        >
        <div class="flex flex-col">
          <span
            style="
              font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman',
                serif;
            "
            >Mẫu số: 012345/001</span
          >
          <span
            style="
              font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman',
                serif;
            "
            >Ký hiệu: VA/12A</span
          >
          <span
            style="
              font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman',
                serif;
            "
            >Số: 01</span
          >
        </div>
      </div>
      <p class="mx-10">Đơn vị thu tiền: Trường Mầm Non KeyOne</p>
      <div class="flex justify-between mx-10">
        <div class="flex flex-col">
          <p class="py-2">Họ tên trẻ: {{ receipt.child.name }}</p>
          <p class="py-2">
            Giới tính: {{ receipt.child.gender ? "Nam" : "Nữ" }}
          </p>
          <p class="py-2">Ngày sinh: {{ receipt.child.birthday }}</p>
          <p class="py-2">Tổng số tiền: {{ formatMoney(receipt.total) }}</p>
        </div>
        <div class="flex flex-col">
          <p class="py-2">Địa chỉ: {{ receipt.child.address }}</p>
          <p class="py-2">Lớp: {{ receipt.classes.name }}</p>
          <p class="py-2">Năm học: {{ receipt.classes.schoolYear.name }}</p>
          <p class="py-2">Số tiền bằng chữ: {{ money }}</p>
        </div>
      </div>
      <div class="mx-10 mt-5">
        <table class="border-collapse w-full table-auto">
          <thead>
            <tr class="border border-solid border-slate-600 uppercase text-base font-bold">
              <th class=""><span class="float-left py-2 px-3">STT</span></th>
              <th class=""><span class="float-left">Khoản Thu</span></th>
              <th class=""><span class="float-left">Mức Thu</span></th>
            </tr>
          </thead>
          <tbody>
            <tr class="border border-solid border-slate-600 uppercase text-base" v-for="(value, index) in collectionRates">
              <td><span class="float-left py-2 px-3">{{ index+1 }}</span></td>
              <td><span>{{ value.tuition }}</span></td>
              <td>{{ value.money }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="flex justify-end mx-10 mt-5">ngày {{ date }} tháng {{ month }} năm {{ year }}</p>
      <div class="mt-5 flex justify-between mx-10">
        <div class="flex flex-col items-center">
          <span class="pb-2">Người nộp tiền</span>
          <span>(Ký và ghi rõ họ tên)</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="pb-2">Người nhận tiền</span>
          <span>(Ký và ghi rõ họ tên)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Receipt from "../../services/receipt.service";
import CollectionRates from "../../services/collectionRates.service";
import { FormatMoney } from "format-money-js";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      receipt: {},
      money: "",
      collectionRates: [],
      date: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };
  },
  methods: {
    formatDate(value) {
      let date = new Date(value);

      let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

      return date + "-" + month + "-" + year;
    },
    formatMoney(money) {
      const fm = new FormatMoney({
        decimals: 0,
        append: true,
      });

      const temp = fm.from(money, { symbol: " vnđ" });

      return temp;
    },
    async get() {
      try {
        this.receipt = await Receipt.get(this.id);
      } catch (error) {
        console.log(error);
      }
    },
    a() {
      var ChuSo = new Array(
        " không ",
        " một ",
        " hai ",
        " ba ",
        " bốn ",
        " năm ",
        " sáu ",
        " bảy ",
        " tám ",
        " chín "
      );
      var Tien = new Array(
        "",
        " nghìn",
        " triệu",
        " tỷ",
        " nghìn tỷ",
        " triệu tỷ"
      );
      function DocSo3ChuSo(baso) {
        var tram;
        var chuc;
        var donvi;
        var KetQua = "";
        tram = parseInt(baso / 100);
        chuc = parseInt((baso % 100) / 10);
        donvi = baso % 10;
        if (tram == 0 && chuc == 0 && donvi == 0) return "";
        if (tram != 0) {
          KetQua += ChuSo[tram] + " trăm ";
          if (chuc == 0 && donvi != 0) KetQua += " linh ";
        }
        if (chuc != 0 && chuc != 1) {
          KetQua += ChuSo[chuc] + " mươi";
          if (chuc == 0 && donvi != 0) KetQua = KetQua + " linh ";
        }
        if (chuc == 1) KetQua += " mười ";
        switch (donvi) {
          case 1:
            if (chuc != 0 && chuc != 1) {
              KetQua += " mốt ";
            } else {
              KetQua += ChuSo[donvi];
            }
            break;
          case 5:
            if (chuc == 0) {
              KetQua += ChuSo[donvi];
            } else {
              KetQua += " lăm ";
            }
            break;
          default:
            if (donvi != 0) {
              KetQua += ChuSo[donvi];
            }
            break;
        }
        return KetQua;
      }
      function DocTienBangChu(SoTien) {
        var lan = 0;
        var i = 0;
        var so = 0;
        var KetQua = "";
        var tmp = "";
        var ViTri = new Array();
        if (SoTien < 0) return "Số tiền âm !";
        if (SoTien == 0) return "Không đồng !";
        if (SoTien > 0) {
          so = SoTien;
        } else {
          so = -SoTien;
        }
        if (SoTien > 8999999999999999) {
          //SoTien = 0;
          return "Số quá lớn!";
        }
        ViTri[5] = Math.floor(so / 1000000000000000);
        if (isNaN(ViTri[5])) ViTri[5] = "0";
        so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
        ViTri[4] = Math.floor(so / 1000000000000);
        if (isNaN(ViTri[4])) ViTri[4] = "0";
        so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
        ViTri[3] = Math.floor(so / 1000000000);
        if (isNaN(ViTri[3])) ViTri[3] = "0";
        so = so - parseFloat(ViTri[3].toString()) * 1000000000;
        ViTri[2] = parseInt(so / 1000000);
        if (isNaN(ViTri[2])) ViTri[2] = "0";
        ViTri[1] = parseInt((so % 1000000) / 1000);
        if (isNaN(ViTri[1])) ViTri[1] = "0";
        ViTri[0] = parseInt(so % 1000);
        if (isNaN(ViTri[0])) ViTri[0] = "0";
        if (ViTri[5] > 0) {
          lan = 5;
        } else if (ViTri[4] > 0) {
          lan = 4;
        } else if (ViTri[3] > 0) {
          lan = 3;
        } else if (ViTri[2] > 0) {
          lan = 2;
        } else if (ViTri[1] > 0) {
          lan = 1;
        } else {
          lan = 0;
        }
        for (i = lan; i >= 0; i--) {
          tmp = DocSo3ChuSo(ViTri[i]);
          KetQua += tmp;
          if (ViTri[i] > 0) KetQua += Tien[i];
          if (i > 0 && tmp.length > 0) KetQua += ","; //&& (!string.IsNullOrEmpty(tmp))
        }
        if (KetQua.substring(KetQua.length - 1) == ",") {
          KetQua = KetQua.substring(0, KetQua.length - 1);
        }
        KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
        return KetQua; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
      }
      this.money = DocTienBangChu(this.receipt.total);
    },

    async getAllCollectionRate() {
      try {
        this.collectionRates = await CollectionRates.getAll();
        this.collectionRates = this.collectionRates.filter((value, index) => {
          return (
            value.grade._id == this.receipt.classes.grade &&
            value.schoolYear._id == this.receipt.classes.schoolYear._id
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
  },
  async created() {
    await this.get();
    await this.a();
    await this.getAllCollectionRate();
  },
};
</script>
