<template>
  <div class="register-form">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p class="text-gray-600">Sign up to get started with BerrySend</p>
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
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
            id="name"
            v-model="form.name"
            type="text"
            required
            autocomplete="name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="John Doe"
            :disabled="loading"
        />
      </div>

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
            autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="••••••••"
            :minlength="8"
            :disabled="loading"
        />
        <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
      </div>

      <!-- Confirm Password Field -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            :class="{ 'border-red-300': form.confirmPassword && !isPasswordMatch }"
            placeholder="••••••••"
            :disabled="loading"
        />
        <p
            v-if="form.confirmPassword && !isPasswordMatch"
            class="mt-1 text-xs text-red-600"
        >
          Passwords do not match
        </p>
      </div>

      <!-- Terms Agreement -->
      <div class="flex items-start">
        <input
            id="terms"
            v-model="form.agreeToTerms"
            type="checkbox"
            required
            class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1"
            :disabled="loading"
        />
        <label for="terms" class="ml-2 text-sm text-gray-600">
          I agree to the
          <a href="#" class="text-teal-600 hover:text-teal-700 font-medium">Terms of Service</a>
          and
          <a href="#" class="text-teal-600 hover:text-teal-700 font-medium">Privacy Policy</a>
        </label>
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
        <span>{{ loading ? 'Creating account...' : 'Create Account' }}</span>
      </button>
    </form>

    <!-- Login Link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <a
            href="#"
            class="text-teal-600 hover:text-teal-700 font-medium ml-1"
            @click.prevent="handleLogin"
        >
          Sign in
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

/**
 * RegisterForm Component
 * Form component for user registration
 *
 * @component
 */
export default {
  name: 'RegisterFormComponent',

  emits: ['submit', 'login'],

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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });

    /**
     * Checks if passwords match
     */
    const isPasswordMatch = computed(() => {
      if (!form.value.confirmPassword) {
        return true;
      }
      return form.value.password === form.value.confirmPassword;
    });

    /**
     * Validates if form is valid
     */
    const isFormValid = computed(() => {
      return (
          form.value.name.trim().length > 0 &&
          form.value.email.trim().length > 0 &&
          form.value.password.length >= 8 &&
          isPasswordMatch.value &&
          form.value.agreeToTerms
      );
    });

    /**
     * Handles form submission
     */
    const handleSubmit = () => {
      if (!isFormValid.value || props.loading) {
        return;
      }

      emit('submit', {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        password: form.value.password
      });
    };

    /**
     * Handles login link click
     */
    const handleLogin = () => {
      emit('login');
    };

    return {
      form,
      isPasswordMatch,
      isFormValid,
      handleSubmit,
      handleLogin
    };
  }
};
</script>
