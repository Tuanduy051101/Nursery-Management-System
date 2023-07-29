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
        <th class="p-2"><span class="float-left">Select</span></th>
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
          <input type="checkbox" name="" id="" v-model="item.selected" />
        </td>
        <td v-for="(label, index) in labels" :key="index" class="p-2">
          <span class="float-left">{{ setGender(label, item[label]) }}</span>
        </td>
        <td v-if="item.like == true" class="p-2">
          <span class="material-symbols-outlined text-green-500"> done </span>
        </td>
        <td v-if="item.like == false" class="p-2">
          <span class="material-symbols-outlined text-red-500"> close </span>
        </td>
        <td v-if="item.allergy == true" class="p-2">
          <span class="material-symbols-outlined text-green-500"> done </span>
        </td>
        <td v-if="item.allergy == false" class="p-2">
          <span class="material-symbols-outlined text-red-500"> close </span>
        </td>
      </tr>
    </tbody>
  </table>
  <span v-if="items.length == 0" class="flex justify-center my-5 text-slate-300"
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
  },
};
</script>
