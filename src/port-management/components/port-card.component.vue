<template>
  <div class="port-card bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <!-- Port Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          {{ port.name }}
        </h3>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ port.country }}
          </span>
        </div>
      </div>

      <!-- Port Type Badge -->
      <span
          :class="portTypeBadgeClass"
          class="px-3 py-1 rounded-full text-xs font-medium"
      >
        {{ portTypeLabel }}
      </span>
    </div>

    <!-- Port Details -->
    <div class="space-y-3">
      <!-- Capacity -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Capacidad</span>
        <span class="font-medium text-gray-900">{{ port.getFormattedCapacity() }}</span>
      </div>

      <!-- Connections -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Conexiones</span>
        <span class="font-medium text-gray-900 flex items-center gap-1">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          {{ port.connections }} total
        </span>
      </div>

      <!-- Coordinates -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Coordenadas</span>
        <span class="font-mono text-xs text-gray-700">{{ port.getFormattedCoordinates() }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
      <button
          @click="onEdit"
          class="flex-1 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        Editar
      </button>
      <button
          @click="onViewDetails"
          class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        Detalles
      </button>
      <button
          @click="onDelete"
          class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import {PortTypeLabels} from "@/port-management/model/port.entity.js";

/**
 * PortCard Component
 * Displays port information in a card format
 *
 * @component
 */
export default {
  name: 'PortCard',

  props: {
    /**
     * Port instance to display
     * @type {Port}
     */
    port: {
      type: Object,
      required: true
    }
  },

  emits: [
    /**
     * Emitted when edit button is clicked
     * @event edit
     * @param {Port} port - Port to edit
     */
    'edit',

    /**
     * Emitted when delete button is clicked
     * @event delete
     * @param {Port} port - Port to delete
     */
    'delete',

    /**
     * Emitted when details button is clicked
     * @event view-details
     * @param {Port} port - Port to view
     */
    'view-details'
  ],

  setup(props, { emit }) {
    const portTypeLabel = computed(() => {
      return PortTypeLabels[props.port.type] || 'Unknown';
    });

    const portTypeBadgeClass = computed(() => {
      const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';

      const typeClasses = {
        'origin': 'bg-blue-100 text-blue-700',
        'destination': 'bg-purple-100 text-purple-700',
        'intermediate': 'bg-gray-100 text-gray-700'
      };

      return typeClasses[props.port.type] || 'bg-gray-100 text-gray-700';
    });

    /**
     * Handle edit action
     */
    const onEdit = () => {
      emit('edit', props.port);
    };

    /**
     * Handle delete action
     */
    const onDelete = () => {
      emit('delete', props.port);
    };

    /**
     * Handle view details action
     */
    const onViewDetails = () => {
      emit('view-details', props.port);
    };

    return {
      portTypeLabel,
      portTypeBadgeClass,
      onEdit,
      onDelete,
      onViewDetails
    };
  }
};
</script>

<style scoped>
.port-card {
  min-width: 320px;
}
</style>