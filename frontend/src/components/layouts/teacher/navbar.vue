<template>
  <div class="flex flex-row items-center justify-between">
    <div class="flex items-center mt-2">
      <img
        src="../../../assets/images/logo.png"
        alt=""
        style="width: 60px"
        class="ml-5"
      />
      <div class="flex space-x-8 mx-5 items-center text-slate-900 text-lg">
        <div class="space-x-4">
          <span class="text-3xl ml-2 font-extrabold">
            <span
              class="text-yellow-600"
              style="text-shadow: 2px 2px 4px rgba(210, 225, 5, 0.5)"
              >Hệ Thống&ensp;</span
            >
            <span
              class="text-blue-500"
              style="text-shadow: 2px 2px 4px rgba(11, 4, 234, 0.5)"
              >Quản Lý Nhà Trẻ</span
            >
          </span>
        </div>
      </div>
    </div>

    <div class="flex">
      <div class="mx-10 mt-1.5">
        <div class="flex justify-end items-center -space-x-2.5">
          <!-- Thêm một nút hoặc biểu tượng để mở thông báo -->
          <a
            class="flex items-center group border rounded-sm cursor-pointer"
            @click="toggleNotifications"
          >
            <span
              class="material-symbols-outlined group-hover:bg-gray-200 group-hover:border-gray-200 rounded-full text-slate-900 cursor-pointer"
              >notifications</span
            >
          </a>
          <div
            class="bg-red-400 rounded-full text-white mb-6 flex justify-center items-center pt-1"
            style="height: 20px; width: 20px"
          >
            <span>{{ unreadNotificationCount }}</span>
          </div>
        </div>
      </div>
      <!-- user -->
      <div class="group relative">
        <div
          class="group flex justify-end items-center overflow-hidden my-1 cursor-pointer"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          @click="showAdvanced = !showAdvanced"
        >
          <!-- <img class="shrink-0 h-12 w-12 rounded-full border border-solid border-slate-600" src="https://cdn.pixabay.com/photo/2022/05/15/13/38/woman-7198072__340.jpg" alt="avatar" /> -->
          <div
            class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold"
          >
            {{ getFirstLetter(username) }}
          </div>
          <div class="ml-3 mr-2">
            <p class="text-base font-medium text-slate-900">
              {{ capitalizeEveryWord(username) }}
            </p>
            <p class="text-xs font-medium text-slate-900">
              {{ capitalizeEveryWord(role) }}
            </p>
          </div>
        </div>
        <ul
          v-if="showAdvanced"
          class="w-40 absolute right-0 mt-2 py-2 bg-white border border-solid border-slate-300 rounded-md shadow-lg z-10"
        >
          <li class="px-4 hover-bg-gray-100 cursor-pointer">
            <span class="text-sm hover:text-yellow-500">Đổi mật khẩu</span>
          </li>
          <li class="px-4 hover-bg-gray-100 cursor-pointer" @click="logout">
            <span class="text-sm hover:text-yellow-500">Đăng xuất</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Hiển thị thông báo -->
  <div
    v-if="showNotifications"
    class="absolute top-16 right-0 w-64 mt-5 mr-5 bg-white border border-solid border-slate-300 rounded-md shadow-lg z-10"
  >
    <div class="flex justify-between items-center mb-3 pt-4 mx-4">
      <span class="text-xl font-semibold">Thông Báo</span>
      <span class="material-symbols-outlined"> drafts </span>
    </div>
    <!-- Duyệt qua danh sách thông báo (tối đa 5 thông báo mới nhất) -->
    <div class="overflow-auto" style="max-height: 350px">
      <div v-for="(notification, index) in notifications" :key="index">
        <div
          class="border border-solid border-slate-300 hover:bg-gray-200 border-l-0 border-r-0 p-4 cursor-pointer"
          :class="[index != notifications.length - 1 ? 'border-b-0' : '']"
        >
          <div
            class="flex group"
            @click="
              async () => {
                activeView = true;
                item = notification.notification;
                await update(notification.notification._id);
              }
            "
          >
            <div class="">
              <div class="flex items-center mb-2">
                <!-- Sử dụng biểu tượng thư trong ví dụ -->
                <span class="font-semibold">{{
                  capitalizeEveryWord(notification.notification.title)
                }}</span>
              </div>
              <div
                class="text-sm text-gray-600"
                style="
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                "
              >
                {{ capitalizeOneWord(notification.notification.content) }}
              </div>

              <div class="text-xs mt-3 text-blue-600">
                {{ formatDate1(notification.notification.dateSent) }}
              </div>
            </div>
            <div
              class="flex mt-0.5"
              v-if="notification.notification.status == 'đã gửi'"
            >
              <span
                class="w-3 h-3 border border-solid rounded-full border-yellow-500 shadow-lg bg-yellow-500 transition-transform transform group-hover:scale-125"
              >
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="flex justify-center">
      <button class="text-blue-500 text-md py-4" @click="viewAllNotifications">
        Xem tất cả
      </button>
    </div> -->
  </div>

  <NotificationDetail
    v-if="activeView"
    :item="item"
    :title="`Thông báo chi tiết`"
    @cancel="
      (value) => {
        activeView = value;
      }
    "
    @submit="create()"
  />
