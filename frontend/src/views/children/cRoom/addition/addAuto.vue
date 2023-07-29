<template>
  <div class="flex-col my-5 mx-5">
    <div class="flex">
      <label for="" class="text-slate-300 flex items-center mr-5"
        >Number of children:</label
      >
      <input
        type="number"
        name=""
        id=""
        placeholder=""
        v-model="numberOfChildren"
        class="flex-1 bg-inherit border border-solid text-slate-300 border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
      />
    </div>
    <div class="flex mt-5">
      <label for="" class="text-slate-300 flex items-center mr-5">Age:</label>
      <FSelect
        class="flex-1 text-md"
        :options="[
          { _id: 0, name: 0 },
          { _id: 1, name: 1 },
          { _id: 2, name: 2 },
          { _id: 3, name: 3 },
          { _id: 4, name: 4 },
          { _id: 5, name: 5 },
          { _id: 6, name: 6 },
          { _id: 7, name: 7 },
        ]"
        :modelValue="` Select age`"
        v-model="ageValue"
      />
    </div>

    <div class="flex mt-5 justify-start">
      <span
        @click="activeAdd = true"
        class="border border-solid px-5 py-2 rounded-md border-green-900 hover:border-green-500 cursor-pointer text-slate-600 hover:text-slate-300"
        >Add Auto</span
      >
    </div>
  </div>
</template>

<script>
import FSelect from "../../../../components/forms/Select.vue";
import Swal from "sweetalert2";
import Classes from "../../../../services/classes.service";
import Children from "../../../../services/children.service";
export default {
  components: {
    FSelect,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ageValue: null,
      numberOfChildren: null,
      activeAdd: false,
      items: [],
      background: "rgb(51 65 85 / var(--tw-bg-opacity))",
    };
  },
  watch: {
    async activeAdd() {
      if (this.activeAdd) {
        if (this.numberOfChildren != null && this.ageValue != null) {
          await this.addChild();
        } else {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Please enter full information.",
            icon: "error",
          });
        }
      }
      this.activeAdd = false;
    },
  },
  methods: {
    async getAll() {
      try {
        this.items = await Children.getAll();
        this.items = this.items.filter((value, index) => {
          let check = false;

          for (var i = 0; i < value.classes.length; i++) {
            if (value.classes[i].schoolYear.name == new Date().getFullYear()) {
              check = true;
              break;
            }
          }
          return check == false;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async addChild() {
      try {
        var check = false;
        for (var i = 0; i < this.numberOfChildren; i++) {
          for (var j = 0; j < this.items.length; j++) {
            if (
              ((new Date().getFullYear()) - (new Date(this.items[j].birthday).getFullYear())) == this.ageValue
            ) {
              await Classes.update(this.id, {
                child: this.items[j]._id,
                object: "addChild",
              });
              await this.getAll();
              break;
            }
          }
          if (i == this.items.length - 1) {
            check = true;
          }
        }
        if (check == true) {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Successful",
            icon: "success",
            timer: 2000,
          });
          this.$router.push({
            name: "ClassRoom.view",
            params: {
              id: this.id,
            },
          });
        } else {
          Swal.fire({
            background: this.background,
            color: "white",
            text: "Invalid number of children !",
            icon: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    await this.getAll();
  },
};
</script>
