<template>
  <table
    class="border-collapse w-full"
    :class="mode == 0 || mode == `auto` ? 'table-auto' : 'table-fixed'"
  >
    <thead>
      <tr
        class="text-slate-300 border border-solid border-slate-600 uppercase text-base"
      >
        <th class="p-2"><span class="float-left">#</span></th>
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
        class="text-slate-300 border border-solid border-slate-600 text-base lowercase hover:border-slate-300"
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
          <span
            class="text-green-900 flex justify-center"
            @click="addItem(item._id, item.name)"
            ><span
              class="material-symbols-outlined hover:text-green-500 cursor-pointer flex justify-center border border-solid w-7 rounded-md text-lg"
            >
              add
            </span></span
          >
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
    },
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
    addItem(id, name) {
      this.$emit("addItem", id, name);
    }
  },
};
</script>
