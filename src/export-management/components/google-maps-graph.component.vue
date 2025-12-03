<template>
  <div class="maps-container">
    <div id="google-maps-container" ref="mapContainer" class="map-canvas"></div>
    <div class="map-info">
      <p v-if="selectedNode" class="node-info">
        {{ selectedNode.label || selectedNode.name }} - {{ selectedNode.type }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

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
    let optimalPolylines = [];
    let selectedNode = ref(null);
    let AdvancedMarkerElement = null;
    let google = null;
    let setOptionsInitialized = false;
    let mapInitialized = false;

    const apiKey = 'AIzaSyDhbalJZscF0_BhYnoewyh5Ah4bz74-Lu4';
    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

    if (apiKey && !setOptionsInitialized) {
      setOptions({
        apiKey: apiKey,
        version: 'weekly'
      });
      setOptionsInitialized = true;
    } else {
      console.warn('VITE_GOOGLE_MAPS_API_KEY is not set. Google Maps may not function correctly.');
    }

    const isValidCoordinate = (lat, lng) => {
      return typeof lat === 'number' && typeof lng === 'number' &&
          isFinite(lat) && isFinite(lng) &&
          lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    };

    const getCoordinates = (node) => {
      let lat = node?.coordinates?.latitude || node?.lat;
      let lng = node?.coordinates?.longitude || node?.lng;

      lat = parseFloat(lat);
      lng = parseFloat(lng);

      return {lat, lng};
    };

    const initMap = async () => {
      if (mapInitialized || !mapContainer.value) return;

      try {
        if (mapContainer.value) {
          if (map) {
            map = null;
          }
          mapContainer.value.innerHTML = '';
        }

        const mapsLib = await importLibrary('maps');
        const markerLib = await importLibrary('marker');

        AdvancedMarkerElement = markerLib?.AdvancedMarkerElement;
        google = mapsLib;

        if (!google || !google.Map) {
          throw new Error('Google Maps library not loaded correctly');
        }

        const mapCenter = calculateCenter();

        if (!isValidCoordinate(mapCenter.lat, mapCenter.lng)) {
          console.warn('Invalid center coordinates, using default');
          mapCenter.lat = 20;
          mapCenter.lng = 0;
        }

        map = new google.Map(mapContainer.value, {
          zoom: 4,
          center: mapCenter,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          streetViewControl: false,
          rotateControl: false,
          scaleControl: false,
          tilt: 0,
          gestureHandling: 'greedy',
          mapId: mapId // <-- Agregado para evitar advertencia y habilitar marcadores avanzados
        });

        mapInitialized = true;
        renderNodes();
        renderEdges();
        renderOptimalRoute();
      } catch (err) {
        console.error('Error initializing Google Maps:', err);
      }
    };

    const calculateCenter = () => {
      if (props.nodes.length === 0) return {lat: 20, lng: 0};

      let validNodes = props.nodes.filter(n => {
        const {lat, lng} = getCoordinates(n);
        return isValidCoordinate(lat, lng);
      });

      if (validNodes.length === 0) return {lat: 20, lng: 0};

      const lat = validNodes.reduce((sum, n) => {
        const {lat} = getCoordinates(n);
        return sum + lat;
      }, 0) / validNodes.length;

      const lng = validNodes.reduce((sum, n) => {
        const {lng} = getCoordinates(n);
        return sum + lng;
      }, 0) / validNodes.length;

      return {lat, lng};
    };

    const renderNodes = () => {
      if (!map || !google) {
        console.warn('Map or google not initialized');
        return;
      }

      markers.forEach(m => {
        try {
          if (m.map) m.map = null;
          else if (m.setMap) m.setMap(null);
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
      markers = [];

      if (props.nodes.length === 0) {
        console.warn('No nodes to render');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      props.nodes.forEach((node) => {
        const {lat, lng} = getCoordinates(node);

        if (!isValidCoordinate(lat, lng)) {
          errorCount++;
          return;
        }

        const color = node.type === 'origin' ? '#3b82f6' :
            node.type === 'destination' ? '#a855f7' :
                '#6b7280';

        try {
          const div = document.createElement('div');

          div.innerHTML = `
            <div style="
              background-color: ${color};
              color: white;
              padding: 0;
              border-radius: 50%;
              font-weight: bold;
              text-align: center;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              font-size: 12px;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              ${node.id.substring(0, 2).toUpperCase()}
            </div>
          `;

          let marker;

          if (AdvancedMarkerElement) {
            marker = new AdvancedMarkerElement({
              position: {lat, lng},
              map: map,
              title: node.label || node.name,
              content: div
            });
          } else {
            const infoWindow = new google.InfoWindow({
              content: div
            });

            marker = {
              position: {lat, lng},
              map: map,
              infoWindow: infoWindow,
              setMap: function (m) {
                if (m) infoWindow.open(map, {position: this.position});
                else infoWindow.close();
              }
            };
          }

          if (marker && marker.addEventListener) {
            marker.addEventListener('click', () => {
              selectedNode.value = node;
            });
          }

          markers.push(marker);
          successCount++;
        } catch (err) {
          errorCount++;
        }
      });
    };

    const renderEdges = () => {
      if (!map || !google) return;

      polylines.forEach(p => {
        try {
          p.setMap(null);
        } catch (e) {
          console.warn('Error removing polyline:', e);
        }
      });
      polylines = [];

      const filteredEdges = props.edges.filter(edge => {
        if (props.transportMode === 'route') return true;
        if (props.transportMode === 'all') return true;
        return edge.mode === props.transportMode;
      });

      filteredEdges.forEach(edge => {
        const edgeObj = JSON.parse(JSON.stringify(edge));
        const fromId = edgeObj.source || edgeObj.from;
        const toId = edgeObj.target || edgeObj.to;

        const startNode = props.nodes.find(n => n.id === fromId);
        const endNode = props.nodes.find(n => n.id === toId);

        if (!startNode || !endNode) {
          return;
        }

        const startCoords = getCoordinates(startNode);
        const endCoords = getCoordinates(endNode);

        if (!isValidCoordinate(startCoords.lat, startCoords.lng) ||
            !isValidCoordinate(endCoords.lat, endCoords.lng)) {
          return;
        }

        try {
          const polyline = new google.Polyline({
            path: [startCoords, endCoords],
            geodesic: true,
            strokeColor: '#808080',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            map: map
          });

          polylines.push(polyline);
        } catch (err) {
        }
      });
    };

    const renderOptimalRoute = () => {
      if (!map || !google) return;

      optimalPolylines.forEach(p => {
        try {
          p.setMap(null);
        } catch (e) {
        }
      });
      optimalPolylines = [];

      if (props.optimalRoute.length === 0) {
        return;
      }

      const routePath = [];

      props.optimalRoute.forEach((edge) => {
        const edgeObj = JSON.parse(JSON.stringify(edge));
        const fromId = edgeObj.source || edgeObj.from;

        const startNode = props.nodes.find(n => n.id === fromId);

        if (startNode) {
          const coords = getCoordinates(startNode);
          if (isValidCoordinate(coords.lat, coords.lng)) {
            routePath.push(coords);
          }
        }
      });

      if (props.optimalRoute.length > 0) {
        const lastEdge = props.optimalRoute[props.optimalRoute.length - 1];
        const lastEdgeObj = JSON.parse(JSON.stringify(lastEdge));
        const toId = lastEdgeObj.target || lastEdgeObj.to;

        const endNode = props.nodes.find(n => n.id === toId);

        if (endNode) {
          const coords = getCoordinates(endNode);
          if (isValidCoordinate(coords.lat, coords.lng)) {
            routePath.push(coords);
          }
        }
      }

      if (routePath.length < 2) {
        return;
      }

      try {
        const optimalPolyline = new google.Polyline({
          path: routePath,
          geodesic: true,
          strokeColor: '#ef4444',
          strokeOpacity: 1,
          strokeWeight: 4,
          map: map
        });

        optimalPolylines.push(optimalPolyline);
      } catch (err) {
      }
    };

    onMounted(initMap);

    watch(() => props.nodes, () => {
      if (map && mapInitialized) {
        renderNodes();
      }
    }, {deep: true});

    watch(() => props.transportMode, () => {
      if (map && mapInitialized) {
        renderEdges();
        if (props.optimalRoute && props.optimalRoute.length > 0) {
          renderOptimalRoute();
        }
      }
    });

    watch(() => props.optimalRoute, () => {
      if (map && mapInitialized) {
        renderOptimalRoute();
      }
    }, {deep: true});

    return {
      mapContainer,
      selectedNode
    };
  }
}
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
  position: relative;
  overflow: hidden;
  background: #e0e7ff;
}

.map-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.node-info {
  margin: 0;
  font-size: 12px;
  color: #333;
}
</style>
