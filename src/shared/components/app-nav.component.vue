<template>
  <nav class="app-nav bg-white border-b border-gray-200 px-6">
    <div class="flex gap-2">
      <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          :class="[
          'nav-tab flex items-center gap-2 px-6 py-3 font-medium transition-all relative',
          activeTab === tab.id
            ? 'text-blue-600 active'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}

        <!-- Active indicator -->
        <div
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        />
      </button>
    </div>
  </nav>
</template>

<script>
import { defineComponent, h } from 'vue';

// Icon components as render functions
const BarChartIcon = () => h('svg', {
  class: 'w-4 h-4',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  })
]);

const LightningIcon = () => h('svg', {
  class: 'w-4 h-4',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13 10V3L4 14h7v7l9-11h-7z'
  })
]);

const SettingsIcon = () => h('svg', {
  class: 'w-4 h-4',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }),
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  })
]);

/**
 * AppNav Component
 * Main navigation tabs for the application
 *
 * @component
 */
export default defineComponent({
  name: 'AppNav',

  props: {
    /**
     * Currently active tab ID
     */
    activeTab: {
      type: String,
      required: true
    }
  },

  emits: [
    /**
     * Emitted when a tab is selected
     * @event tab-change
     * @param {string} tabId - Selected tab ID
     */
    'tab-change'
  ],

  setup(props, { emit }) {
    /**
     * Navigation tabs configuration
     */
    const tabs = [
      {
        id: 'visualization',
        label: 'Visualización',
        icon: BarChartIcon
      },
      {
        id: 'optimization',
        label: 'Optimización',
        icon: LightningIcon
      },
      {
        id: 'management',
        label: 'Gestión',
        icon: SettingsIcon
      }
    ];

    /**
     * Handle tab selection
     */
    const selectTab = (tabId) => {
      emit('tab-change', tabId);
    };

    return {
      tabs,
      selectTab
    };
  }
});
</script>

<style scoped>
.app-nav {
  position: sticky;
  top: 116px;
  z-index: 40;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
}

.nav-tab {
  border-radius: 0;
  position: relative;
}

.nav-tab.active {
  background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05));
}

.nav-tab:hover {
  background: rgba(0, 0, 0, 0.02);
}

.nav-tab.active:hover {
  background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.08));
}
</style>