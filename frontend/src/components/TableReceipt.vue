<template>
    <table class="border-collapse w-full" :class="mode == 0 || mode == `auto` ? 'table-auto' : 'table-fixed' ">
      <thead>
        <tr
          class="text-slate-300 border border-solid border-slate-600 border-l-0 uppercase text-base"
          :class="borderR ? '' : 'border-r-0'"
        >
          <th class="p-2"><span class="float-left">#</span></th>
          <th class="p-2 relative" v-for="(field, index) in fields" :key="index">
            <span class="float-left">{{ field }}</span>
          </th>
          <th v-if="mode == 0 || mode == `auto`" class="w-24"><span class="float-right pr-2">Actions</span></th>
          <th v-if="mode == 1" class="p-2"><span class="float-right">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="text-slate-300 border border-solid border-slate-600 border-l-0 border-r-0 text-base lowercase hover:border-slate-300"
          v-for="(item, index) in items"
          :key="item._id"
        >
          <td class="p-2">
            <router-link
              :to="{ name: actionList[0], params: { id: item._id } }"
              class="float-left text-blue-500"
            >
              #{{ sliceID(item._id, index) }}
            </router-link>
          </td>
          <td v-for="(label, index) in labels" :key="index" class="p-2">
            <span class="float-left">{{ setGender(label, item[label]) }}</span>
          </td>
          <td class="p-2">
            <span v-if="item.status" class="float-left"><span class="bg-green-500 text-green-900 py-0.5 px-2" >Paid</span></span>
            <span v-if="!item.status" class="float-left"><span class="bg-red-500 text-slate-300 py-0.5 px-2" >Unpaid</span></span>
          </td>
          <td class="p-2">
            <router-link
              :to="{ name: actionList[0], params: { id: item._id } }"
              class="pt-2 pl-1 ml-2"
            >
              <IDetail
                class="text-lg text-slate-600 hover:text-slate-300 cursor-pointer"
              />
            </router-link>
  
            <!-- edit -->
            <!-- <router-link
              v-if="actionList.length > 1"
              :to="{ name: actionList[1], params: { id: item._id } }"
              class=""
            >
              <IEdit
                class="text-lg text-yellow-900 hover:text-yellow-300 cursor-pointer float-right pt-2 px-1"
              />
            </router-link>
            <IEdit
              v-else
              @click="updateItem(item._id)"
              class="text-lg text-yellow-900 hover:text-yellow-300 cursor-pointer float-right pt-2 px-1"
            /> -->
  
            <!-- delete -->
            <IDelete
              @click="deleteItem(item._id)"
              class="text-lg text-red-900 hover:text-red-500 cursor-pointer pt-2 px-1 ml-2"
            />
          </td>
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
      }
    },
    emits: ["update:activeAction", "deleteItem", "update:item"],
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
    },
  };
  </script>
  