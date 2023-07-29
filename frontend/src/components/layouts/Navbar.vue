<template>
  <div class="flex flex-row items-center justify-between">
    <div class="space-x-4">
      <span class="text-green-500 text-xl ml-2 uppercase tracking-widest"
        >Nursery</span
      >
      <span class="text-yellow-500 text-xl ml-2 uppercase tracking-widest"
        >Management</span
      >
      <span class="text-red-500 text-xl ml-2 uppercase tracking-widest"
        >System</span
      >
    </div>
    <!-- <div class="flex-1 relative ml-10">
      <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <ISearch class="text-slate-300 cursor-pointer"/>
      </span>
      <input type="search" name="search" id="search" placeholder="Search for anything..."
        class="bg-inherit rounded-md py-2 pl-9 pr-3 w-full border border-solid border-slate-600 text-slate-300 placeholder:italic placeholder:text-sm placeholder:text-slate-400 block focus:rounded-md shadow-sm focus:outline-none" />
    </div> -->

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
        <!-- dropdown -->
        <!-- <div class="absolute h-auto top-16 bg-white right-72 mr-5 rounded-sm">
          a
        </div> -->
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
      <!-- dropdown -->
      <!-- <div v-if="usersToggle" class="absolute border border-slate-300 border-solid h-auto w-40 top-16 mt-5 bg-slate-800 right-0 mr-2 shadow-lg rounded-sm"
        role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
        <div class="border border-solid border-slate-300 border-t-0 border-r-0 border-l-0">
          <a class="group flex items-center p-2 text-white hover:bg-violet-500 text-sm hover:text-white">
            <span class="material-symbols-outlined text-violet-500 group-hover:text-white mr-4 text-xl"> person </span>
            <span>Profile</span>
          </a>
          <a class="group flex items-center p-2 text-white hover:bg-violet-500 text-sm hover:text-white">
            <span class="material-symbols-outlined text-violet-500 group-hover:text-white mr-4 text-xl">
              forward_to_inbox </span>
            <span>Inbox</span>
          </a>
          <a class="group flex items-center p-2 text-white hover:bg-violet-500 text-sm hover:text-white">
            <span class="material-symbols-outlined text-violet-500 group-hover:text-white mr-4 text-xl"> task </span>
            <span>Task</span>
          </a>
          <a class="group flex items-center p-2 text-white hover:bg-violet-500 text-sm hover:text-white">
            <span class="material-symbols-outlined text-violet-500 group-hover:text-white mr-4 text-xl"> chat </span>
            <span>Chat</span>
          </a>
        </div>
        <a class="group flex items-center p-2 text-white hover:bg-violet-500 text-sm hover:text-white">
          <span class="material-symbols-outlined text-violet-500 group-hover:text-white mr-4 text-xl"> logout </span>
          <span @click="logout()">Logout</span>
        </a>
      </div> -->
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
    }
  },
};
</script>

<style scoped></style>
