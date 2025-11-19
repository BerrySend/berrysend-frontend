<template>
  <AuthLayout>
    <RegisterForm
        :loading="authStore.loading"
        :error="authStore.error"
        @submit="handleRegister"
        @login="handleLogin"
    />
  </AuthLayout>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth.store.js';
import AuthLayout from '@/auth/components/auth-layout.component.vue';
import RegisterForm from '@/auth/components/register-form.component.vue';

/**
 * RegisterPage Component
 * Main page for user registration
 *
 * @component
 */
export default {
  name: 'RegisterPageComponent',

  components: {
    AuthLayout,
    RegisterForm
  },

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    /**
     * Handles registration form submission
     *
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User full name
     * @param {string} userData.email - User email
     * @param {string} userData.password - User password
     */
    const handleRegister = async (userData) => {
      try {
        authStore.clearError();
        await authStore.register(userData);

        // Redirect to management page after successful registration
        router.push('/management');
      } catch (error) {
        // Error is already handled by the store
        console.error('Registration failed:', error);
      }
    };

    /**
     * Handles navigation to login page
     */
    const handleLogin = () => {
      router.push('/login');
    };

    return {
      authStore,
      handleRegister,
      handleLogin
    };
  }
};
</script>
