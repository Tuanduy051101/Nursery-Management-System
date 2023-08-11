import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('../views/HomePage.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: '/children',
        name: 'Children',
        component: () => import('../views/children/index.vue'),
      },
      {
        path: '/children/:id',
        name: 'Children.view',
        component: () => import('../views/children/view.vue'),
        props: true,
      },
      {
        path: '/teacher',
        name: 'Teacher',
        component: () => import('../views/teacher/index.vue'),
      },
      {
        path: '/teacher/:id',
        name: 'Teacher.view',
        component: () => import('../views/teacher/view.vue'),
        props: true,
      },
      {
        path: '/position',
        name: 'Position',
        component: () => import('../views/teacher/position/index.vue'),
      },
      {
        path: '/diploma',
        name: 'Diploma',
        component: () => import('../views/teacher/diploma/index.vue')
      },
      {
        path: '/todo',
        name: 'Todo',
        component: () => import('../views/todo/index.vue'),
      },
      {
        path: '/assignment',
        name: 'Assignment',
        component: () => import('../views/todo/assignment/index.vue')
      },
      {
        path: '/duty',
        name: 'Duty',
        component: () => import('../views/todo/duty/index.vue')
      },
      {
        path: '/grade',
        name: 'Grade',
        component: () => import('../views/children/grade/index.vue'),
      },
      {
        path: '/tuitionFees',
        name: 'TuitionFees',
        component: () => import('../views/children/grade/tuitionFees/index.vue'),
      },
      {
        path: '/collectionRates',
        name: 'CollectionRates',
        component: () => import('../views/children/grade/collectionRates/index.vue'),
      },
      {
        path: '/schoolYear',
        name: 'sYear',
        component: () => import('../views/children/sYear/index.vue')
      },
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
        path: '/classroom/:id/add',
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
      {
        path: '/invoice',
        name: 'Invoice',
        component: () => import('../views/invoice/index.vue')
      },
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
      {
        path: '/chart',
        name: 'Chart',
        component: () => import('../views/chart/index.vue')
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('../views/Setting.vue')
      },
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
        path: '/profile/:id',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        props: true,
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('token');
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    // Nếu trang yêu cầu xác thực và người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
