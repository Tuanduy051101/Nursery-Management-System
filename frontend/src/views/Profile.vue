<template>
  <!-- <div class="border border-solid border-slate-600 rounded-md mx-5 mt-5">
    <NavbarScreen @logout="(value) => logout(value)" />
  </div> -->
  <div
    v-if="checked"
    class="border border-solid border-slate-600 rounded-md my-5"
  >
    <!-- class detail -->
    <div class="flex justify-center mb-5">
      <div class="px-5 py-5">
        <!-- title -->
        <p class="text-slate-300 text-lg text-center">
          <span
            class="border border-solid px-32 py-1 border-slate-600 rounded-md"
            >Profile</span
          >
        </p>
        <div class="flex text-slate-300 mt-10">
          <div
            class="flex mx-5 border border-solid border-t-0 border-b-0 border-l-0 border-slate-600"
          >
            <div class="flex flex-col mr-5">
              <span>Teacher:</span>
              <span>Gender:</span>
              <span>Phone:</span>
              <span>Email:</span>
              <span>Position:</span>
              <span>Address:</span>
            </div>
            <div v-if="checked" class="flex flex-col mr-10">
              <span>{{ teacher[0].name }}</span>
              <span>{{ teacher[0].gender ? "Male" : "Female" }}</span>
              <span>{{ teacher[0].phone }}</span>
              <span>{{ teacher[0].email }}</span>
              <span>{{ teacher[0].positionName }}</span>
              <span>{{ teacher[0].address }}</span>
              <p @click="editTeacher = true" class="cursor-pointer mt-5">
                <span
                  class="border border-solid px-4 py-1 rounded-md border-yellow-600 text-slate-600 hover:border-yellow-300 hover:text-slate-300"
                  >Edit</span
                >
              </p>
            </div>
          </div>
          <div class="flex">
            <div class="flex flex-col mr-5">
              <!-- <span>Diploma:</span> -->
            </div>
            <div class="flex flex-col">
              <!-- <span v-for="(value, index) in teacher[0].diploma">{{
                value.name
              }}</span> -->
              <div class="flex">
                <p @click="addDiploma1 = true" class="cursor-pointer mt-5">
                  <span
                    class="border border-solid px-4 py-1 rounded-md border-green-600 text-slate-600 hover:border-green-300 hover:text-slate-300"
                    >Add Diploma</span
                  >
                </p>
                <!-- <p class="cursor-pointer mt-5">
                  <span
                    class="border border-solid px-4 py-1 rounded-md border-yellow-600 text-slate-600 hover:border-yellow-300 hover:text-slate-300"
                    >Edit</span
                  >
                </p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TableDelete
      :items="teacher[0].diploma"
      :fields="['Diploma']"
      :labels="['name']"
      @deleteItem="(value) => deleteDiploma(value)"
    />
  </div>
  <!-- <div class="border border-solid border-slate-600 rounded-md mx-5">
    <Footer />
  </div> -->
  <FormAddDiploma
    v-if="addDiploma1"
    :title="`Add diploma for teacher`"
    :item="itemAdd"
    @cancel="(value, value1) => ((addDiploma1 = value), (itemAdd.diploma = ''))"
    @submit="addDiploma()"
  />
  <FormEditTeacher
    v-if="editTeacher"
    :title="`Edit teacher information`"
    :item="item"
    @cancel="(value) => (editTeacher = value)"
    @submit="update()"
  />
</template>

<script>
import NavbarScreen from "../components/layouts/Navbar.vue";
import Footer from "../components/layouts/Footer.vue";
import Teacher from "../services/teacher.service";
import TableDelete from "../components/TableDelete.vue";
import FormAddDiploma from "../components/forms/FormAddDiploma.vue";
import FormEditTeacher from "../components/forms/FormEditTeacher.vue";
import Swal from "sweetalert2";

export default {
  components: {
    NavbarScreen,
    Footer,
    TableDelete,
    FormAddDiploma,
    FormEditTeacher
  },
  data() {
    return {
      teacher: [],
      checked: false,
      editTeacher: false,
      addDiploma1: false,
      itemAdd: {
        _id: this.id,
        diploma: "",
        other: "",
      },
    };
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
        this.teacher = this.teacher.map((value, index) => {
          return {
            _id: value._id,
            name: value.name,
            gender: value.gender,
            phone: value.phone,
            email: value.email,
            address: value.address,
            position: value.position._id,
            positionName: value.position.name,
            assignment: value.assignment,
            diploma: value.diploma,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    async deleteDiploma(value) {
      try {
        const diploma = await Teacher.deleteDiploma(this.id, {
          diploma: value,
        });

        if (diploma.error == false) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successfull deleted",
            icon: "success",
            timer: 2000,
          });
          this.addDiploma1 = false;
          await this.getAllTeacher();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async addDiploma() {
      try {
        if (this.itemAdd.diploma.length > 0) {
          const diploma = await Teacher.addDiploma(this.id, {
            diploma: this.itemAdd.diploma,
          });
          if (diploma.error == false) {
            Swal.fire({
              background: this.background,
              color: "white",
              text: "Successfull add",
              icon: "success",
              timer: 2000,
            });
            await this.getAll();
          }
        }
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
