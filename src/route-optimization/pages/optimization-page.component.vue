<template>
  <div class="optimization-page">
    <!-- Page Header -->
    <div class="page-header bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Motor de Optimización</h1>
          <p class="text-sm text-gray-600">Configure parámetros y ejecute algoritmos matemáticos de optimización</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Configuration -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Optimization Configuration -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-5">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h2 class="text-lg font-semibold text-gray-900">Configuración de Optimización</h2>
          </div>
          <p class="text-sm text-gray-600 mb-6">Configure los parámetros para encontrar la ruta óptima de transporte</p>

          <!-- Origin Port -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Puerto de Origen
            </label>
            <select
                v-model="config.originPortId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">Seleccione puerto de origen</option>
              <option
                  v-for="port in originPorts"
                  :key="port.id"
                  :value="port.id"
              >
                {{ port.name }} - {{ port.country }}
              </option>
            </select>
          </div>

          <!-- Destination Port -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Puerto de Destino
            </label>
            <select
                v-model="config.destinationPortId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">Seleccione puerto de destino</option>
              <option
                  v-for="port in destinationPorts"
                  :key="port.id"
                  :value="port.id"
              >
                {{ port.name }} - {{ port.country }}
              </option>
            </select>
          </div>

          <!-- Cargo Amount -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cantidad de Arándanos (toneladas)
            </label>
            <input
                v-model.number="config.cargoAmount"
                type="number"
                min="1"
                step="100"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Optimization Objective -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Objetivo de Optimización
            </label>
            <div class="space-y-2">
              <label
                  v-for="(label, key) in objectiveLabels"
                  :key="key"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50 border-blue-300': config.objective === key }"
              >
                <input
                    type="radio"
                    :value="key"
                    v-model="config.objective"
                    class="w-4 h-4 text-blue-500"
                />
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-900">{{ label }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Optimize Button -->
          <button
              @click="executeOptimization"
              :disabled="!canOptimize || isOptimizing"
              class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
                v-if="isOptimizing"
                class="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            {{ isOptimizing ? 'Optimizando Ruta...' : 'Optimizar Ruta' }}
          </button>
          
          <!-- Compare Algorithms Button -->
          <button
              @click="compareAllAlgorithms"
              :disabled="!canOptimize || isComparing"
              class="w-full mt-3 px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
                v-if="isComparing"
                class="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            {{ isComparing ? 'Comparando Algoritmos...' : 'Comparar Todos los Algoritmos' }}
          </button>
        </div>
        
        <!-- Comparison Results -->
        <div v-if="comparisonResults.length > 0" class="bg-white rounded-xl border border-gray-200 p-6 mt-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Comparación de Algoritmos
          </h2>
          
          <div class="space-y-4">
            <div
                v-for="result in comparisonResults"
                :key="result.algorithm"
                class="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                  <span
                      v-if="result.isBest"
                      class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                  >
                    ⭐ Mejor Opción
                  </span>
                  {{ result.algorithm }}
                </h3>
                <span class="text-xs text-gray-500">{{ result.execution_time }}ms</span>
              </div>
              
              <div class="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p class="text-gray-600">Distancia</p>
                  <p class="font-semibold text-gray-900">{{ result.total_distance }} km</p>
                </div>
                <div>
                  <p class="text-gray-600">Tiempo</p>
                  <p class="font-semibold text-gray-900">{{ result.total_time }} hrs</p>
                </div>
                <div>
                  <p class="text-gray-600">Costo</p>
                  <p class="font-semibold text-gray-900">${{ result.total_cost.toLocaleString() }}</p>
                </div>
              </div>
              
              <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-600 mb-1">Ruta:</p>
                <p class="text-xs font-mono text-gray-900">{{ result.visited_ports.join(' → ') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Algorithm Selection -->
      <div class="lg:col-span-1">
        <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Algoritmos de Grafos</h2>
          <p class="text-sm text-gray-600 mb-5">Seleccione el algoritmo de optimización de rutas</p>

          <!-- Algorithms Section -->
          <div class="bg-white rounded-lg p-4 mb-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Algoritmos de Optimización
            </h3>
            <p class="text-xs text-gray-600 mb-4">Seleccione el algoritmo más adecuado para su caso de uso</p>

            <!-- Loading State -->
            <div v-if="loadingAlgorithms" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p class="mt-2 text-sm text-gray-600">Cargando algoritmos...</p>
            </div>

            <!-- Algorithm Cards -->
            <div v-else class="space-y-3">
              <div
                  v-for="algorithm in algorithms"
                  :key="algorithm.id"
                  @click="selectAlgorithm(algorithm)"
                  :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition-all',
                  selectedAlgorithm?.id === algorithm.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    </svg>
                    {{ algorithm.name }}
                  </h4>
                  <span
                      v-if="algorithm.isRecommended"
                      class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                  >
                    ✓
                  </span>
                </div>

                <p class="text-xs text-gray-600 mb-3">{{ algorithm.description }}</p>

                <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-center mb-3">
                  {{ algorithm.complexity }}
                </div>

                <!-- Mini Metrics -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-600">Velocidad</span>
                    <span class="font-semibold">{{ algorithm.metrics.speed }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        class="bg-blue-500 h-1.5 rounded-full"
                        :style="{ width: `${algorithm.metrics.speed}%` }"
                    />
                  </div>

                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-600">Uso de Memoria</span>
                    <span class="font-semibold">{{ algorithm.metrics.memoryUsage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        class="bg-purple-500 h-1.5 rounded-full"
                        :style="{ width: `${algorithm.metrics.memoryUsage}%` }"
                    />
                  </div>

                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-600">Precisión</span>
                    <span class="font-semibold">{{ algorithm.metrics.precision }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        class="bg-green-500 h-1.5 rounded-full"
                        :style="{ width: `${algorithm.metrics.precision}%` }"
                    />
                  </div>
                </div>

                <!-- Advantages & Considerations -->
                <div class="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p class="font-semibold text-green-700 mb-1">Ventajas</p>
                    <ul class="space-y-0.5">
                      <li
                          v-for="(adv, idx) in algorithm.advantages.slice(0, 1)"
                          :key="idx"
                          class="text-gray-600 flex items-start gap-1"
                      >
                        <span class="text-green-500">✓</span>
                        <span>{{ adv }}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="font-semibold text-orange-700 mb-1">Consideraciones</p>
                    <ul class="space-y-0.5">
                      <li
                          v-for="(cons, idx) in algorithm.considerations.slice(0, 1)"
                          :key="idx"
                          class="text-gray-600 flex items-start gap-1"
                      >
                        <span class="text-orange-500">⚠</span>
                        <span>{{ cons }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import optimizationService from '../services/optimization.service';
import portService from '@/port-management/services/port.service';
import OptimizationConfig from "@/route-optimization/model/optimization-config.entity.js";
import { OptimizationObjectiveLabels} from "@/route-optimization/model/optimization-config.entity.js";

/**
 * OptimizationPage Component
 * Main page for route optimization configuration and execution
 *
 * @component
 */
export default {
  name: 'OptimizationPage',

  setup() {
    // State
    const algorithms = ref([]);
    const selectedAlgorithm = ref(null);
    const loadingAlgorithms = ref(false);
    const isOptimizing = ref(false);
    const isComparing = ref(false);
    const optimizationResult = ref(null);
    const comparisonResults = ref([]);

    const config = ref(new OptimizationConfig({
      cargoAmount: 1,
      objective: 'minimize_time'
    }));

    // Ports loaded from backend
    const originPorts = ref([]);
    const destinationPorts = ref([]);
    const loadingPorts = ref(false);

    const objectiveLabels = OptimizationObjectiveLabels;

    /**
     * Check if optimization can be executed
     */
    const canOptimize = computed(() => {
      return (
          config.value.originPortId &&
          config.value.destinationPortId &&
          config.value.originPortId !== config.value.destinationPortId &&
          selectedAlgorithm.value &&
          config.value.cargoAmount > 0
      );
    });

    /**
     * Fetch ports from backend
     */
    const fetchPorts = async () => {
      loadingPorts.value = true;
      try {
        const ports = await portService.getAllPorts();
        originPorts.value = ports;
        destinationPorts.value = ports;
      } catch (error) {
        console.error('Error fetching ports:', error);
        alert('Error cargando puertos. Por favor recargue la página.');
      } finally {
        loadingPorts.value = false;
      }
    };

    /**
     * Fetch available algorithms
     */
    const fetchAlgorithms = async () => {
      loadingAlgorithms.value = true;
      try {
        algorithms.value = await optimizationService.getAvailableAlgorithms();

        // Validar que cada algoritmo tiene la información completa
        algorithms.value.forEach((algo, idx) => {
        });

        // Select recommended algorithm by default
        const recommended = algorithms.value.find(algo => algo.isRecommended);
        if (recommended) {
          selectedAlgorithm.value = recommended;
          config.value.algorithmId = recommended.id;
        }
      } catch (error) {
        console.error('Error fetching algorithms:', error);
      } finally {
        loadingAlgorithms.value = false;
      }
    };

    /**
     * Select an algorithm
     */
    const selectAlgorithm = (algorithm) => {
      selectedAlgorithm.value = algorithm;
      config.value.algorithmId = algorithm.id;
    };

    /**
     * Execute optimization
     */
    const executeOptimization = async () => {
      if (!canOptimize.value) return;

      isOptimizing.value = true;
      try {
        // Determine mode based on origin port name
        const originPort = originPorts.value.find(p => p.id === config.value.originPortId);
        const isAirPort = originPort?.name?.includes('(') && originPort?.name?.includes(')');
        const transportMode = isAirPort ? 'air' : 'maritime';
        
        // Prepare params according to backend API specification
        const params = {
          source: config.value.originPortId,
          destination: config.value.destinationPortId,
          mode: transportMode,
          algorithm_name: selectedAlgorithm.value.id,
          export_weight: config.value.cargoAmount
        };
        
        // Only add parameters for bellman-ford
        if (selectedAlgorithm.value.id === 'bellman-ford') {
          params.parameters = {
            cost_multiplier: 0.4,
            distance_multiplier: 0.3,
            time_multiplier: 0.3
          };
        }

        const result = await optimizationService.computeOptimalRoute(params);
        
        // Store result
        optimizationResult.value = result;
        
        // Store in sessionStorage to pass to visualization page
        sessionStorage.setItem('optimizedRoute', JSON.stringify(result));
        
        // Check if backend returned optimized_route_id or we need to use route_id
        const routeId = result.optimized_route_id || result.route_id || result.id;
        
        if (!routeId) {
          console.error('❌ No se encontró ID de ruta en la respuesta del backend');
          alert('Error: La ruta fue optimizada pero no se recibió un ID.');
          return;
        }
        
        // Store optimization result to create export in visualization page
        sessionStorage.setItem('pendingExportData', JSON.stringify({
          optimized_route_id: routeId,
          comercial_description: '', // Will be filled in visualization page
          transportation_mode: result.route_mode,
          gross_weight: config.value.cargoAmount,
          net_weight: config.value.cargoAmount * 0.9, // Estimate
          us_fob: result.total_cost,
          unit: 'ton',
          quantity: config.value.cargoAmount
        }));
        
        // Navigate to visualization
        window.location.href = '/visualization';
      } catch (error) {
        console.error('Error executing optimization:', error);
        alert(`Error: ${error.message}`);
      } finally {
        isOptimizing.value = false;
      }
    };
    
    /**
     * Compare all algorithms
     */
    const compareAllAlgorithms = async () => {
      if (!canOptimize.value) return;

      isComparing.value = true;
      comparisonResults.value = [];
      
      try {
        const results = [];
        
        // Determine mode based on origin port name
        const originPort = originPorts.value.find(p => p.id === config.value.originPortId);
        const isAirPort = originPort?.name?.includes('(') && originPort?.name?.includes(')');
        const transportMode = isAirPort ? 'air' : 'maritime';
        
        // Execute optimization with each algorithm
        for (const algorithm of algorithms.value) {
          const startTime = performance.now();
          
          const params = {
            source: config.value.originPortId,
            destination: config.value.destinationPortId,
            mode: transportMode,
            algorithm_name: algorithm.id,
            export_weight: config.value.cargoAmount
          };
          
          // Add parameters for bellman-ford
          if (algorithm.id === 'bellman-ford') {
            params.parameters = {
              cost_multiplier: 0.4,
              distance_multiplier: 0.3,
              time_multiplier: 0.3
            };
          }
          
          try {
            const result = await optimizationService.computeOptimalRoute(params);
            const endTime = performance.now();
            
            results.push({
              algorithm: algorithm.name,
              algorithm_id: algorithm.id,
              execution_time: Math.round(endTime - startTime),
              total_distance: result.total_distance,
              total_time: result.total_time,
              total_cost: result.total_cost,
              visited_ports: result.visited_ports,
              success: true
            });
            
          } catch (error) {
            console.error(`❌ Error con ${algorithm.name}:`, error);
            results.push({
              algorithm: algorithm.name,
              algorithm_id: algorithm.id,
              execution_time: 0,
              error: error.message,
              success: false
            });
          }
        }
        
        // Find best result (lowest cost)
        const successfulResults = results.filter(r => r.success);
        if (successfulResults.length > 0) {
          const bestResult = successfulResults.reduce((best, current) => 
            current.total_cost < best.total_cost ? current : best
          );
          bestResult.isBest = true;
        }
        
        comparisonResults.value = results;
        
      } catch (error) {
        console.error('Error comparing algorithms:', error);
        alert(`Error al comparar algoritmos: ${error.message}`);
      } finally {
        isComparing.value = false;
      }
    };

    // Lifecycle
    onMounted(() => {
      fetchPorts();
      fetchAlgorithms();
    });

    return {
      algorithms,
      selectedAlgorithm,
      loadingAlgorithms,
      loadingPorts,
      isOptimizing,
      isComparing,
      optimizationResult,
      comparisonResults,
      config,
      originPorts,
      destinationPorts,
      objectiveLabels,
      canOptimize,
      selectAlgorithm,
      executeOptimization,
      compareAllAlgorithms
    };
  }
};
</script>

<style scoped>
.optimization-page {
  max-width: 1400px;
  margin: 0 auto;
}
</style>