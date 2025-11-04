/**
 * Vue Router Configuration
 * Defines application routes organized by bounded contexts
 *
 * @module router
 */

import { createRouter, createWebHistory } from 'vue-router';

// Port Management Module
const PortManagementPage = () => import('../port-management/pages/port-page.component.vue');

// Route Optimization Module


// Visualization Module



// Shipment Planning Module


/**
 * Route definitions
 */
const routes = [
    {
        path: '/',
        redirect: '/management'
    },
    {
        path: '/management',
        name: 'PortManagement',
        component: PortManagementPage,
        meta: {
            title: 'Port Management',
            description: 'Manage ports, routes and system configurations'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/management'
    }
];

/**
 * Create router instance
 */
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

/**
 * Navigation guard to update page title
 */
router.beforeEach((to, from, next) => {
    // Update document title based on route meta
    if (to.meta.title) {
        document.title = `${to.meta.title} - BerrySend`;
    } else {
        document.title = 'BerrySend - Route Optimization Platform';
    }

    next();
});

/**
 * Global error handler for navigation failures
 */
router.onError((error) => {
    console.error('Router error:', error);
});

export default router;