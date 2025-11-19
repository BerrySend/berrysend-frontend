<template>
  <AuthLayout>
    <LoginForm
        :loading="authStore.loading"
        :error="authStore.error"
        @submit="handleLogin"
        @register="handleRegister"
        @forgot-password="handleForgotPassword"
    />
  </AuthLayout>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth.store.js';
import AuthLayout from '@/auth/components/auth-layout.component.vue';
import LoginForm from '@/auth/components/login-form.component.vue';

/**
 * LoginPage Component
 * Main page for user authentication
 *
 * @component
 */
export default {
  name: 'LoginPageComponent',

  components: {
    AuthLayout,
    LoginForm
  },

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    /**
     * Handles login form submission
     *
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     */
    const handleLogin = async (credentials) => {
      try {
        authStore.clearError();
        await authStore.login(credentials.email, credentials.password);

        // Redirect to management page after successful login
        router.push('/management');
      } catch (error) {
        // Error is already handled by the store
        console.error('Login failed:', error);
      }
    };

    /**
     * Handles navigation to register page
     */
    const handleRegister = () => {
      router.push('/register');
    };

    /**
     * Handles forgot password action
     */
    const handleForgotPassword = () => {
      // TODO: Implement forgot password functionality
      console.log('Forgot password clicked');
    };

    return {
      authStore,
      handleLogin,
      handleRegister,
      handleForgotPassword
    };
  }
};
</script>
