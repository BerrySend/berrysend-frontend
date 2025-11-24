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

    const config = ref(new OptimizationConfig({
      cargoAmount: 1000,
      objective: 'minimize_time'
    }));

    // Mock ports data (should come from port service)
    const originPorts = ref([
      { id: 'callao', name: 'Puerto del Callao', country: 'Perú' },
      { id: 'paita', name: 'Puerto de Paita', country: 'Perú' },
      { id: 'matarani', name: 'Puerto de Matarani', country: 'Perú' }
    ]);

    const destinationPorts = ref([
      { id: 'shanghai', name: 'Puerto de Shanghai', country: 'China' },
      { id: 'rotterdam', name: 'Puerto de Rotterdam', country: 'Países Bajos' },
      { id: 'hamburg', name: 'Puerto de Hamburgo', country: 'Alemania' },
      { id: 'losangeles', name: 'Puerto de Los Ángeles', country: 'Estados Unidos' },
      { id: 'tokyo', name: 'Puerto de Tokio', country: 'Japón' },
      { id: 'miami', name: 'Puerto de Miami', country: 'Estados Unidos' }
    ]);

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
     * Fetch available algorithms
     */
    const fetchAlgorithms = async () => {
      loadingAlgorithms.value = true;
      try {
        algorithms.value = await optimizationService.getAvailableAlgorithms();

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
        await optimizationService.executeOptimization(config.value);

        alert('Optimization completed successfully!');
      } catch (error) {
        console.error('Error executing optimization:', error);
        alert(`Error: ${error.message}`);
      } finally {
        isOptimizing.value = false;
      }
    };

    // Lifecycle
    onMounted(() => {
      fetchAlgorithms();
    });

    return {
      algorithms,
      selectedAlgorithm,
      loadingAlgorithms,
      isOptimizing,
      config,
      originPorts,
      destinationPorts,
      objectiveLabels,
      canOptimize,
      selectAlgorithm,
      executeOptimization
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