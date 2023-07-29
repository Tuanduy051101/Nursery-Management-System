<template>
  <div
    class="fixed top-0 left-0 max-h-screen min-h-screen w-2/12 border border-solid border-slate-600 border-l-0"
  >
    <div class="flex flex-col">
      <!-- Logo -->
      <div class="flex items-center justify-center">
        <!-- <span
          class="material-symbols-outlined text-6xl text-green-500 animate-spin"
        >
          toys_fan
        </span> -->
        <img src="../../assets/images/logo.png" alt="" style="width: 200px; height: 170px;" class="">
        <!-- <span class="text-5xl logo text-yellow-500">KeyOne</span> -->
      </div>
      <!-- Dashboards -->
      <div class="overflow-auto" style="max-height: 694px">
        <router-link
          :to="{ name: `Dashboard` }"
          class="mb-5 flex items-center py-1 px-2 w-11/12 text-base text-slate-300"
          :class="[
            1000 === activeIndex
              ? 'border border-solid border-green-500 rounded-md'
              : 'hover:border hover:border-solid hover:border-yellow-500 hover:rounded-md',
          ]"
          @click="updateActiveIndex(1000)"
        >
          <span
            class="material-symbols-outlined text-2xl mr-4"
            :class="[1000 === activeIndex ? '' : 'text-slate-300']"
          >
            home
          </span>
          <span class="text-lg text-slate-300 sidebar mt-1">Dashboard</span>
        </router-link>
        <!-- Tasks -->
        <div
          v-for="sidebarTask in sidebarTasks"
          :key="sidebarTask.id"
          class="flex flex-col items-center w-11/12"
        >
          <router-link
            :to="{ name: `${sidebarTask.name}` }"
            class="my-5 flex items-center justify-between overflow-hidden py-1 px-2 w-full text-base"
            :class="[
              sidebarTask.id === activeIndex
                ? 'border border-solid border-green-500 rounded-lg'
                : 'hover:border hover:border-solid hover:border-yellow-500 hover:rounded-md',
            ]"
            @click="updateActiveIndex(sidebarTask.id)"
          >
            <div class="flex items-center">
              <span
                class="material-symbols-outlined text-2xl mr-4"
                :class="[
                  sidebarTask.id === activeIndex
                    ? 'text-slate-300'
                    : 'text-slate-300',
                ]"
              >
                {{ sidebarTask.icon }}
              </span>
              <span class="text-lg text-slate-300 sidebar mt-1">{{
                sidebarTask.name
              }}</span>
            </div>

            <!-- child tasks -->
            <div
              v-if="sidebarTask.children.length != 0"
              class="flex items-center"
            >
              <span
                class="material-symbols-outlined text-lg"
                :class="[
                  sidebarTask.id === activeIndex
                    ? 'text-slate-300'
                    : 'text-slate-300',
                ]"
              >
                {{
                  sidebarTask.id === activeIndex
                    ? "expand_more"
                    : "navigate_next"
                }}
              </span>
            </div>
          </router-link>
          <!-- child tasks -->
          <router-link
            v-if="sidebarTask.id === activeIndex"
            v-for="(childTask, indexChild) in sidebarTask.children"
            :to="{ name: `${childTask.route}` }"
            class="flex items-center overflow-hidden py-1 px-2 w-11/12 text-base my-3"
            :class="[
              indexChild === activeIndexChild && sidebarTask.id === activeIndex
                ? 'border border-solid border-green-500 rounded-md'
                : 'hover:border hover:border-solid hover:border-yellow-500 hover:rounded-md',
            ]"
            @click="activeIndexChild = indexChild"
          >
            <span
              class="material-symbols-outlined text-2xl mr-2"
              :class="[
                indexChild === activeIndexChild
                  ? 'text-slate-300'
                  : 'text-slate-300',
              ]"
            >
              fiber_manual_record
            </span>
            <span class="text-md text-slate-300 sidebar mt-1">{{
              childTask.name
            }}</span>
          </router-link>
        </div>
        <!-- Setting -->
        <!-- <router-link
        :to="{ name: `Setting` }"
        class="flex items-center overflow-hidden py-1 px-2 w-11/12 text-base my-5"
        :class="[
          2000 === activeIndex
            ? 'border-2 border-solid border-violet-500 text-white rounded-md'
            : 'text-violet-700 hover:border hover:border-solid hover:border-violet-500 hover:text-white hover:rounded-md',
        ]"
        @click="updateActiveIndex(2000)"
      >
        <span
          class="material-symbols-outlined text-2xl mr-4"
          :class="[2000 === activeIndex ? '' : 'shadow-lg shadow-violet-500']"
        >
          settings
        </span>
        <span class="text-lg text-white sidebar">Settings</span>
      </router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeIndex: { type: Number, default: -1 },
    activeIndexChild: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex"],
  data() {
    return {
      sidebarToggle: true,
      sidebarTasks: [
        {
          id: 1,
          icon: "family_restroom",
          name: "Children",
          role: [
            'BGH', 'QTHT'
          ],
          children: [
            {
              id: 11,
              name: "Parents",
              route: "",
            },
            {
              id: 12,
              name: "Children DI",
              route: "",
            },
          ],
        },
        {
          id: 2,
          icon: "airline_seat_recline_normal",
          name: "Teacher",
          role: ['BGH', 'QTHT'],
          children: [
            {
              id: 21,
              name: "Position",
              route: "Position",
            },
            {
              id: 22,
              name: "Diploma",
              route: "Diploma",
            },
          ],
        },
        {
          id: 3,
          icon: "event_available",
          name: "Todo",
          role: ['BGH', 'QTHT'],
          children: [
            {
              id: 31,
              name: "Assignment",
              route: "Assignment",
            },
            {
              id: 32,
              name: "Duty",
              route: "Duty",
            },
          ],
        },
        {
          id: 4,
          icon: "apartment",
          name: "Grade",
          role: ['BGH', 'QTHT'],
          children: [
            {
              id: 41,
              name: "School Year",
              route: "sYear",
            },
            {
              id: 42,
              name: "Tuition Fees",
              route: "TuitionFees",
            },
            {
              id: 43,
              name: "Collection Rates",
              route: "CollectionRates",
            },
          ],
        },
        {
          id: 5,
          icon: "event_available",
          name: "ClassRoom",
          role: ['BGH', 'QTHT', ''],
          children: [],
        },
        {
          id: 6,
          icon: "restaurant",
          name: "Meal",
          children: [
            {
              id: 61,
              name: "Meal Tickets",
              route: "",
            },
            {
              id: 62,
              name: "Dish",
              route: "Dish",
            },
          ],
        },
        {
          id: 7,
          icon: "receipt_long",
          name: "Invoice",
          children: [],
        },
        {
          id: 8,
          icon: "monitoring",
          name: "Chart",
          children: [
            {
              id: 81,
              name: "Children",
              route: "",
            },
            {
              id: 82,
              name: "CDI",
              route: "",
            },
            {
              id: 83,
              name: "Invoices",
              route: "",
            },
          ],
        },
        {
          id: 9,
          icon: "settings",
          name: "Setting",
          children: [],
        },
      ],
    };
  },
  methods: {
    onClick() {
      this.sidebarTasks.active = true;
    },
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
  },
};
</script>

<style>
/* .bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
} */
/* @keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
} */
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
  display: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(234 179 8);
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}
</style>

