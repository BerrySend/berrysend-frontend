<template>
  <div id="app">
    <!-- Auth Pages (Login/Register) - No layout wrapper -->
    <router-view v-if="isAuthPage" />

    <!-- Protected Pages - Main Layout -->
    <MainLayoutComponent v-else />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayoutComponent from "@/shared/components/main-layout.component.vue";

/**
 * App Component
 * Root component of the BerrySend application
 *
 * @component
 */
export default {
  name: 'App',

  components: {
    MainLayoutComponent
  },

  setup() {
    const route = useRoute();

    /**
     * Checks if current route is an authentication page
     */
    const isAuthPage = computed(() => {
      return route.path === '/login' || route.path === '/register';
    });

    return {
      isAuthPage
    };
  }
};
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: #f9fafb;
  color: #111827;
  line-height: 1.5;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Utility classes */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Button reset */
button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Input reset */
input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
}

/* Link reset */
a {
  color: inherit;
  text-decoration: none;
}

/* Focus visible for accessibility */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>