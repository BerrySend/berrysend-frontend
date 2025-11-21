<template>
  <div class="visualization-page">
    <!-- Page Header -->
    <div class="page-header bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Mapa de Rutas Inteligente</h1>
            <p class="text-sm text-gray-600">Visualización interactiva del grafo ponderado con puertos y rutas de transporte optimizadas</p>
          </div>
        </div>

        <!-- Mode Toggles -->
        <div class="flex items-center gap-2">
          <span
              class="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm font-medium"
          >
            Tiempo Real
          </span>
          <span
              class="px-3 py-1 bg-purple-100 border border-purple-200 text-purple-600 rounded-lg text-sm font-medium"
          >
            Grafos Optimizados
          </span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div class="flex items-center justify-between">
        <!-- Transport Mode Buttons -->
        <div class="flex items-center gap-2">
          <button
              v-for="mode in transportModes"
              :key="mode.id"
              @click="activeTransportMode = mode.id"
              :class="[
              'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
              activeTransportMode === mode.id
                ? mode.activeClass
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <component :is="mode.icon" class="w-4 h-4" />
            {{ mode.label }}
          </button>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-gray-700">Origen</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-purple-500"></div>
            <span class="text-gray-700">Destino</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-gray-500"></div>
            <span class="text-gray-700">Intermedio</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-0.5 bg-red-500"></div>
            <span class="text-gray-700">Ruta Óptima</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Graph Visualization -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <GoogleMapsGraph
          :nodes="graphNodes"
          :edges="graphEdges"
          :optimal-route="optimalRoute"
          :transport-mode="activeTransportMode"
          :width="900"
      />
    </div>

    <!-- Exports Table -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div class="mb-4">
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Exportaciones Registradas
        </h2>
        <p class="text-sm text-gray-600 mt-1">{{ exportsList.length }} exportaciones en el sistema</p>
      </div>

      <div v-if="loadingExports" class="text-center py-8">
        <div class="inline-block animate-spin">
          <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </div>
        <p class="text-gray-600 mt-2">Cargando exportaciones...</p>
      </div>

      <div v-else-if="exportsList.length > 0" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Descripción Comercial</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Modo Transporte</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">FOB USD</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Peso Bruto</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Peso Neto</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Unidad</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Cantidad</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Fecha Creación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exportItem in exportsList" :key="exportItem.id" class="border-b border-gray-100 hover:bg-gray-50 transition">
              <td class="py-3 px-4 text-gray-900 font-medium">#{{ exportItem.id }}</td>
              <td class="py-3 px-4 text-gray-700">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ exportItem.user_id }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-700 max-w-xs truncate" :title="exportItem.commercial_description">
                {{ exportItem.commercial_description }}
              </td>
              <td class="py-3 px-4 text-gray-700">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  exportItem.transportation_mode === 'maritime'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                ]">
                  {{ exportItem.transportation_mode === 'maritime' ? '🌊 Marítimo' : '✈️ Aéreo' }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-700 font-semibold text-green-600">
                ${{ exportItem.us_fob.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>
              <td class="py-3 px-4 text-gray-700">{{ exportItem.gross_weight.toLocaleString() }}</td>
              <td class="py-3 px-4 text-gray-700">{{ exportItem.net_weight.toLocaleString() }}</td>
              <td class="py-3 px-4 text-gray-700">{{ exportItem.unit }}</td>
              <td class="py-3 px-4 text-gray-700 font-medium">{{ exportItem.quantity.toLocaleString() }}</td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusClass(exportItem.status)
                  ]"
                >
                  {{ getStatusLabel(exportItem.status) }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ formatDate(exportItem.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p class="text-gray-600">No hay exportaciones para mostrar</p>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          <span class="text-3xl font-bold text-gray-900">{{ statistics.originPorts }}</span>
        </div>
        <p class="text-sm text-gray-600">Puertos Origen</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          <span class="text-3xl font-bold text-gray-900">{{ statistics.destinationPorts }}</span>
        </div>
        <p class="text-sm text-gray-600">Puertos Destino</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l-4.95 2.6L3 13.5 6.5 9H3L1.5 7.5 2.3 5l2.7.8L7.5 3H9l-.5 3.5L12 5l.5 1.5-1.5 1.5h3.5l-3.5 4.5z"/>
          </svg>
          <span class="text-3xl font-bold text-gray-900">{{ statistics.maritimeRoutes }}</span>
        </div>
        <p class="text-sm text-gray-600">Rutas Marítimas</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
          <span class="text-3xl font-bold text-gray-900">{{ statistics.airRoutes }}</span>
        </div>
        <p class="text-sm text-gray-600">Rutas Aéreas</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, h } from 'vue';
import NetworkGraph from '../components/network-graph.component.vue';
import {graphService} from "@/export-management/services/graph.service.js";
import GraphEdge from "@/export-management/model/graph-edge.entity.js";
import GraphNode from "@/export-management/model/graph-node.entity.js";
import GoogleMapsGraph from "@/export-management/components/google-maps-graph.component.vue";
import ExportService from "@/export-management/services/export.service.js";

// Icon components
const EyeIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', 'd': 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', 'd': 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })
]);

