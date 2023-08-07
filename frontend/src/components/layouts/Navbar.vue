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
              >notifications</span
            >
          </a>
          <div
            class="bg-red-900 rounded-full shadow-xl text-slate-300 mb-6 px-2 pt-0.5"
          >
            0
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
        >
          <!-- <img class="shrink-0 h-12 w-12 rounded-full border border-solid border-slate-600" src="https://cdn.pixabay.com/photo/2022/05/15/13/38/woman-7198072__340.jpg" alt="avatar" /> -->
          <div
            class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold"
          >
            {{ getFirstLetter(username) }}
          </div>
          <div class="ml-3 mr-2">
            <p class="text-base font-medium text-slate-300">{{ username }}</p>
            <p class="text-xs font-medium text-white">{{ role }}</p>
          </div>
        </div>
        <ul
          class="hidden w-40 absolute right-0 mt-2 py-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 group-hover:block"
        >
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <span class="text-sm">Change password</span>
          </li>
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click="logout"
          >
            <span class="text-sm">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import VueLetterAvatar from "vue-letter-avatar";

export default {
  components: {
    VueLetterAvatar,
  },
  data() {
    return {
      username: sessionStorage.getItem("username"),
      role: sessionStorage.getItem("role"),
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      run_alert(alert_success(`Logout successful.`));
      this.$router.push({ name: "Login" });
    },
    getFirstLetter(name) {
      const lastName = name.trim().split(" ").pop();
      return lastName ? lastName.charAt(0).toUpperCase() : "";
    },
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
</style>
