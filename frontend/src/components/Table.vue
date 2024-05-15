<template>
  <table
    class="border-collapse w-full"
    :class="mode == 0 || mode == `auto` ? 'table-auto' : 'table-fixed'"
  >
    <thead>
      <tr
        class="border border-solid border-slate-300 border-l-0"
        :class="borderR ? '' : 'border-r-0'"
      >
        <th v-if="showCheckbox" class="p-2">
          <input
            type="checkbox"
            class="float-left text-blue-700"
            v-model="ischecked"
          />
        </th>
        <th v-if="activeSTT" class="p-2">
          <span class="float-left pt-1.5 text-blue-500 text-lg">#</span>
        </th>
        <th class="p-2" v-for="(field, index) in fields" :key="index">
          <span
            class="float-left pt-2 text-blue-700 bold"
            style="white-space: nowrap; font-weight: normal"
            >{{
              field.charAt(0).toUpperCase() + field.slice(1).toLowerCase()
            }}</span
          >
        </th>
        <th
          v-if="
            (mode == 0 || mode == `auto`) &&
            showAction.some((value) => value == true)
          "
          class="w-24"
        >
          <span class="float-right pr-2 whitespace-nowrap pt-2 text-blue-700"
            >Chức năng</span
          >
        </th>
        <th
          v-if="mode == 1 && showAction.some((value) => value == true)"
          class="p-2"
        >
          <span class="float-right whitespace-nowrap pt-2">Chức năng</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="text-slate-900 whitespace-normal border border-solid border-slate-300 border-l-0 border-r-0 text-base text-capitalize hover:border-slate-300"
        v-for="(item, index) in items"
        :key="item._id"
        :class="[!borderB ? 'border-b-0' : '']"
      >
        <td v-if="showCheckbox" class="p-2">
          <input
            v-model="item.checked"
            class="float-left text-white"
            type="checkbox"
            name=""
            id=""
          />
        </td>
        <td class="p-2" v-if="activeSTT">
          <router-link
            :to="{ name: actionList[0], params: { id: item._id } }"
            class="float-left text-blue-500 pt-1.5"
          >
            #{{ index + startRow }}
          </router-link>
        </td>
        <td
          v-for="(label, index1) in labels"
          :key="index"
          class="p-2 whitespace-normal"
        >
          <span
            v-if="
              label == '_id' || label == 'teacher_id' || label == 'children_id'
            "
            class="float-left pt-1.5 overflow-ellipsis overflow-hidden block w-20"
            :class="[
              wrapList[index1] == true
                ? 'whitespace-normal'
                : 'whitespace-nowrap',
            ]"
            @copy="handleCopy($event, item[label])"
            ref="myId"
            :title="item[label]"
            >{{ setGender(label, item[label]) }}</span
          >
          <span
            v-if="
              label != 'status' &&
              label != 'reason' &&
              label != 'height' &&
              label != 'weight' &&
              label != 'roses' &&
              label != 'health' &&
              label != 'note' &&
              label != 'evaluate' &&
              label != 'email' &&
              label != 'teacher_email' &&
              label != 'parent_email' &&
              label != 'description' &&
              label != 'noteValue' &&
              label != 'teachers' &&
              label != 'teachersNew1' &&
              label != '_id' &&
              label != 'teacher_id' &&
              label != 'children_id' &&
              label != 'function' &&
              label != '_note' &&
              label != '_note' &&
              label != 'noteValue' &&
              label != 'making' &&
              label != 'amount' &&
              label != 'foodstuff_function' &&
              label != 'allergenDescription' &&
              label != 'reactionType' &&
              label != 'treatment' &&
              label != 'dish_format'
            "
            class="float-left pt-2 capitalize"
            :class="[
              wrapList[index1] == true
                ? 'whitespace-normal'
                : 'whitespace-nowrap',
            ]"
            >{{ setGender(label, item[label]) }}</span
          >
          <span
            v-html="item.teachers"
            v-if="label == 'teachers'"
            class="float-left pt-1.5 capitalize"
            :class="[
              wrapList[index1] == true
                ? 'whitespace-normal'
                : 'whitespace-nowrap',
            ]"
          ></span>
          <span
            @click="$emit('updateIndexTeacher', index, item._id)"
            v-html="item.teachersNew1"
            v-if="label == 'teachersNew1'"
            class="float-left pt-1.5 capitalize"
            :class="[
              wrapList[index1] == true
                ? 'whitespace-normal'
                : 'whitespace-nowrap',
            ]"
          ></span>
          <span
            v-if="
              label == 'email' ||
              label == 'parent_email' ||
              label == 'teacher_email'
            "
            class="float-left pt-1.5"
            :class="[
              wrapList[index1] == true
                ? 'whitespace-normal'
                : 'whitespace-nowrap',
            ]"
            >{{ setGender(label, item[label]) }}</span
          >
          <span
            v-if="label == 'description' || label == 'noteValue'"
            class="float-left pt-1.5"
            :class="[
              wrapList[index1] == true
                ? 'whitespace-normal'
                : 'whitespace-nowrap',
            ]"
            >{{
              capitalizeFirstLetterAndAfterPeriod(setGender(label, item[label]))
            }}</span
          >
          <span
            v-if="
              label == '_note' ||
              label == 'function' ||
              label == 'making' ||
              label == 'amount' ||
              label == 'allergenDescription' ||
              label == 'reactionType' ||
              label == 'treatment' ||
              label == 'foodstuff_function'
            "
            class="float-left pt-1.5"
            :class="[
              wrapList[index1] == true
                ? 'whitespace-normal'
                : 'whitespace-nowrap',
            ]"
            >{{
              capitalizeFirstLetterAndAfterPeriod(setGender(label, item[label]))
            }}</span
          >
          <span
            v-html="item.dish_format"
            v-if="label == 'dish_format'"
            class="float-left pt-1.5 capitalize"
            :class="[
              wrapList[index1] == true
                ? 'whitespace-normal'
                : 'whitespace-nowrap',
            ]"
          ></span>
          <input
            v-if="label == 'status'"
            type="checkbox"
            name=""
            id=""
            v-model="item[label]"
            class="mt-1.5"
          />
          <div ref="selectRef" class="relative" v-if="label == 'evaluate'">
            <input
              type="text"
              name=""
              id=""
              v-model="item[label]"
              class="outline-none bg-inherit mt-1.5"
              @focus="
                (showSelectHealth = index),
                  setTimeout(() => {
                    showSelectHealth = -1;
                  }, 5000)
              "
            />
            <ul
              v-if="index == showSelectHealth"
              class="absolute flex bg-white border border-solid border-slate-300 p-2 rounded-md shadow-lg z-10 text-black space-x-2 opacity-100"
            >
              <li
                @click="(item[label] = 'yêu thích'), (showSelectHealth = -1)"
                class="cursor-pointer whitespace-nowrap"
                :class="[
                  item[label] == 'yêu thích'
                    ? 'text-green-500'
                    : 'hover:text-yellow-500',
                ]"
              >
                Yêu thích
              </li>
              <li
                @click="(item[label] = 'không thích'), (showSelectHealth = -1)"
                class="cursor-pointer whitespace-nowrap"
                :class="[
                  item[label] == 'không thích'
                    ? 'text-green-500'
                    : 'hover:text-yellow-500',
                ]"
              >
                Không thích
              </li>
              <li
                @click="(item[label] = 'bị dị ứng'), (showSelectHealth = -1)"
                class="cursor-pointer whitespace-nowrap"
                :class="[
                  item[label] == 'bị dị ứng'
                    ? 'text-green-500'
                    : 'hover:text-yellow-500',
                ]"
              >
                Bị dị ứng
              </li>
            </ul>
          </div>
          <input
            v-if="label == 'height'"
            type="number"
            name=""
            id=""
            v-model="item[label]"
            class="outline-none bg-inherit w-12 mt-1.5"
            max="100"
            min="10"
          />
          <input
            v-if="label == 'weight'"
            type="number"
            name=""
            id=""
            v-model="item[label]"
            class="outline-none bg-inherit w-12 mt-1.5"
            max="30"
            min="5"
          />
          <textarea
            v-if="label == 'reason'"
            v-model="item[label]"
            class="flex item-center bg-inherit border-0 border-solid border-slate-600 rounded-md focus:border-slate-300 p-2"
            style="outline: none; max-height: 80px; height: 40px"
          ></textarea>
          <div ref="selectRef" class="relative" v-if="label == 'health'">
            <input
              type="text"
              name=""
              id=""
              v-model="item[label]"
              class="outline-none bg-inherit capitalize"
              @focus="
                (showSelectHealth = index),
                  setTimeout(() => {
                    showSelectHealth = -1;
                  }, 5000)
              "
            />
            <ul
              v-if="index == showSelectHealth"
              class="absolute flex bg-white p-2 rounded-md shadow-lg z-10 text-black space-x-2 opacity-100"
            >
              <li
                @click="(item[label] = 'kém'), (showSelectHealth = -1)"
                class="cursor-pointer"
                :class="[item[label] == 'kém' ? 'text-green-500' : '']"
              >
                Kém
              </li>
              <li
                @click="(item[label] = 'bình thường'), (showSelectHealth = -1)"
                class="cursor-pointer"
                :class="[item[label] == 'bình thường' ? 'text-green-500' : '']"
              >
                Bình thường
              </li>
              <li
                @click="(item[label] = 'tốt'), (showSelectHealth = -1)"
                class="cursor-pointer"
                :class="[item[label] == 'tốt' ? 'text-green-500' : '']"
              >
                Tốt
              </li>
            </ul>
          </div>
          <input
            v-if="label == 'roses'"
            type="number"
            name=""
            id=""
            v-model="item[label]"
            class="outline-none bg-inherit w-12"
            min="1"
            max="5"
          />
          <textarea
            v-if="label == 'note'"
            v-model="item[label]"
            class="flex item-center bg-inherit border-0 border-solid border-slate-600 rounded-md focus:border-slate-300 p-2 first-letter-uppercase"
            style="outline: none; max-height: 80px; height: 40px"
          ></textarea>
        </td>
        <td class="p-2" v-if="showAction.length > 0">
          <div class="flex items-center justify-center pt-1.5">
            <router-link
              :to="{ name: actionList[0], params: { id: item._id } }"
              v-if="showAction[0]"
            >
              <i
                title="Xem chi tiết"
                @click="
                  $emit(
                    'view',
                    viewOption == '_id'
                      ? item._id
                      : viewOption == 'children'
                      ? item.children_id
                      : item.teacher_id
                  )
                "
                class="bi bi-eye cursor-pointer hover:text-blue-500"
              ></i>
            </router-link>
            <div v-if="showAction[0]" class="ml-2"></div>
            <i
              v-if="showAction[1]"
              class="bi bi-pencil-square cursor-pointer hover:text-yellow-500"
              title="Sửa"
              @click="$emit('edit', item._id)"
            ></i>
            <div v-if="showAction[1]" class="ml-2"></div>
            <i
              title="Xoá"
              v-if="showAction[2]"
              class="bi bi-trash cursor-pointer hover:text-red-500"
              @click="$emit('delete', item)"
            ></i>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <span v-if="items.length == 0" class="flex justify-center mt-5 text-slate-900"
    >Không có dữ liệu.</span
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
    wrapList: {
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
    borderB: {
      type: Boolean,
      default: true,
    },
    showAction: {
      type: Array,
      default: [true, true, true],
    },
    startRow: {
      type: Number,
      default: 1,
    },
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    activeSTT: {
      type: Boolean,
      default: false,
    },
    viewOption: {
      type: String,
      default: "_id",
    },
  },
  emits: ["update:activeAction", "deleteItem", "update:item"],
  data() {
    return {
      ischecked: false,
      showSelectHealth: -1,
    };
  },
  watch: {
    ischecked(newVal) {
      if (this.items) {
        this.items.forEach((item) => {
          item.checked = newVal;
        });
      }
    },
  },
  methods: {
    sliceID(id, index) {
      return id.substring(18, 22).concat(index);
    },
    async handleCopy(e, value) {
      e.preventDefault();
      await navigator.clipboard.writeText(value);
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
    capitalizeFirstLetterAndAfterPeriod(str) {
      if (str) {
        let sentences = str.toString().split(". ");

        // Viết hoa chữ cái đầu tiên của mỗi câu
        sentences = sentences.map(
          (sentence) =>
            sentence.charAt(0).toLocaleUpperCase("vi-VN") + sentence.slice(1)
        );

        // Nối các câu lại thành một chuỗi
        str = sentences.join(". ");

        return str;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
