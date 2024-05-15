<template>
  <div
    class="bg-inherit border border-solid border-slate-300 py-5 rounded-lg mb-5"
  >
    <div class="flex justify-between px-6">
      <h3 class="text-lg text-slate-900 font-semibold mb-4">
        Chỉ số phát triển
      </h3>
      <span
        class="material-symbols-outlined text-slate-900 font-bold cursor-pointer"
      >
        more_vert
      </span>
    </div>
    <div class="flex px-6">
      <FSelect
        class="w-full text-md"
        :options="schoolYearList"
        :modelValue="const_sy"
        :title="const_sy"
        @update:modelValue="
          (value) => {
            schoolYearValue = value;
          }
        "
        @refresh="
          async () => {
            schoolYearValue = const_sy;
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full mx-5 text-md"
        :options="gradeList"
        :modelValue="const_gr"
        :title="const_gr"
        @update:modelValue="
          (value) => {
            gradeValue = value;
            if (classList.length > 0) {
              categories_inGrade = classList[0].cdi.map((item) =>
                parseInt(item.month.name)
              );
              categories_inGrade = categories_inGrade.filter(
                (item, index, self) => self.indexOf(item) == index
              );
              classList.forEach((value1) => {
                const chartSeries_inclass = value1.children.map((item) => ({
                  name: item.name,
                  development: [
                    {
                      name: 'Chiều cao',
                      data: categories_inGrade.map((item1) => {
                        const foundData = value1.cdi.find(
                          (item2) =>
                            item1 == parseInt(item2.month.name) &&
                            item2.child._id == item._id
                        );
                        return foundData ? foundData.height : 0;
                      }),
                    },
                    {
                      name: 'Cân nặng',
                      data: categories_inGrade.map((item1) => {
                        const foundData = value1.cdi.find(
                          (item2) =>
                            item1 == parseInt(item2.month.name) &&
                            item2.child._id == item._id
                        );
                        return foundData ? foundData.weight : 0;
                      }),
                    },
                    {
                      name: 'Số bông hồng',
                      data: categories_inGrade.map((item1) => {
                        const foundData = value1.cdi.find(
                          (item2) =>
                            item1 == parseInt(item2.month.name) &&
                            item2.child._id == item._id
                        );
                        return foundData ? foundData.roses : 0;
                      }),
                    },
                    {
                      name: 'Sức khoẻ',
                      data: categories_inGrade.map((item1) => {
                        const foundData = value1.cdi.find(
                          (item2) =>
                            item1 == parseInt(item2.month.name) &&
                            item2.child._id == item._id
                        );
                        return foundData
                          ? foundData.health == 'tốt'
                            ? 3
                            : foundData.health == 'kém'
                            ? 1
                            : foundData.health == 'bình thường'
                            ? 2
                            : 0
                          : 0;
                      }),
                    },
                  ],
                }));
                chartSeries_inGrade.push({
                  checked: true,
                  chartSeries: chartSeries_inclass,
                });
              });
            }
          }
        "
        @refresh="
          async () => {
            gradeValue = const_gr;
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full text-md"
        :options="classList"
        :modelValue="const_cl"
        :title="const_cl"
        @update:modelValue="
          (value) => {
            classValue = value;
            const temp = classList.filter((item) => item._id == classValue);
            categories_inClass = temp[0].cdi.map((item) =>
              parseInt(item.month.name)
            );
            categories_inClass = categories_inClass.filter(
              (item, index, self) => self.indexOf(item) == index
            );
            chartSeries_inclass = temp[0].children.map((item) => ({
              name: `${item.name
                .split(' ')
                .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
                .join(' ')} (${item._id})`,
              development: [
                {
                  name: 'Chiều cao',
                  data: categories_inClass.map((item1) => {
                    const foundData = temp[0].cdi.find(
                      (item2) =>
                        item1 == parseInt(item2.month.name) &&
                        item2.child._id == item._id
                    );
                    return foundData.height;
                  }),
                },
                {
                  name: 'Cân nặng',
                  data: categories_inClass.map((item1) => {
                    const foundData = temp[0].cdi.find(
                      (item2) =>
                        item1 == parseInt(item2.month.name) &&
                        item2.child._id == item._id
                    );
                    return foundData.weight;
                  }),
                },
                {
                  name: 'Số bông hồng',
                  data: categories_inClass.map((item1) => {
                    const foundData = temp[0].cdi.find(
                      (item2) =>
                        item1 == parseInt(item2.month.name) &&
                        item2.child._id == item._id
                    );
                    return foundData.roses;
                  }),
                },
                {
                  name: 'Sức khoẻ',
                  data: categories_inClass.map((item1) => {
                    const foundData = temp[0].cdi.find(
                      (item2) =>
                        item1 == parseInt(item2.month.name) &&
                        item2.child._id == item._id
                    );
                    return foundData.health == 'tốt'
                      ? 3
                      : foundData.health == 'kém'
                      ? 1
                      : foundData.health == 'bình thường'
                      ? 2
                      : 0;
                  }),
                },
              ],
            }));
          }
        "
        @refresh="
          async () => {
            classValue = const_cl;
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full text-md ml-5"
        :options="childrenList"
        :modelValue="const_ch"
        :title="const_ch"
        :optionLarge="true"
        @update:modelValue="
          (value) => {
            childrenValue = value;
            const temp = childrenList.filter(
              (item) => item._id == childrenValue
            );

            gradeListOneChild = temp[0].classes.map((item) => ({
              name: item.grade.name,
              _id: item.grade._id,
              checked: false,
            }));

            temp[0].cDI = temp[0].cDI.filter(
              (item) => item.classes._id == classValue
            );
            categories = temp[0].cDI.map((item) => item.month.name);
            chartSeries[0].data = temp[0].cDI.map((item) =>
              parseFloat(item.height)
            );
            chartSeries[1].data = temp[0].cDI.map((item) =>
              parseFloat(item.weight)
            );
            chartSeries[3].data = temp[0].cDI.map((item) =>
              parseFloat(item.roses)
            );
            chartSeries[2].data = temp[0].cDI.map((item) =>
              item.health == 'tốt'
                ? 3
                : item.health == 'kém'
                ? 1
                : item.health == 'bình thường'
                ? 2
                : 0
            );
          }
        "
        @refresh="
          async () => {
            childrenValue = const_ch;
          }
        "
        :showClose="true"
      />
    </div>
    <div
      class="border-t border-solid mt-6 border-slate-300 flex justify-center pt-5"
    >
      <span v-if="schoolYearValue == const_sy || gradeValue == const_gr"
        >Chọn dữ liệu để thống kê chỉ số phát triển.</span
      >
    </div>
    <div
      class=""
      v-if="childrenValue && childrenValue != const_ch && !showChartAll"
    >
      <div class="flex mx-6 mt-6 -mb-3 space-x-6 text-slate-900">
        <!-- <div class="flex items-center space-x-2">
                <label for="">All</label>
                <input
                  class="-mt-1.5"
                  type="checkbox"
                  name=""
                  id=""
                  v-model="showChartAll"
                />
              </div> -->
        <div
          v-for="(value, index) in chartSeries"
          class="flex items-center space-x-2"
        >
          <label for="">{{ value.name }}</label>
          <input
            v-model="value.checked"
            class="-mt-1.5"
            type="checkbox"
            name=""
            id=""
          />
        </div>
      </div>
      <ChildDevelopmentStatisticsOneClass
        :categories="categories"
        :chartSeries="chartSeries.filter((item) => item.checked)"
        class="mt-6"
      />
    </div>
    <div class="" v-if="showChartAll">
      <div class="flex mx-6 mt-6 mb-4 space-x-6 text-slate-300">
        <div class="flex items-center space-x-2">
          <label for="">All</label>
          <input
            class="-mt-1.5"
            type="checkbox"
            name=""
            id=""
            v-model="showChartAll"
          />
        </div>
        <div
          v-for="(value, index) in chartSeries"
          class="flex items-center space-x-2"
        >
          <label for="">{{ value.name }}</label>
          <input
            v-model="value.checked"
            class="-mt-1.5"
            type="checkbox"
            name=""
            id=""
          />
        </div>
      </div>
      <ChildDevelopmentStatisticsFullClass />
    </div>
    <div
      class=""
      v-if="classValue && classValue != const_cl && childrenValue == const_ch"
    >
      <div class="flex mx-6 mt-6 mb-4 space-x-6 text-slate-900">
        <div
          v-for="(value, index) in checkbox_inclass"
          class="flex items-center space-x-2"
        >
          <label for="">{{ value.name }} ({{ value.unit }})</label>
          <input
            v-model="radioValue_inClass"
            class="-mt-1.5"
            type="radio"
            name="x"
            id=""
            :value="value.name"
            checked
          />
        </div>
        <div></div>
      </div>
      <ChildDevelopmentStatisticsInClass
        :categories="categories_inClass"
        :chartSeries="
          chartSeries_inclass.map((item) => {
            const foundData = item.development.find(
              (item1) => item1.name == radioValue_inClass
            );
            return foundData
              ? {
                  name: item.name,
                  data: foundData['data'],
                }
              : null;
          })
        "
      />
    </div>
    <div
      class=""
      v-if="
        gradeValue &&
        gradeValue != const_gr &&
        childrenValue == const_ch &&
        classValue == const_cl
      "
    >
      <div class="flex flex-wrap mx-6 mt-6 mb-2 space-x-6 text-slate-900">
        <div
          v-for="(value, index) in classList"
          class="flex items-center space-x-2"
        >
          <label for="">{{ value.name }}</label>
          <input
            class="-mt-1.5"
            v-model="chartSeries_inGrade[index].checked"
            type="checkbox"
            id=""
            :checked="chartSeries_inGrade[index].checked"
          />
        </div>
      </div>
      <div class="flex flex-wrap mx-6 mt-4 space-x-6 text-slate-900">
        <div
          v-for="(value, index) in checkbox_inclass"
          class="flex items-center space-x-2"
        >
          <label for="">{{ value.name }} ({{ value.unit }})</label>
          <input
            v-model="radioValue_inClass"
            class="-mt-1.5"
            type="radio"
            name="x"
            id=""
            :value="value.name"
            checked
          />
        </div>
      </div>
      <div v-if="classList.length > 0" class="grid grid-cols-2 mt-5">
        <div class="" v-for="(value, index) in classList">
          <ChildDevelopmentStatisticsInClass
            v-show="chartSeries_inGrade[index].checked"
            class="w-full"
            :categories="categories_inGrade"
            :active-change="chartSeries_inGrade[index].checked"
            :chartSeries="
              chartSeries_inGrade[index].chartSeries.map((item) => {
                const foundData = item.development.find(
                  (item1) => item1.name == radioValue_inClass
                );
                return foundData
                  ? {
                      name: item.name,
                      data: foundData['data'],
                    }
                  : null;
              })
            "
            :title="value.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted, watch } from "vue";
import ChildDevelopmentStatisticsOneClass from "../statisfics/ChildDevelopmentStatistics-oneClass.vue";
import ChildDevelopmentStatisticsInClass from "../statisfics/ChildDevelopmentStatistics-inClass.vue";
import {
  http_getAll,
  Children,
  Teacher,
  Classes,
  SchoolYear,
  Grade,
  FSelect,
} from "../../assets/js/imports";
import {
  schoolYearList,
  schoolYearValue,
  const_sy,
  gradeList,
  const_gr,
  gradeValue,
  classList,
  classValue,
  const_cl,
} from "../../components/common";
const totalChildren = ref(0);
const totalTeachers = ref(0);
const totalClasses = ref(0);
const activeChooseYear = ref(false);
const selectRef = ref(null);
const sYearValue = ref(null);
const sYearList = ref(null);
const childrenList = ref([]);
const childrenValue = ref("Trẻ");
const const_ch = ref("Trẻ");
const categories = ref([]);
const categories_inClass = ref([]);
const chartSeries_inclass = ref([]);
const categories_inGrade = ref([]);
const chartSeries_inGrade = ref([]);
const checkbox_inclass = ref([
  {
    name: "Chiều cao",
    checked: true,
    unit: "Cm",
  },
  {
    name: "Cân nặng",
    checked: true,
    unit: "Kg",
  },
  {
    name: "Sức khoẻ",
    checked: true,
    unit: "0: kém, 1: bình thường, 2: tốt",
  },
  {
    name: "Số bông hồng",
    checked: true,
    unit: "1-5 bông hồng",
  },
]);
const radioValue_inClass = ref("Số bông hồng");
const chartSeries = ref([
  {
    name: "Chiều cao (Cm)",
    data: [],
    checked: true,
  },
  {
    name: "Cân nặng (Kg)",
    data: [],
    checked: true,
  },
  {
    name: "Sức khoẻ (1: kém, 2: bình thường, 3: tốt)",
    data: [],
    checked: true,
  },
  {
    name: "Số bông hồng",
    data: [],
    checked: true,
  },
]);
const gradeListOneChild = ref([]);
const showChartAll = ref(false);

watch(sYearValue, async (n, o) => {
  totalClasses.value = (await http_getAll(Classes)).filter(
    (item) => item.schoolYear.name == n
  ).length;
});

const handleFilter = async () => {
  if (
    gradeValue.value != const_gr.value &&
    gradeValue.value &&
    schoolYearValue.value != const_sy.value &&
    schoolYearValue.value
  ) {
    classList.value = await http_getAll(Classes);
    classList.value = classList.value.map((i) => ({
      ...i,
      checked: true,
    }));
    childrenList.value = await http_getAll(Children);
    childrenList.value = childrenList.value.map((i) => ({
      ...i,
      name: `${i.name} - ${i._id}`,
    }));
    classList.value = classList.value.filter(
      (item) =>
        item.grade._id == gradeValue.value &&
        item.schoolYear._id == schoolYearValue.value
    );
    handleClasses();
  }
  // if (schoolYearValue.value != const_sy.value && schoolYearValue.value) {
  //   classList.value = classList.value.filter(
  //     (item) => item.schoolYear._id == schoolYearValue.value
  //   );
  // }
  if (
    gradeValue.value == const_gr.value &&
    schoolYearValue.value == const_sy.value
  ) {
    classList.value = [];
    classValue.value = const_cl.value;
  }
  if (classValue.value != const_cl.value) {
    childrenList.value = childrenList.value.filter((item) =>
      item.classes.some((item1) => item1._id == classValue.value)
    );
  }
  if (classValue.value == const_cl.value) {
    childrenList.value = [];
    childrenValue.value = const_ch.value;
  }
};

const handleClasses = () => {
  if (classList.value.length > 0) {
    categories_inGrade.value = classList.value[0].cdi.map((item) =>
      parseInt(item.month.name)
    );
    categories_inGrade.value = categories_inGrade.value.filter(
      (item, index, self) => self.indexOf(item) == index
    );
    for (let value1 of classList.value) {
      let chartSeries_inclass = value1.children.map((item) => ({
        name: `${item.name} - ${item._id}`,
        checked: true,
        development: [
          {
            name: "Chiều cao",
            data: categories_inGrade.value.map((item1) => {
              const foundData = value1.cdi.find(
                (item2) =>
                  item1 == parseInt(item2.month.name) &&
                  item2.child._id == item._id
              );
              return foundData ? foundData.height : 0;
            }),
          },
          {
            name: "Cân nặng",
            data: categories_inGrade.value.map((item1) => {
              const foundData = value1.cdi.find(
                (item2) =>
                  item1 == parseInt(item2.month.name) &&
                  item2.child._id == item._id
              );
              return foundData ? foundData.weight : 0;
            }),
          },
          {
            name: "Số bông hồng",
            data: categories_inGrade.value.map((item1) => {
              const foundData = value1.cdi.find(
                (item2) =>
                  item1 == parseInt(item2.month.name) &&
                  item2.child._id == item._id
              );
              return foundData ? foundData.roses : 0;
            }),
          },
          {
            name: "Sức khoẻ",
            data: categories_inGrade.value.map((item1) => {
              const foundData = value1.cdi.find(
                (item2) =>
                  item1 == parseInt(item2.month.name) &&
                  item2.child._id == item._id
              );
              return foundData
                ? foundData.health == "tốt"
                  ? 3
                  : foundData.health == "kém"
                  ? 1
                  : foundData.health == "bình thường"
                  ? 2
                  : 0
                : 0;
            }),
          },
        ],
      }));
      chartSeries_inGrade.value.push({
        checked: true,
        chartSeries: chartSeries_inclass,
      });
    }
  }
};

watch(gradeValue, async (n, o) => {
  await handleFilter();
});

watch(schoolYearValue, async (n, o) => {
  await handleFilter();
});

watch(classValue, (n, o) => {
  handleFilter();
});

const handleClickOutside = (event) => {
  if (selectRef.value != null) {
    if (!selectRef.value.contains(event.target)) {
      activeChooseYear.value = false;
    }
  }
};

onBeforeMount(async () => {
  const childcareCenter = sessionStorage.getItem("owner_childcareCenter");
  totalChildren.value = (await http_getAll(Children)).length;
  totalTeachers.value = (await http_getAll(Teacher)).length;
  totalClasses.value = (await http_getAll(Classes)).length;
  sYearList.value = (await http_getAll(SchoolYear)).filter(
    (i) => i.childcareCenter._id == childcareCenter
  );
  schoolYearList.value = sYearList.value;
  gradeList.value = await http_getAll(Grade);
  gradeValue.value = const_gr.value;
  schoolYearValue.value = const_sy.value;
  classValue.value = const_cl.value;
});
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
const consoleLog = (value) => {
  console.log(value);
};
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}
.shadow-lg {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}
.text-xl {
  font-size: 1.5rem;
}
.text-3xl {
  font-size: 2.5rem;
}
</style>
