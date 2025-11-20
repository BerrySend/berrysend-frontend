<!-- src/export-management/components/google-maps-graph.component.vue -->
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
    let selectedNode = ref(null);
    let AdvancedMarkerElement = null;
    let google = null;
    let setOptionsInitialized = false;

    // ✅ CRÍTICO: setOptions ANTES de hacer cualquier otra cosa
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log('Configurando Google Maps con API Key:', apiKey ? 'presente' : 'NO PRESENTE');

    if (apiKey && !setOptionsInitialized) {
      setOptions({
        apiKey: apiKey,
        version: 'weekly'
      });
      setOptionsInitialized = true;
    } else {
      console.error('VITE_GOOGLE_MAPS_API_KEY no está configurada');
    }

    // Validar que las coordenadas sean números válidos
    const isValidCoordinate = (lat, lng) => {
      return typeof lat === 'number' && typeof lng === 'number' &&
             isFinite(lat) && isFinite(lng) &&
             lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    };

    // Garantizar que lat/lng sean números, accediendo directamente a coordinates
    const getCoordinates = (node) => {
      // Intentar diferentes formas de acceder a las coordenadas
      let lat = node?.coordinates?.latitude || node?.lat;
      let lng = node?.coordinates?.longitude || node?.lng;

      lat = parseFloat(lat);
      lng = parseFloat(lng);

      return { lat, lng };
    };

    const initMap = async () => {
      try {
        console.log('Iniciando mapa...');

        // Importar las bibliotecas necesarias
        const mapsLib = await importLibrary('maps');
        const markerLib = await importLibrary('marker');

        console.log('Librerías importadas:', { mapsLib: !!mapsLib, markerLib: !!markerLib });

        // Asignar referencias globales
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

        console.log('Creando mapa en:', mapContainer.value, 'con centro:', mapCenter);

        map = new google.Map(mapContainer.value, {
          zoom: 4,
          center: mapCenter,
          mapId: 'berrysend-map',                  // ✅ REQUERIDO para AdvancedMarkerElement
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          streetViewControl: false,
          rotateControl: false,
          scaleControl: true,
          tilt: 0,
          gestureHandling: 'greedy',
          restriction: {
            latLngBounds: {
              north: 85,
              south: -85,
              west: -180,
              east: 180
            },
            strictBounds: false
          },
          // ✅ Estilo personalizado para minimizar marca de agua
          styles: [
            {
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#616161"}]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{"color": "#f5f5f5"}]
            }
          ]
        });

        console.log('Mapa creado exitosamente');

        // Dibujar cuando la API y el mapa estén listos
        renderNodes();
        renderEdges();
        renderOptimalRoute();
      } catch (err) {
        console.error('Error inicializando Google Maps:', err);
      }
    };

    const calculateCenter = () => {
      if (props.nodes.length === 0) return { lat: 20, lng: 0 };

      let validNodes = props.nodes.filter(n => {
        const { lat, lng } = getCoordinates(n);
        return isValidCoordinate(lat, lng);
      });

      if (validNodes.length === 0) return { lat: 20, lng: 0 };

      const lat = validNodes.reduce((sum, n) => {
        const { lat } = getCoordinates(n);
        return sum + lat;
      }, 0) / validNodes.length;

      const lng = validNodes.reduce((sum, n) => {
        const { lng } = getCoordinates(n);
        return sum + lng;
      }, 0) / validNodes.length;

      return { lat, lng };
    };

    const renderNodes = () => {
      if (!map || !google) {
        console.warn('❌ Map or google not ready', { map: !!map, google: !!google });
        return;
      }

      // Limpiar marcadores anteriores
      markers.forEach(m => {
        try {
          if (m.map) m.map = null;
          else if (m.setMap) m.setMap(null);
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
      markers = [];

      console.log('📍 Rendering nodes:', props.nodes.length);
      if (props.nodes.length === 0) {
        console.warn('⚠️ No nodes to render');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      props.nodes.forEach((node, idx) => {
        const { lat, lng } = getCoordinates(node);

        // Log para depuración
        if (idx < 3) {
          console.log(`📍 Node ${idx}:`, {
            id: node.id,
            name: node.name,
            type: node.type,
            lat,
            lng,
            hasCoordinates: !!node.coordinates
          });
        }

        // Validar coordenadas antes de crear marcador
        if (!isValidCoordinate(lat, lng)) {
          console.warn(`❌ Invalid coordinates for node ${node.id}:`, { lat, lng });
          errorCount++;
          return;
        }

        const color = node.type === 'origin' ? '#3b82f6' :
                      node.type === 'destination' ? '#a855f7' :
                      '#6b7280';

        try {
          // Crear contenido del marcador con SVG
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
              position: { lat, lng },
              map: map,
              title: node.label || node.name,
              content: div
            });
          } else {
            // Fallback: crear un marcador simple sin AdvancedMarkerElement
            console.warn('AdvancedMarkerElement not available, using fallback');
            const infoWindow = new google.InfoWindow({
              content: div
            });

            // Crear un marcador invisible como punto de anclaje
            marker = {
              position: { lat, lng },
              map: map,
              infoWindow: infoWindow,
              setMap: function(m) {
                if (m) infoWindow.open(map, { position: this.position });
                else infoWindow.close();
              }
            };
          }

          // Agregar listener de click
          if (marker && marker.addEventListener) {
            marker.addEventListener('click', () => {
              selectedNode.value = node;
            });
          }

          markers.push(marker);
          successCount++;
        } catch (err) {
          console.error(`❌ Error creating marker for node ${node.id}:`, err);
          errorCount++;
        }
      });

      console.log(`✅ Nodes rendered: ${successCount} success, ${errorCount} errors`);
    };

    const createMarkerContent = (node, color) => {
      const div = document.createElement('div');
      div.style.cssText = `
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
        font-size: 12px;
      `;
      div.textContent = node.id;
      return div;
    };

    const renderEdges = () => {
      if (!map || !google) return;

      polylines.forEach(p => {
        try { p.setMap(null); } catch (e) {
          console.warn('Error removing polyline:', e);
        }
      });
      polylines = [];

      const filteredEdges = props.edges.filter(edge => {
        if (props.transportMode === 'all') return true;
        return edge.mode === props.transportMode;
      });

      filteredEdges.forEach(edge => {
        // Convertir Proxy a objeto plano
        const edgeObj = JSON.parse(JSON.stringify(edge));
        const fromId = edgeObj.source || edgeObj.from;
        const toId = edgeObj.target || edgeObj.to;

        const startNode = props.nodes.find(n => n.id === fromId);
        const endNode = props.nodes.find(n => n.id === toId);

        if (!startNode || !endNode) {
          console.warn(`Edge nodes not found: from=${fromId}, to=${toId}`, { edgeObj });
          return;
        }

        const startCoords = getCoordinates(startNode);
        const endCoords = getCoordinates(endNode);

        if (!isValidCoordinate(startCoords.lat, startCoords.lng) ||
            !isValidCoordinate(endCoords.lat, endCoords.lng)) {
          console.warn('Invalid coordinates for edge:', { edge: { from: fromId, to: toId }, startCoords, endCoords });
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
          console.error('Error creating polyline:', err);
        }
      });
    };

    const renderOptimalRoute = () => {
      if (!map || !google) return;
      if (props.optimalRoute.length === 0) {
        console.log('No optimal route to render');
        return;
      }

      console.log('Rendering optimal route with edges:', props.optimalRoute.length);
      console.log('First edge raw:', props.optimalRoute[0]);

      const routePath = [];

      props.optimalRoute.forEach((edge, idx) => {
        // Convertir Proxy a objeto plano
        const edgeObj = JSON.parse(JSON.stringify(edge));
        const fromId = edgeObj.source || edgeObj.from;

        if (idx === 0) {
          console.log(`Route edge ${idx} parsed:`, { fromId, edgeObj });
        }

        const startNode = props.nodes.find(n => n.id === fromId);

        if (startNode) {
          const coords = getCoordinates(startNode);
          if (idx === 0) {
            console.log(`Route edge ${idx}: from=${fromId}, coords=`, coords);
          }
          if (isValidCoordinate(coords.lat, coords.lng)) {
            routePath.push(coords);
          }
        } else {
          console.warn(`Start node not found for edge from: ${fromId}`, { edgeObj, availableNodeIds: props.nodes.map(n => n.id) });
        }
      });

      // Agregar el nodo destino de la última arista
      if (props.optimalRoute.length > 0) {
        const lastEdge = props.optimalRoute[props.optimalRoute.length - 1];
        const lastEdgeObj = JSON.parse(JSON.stringify(lastEdge));
        const toId = lastEdgeObj.target || lastEdgeObj.to;

        console.log('Last edge parsed:', { toId, lastEdgeObj });

        const endNode = props.nodes.find(n => n.id === toId);

        if (endNode) {
          const coords = getCoordinates(endNode);
          console.log(`Route final: to=${toId}, coords=`, coords);
          if (isValidCoordinate(coords.lat, coords.lng)) {
            routePath.push(coords);
          }
        } else {
          console.warn(`End node not found for edge to: ${toId}`, { lastEdgeObj, availableNodeIds: props.nodes.map(n => n.id) });
        }
      }

      console.log('Final route path:', routePath);

      if (routePath.length < 2) {
        console.warn('Insufficient valid coordinates for optimal route. Path length:', routePath.length);
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

        polylines.push(optimalPolyline);
        console.log('Optimal route rendered successfully');
      } catch (err) {
        console.error('Error creating optimal route polyline:', err);
      }
    };

    onMounted(initMap);

    // Watchers: solo ejecutar si el mapa está listo
    watch(() => props.nodes, () => {
      if (map) renderNodes();
    }, { deep: true });

    watch(() => props.transportMode, () => {
      if (map) renderEdges();
    });

    watch(() => props.optimalRoute, () => {
      if (map) renderOptimalRoute();
    }, { deep: true });

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
