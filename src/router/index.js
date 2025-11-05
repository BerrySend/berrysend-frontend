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
const OptimizationPage = () => import('../route-optimization/pages/optimization-page.component.vue');

// Visualization Module
//const VisualizationPage = () => import('../modules/visualization/pages/visualization-page.component.vue');
//const ResultsPage = () => import('../modules/visualization/pages/results-page.component.vue');

// Shipment Planning Module
//const ShipmentPlanningPage = () => import('../modules/shipment-planning/pages/shipment-planning-page.component.vue');

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
            description: 'Manage ports, routes and system configurations',
            icon: 'settings'
        }
    },
    {
        path: '/visualization',
        name: 'Visualization',
        //component: VisualizationPage,
        meta: {
            title: 'Visualization',
            description: 'Interactive visualization of route network',
            icon: 'chart'
        }
    },
    {
        path: '/optimization',
        name: 'Optimization',
        component: OptimizationPage,
        meta: {
            title: 'Route Optimization',
            description: 'Configure and execute optimization algorithms',
            icon: 'lightning'
        }
    },
    {
        path: '/results',
        name: 'Results',
        //component: ResultsPage,
        meta: {
            title: 'Optimization Results',
            description: 'View and analyze optimization results',
            icon: 'chart'
        }
    },
    {
        path: '/shipments',
        name: 'ShipmentPlanning',
        //component: ShipmentPlanningPage,
        meta: {
            title: 'Shipment Planning',
            description: 'Create and manage shipment plans',
            icon: 'package'
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