const ShipIcon = () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M9 12l-4.95 2.6L3 13.5 6.5 9H3L1.5 7.5 2.3 5l2.7.8L7.5 3H9l-.5 3.5L12 5l.5 1.5-1.5 1.5h3.5l-3.5 4.5z' })
]);

const PlaneIcon = () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' })
]);

export default {
  name: 'VisualizationPage',

  components: {GoogleMapsGraph, NetworkGraph },

  setup() {
    const activeTransportMode = ref('all');
    const graphNodes = ref([]);
    const graphEdges = ref([]);
    const optimalRoute = ref([]);
    const exportsList = ref([]);
    const loadingExports = ref(false);

    const transportModes = [
      { id: 'all', label: 'Etiquetas', icon: EyeIcon, activeClass: 'bg-blue-500 text-white' },
      { id: 'maritime', label: 'Marítimo', icon: ShipIcon, activeClass: 'bg-blue-500 text-white' },
      { id: 'air', label: 'Aéreo', icon: PlaneIcon, activeClass: 'bg-purple-500 text-white' }
    ];

    const statistics = computed(() => ({
      originPorts: graphNodes.value.filter(n => n.type === 'origin').length,
      destinationPorts: graphNodes.value.filter(n => n.type === 'destination').length,
      maritimeRoutes: graphEdges.value.filter(e => e.mode === 'maritime').length,
      airRoutes: graphEdges.value.filter(e => e.mode === 'air').length,
    }));

    const getStatusClass = (status) => {
      const statusClasses = {
        'completed': 'bg-green-100 text-green-800',
        'in_transit': 'bg-blue-100 text-blue-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'cancelled': 'bg-red-100 text-red-800'
      };
      return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
      const statusLabels = {
        'completed': 'Completado',
        'in_transit': 'En tránsito',
        'pending': 'Pendiente',
        'cancelled': 'Cancelado'
      };
      return statusLabels[status] || status;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const loadGraphData = async () => {
      try {
        const [nodesRes, edgesRes, optimalRes] = await Promise.all([
          graphService.getNodes(),
          graphService.getEdges(),
          graphService.getOptimalRoute()
        ]);

        // Instantiate as entity classes
        graphNodes.value = nodesRes.data.map(node => new GraphNode(node));
        graphEdges.value = edgesRes.data.map(e => new GraphEdge(e));

        const routeNodeIds = optimalRes.data;
        const optimalRouteEdges = [];

        if (Array.isArray(routeNodeIds) && routeNodeIds.length > 0) {
          if (typeof routeNodeIds[0] === 'string') {
            for (let i = 0; i < routeNodeIds.length - 1; i++) {
              const fromId = routeNodeIds[i];
              const toId = routeNodeIds[i + 1];

              const edge = graphEdges.value.find(e =>
                (e.source === fromId && e.target === toId) ||
                (e.source === toId && e.target === fromId) ||
                (e.port_a_id === fromId && e.port_b_id === toId) ||
                (e.port_a_id === toId && e.port_b_id === fromId)
              );

              if (edge) {
                optimalRouteEdges.push(edge);
              } else {
                optimalRouteEdges.push(new GraphEdge({
                  source: fromId,
                  target: toId,
                  mode: 'maritime',
                  distance: 0,
                  time: 0,
                  cost: 0,
                  isOptimal: true
                }));
              }
            }
          } else {
            optimalRouteEdges.push(...routeNodeIds.map(edge => new GraphEdge(edge)));
          }
        }

        optimalRoute.value = optimalRouteEdges;

      } catch (error) {
        console.error('Error loading graph data:', error);
      }
    };

    const loadExports = async () => {
      loadingExports.value = true;
      try {
        exportsList.value = await ExportService.getAllExports();
      } catch (error) {
        console.error('Error loading exports:', error);
        // Fallback: mostrar lista vacía en lugar de romper la página
        exportsList.value = [];
      } finally {
        loadingExports.value = false;
      }
    };

    onMounted(() => {
      loadGraphData();
      loadExports();
    });

    return {
      activeTransportMode,
      transportModes,
      graphNodes,
      graphEdges,
      optimalRoute,
      statistics,
      exportsList,
      loadingExports,
      getStatusClass,
      getStatusLabel,
      formatDate
    };
  }
};
</script>


<style scoped>
.visualization-page {
  max-width: 1400px;
  margin: 0 auto;
}
</style>