<template>
  <div
      :class="[
      'algorithm-card bg-white rounded-lg border-2 p-5 transition-all cursor-pointer',
      isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
    ]"
      @click="$emit('select', algorithm)"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-2">
        <!-- Lightning Icon -->
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900">{{ algorithm.name }}</h3>
      </div>

      <!-- Recommended Badge -->
      <span
          v-if="algorithm.isRecommended"
          class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        Recomendado
      </span>
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-600 mb-4">{{ algorithm.description }}</p>

    <!-- Complexity -->
    <div class="mb-4 p-2 bg-gray-50 rounded text-center">
      <code class="text-xs font-mono text-gray-700">{{ algorithm.complexity }}</code>
    </div>

    <!-- Metrics -->
    <div class="space-y-3 mb-4">
      <!-- Speed -->
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-600">Velocidad</span>
          <span class="font-semibold text-gray-900">{{ algorithm.metrics.speed }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
              class="bg-blue-500 h-2 rounded-full transition-all"
              :style="{ width: `${algorithm.metrics.speed}%` }"
          />
        </div>
      </div>

      <!-- Memory Usage -->
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-600">Uso de Memoria</span>
          <span class="font-semibold text-gray-900">{{ algorithm.metrics.memoryUsage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
              class="bg-purple-500 h-2 rounded-full transition-all"
              :style="{ width: `${algorithm.metrics.memoryUsage}%` }"
          />
        </div>
      </div>

      <!-- Precision -->
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-600">Precisión</span>
          <span class="font-semibold text-gray-900">{{ algorithm.metrics.precision }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
              class="bg-green-500 h-2 rounded-full transition-all"
              :style="{ width: `${algorithm.metrics.precision}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Advantages and Considerations -->
    <div class="grid grid-cols-2 gap-3 text-xs">
      <!-- Advantages -->
      <div>
        <h4 class="font-semibold text-green-700 mb-2">Ventajas</h4>
        <ul class="space-y-1">
          <li
              v-for="(advantage, index) in algorithm.advantages.slice(0, 2)"
              :key="index"
              class="flex items-start gap-1 text-gray-600"
          >
            <svg class="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>{{ advantage }}</span>
          </li>
        </ul>
      </div>

      <!-- Considerations -->
      <div>
        <h4 class="font-semibold text-orange-700 mb-2">Consideraciones</h4>
        <ul class="space-y-1">
          <li
              v-for="(consideration, index) in algorithm.considerations.slice(0, 2)"
              :key="index"
              class="flex items-start gap-1 text-gray-600"
          >
            <svg class="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>{{ consideration }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Selected Indicator -->
    <div v-if="isSelected" class="mt-4 pt-4 border-t border-blue-200">
      <p class="text-sm text-blue-600 font-medium text-center flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        Algoritmo Seleccionado
      </p>
    </div>
  </div>
</template>

<script>
/**
 * AlgorithmCard Component
 * Displays algorithm information in a selectable card format
 *
 * @component
 */
export default {
  name: 'AlgorithmCard',

  props: {
    /**
     * Algorithm instance to display
     * @type {Algorithm}
     */
    algorithm: {
      type: Object,
      required: true
    },

    /**
     * Whether this algorithm is currently selected
     */
    isSelected: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    /**
     * Emitted when algorithm card is clicked
     * @event select
     * @param {Algorithm} algorithm - Selected algorithm
     */
    'select'
  ]
};
</script>

<style scoped>
.algorithm-card {
  min-width: 280px;
}
</style>