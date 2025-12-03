<template>
  <div class="port-management-page">
    <!-- Page Header -->
    <div class="page-header bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Puertos</h1>
            <p class="text-sm text-gray-600">Administra puertos, rutas y configuraciones del sistema</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="stat-card bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
          </svg>
          <span class="text-2xl font-bold text-gray-900">{{ statistics.totalPorts }}</span>
        </div>
        <p class="text-sm text-gray-600">Total de Puertos</p>
      </div>

      <div class="stat-card bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span class="text-2xl font-bold text-gray-900">{{ statistics.maritimeRoutes }}</span>
        </div>
        <p class="text-sm text-gray-600">Rutas Marítimas</p>
      </div>

      <div class="stat-card bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          <span class="text-2xl font-bold text-gray-900">{{ statistics.airRoutes }}</span>
        </div>
        <p class="text-sm text-gray-600">Rutas Aéreas</p>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl p-5 border border-gray-200 mb-6">
      <div class="flex items-center gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nombre o país..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <!-- Filter Buttons -->
        <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeFilter === filter.value
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Port System Section -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        Puertos del Sistema
      </h2>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p class="mt-4 text-gray-600">Cargando puertos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-gray-900 font-medium mb-2">Error al cargar los puertos</p>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
            @click="fetchPorts"
            class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Ports Grid -->
      <div v-else-if="filteredPorts.length > 0" class="grid grid-cols-3 gap-4">
        <PortCard
            v-for="port in filteredPorts"
            :key="port.id"
            :port="port"
            @edit="handleEdit"
            @view-details="handleViewDetails"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p class="text-gray-600">No se encontraron puertos</p>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import portService from "@/port-management/services/port.service.js";
import PortCard from "@/port-management/components/port-card.component.vue";


/**
 * PortManagementPage Component
 * Main page for managing ports in the system
 *
 * @component
 */
export default {
  name: 'PortManagementPage',

  components: {
    PortCard
  },

  setup() {
    // State
    const ports = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const searchQuery = ref('');
    const activeFilter = ref('all');

    const statistics = computed(() => {
      const totalConnections = ports.value.reduce((sum, port) => sum + (port.connections || 0), 0);
      // Estimar proporción de rutas marítimas vs aéreas
      // Por defecto, aproximadamente 70% marítimas y 30% aéreas en transporte internacional
      const maritimeCount = Math.ceil(totalConnections * 0.7);
      const airCount = Math.ceil(totalConnections * 0.3);

      return {
        totalPorts: ports.value.length,
        maritimeRoutes: maritimeCount,
        airRoutes: airCount
      };
    });

    // Filter options
    const filters = [
      { value: 'all', label: 'Todos' },
      { value: 'national', label: 'Nacionales' },
      { value: 'international', label: 'Internacionales' }
    ];

    /**
     * Computed filtered ports based on search and active filter
     */
    const filteredPorts = computed(() => {
      let result = ports.value;

      // Apply country filter
      if (activeFilter.value !== 'all') {
        if (activeFilter.value === 'national') {
          result = result.filter(port => port.country?.toLowerCase() === 'peru');
        } else if (activeFilter.value === 'international') {
          result = result.filter(port => port.country?.toLowerCase() !== 'peru');
        }
      }

      // Apply search filter
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(port =>
            port.name.toLowerCase().includes(query) ||
            port.country.toLowerCase().includes(query)
        );
      }

      return result;
    });

    /**
     * Fetch all ports from API
     */
    const fetchPorts = async () => {
      loading.value = true;
      error.value = null;

      try {
        ports.value = await portService.getAllPorts();
      } catch (err) {
        error.value = err.message;
        console.error('Failed to fetch ports:', err);
      } finally {
        loading.value = false;
      }
    };

    /**
     * Handle edit port action
     */
    const handleEdit = (port) => {
      console.log('Edit port:', port);
      // TODO: Implement edit modal
    };

    /**
     * Handle view port details action
     */
    const handleViewDetails = (port) => {
      console.log('View details for port:', port);
      // TODO: Navigate to port details page
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchPorts();
    });

    return {
      ports,
      loading,
      error,
      searchQuery,
      activeFilter,
      statistics,
      filters,
      filteredPorts,
      fetchPorts,
      handleEdit,
      handleViewDetails
    };
  }
};
</script>

<style scoped>
.port-management-page {
  max-width: 1400px;
  margin: 0 auto;
}
</style>