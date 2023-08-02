<template>
  <div class="flex flex-row items-center justify-between">
    <div class="space-x-4">
      <span class="text-green-500 text-xl ml-2 uppercase tracking-widest logo"
        >Nursery</span
      >
      <span class="text-yellow-500 text-xl ml-2 uppercase tracking-widest logo"
        >Management</span
      >
      <span class="text-red-500 text-xl ml-2 uppercase tracking-widest logo"
        >System</span
      >
    </div>

    <div class="flex">
      <div class="mx-10 mt-1.5">
        <!-- task -->
        <div class="flex justify-end items-center -space-x-2.5">
          <a class="flex items-center group border rounded-sm">
            <span
              class="material-symbols-outlined group-hover:text-white text-slate-300 cursor-pointer"
            >
              notifications
            </span>
          </a>
          <div
            class="bg-red-900 rounded-full shadow-xl text-slate-300 mb-6 px-2 pt-0.5"
          >
            0
          </div>
        </div>
      </div>
      <!-- user -->
      <div
        @click="showUsers"
        class="group flex justify-end items-center overflow-hidden my-1 cursor-pointer"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
      >
        <img
          class="shrink-0 h-12 w-12 rounded-full border border-solid border-slate-600"
          src="https://cdn.pixabay.com/photo/2022/05/15/13/38/woman-7198072__340.jpg"
          alt=""
        />
        <div class="ml-3 mr-2" @click="showProfile()">
          <p class="text-base font-medium text-slate-300">{{ userName }}</p>
          <p class="text-xs font-medium text-white group-hover:italic">
            {{ role }}
          </p>
        </div>
        <div class="flex ml-5 mr-2">
          <span
            @click="logout()"
            class="material-symbols-outlined text-slate-600 hover:text-slate-300 cursor-pointer"
          >
            logout
          </span>
          <!-- <span>Logout</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ISearch from "../icons/Search.vue";
export default {
  components: {
    ISearch,
  },
  data() {
    return {
      usersToggle: false,
      onSearch: false,
      userName: sessionStorage.getItem("userName"),
      role: sessionStorage.getItem("role"),
    };
  },
  methods: {
    showUsers() {
      this.usersToggle = !this.usersToggle;
    },
    logout() {
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("role");
      this.$emit("logout", false);
      // this.$router.push({
      //   name: "Signin",
      // });
    },
    showProfile() {
      this.$emit("showProfile", true);
    },
  },
};
</script>

<style scoped></style>
