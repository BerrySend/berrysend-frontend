<template>
  <div class="login-form">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p class="text-gray-600">Sign in to your account to continue</p>
    </div>

    <!-- Error Message -->
    <div
        v-if="error"
        class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
    >
      <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="you@example.com"
            :disabled="loading"
        />
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="••••••••"
            :disabled="loading"
        />
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
              v-model="form.rememberMe"
              type="checkbox"
              class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              :disabled="loading"
          />
          <span class="ml-2 text-sm text-gray-600">Remember me</span>
        </label>

        <a
            href="#"
            class="text-sm text-teal-600 hover:text-teal-700 font-medium"
            @click.prevent="handleForgotPassword"
        >
          Forgot password?
        </a>
      </div>

      <!-- Submit Button -->
      <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
      </button>
    </form>

    <!-- Register Link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <a
            href="#"
            class="text-teal-600 hover:text-teal-700 font-medium ml-1"
            @click.prevent="handleRegister"
        >
          Sign up
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

/**
 * LoginForm Component
 * Form component for user authentication
 *
 * @component
 */
export default {
  name: 'LoginFormComponent',

  emits: ['submit', 'register', 'forgot-password'],

  props: {
    /**
     * Loading state
     */
    loading: {
      type: Boolean,
      default: false
    },

    /**
     * Error message
     */
    error: {
      type: String,
      default: null
    }
  },

  setup(props, { emit }) {
    const form = ref({
      email: '',
      password: '',
      rememberMe: false
    });

    /**
     * Validates if form is valid
     */
    const isFormValid = computed(() => {
      return form.value.email.trim().length > 0 && form.value.password.length > 0;
    });

    /**
     * Handles form submission
     */
    const handleSubmit = () => {
      if (!isFormValid.value || props.loading) {
        return;
      }

      emit('submit', {
        email: form.value.email.trim(),
        password: form.value.password,
        rememberMe: form.value.rememberMe
      });
    };

    /**
     * Handles register link click
     */
    const handleRegister = () => {
      emit('register');
    };

    /**
     * Handles forgot password link click
     */
    const handleForgotPassword = () => {
      emit('forgot-password');
    };

    return {
      form,
      isFormValid,
      handleSubmit,
      handleRegister,
      handleForgotPassword
    };
  }
};
</script>
