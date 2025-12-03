<template>
  <header class="app-header bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo and Title -->
      <div class="flex items-center gap-3">
        <div class="logo-container">
          <img
            src="@/assets/berrysend_logo.png"
            alt="BerrySend Logo"
            class="h-12 w-auto object-contain rounded-xl"
          />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">BerrySend</h1>
          <p class="text-sm text-gray-600">
            Optimización matemática de rutas para exportación de arándanos desde Perú
          </p>
        </div>
      </div>

      <!-- Statistics and User Menu -->
      <div class="flex items-center gap-8">
        <StatCard
            :value="statistics.totalPorts"
            label="Puertos"
            color="blue"
        />
        <StatCard
            :value="statistics.activeRoutes"
            label="Rutas Activas"
            color="orange"
        />

        <!-- User Menu -->
        <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name || 'User' }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
          </div>
          <button
              @click="handleLogout"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Subtitle with badges -->
    <div class="flex items-center gap-2 mt-4 text-sm text-gray-600">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
      <span>Algoritmos Matemáticos</span>
      <span class="mx-2 text-gray-400">•</span>
      <span class="flex items-center gap-1">
        🔗 Optimización Multimodal
      </span>
    </div>
  </header>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth.store.js';
import StatCard from '@/shared/components/stat-card.component.vue';
export default {
  name: 'AppHeader',

  components: {
    StatCard
  },

  props: {
    /**
     * Header statistics object
     */
    statistics: {
      type: Object,
      required: true,
      validator: (value) => {
        return (
            typeof value.totalPorts === 'number' &&
            typeof value.activeRoutes === 'number'
        );
      }
    }
  },

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    /**
     * Handles logout action
     */
    const handleLogout = async () => {
      try {
        await authStore.logout();
        router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    return {
      authStore,
      handleLogout
    };
  }
};
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
}

.logo-container {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
