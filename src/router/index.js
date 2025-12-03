import { createRouter, createWebHistory } from 'vue-router';
import { requireAuth, requireGuest } from '@/auth/guards/auth.guard.js';

const LoginPage = () => import('../auth/pages/login-page.component.vue');
const RegisterPage = () => import('../auth/pages/register-page.component.vue');
const PortManagementPage = () => import('../port-management/pages/port-page.component.vue');
const OptimizationPage = () => import('../route-optimization/pages/optimization-page.component.vue');
const VisualizationPage = () => import('../export-management/pages/visualization-page.component.vue');

const routes = [
    {
        path: '/',
        redirect: '/management'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: {
            title: 'Login',
            description: 'Sign in to your account',
            requiresAuth: false,
            hideForAuth: true
        },
        beforeEnter: requireGuest
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: {
            title: 'Register',
            description: 'Create a new account',
            requiresAuth: false,
            hideForAuth: true
        },
        beforeEnter: requireGuest
    },
    {
        path: '/management',
        name: 'PortManagement',
        component: PortManagementPage,
        meta: {
            title: 'Port Management',
            description: 'Manage ports, routes and system configurations',
            icon: 'settings',
            requiresAuth: true
        },
        beforeEnter: requireAuth
    },
    {
        path: '/visualization',
        name: 'Visualization',
        component: VisualizationPage,
        meta: {
            title: 'Visualization',
            description: 'Interactive visualization of route network',
            icon: 'chart',
            requiresAuth: true
        },
        beforeEnter: requireAuth
    },
    {
        path: '/optimization',
        name: 'Optimization',
        component: OptimizationPage,
        meta: {
            title: 'Route Optimization',
            description: 'Configure and execute optimization algorithms',
            icon: 'lightning',
            requiresAuth: true
        },
        beforeEnter: requireAuth
    },
    {
        path: '/shipments',
        name: 'ShipmentPlanning',
        meta: {
            title: 'Shipment Planning',
            description: 'Create and manage shipment plans',
            icon: 'package',
            requiresAuth: true
        },
        beforeEnter: requireAuth
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/management'
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = `${to.meta.title} - BerrySend`;
    } else {
        document.title = 'BerrySend - Route Optimization Platform';
    }
    next();
});

router.onError((error) => {
    console.error('Router error:', error);
});

export default router;