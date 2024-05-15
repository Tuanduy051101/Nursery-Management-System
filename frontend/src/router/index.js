import { createWebHistory, createRouter } from "vue-router";
import { Account } from '../assets/js/imports';

const checkTeacher = (to, from, next) => {
  const role = sessionStorage.getItem("role");
  if (role == 'giáo viên quản lý trẻ') {
    next();
  } else {
    next({ name: 'Login' });
  }
};

const checkAccounting = (to, from, next) => {
  const role = sessionStorage.getItem("role");
  if (role == 'kế toán') {
    next();
  } else {
    next({ name: 'Login' });
  }
};

const checkAdmin = (to, from, next) => {
  const role = sessionStorage.getItem("role");
  if (role == 'ban giám hiệu' || role == 'quản trị hệ thống') {
    next();
  } else {
    next({ name: 'Login' });
  }
};

const checkChef = (to, from, next) => {
  const role = sessionStorage.getItem("role");
  if (role == 'nhân viên bếp') {
    next();
  } else {
    next({ name: 'Login' });
  }
};

const checkParents = (to, from, next) => {
  const role = sessionStorage.getItem("role");
  if (role == 'phụ huynh') {
    next();
  } else {
    next({ name: 'Login' });
  }
};

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
    beforeEnter: checkAdmin,
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/children',
        name: 'Children',
        component: () => import('../views/children/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/allergies',
        name: 'Allergies',
        component: () => import('../views/mealTicket/allergies/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/children/:id',
        name: 'Children.view',
        component: () => import('../views/children/view.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/teacher',
        name: 'Teacher',
        component: () => import('../views/teacher/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/teacher/:id',
        name: 'Teacher.view',
        component: () => import('../views/teacher/view.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/position',
        name: 'Position',
        component: () => import('../views/teacher/position/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/diploma',
        name: 'Diploma',
        component: () => import('../views/teacher/diploma/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/todo',
        name: 'Todo',
        component: () => import('../views/todo/assignment/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/assignment',
        name: 'Assignment',
        component: () => import('../views/todo/assignment/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/duty',
        name: 'Duty',
        component: () => import('../views/todo/duty/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/grade',
        name: 'Grade',
        component: () => import('../views/children/grade/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/tuitionFees',
        name: 'TuitionFees',
        component: () => import('../views/children/grade/tuitionFees/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/collectionRates',
        name: 'CollectionRates',
        component: () => import('../views/children/grade/collectionRates/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/schoolYear',
        name: 'sYear',
        component: () => import('../views/children/sYear/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/classroom',
        name: 'ClassRoom',
        component: () => import('../views/children/cRoom/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/classroom/:id',
        name: 'ClassRoom.view',
        component: () => import('../views/children/cRoom/view.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/classroom/:id',
        name: 'ClassRoom.edit',
        component: () => import('../views/children/cRoom/edit.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/classroom/:id/add',
        name: 'ClassRoom.add',
        component: () => import('../views/children/cRoom/addition/index.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/classroom/:id',
        name: 'ClassRoom.cdi.add',
        component: () => import('../views/children/cRoom/cdi/add.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/invoice',
        name: 'Invoice',
        component: () => import('../views/invoice/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/receipt/:id',
        name: 'Receipt.view',
        component: () => import('../views/invoice/receipt/view.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/meal',
        name: 'Meal',
        component: () => import('../views/mealTicket/meal/index.vue'),
        beforeEnter: checkAdmin,
      },
      {
        path: '/meal/:id',
        name: 'Meal.view',
        component: () => import('../views/mealTicket/meal/view.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/mealTicket',
        name: 'MealTicket',
        component: () => import('../views/mealTicket/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/mealTicket/:id',
        name: 'MealTicket.view',
        component: () => import('../views/mealTicket/meal/view_children.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/dish',
        name: 'Dish',
        component: () => import('../views/mealTicket/dish/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/dish/:id',
        name: 'Dish.view',
        component: () => import('../views/mealTicket/dish/view.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/chart',
        name: 'Chart',
        component: () => import('../views/chart/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('../views/Setting.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/childcareCenter',
        name: 'ChildcareCenter',
        component: () => import('../views/children/childcareCenter/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/session',
        name: 'Session',
        component: () => import('../views/children/session/index.vue'),
        beforeEnter: checkAdmin,

      },
      {
        path: '/print/:id',
        name: 'Receipt.print',
        component: () => import('../views/print/receipt.vue'),
        beforeEnter: checkAdmin,
        props: true,
      },
      {
        path: '/print/:id',
        name: 'Classes.children.print',
        component: () => import('../views/print/children.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
      {
        path: '/profile/:id',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        beforeEnter: checkAdmin,

        props: true,
      },
    ]
  },
  {
    path: '/chef',
    component: () => import('../views/HomePage_chef.vue'),
    meta: { requiresAuth: true },
    beforeEnter: checkChef,
    children: [
      {
        path: '/chef/payment',
        name: 'Payment-chef',
        component: () => import('../views/invoice/payment/index.vue'),
        beforeEnter: checkChef,
      },
      {
        path: '/chef/meal',
        name: 'Meal-chef',
        component: () => import('../views/mealTicket/meal/index.vue'),
        beforeEnter: checkChef,
      },
      {
        path: '/chef/mealTicket',
        name: 'MealTicket-chef',
        component: () => import('../views/mealTicket/index.vue'),
        beforeEnter: checkChef,
      },
      {
        path: '/chef/dish',
        name: 'Dish-chef',
        component: () => import('../views/mealTicket/dish/index.vue'),
        beforeEnter: checkChef,
      },
      {
        path: '/chef/meal/:id',
        name: 'Meal-chef.view',
        component: () => import('../views/mealTicket/meal/view.vue'),
        beforeEnter: checkChef,
        props: true,
      },
      {
        path: '/chef/dish/:id',
        name: 'Dish-chef.view',
        component: () => import('../views/mealTicket/dish/view.vue'),
        beforeEnter: checkChef,

        props: true,
      },
      {
        path: '/chef/mealTicket/:id',
        name: 'MealTicket-chef.view',
        component: () => import('../views/mealTicket/meal/view_children.vue'),
        beforeEnter: checkChef,
        props: true,
      },
      {
        path: '/chef/allergies',
        name: 'Chef-allergies',
        component: () => import('../views/mealTicket/allergies/index.vue'),
        beforeEnter: checkChef,

      },
    ]
  },
  {
    path: '/teacher',
    component: () => import('../views/HomePage_teacher.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/teacher/classroom',
        name: 'ClassRoom-teacher',
        component: () => import('../views/UI/teacher/classroom.vue'),
        beforeEnter: checkTeacher,
      },
      {
        path: '/teacher/classroom/:id',
        name: 'ClassRoom-teacher.view',
        component: () => import('../views/children/cRoom/view.vue'),
        beforeEnter: checkTeacher,
        props: true,
      },
      {
        path: '/teacher/classroom/:id/add',
        name: 'ClassRoom-teacher.add',
        component: () => import('../views/children/cRoom/addition/index.vue'),
        beforeEnter: checkTeacher,
        props: true,
      },
      {
        path: '/teacher/children/:id',
        name: 'Children-teacher.view',
        component: () => import('../views/children/view.vue'),
        beforeEnter: checkTeacher,
        props: true,
      },
    ]
  },
  {
    path: '/parents',
    component: () => import('../views/HomePage_child.vue'),
    meta: { requiresAuth: true },
    beforeEnter: checkParents,
    children: [
      {
        path: '/child/dashboard',
        name: 'Dashboard-child',
        component: () => import('../views/Dashboard.vue'),
        beforeEnter: checkParents,
      },
      {
        path: '/child/attendance',
        name: 'Attendance-child',
        component: () => import('../views/UI/parents/attendance.vue'),
        beforeEnter: checkParents,
      },
      {
        path: '/child/cdi',
        name: 'Cdi-child',
        component: () => import('../views/UI/parents/cdi.vue'),
        beforeEnter: checkParents,
      },
      {
        path: '/child/receipt',
        name: 'Receipt-child',
        component: () => import('../views/UI/parents/receipt.vue'),
        beforeEnter: checkParents,
      },
      {
        path: '/child/meal',
        name: 'Meal-child',
        component: () => import('../views/UI/parents/mealTicket.vue'),
        beforeEnter: checkParents,
      },
    ]
  },
  {
    path: '/accountant',
    component: () => import('../views/HomePage_accountant.vue'),
    meta: { requiresAuth: true },
    beforeEnter: checkAccounting,
    children: [
      {
        path: '/accountant/dashboard',
        name: 'Dashboard-accountant',
        component: () => import('../views/Dashboard.vue'),
        beforeEnter: checkAccounting,

      },
      {
        path: '/accountant/tuitionFees',
        name: 'TuitionFees-accountant',
        component: () => import('../views/children/grade/tuitionFees/index.vue'),
        beforeEnter: checkAccounting,

      },
      {
        path: '/accountant/collectionRates',
        name: 'CollectionRates-accountant',
        component: () => import('../views/children/grade/collectionRates/index.vue'),
        beforeEnter: checkAccounting,

      },
      {
        path: '/accountant/invoice',
        name: 'Invoice-accountant',
        component: () => import('../views/invoice/index.vue'),
        beforeEnter: checkAccounting,

      },
      {
        path: '/accountant/receipt/:id',
        name: 'Receipt-accounting.view',
        component: () => import('../views/invoice/receipt/view.vue'),
        beforeEnter: checkAccounting,
        props: true,
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem('token');
  const isHeadquarters = sessionStorage.getItem("owner_isHeadquarters");
  const isToken = await Account.verifyToken({
    token,
    isHeadquarters,
  });

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    isToken.error
  ) {
    // Nếu trang yêu cầu xác thực và người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
