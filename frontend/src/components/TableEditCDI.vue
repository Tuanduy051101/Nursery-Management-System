<template>

    <table
      class="border-collapse w-full"
      :class="mode == 0 || mode == `auto` ? 'table-auto' : 'table-fixed'"
    >
      <thead>
        <tr
          class="text-slate-300 border border-solid border-slate-600 border-l-0 uppercase text-base"
          :class="borderR ? '' : 'border-r-0'"
        >
          <th class="p-2"><span class="float-left"></span></th>
          <th class="p-2 relative" v-for="(field, index) in fields" :key="index">
            <span class="float-left">{{ field }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="text-slate-300 border border-solid border-slate-600 border-l-0 border-r-0 text-base lowercase hover:border-slate-300"
          v-for="(item, index) in items"
          :key="item._id"
        >
          <td class="p-2">
            <input v-if="nameAction == `Add CDI`" type="checkbox" name="" id="" v-model="item.addCDI">
            <input v-if="nameAction == `Edit CDI`" type="checkbox" name="" id="" v-model="item.editCDI">
          </td>
          <td class="p-2">
            <span class="float-left" >{{ item.name }}</span>
          </td>
          <td class="p-2">
            <input v-model="item.height" type="number" name="" id="" class="bg-inherit border border-solid px-2 py-0.5 border-slate-600 focus:border-slate-300"
            :class="item.errors.height.error ? 'border-red-500' : ''"
            >
            <p>{{ item.errors.height.message }}</p>
          </td>
          <td class="p-2">
            <input v-model="item.weight" type="number" name="" id="" class="bg-inherit border border-solid px-2 py-0.5 border-slate-600 focus:border-slate-300" >
          </td>
          <td class="p-2">
            <!-- <input type="text" name="" id="" class="bg-inherit border border-solid px-2 py-0.5 border-slate-600 focus:border-slate-300"> -->
            <textarea v-model="item.health" rows="1" class="overflow-auto bg-inherit outline-none border border-solid px-2 py-0.5 border-slate-600 focus:border-slate-300 flex items-center" ></textarea>
          </td>
          <td class="p-2">
            <input v-model="item.roses" type="number" name="" id="" class="bg-inherit border border-solid px-2 py-0.5 border-slate-600 focus:border-slate-300" >
          </td>
        </tr>
        <tr v-if="items.length != 0" class="" >
            <td :colspan="colSpan" class="text-center pt-8 text-slate-300"><span @click="addItem" class="border border-solid border-yellow-600 hover:border-yellow-300 px-5 py-2 rounded-md cursor-pointer text-slate-600 hover:text-slate-300" >{{ nameAction }}</span></td>
        </tr>
      </tbody>
    </table>
    <span v-if="items.length == 0" class="flex justify-center mt-5 text-slate-300"
      >No matching records found</span
    >
  </template>
  
  <script>
  import IDetail from "./icons/Detail.vue";
  import IEdit from "./icons/Edit.vue";
  import IDelete from "./icons/Delete.vue";
  
  export default {
    components: {
      IDetail,
      IEdit,
      IDelete,
    },
    props: {
      items: {
        type: Array,
        default: [],
      },
      fields: {
        type: Array,
        default: ["Name", "Age", "Payment"],
      },
      labels: {
        type: Array,
        default: [],
      },
      actionList: {
        type: Array,
        default: [],
      },
      mode: {
        type: Number,
        default: 0,
      },
      borderR: {
        type: Boolean,
        default: false,
      },
      nameAction: {
        type: String,
        default: '',
        required: true,
      }
    },
    data() {
        return {
            colSpan: this.fields.length + 2,
        }
    },
    emits: ["update:activeAction", "deleteItem", "update:item", "addItem"],
    watch: {
        items() {
            console.log('abcd');
        },

    },
    methods: {
      sliceID(id, index) {
        return id.substring(18, 22).concat(index);
      },
      setGender(name, value) {
        if (name == "gender" && value == true) return "nam";
        else if (name == "gender" && value == false) return "nữ";
        return value;
      },
      updateActiveAction(index) {
        this.$emit("update:activeAction", index);
      },
      deleteItem(id) {
        this.$emit("deleteItem", id);
      },
      updateItem(id) {
        this.$emit("update:item", id);
      },
      addItem(id) {
        // let check = false;
        // for (let value of this.items) {
        //     if (value.height < 10 || value.height > 50) {
        //         value.errors.height.error = true;
        //         value.errors.height.message = '9 < height < 51';
        //     } 
        //     else value.errors.height.error = false;
        // }
        this.$emit("addItem", this.items);
        this.$emit("startAdd", true);
      },
    },
  };
  </script>
  