</template>

<script>
import {
  // service
  Account,
  Assignment,
  Attendance,
  CDI,
  Children,
  Classes,
  CollectionRates,
  Diploma,
  Dish,
  Duty,
  Evaluate,
  Foodstuff,
  Grade,
  Ingredient,
  Meal,
  MealTicket,
  Month,
  Parents,
  ParentDetails,
  Payment,
  PaymentDetail,
  Position,
  Receipt,
  SchoolYear,
  Teacher,
  TuitionFees,
  Notification,
  // vue composition
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  onUnmounted,
  watchEffect,
  provide,
  inject,
  onBeforeMount,
  // vue router
  useRoute,
  useRouter,
  // vee-validate
  Form,
  Field,
  ErrorMessage,
  yup,
  // alert
  alert_error,
  alert_warning,
  alert_success,
  run_alert,
  http_getAll,
  http_update,
  formatDate,
} from "../../../assets/js/imports";
import NotificationDetail from "../../forms/NotificationDetail.vue";
export default {
  data() {
    return {
      username: sessionStorage.getItem("owner_name"),
      role: sessionStorage.getItem("role"),
      activeMenu: sessionStorage.getItem("activeIndex") || 1,
      menus: [
        {
          _id: 1,
          name: "Classroom",
          router: "ClassRoom-teacher",
          nameUse: "Lớp học",
        },
      ],
      showNotifications: false,
      showAdvanced: false,
      notifications: [],
      activeView: false,
      item: {},
    };
  },
  components: {
    NotificationDetail,
  },
  computed: {
    // Số lượng thông báo chưa đọc
    unreadNotificationCount() {
      console.log("x", this.notifications);
      return this.notifications.filter(
        (notification) => notification.notification.status == "đã gửi"
      ).length;
    },
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      run_alert(alert_success(`Logout successful.`));
      this.$router.push({ name: "Login" });
    },
    formatDate1(value) {
      return formatDate(value);
    },
    capitalizeEveryWord(str) {
      return str
        .split(" ")
        .map((i) => i.replace(/\b\w/, (match) => match.toUpperCase()))
        .join(" ");
    },
    capitalizeOneWord(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    getFirstLetter(name) {
      const lastName = name.trim().split(" ").pop();
      return lastName ? lastName.charAt(0).toUpperCase() : "";
    },
    sessionStorageactiveIndex(value) {
      sessionStorage.setItem("activeIndex", value.toString());
    },
    sessionStorageactiveIndexChild(value) {
      sessionStorage.setItem("activeIndexChild", value.toString());
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    // Đánh dấu tất cả các thông báo là đã đọc
    markAllNotificationsAsRead() {
      this.notifications.forEach(
        (notification) => (notification.unread = false)
      );
    },
    // Xem tất cả thông báo
    viewAllNotifications() {
      this.showNotifications = true;
      this.markAllNotificationsAsRead();
    },

    async update(_id) {
      await http_update(Notification, _id, {});
      await this.refresh();
    },

    async refresh() {
      this.notifications = await http_getAll(Notification);
      this.notifications = this.notifications.map((i) => ({
        notification: i._doc,
        recipientInfo: i.recipientInfo,
      }));
      this.notifications = this.notifications.reverse();
    },
  },

  async created() {
    await this.refresh();
  },
};
</script>

<style scoped>
/* Your custom styles go here */
.avatar {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: calc(var(--size) / 2.5);
  color: #ffffff;
}

.initial {
  text-transform: uppercase;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
