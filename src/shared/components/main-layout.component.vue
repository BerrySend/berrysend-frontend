<template>
  <div class="main-layout min-h-screen bg-gray-50">
    <!-- Application Header -->
    <AppHeader :statistics="headerStats" />

    <!-- Navigation Tabs -->
    <AppNav :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Main Content Area -->
    <main class="main-content p-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '@/shared/components/app-header.component.vue';
import AppNav from '@/shared/components/app-nav.component.vue';
import PortService from '@/port-management/services/port.service.js';
import ExportService from '@/export-management/services/export.service.js';

/**
 * MainLayout Component
 * Main application layout with header and navigation
 *
 * @component
 */
export default {
  name: 'MainLayoutComponent',

  components: {
    AppHeader,
    AppNav
  },

  setup() {
    const router = useRouter();
    const route = useRoute();

    const activeTab = ref('management');

    // Header statistics
    const headerStats = ref({
      totalPorts: 0,
      activeRoutes: 0
    });

    /**
     * Load statistics from API
     */
    const loadStatistics = async () => {
      try {
        // Get all ports
        try {
          const ports = await PortService.getAllPorts();

          if (Array.isArray(ports)) {
            headerStats.value.totalPorts = ports.length;
          } else {
            console.warn('⚠️ Ports is not an array:', ports);
            headerStats.value.totalPorts = 0;
          }
        } catch (portError) {
          console.error('❌ Error fetching ports:', portError);
          headerStats.value.totalPorts = 0;
        }

        // Get all exports (active routes)
        try {
          const exports = await ExportService.getAllExports();

          if (Array.isArray(exports)) {
            headerStats.value.activeRoutes = exports.length;
          } else {
            console.warn('⚠️ Exports has unexpected format:', exports);
            headerStats.value.activeRoutes = 0;
          }
        } catch (exportError) {
          console.error('❌ Error fetching exports:', exportError);
          console.error('❌ Error message:', exportError.message);
          headerStats.value.activeRoutes = 0;
        }
      } catch (error) {
        console.error('❌ Unexpected error in loadStatistics:', error);
      }
    };

    /**
     * Handle tab change navigation
     */
    const handleTabChange = (tabId) => {
      activeTab.value = tabId;

      // Navigate to corresponding route
      const routeMap = {
        'visualization': '/visualization',
        'optimization': '/optimization',
        'management': '/management'
      };

      if (routeMap[tabId]) {
        router.push(routeMap[tabId]);
      }
    };

    /**
     * Update active tab based on current route
     */
    const updateActiveTab = () => {
      const path = route.path;

      if (path.includes('visualization')) {
        activeTab.value = 'visualization';
      } else if (path.includes('optimization')) {
        activeTab.value = 'optimization';
      } else if (path.includes('management')) {
        activeTab.value = 'management';
      }
    };

    onMounted(() => {
      updateActiveTab();
      loadStatistics();
    });

    return {
      activeTab,
      headerStats,
      handleTabChange
    };
  }
};
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 180px);
}

/* Page transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>