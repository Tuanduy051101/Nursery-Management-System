<template>
  <table class="border-collapse w-full table-auto">
    <thead>
      <tr
        class="text-slate-300 border border-solid border-slate-600 border-l-0 uppercase text-base"
        :class="borderR ? '' : 'border-r-0'"
      >
        <th class="p-2"><span class="float-left">#</span></th>
        <th class="p-2 relative" v-for="(field, index) in fields" :key="index">
          <span class="float-left">{{ field }}</span>
        </th>
        <th class="w-24"><span class="float-right pr-2">Actions</span></th>
        <!-- <th class="p-2"><span class="float-right">Actions</span></th> -->
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
          <!-- <span class="flex flex-col" v-for="(value2, index2) in item.ingredient">
                <span>{{ index2 + 1 }}. {{ value2.foodstuff.name }} <span v-if="value2.amount != 0">({{ value2.amount }})</span></span>
                <span>{{ index2 + 1 }}.1 {{ value2.foodstuff.making }}</span>
                <span>{{ index2 + 1 }}.2 {{ value2.foodstuff.function }}</span>
                <span>{{ index2 + 1 }}.3 {{ value2.foodstuff.note }}</span>
            </span> -->
          <span class="float-left">{{ item.ingredient.length }}</span>
        </td>
        <td class="p-2">
          <span class="float-left">{{ item.note.length > 0 ? item.note : 'empty' }}</span>
        </td>
        <td>
          <router-link
            :to="{ name: actionList[0], params: { id: item._id } }"
            class="ml-4 pt-2 pl-1"
          >
            <IDetail
              class="text-lg text-slate-600 hover:text-slate-300 cursor-pointer"
            />
          </router-link>
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
