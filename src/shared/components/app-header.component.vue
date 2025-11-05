<template>
  <header class="app-header bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo and Title -->
      <div class="flex items-center gap-3">
        <div class="logo-container w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            BerrySend
            <span class="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-md font-semibold">
              Pro
            </span>
          </h1>
          <p class="text-sm text-gray-600">
            Optimización matemática de rutas para exportación de arándanos desde Perú
          </p>
        </div>
      </div>

      <!-- Statistics -->
      <div class="flex items-center gap-8">
        <StatCard
            :value="statistics.originPorts"
            label="Puertos de Origen"
            color="blue"
        />
        <StatCard
            :value="statistics.destinations"
            label="Destinos"
            color="purple"
        />
        <StatCard
            :value="statistics.activeRoutes"
            label="Rutas Activas"
            color="orange"
        />
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
import StatCard from '@/shared/components/stat-card.component.vue';

/**
 * AppHeader Component
 * Application header with branding and key statistics
 *
 * @component
 */
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
            typeof value.originPorts === 'number' &&
            typeof value.destinations === 'number' &&
            typeof value.activeRoutes === 'number'
        );
      }
    }
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
