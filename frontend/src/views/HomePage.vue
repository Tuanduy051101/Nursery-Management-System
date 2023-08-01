<script>
import NavbarScreen from "./components/layouts/Navbar.vue";
import SideBarScreen from "./components/layouts/Sidebar.vue";
import FooterScreen from "./components/layouts/Footer.vue";
import Login from "./views/Login.vue";
import LoginService from "./services/login.service";
import Student from "./views/decentralization/children/index.vue";
import Teacher from "./views/decentralization/teacher/index.vue";
import Accountant from "./views/decentralization/accountant/accountant.vue";
import TeacherService from "./services/teacher.service";

export default {
  components: {
    NavbarScreen,
    SideBarScreen,
    FooterScreen,
    Login,
    Student,
    Teacher,
    Accountant,
  },
  data() {
    return {
      activeIndex: -1,
      activeIndex: -1,
      user: {},
      userList: [],
      checkLogin: false,
      role: null,
      userName: null,
      showProfile: false,
      teacher: [],
      checked: false,
    };
  },
  watch: {
    // checkLogin() {
    //   if (this.checkLogin == false) {
    //     this.$router.push({
    //       name: 'Signin',
    //     });
    //   }
    // }
    showProfile() {
      console.log(this.teacher);
      if (this.showProfile == true) {
        if (this.teacher.length > 0) {
          this.$router.push({
            name: "Profile",
            params: { id: this.teacher[0]._id },
          });
        }
      }
    },
  },
  methods: {
    async getAllTeacher() {
      try {
        this.teacher = await TeacherService.getAll();
        this.teacher = this.teacher.filter((value, index) => {
          if (
            (value.account.name == sessionStorage.getItem("userName")) ==
            true
          ) {
            this.checked = true;
          }
          return value.account.name == sessionStorage.getItem("userName");
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    this.getAllTeacher();
  },
};
</script>

<template>
  <Login
    v-if="!checkLogin"
    @submit="
      (value, value1, value2) => (
        (checkLogin = value), (userName = value1), (role = value2)
      )
    "
  />
  <div
    v-if="checkLogin == true && (role == 'BGH' || role == 'QTHT')"
    class="w-full bg-slate-800"
  >
    <div class="flex flex-row">
      <div class="basis-2/12 relative z-30 mr-5 print:hidden">
        <SideBarScreen v-model:activeIndex="activeIndex" />
      </div>
      <div class="basis-10/12 relative w-11/12">
        <div
          class="bg-slate-800 my-5 mr-5 shadow-md rounded-md z-20 border border-solid border-slate-600 border-0.5 print:hidden"
        >
          <NavbarScreen
            @click="showProfile = !showProfile"
            class=""
            @logout="(value) => (checkLogin = value)"
          />
        </div>
        <div class="mr-5 mt-5">
          <RouterView></RouterView>
        </div>
        <div
          class="mr-5 mt-5 rounded-md border border-solid border-slate-600 print:hidden"
        >
          <FooterScreen />
        </div>
      </div>
    </div>
  </div>
  <Student
    @logout="(value) => (checkLogin = value)"
    v-if="checkLogin == true && role == 'PH'"
  />
  <Teacher
    @logout="(value) => (checkLogin = value)"
    v-if="checkLogin == true && role == 'GVQLT'"
  />
  <Accountant
    @logout="(value) => (checkLogin = value)"
    v-if="checkLogin == true && role == 'KT'"
  />
</template>

<style></style>
