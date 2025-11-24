<template>
  <div class="network-graph">
    <svg
        ref="svgRef"
        class="graph-svg"
        :width="width"
        :height="height"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
    >
      <!-- Edges (routes) -->
      <g class="edges">
        <line
            v-for="edge in visibleEdges"
            :key="edge.id"
            :x1="getNodeById(edge.source)?.x"
            :y1="getNodeById(edge.source)?.y"
            :x2="getNodeById(edge.target)?.x"
            :y2="getNodeById(edge.target)?.y"
            :stroke="edge.getColor()"
            :stroke-width="edge.getStrokeWidth()"
            :stroke-dasharray="edge.mode === 'air' ? '5,5' : '0'"
            class="edge"
            :class="{ 'optimal': edge.isOptimal }"
            @mouseenter="handleEdgeHover(edge)"
        />

        <!-- Edge labels (distance) -->
        <text
            v-for="edge in visibleEdges"
            :key="`label-${edge.id}`"
            :x="(getNodeById(edge.source)?.x + getNodeById(edge.target)?.x) / 2"
            :y="(getNodeById(edge.source)?.y + getNodeById(edge.target)?.y) / 2 - 5"
            class="edge-label"
            text-anchor="middle"
        >
          {{ edge.distance }}t
        </text>
      </g>

      <!-- Nodes (ports) -->
      <g class="nodes">
        <g
            v-for="node in nodes"
            :key="node.id"
            @mouseenter="handleNodeHover(node)"
            class="node-group"
        >
          <circle
              :cx="node.x"
              :cy="node.y"
              :r="node.getRadius()"
              :fill="node.getColor()"
              class="node"
              :class="{ 'origin': node.type === 'origin', 'destination': node.type === 'destination' }"
          />

          <!-- Node label -->
          <text
              :x="node.x"
              :y="node.y - node.getRadius() - 8"
              class="node-label"
              text-anchor="middle"
          >
            {{ node.name }}
          </text>
        </g>
      </g>
    </svg>

    <!-- Tooltip -->
    <div
        v-if="tooltip.visible"
        class="tooltip"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
    >
      <div v-if="tooltip.type === 'node'" class="tooltip-content">
        <h4 class="font-semibold text-sm mb-1">{{ tooltip.data.name }}</h4>
        <p class="text-xs text-gray-600">{{ tooltip.data.type }}</p>
        <p class="text-xs text-gray-500 mt-1">
          {{ tooltip.data.coordinates.latitude.toFixed(2) }}°,
          {{ tooltip.data.coordinates.longitude.toFixed(2) }}°
        </p>
      </div>

      <div v-else-if="tooltip.type === 'edge'" class="tooltip-content">
        <div class="flex items-center gap-2 mb-2">
          <svg v-if="tooltip.data.mode === 'maritime'" class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l-4.95 2.6L3 13.5 6.5 9H3L1.5 7.5 2.3 5l2.7.8L7.5 3H9l-.5 3.5L12 5l.5 1.5-1.5 1.5h3.5l-3.5 4.5z"/>
          </svg>
          <svg v-else class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
          <span class="text-xs font-semibold">
            {{ tooltip.data.mode === 'maritime' ? 'Marítimo' : 'Aéreo' }}
          </span>
        </div>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-600">Distancia:</span>
            <span class="font-medium">{{ tooltip.data.getFormattedDistance() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Tiempo:</span>
            <span class="font-medium">{{ tooltip.data.getFormattedTime() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Costo:</span>
            <span class="font-medium">{{ tooltip.data.getFormattedCost() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import GraphEdge from "@/export-management/model/graph-edge.entity.js";

/**
 * NetworkGraph Component
 * Displays an interactive network graph of ports and routes
 *
 * @component
 */
export default {
  name: 'NetworkGraph',

  props: {
    /**
     * Array of graph nodes
     */
    nodes: {
      type: Array,
      required: true
    },

    /**
     * Array of graph edges
     */
    edges: {
      type: Array,
      required: true
    },

    /**
     * Array of node IDs that form the optimal route
     */
    optimalRoute: {
      type: Array,
      default: () => []
    },

    /**
     * Active transport mode filter
     */
    transportMode: {
      type: String,
      default: 'all', // 'all', 'maritime', 'air'
      validator: (value) => ['all', 'maritime', 'air'].includes(value)
    },

    /**
     * SVG width
     */
    width: {
      type: Number,
      default: 900
    },

    /**
     * SVG height
     */
    height: {
      type: Number,
      default: 500
    }
  },

  setup(props) {
    const svgRef = ref(null);
    const tooltip = ref({
      visible: false,
      x: 0,
      y: 0,
      type: null, // 'node' or 'edge'
      data: null
    });

    /**
     * Filter edges based on transport mode
     */
    const visibleEdges = computed(() => {
      let filtered = props.edges;

      // Filter by transport mode
      if (props.transportMode !== 'all') {
        filtered = filtered.filter(edge => edge.mode === props.transportMode);
      }

      // Mark optimal route edges
      if (props.optimalRoute.length > 0) {
        filtered = filtered.map(edge => {
          const edgeCopy = new GraphEdge(edge.toJSON());

          // Check if this edge is part of optimal route
          for (let i = 0; i < props.optimalRoute.length - 1; i++) {
            if (
                (edge.source === props.optimalRoute[i] && edge.target === props.optimalRoute[i + 1]) ||
                (edge.target === props.optimalRoute[i] && edge.source === props.optimalRoute[i + 1])
            ) {
              edgeCopy.isOptimal = true;
              break;
            }
          }

          return edgeCopy;
        });
      }

      return filtered;
    });

    /**
     * Get node by ID
     */
    const getNodeById = (nodeId) => {
      return props.nodes.find(n => n.id === nodeId);
    };

    /**
     * Handle node hover
     */
    const handleNodeHover = (node) => {
      tooltip.value = {
        visible: true,
        x: node.x + 15,
        y: node.y - 15,
        type: 'node',
        data: node
      };
    };

    /**
     * Handle edge hover
     */
    const handleEdgeHover = (edge) => {
      const sourceNode = getNodeById(edge.source);
      const targetNode = getNodeById(edge.target);

      if (sourceNode && targetNode) {
        tooltip.value = {
          visible: true,
          x: (sourceNode.x + targetNode.x) / 2 + 15,
          y: (sourceNode.y + targetNode.y) / 2 - 15,
          type: 'edge',
          data: edge
        };
      }
    };

    /**
     * Handle mouse move for tooltip positioning
     */
    const handleMouseMove = (event) => {
      if (tooltip.value.visible) {
        const rect = svgRef.value.getBoundingClientRect();
        tooltip.value.x = event.clientX - rect.left + 15;
        tooltip.value.y = event.clientY - rect.top - 15;
      }
    };

    /**
     * Handle mouse leave
     */
    const handleMouseLeave = () => {
      tooltip.value.visible = false;
    };

    return {
      svgRef,
      tooltip,
      visibleEdges,
      getNodeById,
      handleNodeHover,
      handleEdgeHover,
      handleMouseMove,
      handleMouseLeave
    };
  }
};
</script>

<style scoped>
.network-graph {
  position: relative;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
  border-radius: 12px;
  overflow: hidden;
}

.graph-svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* Edges */
.edge {
  transition: stroke-width 0.2s ease;
  cursor: pointer;
}

.edge:hover {
  stroke-width: 4 !important;
}

.edge.optimal {
  filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.5));
}

.edge-label {
  font-size: 10px;
  fill: #6b7280;
  font-weight: 500;
  pointer-events: none;
}

/* Nodes */
.node-group {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.node-group:hover {
  transform: scale(1.2);
}

.node {
  transition: all 0.2s ease;
  stroke: #ffffff;
  stroke-width: 2;
}

.node.origin,
.node.destination {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.node-label {
  font-size: 11px;
  font-weight: 600;
  fill: #1f2937;
  pointer-events: none;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* Tooltip */
.tooltip {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 150px;
}

.tooltip-content {
  white-space: nowrap;
}
</style>