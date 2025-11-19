<template>
  <div class="auth-layout min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-xl mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">BerrySend</h1>
        <p class="text-gray-600">Route Optimization Platform</p>
      </div>

      <!-- Auth Card -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <slot />
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-600">
        <p>© 2025 BerrySend. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * AuthLayout Component
 * Layout wrapper for authentication pages (login, register)
 *
 * @component
 */
export default {
  name: 'AuthLayoutComponent'
};
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
}
</style>
