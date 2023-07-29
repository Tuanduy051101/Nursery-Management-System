<template>
  <div v-if="showProfile == false" class="">
    <div class="border border-solid border-slate-600 rounded-md mx-5 mt-5">
    <NavbarScreen
      @logout="(value) => logout(value)"
      @click="showProfile = !showProfile"
    />
  </div>
  <div v-if="checked" class="my-5 mx-5">
    <TeacherView :id="teacher[0]._id" />
  </div>
  <div class="border border-solid border-slate-600 rounded-md mx-5">
    <Footer />
  </div>
  </div>
  <RouterView></RouterView>
</template>

<script>
import NavbarScreen from "../../../components/layouts/Navbar.vue";
import Footer from "../../../components/layouts/Footer.vue";
import Teacher from "../../../services/teacher.service";
import TeacherView from "../../../views/teacher/view.vue";
export default {
  components: {
    NavbarScreen,
    Footer,
    TeacherView,
  },
  data() {
    return {
      teacher: [],
      checked: false,
      showProfile: false,
    };
  },
  watch: {
    showProfile() {
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
        this.teacher = await Teacher.getAll();
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
    logout(value) {
      this.$emit("logout", value);
    },
  },
  async mounted() {
    this.getAllTeacher();
  },
};
</script>
