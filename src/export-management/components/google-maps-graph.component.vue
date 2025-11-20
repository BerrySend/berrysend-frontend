<!-- src/export-management/components/google-maps-graph.component.vue -->
<template>
  <div class="maps-container">
    <div ref="mapContainer" class="map-canvas"></div>
    <div class="map-info">
      <p v-if="selectedNode" class="node-info">
        {{ selectedNode.label }} - {{ selectedNode.type }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

export default {
  name: 'GoogleMapsGraph',
  props: {
    nodes: {
      type: Array,
      required: true
    },
    edges: {
      type: Array,
      required: true
    },
    optimalRoute: {
      type: Array,
      default: () => []
    },
    transportMode: {
      type: String,
      default: 'all'
    },
    width: {
      type: Number,
      default: 900
    },
    height: {
      type: Number,
      default: 500
    }
  },
  setup(props) {
    const mapContainer = ref(null);
    let map = null;
    let markers = [];
    let polylines = [];
    let selectedNode = ref(null);

    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly'
      });

      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement } = await loader.importLibrary('marker');

      const mapCenter = calculateCenter();

      map = new Map(mapContainer.value, {
        zoom: 12,
        center: mapCenter,
        mapTypeControl: true,
        fullscreenControl: true
      });

      renderNodes(AdvancedMarkerElement);
      renderEdges();
      renderOptimalRoute();
    };

    const calculateCenter = () => {
      if (props.nodes.length === 0) return { lat: 0, lng: 0 };

      const lat = props.nodes.reduce((sum, n) => sum + (n.lat || 0), 0) / props.nodes.length;
      const lng = props.nodes.reduce((sum, n) => sum + (n.lng || 0), 0) / props.nodes.length;

      return { lat, lng };
    };

    const renderNodes = (MarkerClass) => {
      markers.forEach(m => m.map = null);
      markers = [];

      props.nodes.forEach(node => {
        const color = node.type === 'origin' ? '#3b82f6' : node.type === 'destination' ? '#a855f7' : '#6b7280';

        const marker = new MarkerClass({
          position: { lat: node.lat, lng: node.lng },
          map: map,
          title: node.label,
          content: createMarkerContent(node, color)
        });

        marker.addListener('click', () => {
          selectedNode.value = node;
        });

        markers.push(marker);
      });
    };

    const createMarkerContent = (node, color) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <div style="
          background-color: ${color};
          color: white;
          padding: 4px 8px;
          border-radius: 50%;
          font-weight: bold;
          text-align: center;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          ${node.id}
        </div>
      `;
      return div;
    };

    const renderEdges = () => {
      polylines.forEach(p => p.setMap(null));
      polylines = [];

      const filteredEdges = props.edges.filter(edge => {
        if (props.transportMode === 'all') return true;
        return edge.mode === props.transportMode;
      });

      filteredEdges.forEach(edge => {
        const startNode = props.nodes.find(n => n.id === edge.from);
        const endNode = props.nodes.find(n => n.id === edge.to);

        if (startNode && endNode) {
          const polyline = new google.maps.Polyline({
            path: [
              { lat: startNode.lat, lng: startNode.lng },
              { lat: endNode.lat, lng: endNode.lng }
            ],
            geodesic: true,
            strokeColor: '#808080',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            map: map
          });

          polylines.push(polyline);
        }
      });
    };

    const renderOptimalRoute = () => {
      if (props.optimalRoute.length === 0) return;

      const routePath = [];
      props.optimalRoute.forEach(edge => {
        const startNode = props.nodes.find(n => n.id === edge.from);
        if (startNode) {
          routePath.push({ lat: startNode.lat, lng: startNode.lng });
        }
      });

      const lastEdge = props.optimalRoute[props.optimalRoute.length - 1];
      const endNode = props.nodes.find(n => n.id === lastEdge.to);
      if (endNode) {
        routePath.push({ lat: endNode.lat, lng: endNode.lng });
      }

      const optimalPolyline = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#ef4444',
        strokeOpacity: 1,
        strokeWeight: 4,
        map: map
      });

      polylines.push(optimalPolyline);
    };

    onMounted(initMap);

    watch(() => props.nodes, () => {
      if (map && markers.length > 0) {
        renderNodes();
      }
    });

    watch(() => props.transportMode, renderEdges);

    watch(() => props.optimalRoute, renderOptimalRoute);

    return {
      mapContainer,
      selectedNode
    };
  }
};
</script>

<style scoped>
.maps-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-canvas {
  width: 100%;
  height: 500px;
  border-radius: 8px;
}

.map-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.node-info {
  margin: 0;
  font-size: 12px;
  color: #333;
}
</style>
