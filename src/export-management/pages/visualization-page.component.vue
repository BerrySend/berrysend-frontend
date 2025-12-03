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
              @click="handleTransportModeClick(mode.id)"
              :class="[
              'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
              (mode.id === 'route' ? hasActiveOptimalRoute : activeTransportMode === mode.id)
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
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Descripción Comercial</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Modo Transporte</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">FOB USD</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Peso Bruto</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Peso Neto</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Cantidad</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Fecha Creación</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="exportItem in exportsList"
              :key="exportItem.id"
              class="border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer"
              @click="selectExport(exportItem)"
              :class="{ 'bg-blue-100': selectedExport?.id === exportItem.id }"
            >
              <td class="py-3 px-4 text-gray-900 font-medium">#{{ exportItem.id.substring(0, 4) }}</td>
              <td class="py-3 px-4 text-gray-700 max-w-xs truncate" :title="exportItem.comercial_description">
                {{ exportItem.comercial_description }}
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
              <td class="py-3 px-4 text-gray-700 font-medium">{{ exportItem.quantity.toLocaleString() }}</td>
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

    <!-- Export Creation Modal -->
    <div
        v-if="showExportModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="cancelExport"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">Guardar Export</h3>
          <button
              @click="cancelExport"
              class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <p class="text-sm text-gray-600 mb-6">
          La ruta ha sido optimizada exitosamente. Complete la información para guardar el export.
        </p>
        
        <div class="space-y-4">
          <!-- Commercial Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción Comercial *
            </label>
            <input
                v-model="exportForm.comercial_description"
                type="text"
                placeholder="Ej: Arándanos frescos"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <input
                v-model.number="exportForm.quantity"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Unit -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Unidad
            </label>
            <select
                v-model="exportForm.unit"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="kg">Kilogramos (kg)</option>
              <option value="ton">Toneladas (ton)</option>
              <option value="lb">Libras (lb)</option>
            </select>
          </div>
          
          <!-- Route Info Summary -->
          <div v-if="pendingExport" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-blue-900 mb-2">Información de la Ruta</h4>
            <div class="space-y-1 text-xs text-blue-800">
              <p><strong>Modo:</strong> {{ pendingExport.transportation_mode }}</p>
              <p><strong>Peso bruto:</strong> {{ pendingExport.gross_weight }} kg</p>
              <p><strong>Peso neto:</strong> {{ pendingExport.net_weight }} kg</p>
              <p><strong>Valor FOB:</strong> ${{ pendingExport.us_fob.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex gap-3 mt-6">
          <button
              @click="cancelExport"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
              @click="saveExport"
              :disabled="savingExport || !exportForm.comercial_description.trim()"
              class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
                v-if="savingExport"
                class="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>{{ savingExport ? 'Guardando...' : 'Guardar Export' }}</span>
          </button>
        </div>
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

const RouteIcon = () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', 'd': 'M13 10V3L4 14h7v7l9-11h-7z' })
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
    const selectedExport = ref(null);
    
    // Track if an optimal route is currently displayed
    const hasActiveOptimalRoute = ref(false);

    // Pending export from optimization
    const pendingExport = ref(null);
    const showExportModal = ref(false);
    const exportForm = ref({
      comercial_description: '',
      unit: 'ton',
      quantity: 0
    });
    const savingExport = ref(false);

    const handleTransportModeClick = (modeId) => {
      if (modeId === 'route') {
        // Toggle the optimal route visibility
        hasActiveOptimalRoute.value = !hasActiveOptimalRoute.value;
        if (!hasActiveOptimalRoute.value) {
          // Just hide the optimal route, don't clear the edges
          optimalRoute.value = [];
        } else if (selectedExport.value) {
          // Re-display the optimal route for the selected export without clearing edges
          selectExport(selectedExport.value);
        }
      } else {
        activeTransportMode.value = modeId;
        // Keep the optimal route visible if it was previously shown
      }
    };

    const transportModes = [
      { id: 'route', label: 'Ver Ruta Óptima', icon: RouteIcon, activeClass: 'bg-purple-500 text-white' },
      { id: 'maritime', label: 'Marítimo', icon: ShipIcon, activeClass: 'bg-blue-500 text-white' },
      { id: 'air', label: 'Aéreo', icon: PlaneIcon, activeClass: 'bg-indigo-500 text-white' }
    ];

    const statistics = computed(() => ({
      originPorts: graphNodes.value.filter(n => n.type === 'origin').length,
      destinationPorts: graphNodes.value.filter(n => n.type === 'destination').length,
      maritimeRoutes: graphEdges.value.filter(e => e.mode === 'maritime').length,
      airRoutes: graphEdges.value.filter(e => e.mode === 'air').length,
      totalPorts: graphNodes.value.length,
      totalRoutes: graphEdges.value.length
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

    /**
     * Normaliza los campos de exportación desde diferentes fuentes de API
     */
    const normalizeExportData = (exportItem) => {
      // Extrae comercial_description con múltiples fallbacks
      const getCommercialDescription = () => {
        // Prioridad 1: comercial_description
        if (exportItem.comercial_description && exportItem.comercial_description.trim()) {
          return exportItem.comercial_description.trim();
        }
        // Prioridad 2: commercial_description
        if (exportItem.commercial_description && exportItem.commercial_description.trim()) {
          return exportItem.commercial_description.trim();
        }
        // Prioridad 3: description
        if (exportItem.description && exportItem.description.trim()) {
          return exportItem.description.trim();
        }
        // Fallback
        return 'Sin descripción';
      };

      const normalized = {
        ...exportItem,
        comercial_description: getCommercialDescription(),
        transportation_mode: exportItem.transportation_mode || exportItem.transport_mode || 'maritime',
        us_fob: exportItem.us_fob || exportItem.fob || 0,
        gross_weight: exportItem.gross_weight || exportItem.peso_bruto || 0,
        net_weight: exportItem.net_weight || exportItem.peso_neto || 0,
        quantity: exportItem.quantity || exportItem.cantidad || 0,
        created_at: exportItem.created_at || exportItem.fecha_creacion || new Date().toISOString(),
        id: exportItem.id || Math.random().toString(36).substr(2, 9),
        optimized_route_id: exportItem.optimized_route_id || null,
        optimized_route: exportItem.optimized_route || null
      };

      return normalized;
    };

    const loadGraphData = async () => {
      try {
        const [nodesRes, edgesRes] = await Promise.all([
          graphService.getNodes(),
          graphService.getEdges()
        ]);

        graphNodes.value = nodesRes.data.map(node => new GraphNode(node));
        graphEdges.value = edgesRes.data.map(e => new GraphEdge(e));

        // Optimal route will be loaded from session storage or when an export is selected
        optimalRoute.value = [];

      } catch (error) {
        console.error('Error loading graph data:', error);
      }
    };

    const loadExports = async () => {
      loadingExports.value = true;
      try {
        const data = await ExportService.getAllExports();
        if (data && data.length > 0) {
          exportsList.value = data.map(exp => normalizeExportData(exp));
        } else {
          exportsList.value = data;
        }
      } catch (error) {
        console.error('Error loading exports:', error);
        exportsList.value = [];
      } finally {
        loadingExports.value = false;
      }
    };


    const findPortNodeByName = (portName) => {
      if (!portName) return null;

      const normalizedSearchName = portName.toLowerCase().trim();

      let node = graphNodes.value.find(n =>
        n.name && n.name.toLowerCase() === normalizedSearchName
      );
      if (node) {
        return node;
      }

      const firstWord = normalizedSearchName.split(/[(\s]+/)[0];
      if (firstWord && firstWord.length > 0) {
        node = graphNodes.value.find(n =>
          n.name && n.name.toLowerCase().startsWith(firstWord)
        );
        if (node) {
          return node;
        }
      }

      node = graphNodes.value.find(n =>
        n.name && n.name.toLowerCase().includes(normalizedSearchName)
      );
      if (node) {
        return node;
      }

      const codeMatch = normalizedSearchName.match(/\(([A-Z]{3})/);
      if (codeMatch) {
        const code = codeMatch[1];
        node = graphNodes.value.find(n =>
          n.name && n.name.toUpperCase().includes(code)
        );
        if (node) {
          return node;
        }
      }

      return null;
    };

    const selectExport = async (exportItem) => {
      selectedExport.value = exportItem;

      try {
        // Reset all nodes to intermediate type first
        graphNodes.value = graphNodes.value.map(node => ({
          ...node,
          type: 'intermediate'
        }));

        if (exportItem.optimized_route && exportItem.optimized_route.visited_ports) {
          const routeData = exportItem.optimized_route;

          // Create edges between consecutive ports using visited_ports
          const routeEdges = [];
          const visitedPorts = routeData.visited_ports;
          
          // Mark first port as origin, last as destination
          if (visitedPorts.length > 0) {
            const firstPortName = visitedPorts[0];
            const lastPortName = visitedPorts[visitedPorts.length - 1];

            graphNodes.value = graphNodes.value.map(node => {
              if (findPortNodeByName(firstPortName)?.id === node.id) {
                return { ...node, type: 'origin' };
              } else if (findPortNodeByName(lastPortName)?.id === node.id && findPortNodeByName(firstPortName)?.id !== node.id) {
                return { ...node, type: 'destination' };
              }
              return node;
            });
          }

          for (let i = 0; i < visitedPorts.length - 1; i++) {
            const fromPortName = visitedPorts[i];
            const toPortName = visitedPorts[i + 1];
            
            // Find port nodes by name with flexible matching
            const fromNode = findPortNodeByName(fromPortName);
            const toNode = findPortNodeByName(toPortName);

            if (!fromNode || !toNode) {
              console.warn(`Puerto no encontrado: ${fromPortName} o ${toPortName}`);
              continue;
            }
            
            // Try to find existing edge in graph
            const existingEdge = graphEdges.value.find(e =>
              (e.source === fromNode.id && e.target === toNode.id) ||
              (e.target === fromNode.id && e.source === toNode.id)
            );
            
            if (existingEdge) {
              routeEdges.push(new GraphEdge({
                ...existingEdge,
                isOptimal: true
              }));
            } else {
              // Create new edge for visualization
              routeEdges.push(new GraphEdge({
                source: fromNode.id,
                target: toNode.id,
                mode: routeData.route_mode || 'maritime',
                isOptimal: true
              }));
            }
          }
          
          optimalRoute.value = routeEdges;
          hasActiveOptimalRoute.value = true;

        } else if (exportItem.optimized_route_id) {
          // Export has route ID but not the full route data
          // Try to fetch the route separately
          console.log('📡 Cargando ruta por ID:', exportItem.optimized_route_id);
          
          try {
            const routeData = await ExportService.getRouteById(exportItem.optimized_route_id);

            // Mark first port as origin, last as destination
            const visitedPorts = routeData.visited_ports || [];
            if (visitedPorts.length > 0) {
              const firstPortName = visitedPorts[0];
              const lastPortName = visitedPorts[visitedPorts.length - 1];

              graphNodes.value = graphNodes.value.map(node => {
                if (findPortNodeByName(firstPortName)?.id === node.id) {
                  return { ...node, type: 'origin' };
                } else if (findPortNodeByName(lastPortName)?.id === node.id && findPortNodeByName(firstPortName)?.id !== node.id) {
                  return { ...node, type: 'destination' };
                }
                return node;
              });
            }

            // Create edges using the fetched route data
            const routeEdges = [];

            for (let i = 0; i < visitedPorts.length - 1; i++) {
              const fromPortName = visitedPorts[i];
              const toPortName = visitedPorts[i + 1];
              
              const fromNode = findPortNodeByName(fromPortName);
              const toNode = findPortNodeByName(toPortName);

              if (!fromNode || !toNode) {
                console.warn(`Puerto no encontrado: ${fromPortName} o ${toPortName}`);
                continue;
              }
              
              const existingEdge = graphEdges.value.find(e =>
                (e.source === fromNode.id && e.target === toNode.id) ||
                (e.target === fromNode.id && e.source === toNode.id)
              );
              
              if (existingEdge) {
                routeEdges.push(new GraphEdge({
                  ...existingEdge,
                  isOptimal: true
                }));
              } else {
                routeEdges.push(new GraphEdge({
                  source: fromNode.id,
                  target: toNode.id,
                  mode: routeData.route_mode || 'maritime',
                  isOptimal: true
                }));
              }
            }
            
            optimalRoute.value = routeEdges;
            hasActiveOptimalRoute.value = true;
            console.log('🎯 Ruta óptima cargada desde API:', routeEdges.length, 'conexiones');
            
          } catch (routeError) {
            console.error('❌ Error cargando ruta:', routeError);
            optimalRoute.value = [];
            hasActiveOptimalRoute.value = false;
          }
        } else {
          console.warn('Export no tiene ruta optimizada asociada');
          optimalRoute.value = [];
          hasActiveOptimalRoute.value = false;
        }

      } catch (error) {
        console.error('❌ Error al seleccionar exportación:', error);
      }
    };

    /**
     * Save export from optimization result
     */
    const saveExport = async () => {
      if (!pendingExport.value) return;
      
      if (!exportForm.value.comercial_description.trim()) {
        alert('Por favor ingrese una descripción comercial');
        return;
      }
      
      if (!pendingExport.value?.optimized_route_id) {
        alert('Error: No se encontró el ID de la ruta optimizada');
        return;
      }
      
      savingExport.value = true;
      try {
        // Get user ID from localStorage (berrysend_user key)
        const storedUser = localStorage.getItem('berrysend_user');
        if (!storedUser) {
          throw new Error('Usuario no autenticado. Por favor inicie sesión nuevamente.');
        }
        
        const userData = JSON.parse(storedUser);
        const userId = userData.id;
        
        if (!userId) {
          throw new Error('ID de usuario no encontrado');
        }
        
        // Validate all required fields
        const gross_weight = Number(pendingExport.value.gross_weight);
        const net_weight = Number(pendingExport.value.net_weight);
        const us_fob = Number(pendingExport.value.us_fob);
        const quantity = Number(exportForm.value.quantity);
        
        if (gross_weight <= 0 || net_weight <= 0 || quantity <= 0) {
          throw new Error('Los pesos y cantidad deben ser mayores a 0');
        }
        
        const exportData = {
          comercial_description: exportForm.value.comercial_description.trim(),
          transportation_mode: pendingExport.value.transportation_mode,
          us_fob: us_fob,
          gross_weight: gross_weight,
          net_weight: net_weight,
          unit: exportForm.value.unit,
          quantity: quantity,
          optimized_route_id: pendingExport.value.optimized_route_id,
          user_id: userId
        };
        
        const createdExport = await ExportService.createExport(exportData);
        
        // Clear pending data
        sessionStorage.removeItem('pendingExportData');
        sessionStorage.removeItem('optimizedRoute');
        pendingExport.value = null;
        showExportModal.value = false;
        
        // Reload exports and select the new one
        await loadExports();
        const newExport = exportsList.value.find(e => e.export_id === createdExport.export_id);
        if (newExport) {
          selectExport(newExport);
        }
        
      } catch (error) {
        console.error('Error guardando export:', error);
        
        let errorMessage = 'Error al guardar el export';
        if (error.response?.data?.detail) {
          if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          } else if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail.map(e => e.msg || e.message).join('\n');
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(`Error al guardar:\n${errorMessage}`);
      } finally {
        savingExport.value = false;
      }
    };
    
    /**
     * Cancel export creation
     */
    const cancelExport = () => {
      sessionStorage.removeItem('pendingExportData');
      sessionStorage.removeItem('optimizedRoute');
      pendingExport.value = null;
      showExportModal.value = false;
      optimalRoute.value = [];
    };

    onMounted(() => {
      loadGraphData();
      loadExports();
      
      // Check for pending export data from optimization
      const pendingData = sessionStorage.getItem('pendingExportData');
      const optimizedRouteData = sessionStorage.getItem('optimizedRoute');
      
      if (pendingData && optimizedRouteData) {
        try {
          pendingExport.value = JSON.parse(pendingData);
          const routeResult = JSON.parse(optimizedRouteData);
          
          // Pre-fill form
          exportForm.value.quantity = pendingExport.value.quantity || 0;
          exportForm.value.unit = pendingExport.value.unit || 'ton';
          
          // Show modal
          showExportModal.value = true;
          
          // Load the optimized route on the map
          console.log('📍 Cargando ruta optimizada en el mapa:', routeResult);
          
          // Wait for graph data to load first
          setTimeout(async () => {
            if (routeResult.visited_ports && graphNodes.value.length > 0) {
              const routeEdges = [];
              const visitedPorts = routeResult.visited_ports;
              
              for (let i = 0; i < visitedPorts.length - 1; i++) {
                const fromPortName = visitedPorts[i];
                const toPortName = visitedPorts[i + 1];
                
                const fromNode = findPortNodeByName(fromPortName);
                const toNode = findPortNodeByName(toPortName);

                if (fromNode && toNode) {
                  routeEdges.push(new GraphEdge({
                    source: fromNode.id,
                    target: toNode.id,
                    mode: routeResult.route_mode || 'maritime',
                    isOptimal: true
                  }));
                }
              }
              
              optimalRoute.value = routeEdges;
              hasActiveOptimalRoute.value = true;
              console.log('🎯 Ruta pendiente cargada en el mapa:', routeEdges.length, 'conexiones');
            }
          }, 1000);
          
        } catch (error) {
          console.error('Error loading pending export:', error);
        }
      }
    });

    return {
      activeTransportMode,
      transportModes,
      graphNodes,
      graphEdges,
      optimalRoute,
      hasActiveOptimalRoute,
      statistics,
      exportsList,
      loadingExports,
      pendingExport,
      showExportModal,
      exportForm,
      savingExport,
      saveExport,
      cancelExport,
      selectedExport,
      selectExport,
      getStatusClass,
      getStatusLabel,
      formatDate,
      handleTransportModeClick,
      findPortNodeByName
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