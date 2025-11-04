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
      originPorts: 3,
      destinations: 6,
      activeRoutes: 13
    });

    /**
     * Handle tab change navigation
     */
    const handleTabChange = (tabId) => {
      activeTab.value = tabId;

      // Navigate to corresponding route
      const routeMap = {
        'visualization': '/visualization',
        'optimization': '/optimization',
        'results': '/results',
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
      } else if (path.includes('results')) {
        activeTab.value = 'results';
      } else if (path.includes('management')) {
        activeTab.value = 'management';
      }
    };

    onMounted(() => {
      updateActiveTab();
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