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
          <th v-if="mode == 0 || mode == `auto`" class="w-24">
            <span class="float-right pr-2">Actions</span>
          </th>
          <th v-if="mode == 1" class="p-2">
            <span class="float-right">Actions</span>
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
            <input type="checkbox" name="" id="" v-model="item.addChild">
          </td>
          <td v-for="(label, index) in labels" :key="index" class="p-2">
            <span class="float-left">{{ setGender(label, item[label]) }}</span>
          </td>
          <td class="p-2">
            <router-link
              :to="{ name: actionList[0], params: { id: item._id } }"
              class="text-slate-600 flex justify-center mr-2 float-right"
            >
              <span
                class="material-symbols-outlined hover:text-slate-300 cursor-pointer flex justify-center border border-solid w-7 rounded-md text-lg"
              >
                visibility
              </span>
            </router-link>
          </td>
        </tr>
        <tr v-if="items.length != 0" class="" >
            <td :colspan="colSpan" class="text-center pt-8 text-slate-300"><span @click="addItem" class="border border-solid border-green-900 hover:border-green-500 px-5 py-2 rounded-md cursor-pointer text-slate-600 hover:text-slate-300" >Add Many</span></td>
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
        }
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
        this.$emit("addItem", this.items);
        this.$emit("startAdd", true);
      },
    },
  };
  </script>
  