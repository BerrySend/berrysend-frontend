<template>
  <div class="stat-card text-center">
    <div :class="['text-2xl font-bold mb-1', textColorClass]">
      {{ formattedValue }}
    </div>
    <div class="text-xs text-gray-600">
      {{ label }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

/**
 * StatCard Component
 * Displays a statistic with label and color coding
 *
 * @component
 */
export default {
  name: 'StatCard',

  props: {
    /**
     * Numeric value to display
     */
    value: {
      type: Number,
      required: true
    },

    /**
     * Label for the statistic
     */
    label: {
      type: String,
      required: true
    },

    /**
     * Color theme: 'blue', 'purple', 'orange', 'green', 'red'
     */
    color: {
      type: String,
      default: 'blue',
      validator: (value) => {
        return ['blue', 'purple', 'orange', 'green', 'red', 'teal'].includes(value);
      }
    },

    /**
     * Format as decimal number
     */
    decimal: {
      type: Boolean,
      default: false
    },

    /**
     * Number of decimal places (if decimal is true)
     */
    decimals: {
      type: Number,
      default: 1
    }
  },

  setup(props) {
    /**
     * Get text color class based on color prop
     */
    const textColorClass = computed(() => {
      const colorMap = {
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        orange: 'text-orange-600',
        green: 'text-green-600',
        red: 'text-red-600',
        teal: 'text-teal-600'
      };

      return colorMap[props.color] || 'text-blue-600';
    });

    /**
     * Format value for display
     */
    const formattedValue = computed(() => {
      if (props.decimal) {
        return props.value.toFixed(props.decimals);
      }
      return props.value.toLocaleString();
    });

    return {
      textColorClass,
      formattedValue
    };
  }
};
</script>

<style scoped>
.stat-card {
  min-width: 100px;
}
</style>