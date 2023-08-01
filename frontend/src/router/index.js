import { createWebHistory, createRouter } from "vue-router";

const routes = [
  // Dashboard
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  // Children
  {
    path: '/children',
    name: 'Children',
    component: () => import('../views/children/index.vue'),
  },
  // Children.view
  {
    path: '/children/:id',
    name: 'Children.view',
    component: () => import('../views/children/view.vue'),
    props: true,
  },
  // Teacher
  {
    path: '/teacher',
    name: 'Teacher',
    component: () => import('../views/teacher/index.vue'),
  },
  // Teacher.vue
  {
    path: '/teacher/:id',
    name: 'Teacher.view',
    component: () => import('../views/teacher/view.vue'),
    props: true,
  },
  // Position
  {
    path: '/position',
    name: 'Position',
    component: () => import('../views/teacher/position/index.vue'),
  },
  // Diploma
  {
    path: '/diploma',
    name: 'Diploma',
    component: () => import('../views/teacher/diploma/index.vue')
  },
  // Todo
  {
    path: '/todo',
    name: 'Todo',
    component: () => import('../views/todo/index.vue'),
  },
  // Assignment
  {
    path: '/assignment',
    name: 'Assignment',
    component: () => import('../views/todo/assignment/index.vue')
  },
  // Duty
  {
    path: '/duty',
    name: 'Duty',
    component: () => import('../views/todo/duty/index.vue')
  },
  // Grade
  {
    path: '/grade',
    name: 'Grade',
    component: () => import('../views/children/grade/index.vue'),
  },
  // Tuition Fees
  {
    path: '/tuitionFees',
    name: 'TuitionFees',
    component: () => import('../views/children/grade/tuitionFees/index.vue'),
  },
  // Collection Rates
  {
    path: '/collectionRates',
    name: 'CollectionRates',
    component: () => import('../views/children/grade/collectionRates/index.vue'),
  },
  // School Year
  {
    path: '/schoolYear',
    name: 'sYear',
    component: () => import('../views/children/sYear/index.vue')
  },
  // ClassRoom
  {
    path: '/classroom',
    name: 'ClassRoom',
    component: () => import('../views/children/cRoom/index.vue'),
  },
  {
    path: '/classroom/:id',
    name: 'ClassRoom.view',
    component: () => import('../views/children/cRoom/view.vue'),
    props: true,
  },
  {
    path: '/classroom/:id',
    name: 'ClassRoom.edit',
    component: () => import('../views/children/cRoom/edit.vue'),
    props: true,
  },
  {
    path: '/classroom/:id',
    name: 'ClassRoom.add',
    component: () => import('../views/children/cRoom/addition/index.vue'),
    props: true,
  },
  {
    path: '/classroom/:id',
    name: 'ClassRoom.cdi.add',
    component: () => import('../views/children/cRoom/cdi/add.vue'),
    props: true,
  },
  // Invoice
  {
    path: '/invoice',
    name: 'Invoice',
    component: () => import('../views/invoice/index.vue')
  },
  // Receipt.view
  {
    path: '/receipt/:id',
    name: 'Receipt.view',
    component: () => import('../views/invoice/receipt/view.vue'),
    props: true,
  },
  {
    path: '/meal',
    name: 'Meal',
    component: () => import('../views/mealTicket/meal/index.vue')
  },
  // Meal.view
  {
    path: '/meal/:id',
    name: 'Meal.view',
    component: () => import('../views/mealTicket/meal/view.vue'),
    props: true,
  },
  {
    path: '/mealTicket',
    name: 'MealTicket',
    component: () => import('../views/mealTicket/index.vue'),
  },
  // MealTicket.view
  {
    path: '/mealTicket/:id',
    name: 'MealTicket.view',
    component: () => import('../views/mealTicket/meal/view_children.vue'),
    props: true,
  },
  {
    path: '/dish',
    name: 'Dish',
    component: () => import('../views/mealTicket/dish/index.vue'),
  },
  {
    path: '/dish/:id',
    name: 'Dish.view',
    component: () => import('../views/mealTicket/dish/view.vue'),
    props: true,
  },
  // Chart
  {
    path: '/chart',
    name: 'Chart',
    component: () => import('../views/chart/index.vue')
  },
  // Setting
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  },
  // print
  {
    path: '/print/:id',
    name: 'Receipt.print',
    component: () => import('../views/print/receipt.vue'),
    props: true,
  },
  {
    path: '/print/:id',
    name: 'Classes.children.print',
    component: () => import('../views/print/children.vue'),
    props: true,
  },
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../views/Login.vue'),
  },
  // {
  //   path: '/',
  //   name: 'Signin1',
  //   component: () => import('../views/Login.vue'),
  // },
  // {
  //   path: '/ph/:id',
  //   name: 'PH',
  //   component: () => import('../views/decentralization/children/index.vue'),
  //   props: true,
  // },
  // {
  //   path: '/',
  //   name: 'App',
  //   component: () => import('../App.vue'),
  // },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    props: true,
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  
})
export default router;
