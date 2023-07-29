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
          >Danh Sách Lớp {{ classes.name }}</span
        >
        <div class="flex flex-col">
          <span
            style="
              font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman',
                serif;
            "
            >Năm học: {{ classes.schoolYear.name }}</span
          >
          <span
            style="
              font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman',
                serif;
            "
            >Giao viên quản lý trẻ: {{ assignment[0].teacher.name }}</span
          >
        </div>
      </div>
      <div class="mx-10 mt-5">
        <table class="border-collapse w-full table-auto">
          <thead>
            <tr
              class="border border-solid border-slate-600 uppercase text-base font-bold"
            >
              <th class=""><span class="float-left py-2 px-3">STT</span></th>
              <th class=""><span class="float-left">Tên</span></th>
              <th class=""><span class="float-left">Giới tính</span></th>
              <!-- <th class=""><span class="float-left">Ngày sinh</span></th> -->
              <th class=""><span class="float-left">Địa chỉ</span></th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border border-solid border-slate-600 text-base"
              v-for="(value, index) in children"
            >
              <td>
                <span class="float-left py-2 px-3">{{ index + 1 }}</span>
              </td>
              <td>
                <span>{{ value.name }}</span>
              </td>
              <td>{{ value.gender ? 'Nam' : 'Nữ' }}</td>
              <!-- <td>{{ value.birthday }}</td> -->
              <td>{{ value.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Receipt from "../../services/receipt.service";
import CollectionRates from "../../services/collectionRates.service";
import Classes from "../../services/classes.service";
import Children from "../../services/children.service";
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
      children: [],
      classes: [],
      assignment: [],
    };
  },
  methods: {
    async getAll() {
      try {
        this.children = await Children.getAll();
        this.children = this.children.filter(
            (value, index) => {
                var check= false;
                for(let value1 of value.classes) {
                    if (value1._id == this.id) {
                        check = true;
                        break;
                    }
                }
                return check == true;
            }
        )
      } catch (error) {
        console.error(error);
      }
    },
    async getClass() {
      try {
        this.classes = await Classes.get(this.id);
        this.classes = this.classes[0];
        this.assignment = this.classes.assignment;
      } catch (error) {
        console.error(error);
      }
    },
  },
  async created() {
    await this.getAll();
    await this.getClass();
  },
};
</script>
