<template>
  <div class="border border-solid border-slate-600 rounded-md mx-5 mt-5">
    <NavbarScreen @logout="(value) => logout(value)" />
  </div>
  <div v-if="checked" class="my-5 mx-5">
    <ChildrenView :id="children[0]._id" />
  </div>
  <div class="border border-solid border-slate-600 rounded-md mx-5">
    <Footer />
  </div>
</template>

<script>
import NavbarScreen from "../../../components/layouts/Navbar.vue";
import Footer from "../../../components/layouts/Footer.vue";
import Children from "../../../services/children.service";
import ChildrenView from "../../../views/children/view.vue";
export default {
  components: {
    NavbarScreen,
    Footer,
    ChildrenView
  },
  data() {
    return {
      children: [],
      checked: false,
    };
  },
  methods: {
    async getAllChildren() {
      try {
        this.children = await Children.getAll();
        this.children = this.children.filter((value, index) => {
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
    }
  },
  async mounted() {
    this.getAllChildren();
  },
};
</script>
