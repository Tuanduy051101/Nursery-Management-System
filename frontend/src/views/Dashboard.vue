<template>
  <div class="">
    <div
      v-if="role == 'ban giám hiệu' || role == 'quản trị hệ thống'"
      class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 mb-5"
    >
      <div
        class="bg-inherit relative flex justify-between p-6 rounded-lg border border-solid border-slate-300"
      >
        <div class="">
          <h3 class="text-lg font-semibold mb-2 text-slate-900">Tổng số trẻ</h3>
          <p class="text-3xl font-bold text-slate-900">{{ totalChildren }}</p>
        </div>
        <div ref="selectRef1" class="flex text-slate-900" v-if="isToken">
          <span
            @click="activeChooseChildren = true"
            class="material-symbols-outlined cursor-pointer group"
          >
            unfold_more
          </span>
          <div
            v-if="activeChooseChildren"
            class="absolute left-0 top-0 ml-44 border border-solid w-28 mt-10 bg-white border-slate-300 rounded-md shadow-lg"
          >
            <ul>
              <li
                v-for="(value, index) in childrenList"
                @click="
                  () => {
                    childrenValue = value.name;
                    refresh(value._id);
                  }
                "
                class="ml-5 mt-1.5 cursor-pointer hover:text-green-500"
                :class="[
                  childrenValue == value.name ? 'text-green-500' : 'text-black',
                ]"
              >
                {{ value.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        class="bg-inherit relative flex justify-between p-6 rounded-lg border border-solid border-slate-300"
      >
        <div class="">
          <h3 class="text-lg font-semibold mb-2 text-slate-900">
            Tổng số giáo viên
          </h3>
          <p class="text-3xl font-bold text-slate-900">{{ totalTeachers }}</p>
        </div>
      </div>
      <div
        class="bg-inherit relative flex justify-between p-6 rounded-lg border border-solid border-slate-300"
      >
        <div class="">
          <h3 class="text-lg font-semibold mb-2 text-slate-900">Tổng số lớp</h3>
          <p class="text-3xl font-bold text-slate-900">{{ totalClasses }}</p>
        </div>
        <div ref="selectRef" class="flex text-slate-900" v-if="isToken">
          <span
            @click="activeChooseYear = true"
            class="material-symbols-outlined cursor-pointer group"
          >
            unfold_more
          </span>
          <div
            v-if="activeChooseYear"
            class="absolute left-0 top-0 ml-44 border border-solid w-28 mt-10 bg-white border-slate-300 rounded-md shadow-lg"
          >
            <ul>
              <li
                v-for="(value, index) in sYearList"
                @click="sYearValue = value.name"
                class="ml-5 mt-1.5 cursor-pointer hover:text-green-500"
                :class="[
                  sYearValue == value.name ? 'text-green-500' : 'text-black',
                ]"
              >
                {{ value.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <div
      class="bg-inherit border border-solid border-slate-300 py-5 rounded-lg mb-5 px-6"
    >
      <div class="flex justify-between">
        <h3 class="text-lg text-slate-900 font-semibold mb-4">Điểm danh</h3>
        <span
          class="material-symbols-outlined text-slate-900 font-bold cursor-pointer"
        >
          more_vert
        </span>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 mb-5">
        <div
          class="bg-inherit p-6 rounded-lg border border-solid border-slate-300 cursor-pointer -mr-3"
        >
          <h3 class="text-lg font-semibold text-slate-900 mb-2">
            Tổng số trẻ có mặt
          </h3>
          <p class="text-3xl font-bold text-slate-900">{{ totalChildren }}</p>
        </div>
        <div
          class="bg-inherit p-6 rounded-lg border border-solid border-slate-300 -mr-3"
        >
          <h3 class="text-lg font-semibold mb-2 text-slate-900">
            Tổng số trẻ vắng mặt (không phép)
          </h3>
          <p class="text-3xl font-bold text-slate-900">{{ totalTeachers }}</p>
        </div>
        <div
          class="bg-inherit relative flex justify-between p-6 rounded-lg border border-solid border-slate-300"
        >
          <div class="">
            <h3 class="text-lg font-semibold mb-2 text-slate-900">
              Tổng số trẻ vắng mặt (có phép)
            </h3>
            <p class="text-3xl font-bold text-slate-900">{{ totalClasses }}</p>
          </div>
        </div>
      </div>
    </div> -->
    <DashboardCDI
      v-if="role == 'ban giám hiệu' || role == 'quản trị hệ thống'"
    />
    <DashboardChildren />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted, watch } from "vue";
import DashboardChildren from "../views/Dashboard/children.vue";
import DashboardCDI from "../views/Dashboard/cdi.vue";
import {
  http_getAll,
  Children,
  Teacher,
  Classes,
  SchoolYear,
  ChildcareCenter,
  Grade,
  FSelect,
  verifyToken,
} from "../assets/js/imports";
import {
  schoolYearList,
  schoolYearValue,
  const_sy,
  gradeList,
  const_gr,
  gradeValue,
  classList,
  classValue,
  const_cl,
} from "../components/common";
import axios from "axios";
const totalChildren = ref(0);
const totalTeachers = ref(0);
const totalClasses = ref(0);
const activeChooseYear = ref(false);
const activeChooseChildren = ref(false);
const activeChooseTeacher = ref(false);
const selectRef = ref(null);
const selectRef1 = ref(null);
const selectRef2 = ref(null);
const sYearValue = ref(null);
const sYearList = ref(null);
const childrenValue = ref(null);
const childrenList = ref(null);
const teacherValue = ref(null);
const teacherList = ref(null);

const role = ref(sessionStorage.getItem("role"));

watch(sYearValue, async (n, o) => {
  totalClasses.value = (await http_getAll(Classes)).filter(
    (item) => item.schoolYear.name == n
  ).length;
});

const apiUrl = "https://provinces.open-api.vn/api/";
const params = { depth: 3 };

// Sử dụng axios để gửi yêu cầu GET
axios
  .get(apiUrl, { params })
  .then((response) => {
    // Xử lý dữ liệu trả về từ API
    console.log("Dữ liệu từ API:", response.data);
  })
  .catch((error) => {
    console.error("Lỗi khi gọi API:", error);
  });

const handleClickOutside = (event) => {
  if (selectRef.value != null) {
    if (!selectRef.value.contains(event.target)) {
      activeChooseYear.value = false;
    }
  }
  if (selectRef1.value != null) {
    if (!selectRef1.value.contains(event.target)) {
      activeChooseChildren.value = false;
    }
  }
  if (selectRef2.value != null) {
    if (!selectRef2.value.contains(event.target)) {
      activeChooseTeacher.value = false;
    }
  }
};

const isToken = ref("");

const refresh = async (childcareCenterId) => {
  totalChildren.value = (await http_getAll(Children)).filter(
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id == childcareCenterId
  ).length;
  totalTeachers.value = (await http_getAll(Teacher)).filter(
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id == childcareCenterId
  ).length;
  totalClasses.value = (await http_getAll(Classes)).filter(
    (i) => i.schoolYear.childcareCenter == childcareCenterId
  ).length;
  sYearList.value = (await http_getAll(SchoolYear)).filter(
    (i) => i.childcareCenter._id == childcareCenterId
  );
  schoolYearList.value = sYearList.value;
  gradeList.value = await http_getAll(Grade);
  gradeValue.value = const_gr.value;
  schoolYearValue.value = const_sy.value;
  classValue.value = const_cl.value;
};

onBeforeMount(async () => {
  isToken.value = await verifyToken();
  const childcareCenter = sessionStorage.getItem("owner_childcareCenter");
  childrenValue.value = sessionStorage.getItem("owner_childcareCenterName");
  totalChildren.value = (await http_getAll(Children)).filter(
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id == childcareCenter
  ).length;
  totalTeachers.value = (await http_getAll(Teacher)).filter(
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id == childcareCenter
  ).length;
  totalClasses.value = (await http_getAll(Classes)).filter(
    (i) => i.schoolYear.childcareCenter == childcareCenter
  ).length;
  sYearList.value = (await http_getAll(SchoolYear)).filter(
    (i) => i.childcareCenter._id == childcareCenter
  );
  schoolYearList.value = sYearList.value;
  gradeList.value = await http_getAll(Grade);
  gradeValue.value = const_gr.value;
  schoolYearValue.value = const_sy.value;
  classValue.value = const_cl.value;
  childrenList.value = await http_getAll(ChildcareCenter);
  teacherList.value = await http_getAll(ChildcareCenter);
});
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
const consoleLog = (value) => {
  console.log(value);
};
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}
.shadow-lg {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}
.text-xl {
  font-size: 1.5rem;
}
.text-3xl {
  font-size: 2.5rem;
}
</style>
