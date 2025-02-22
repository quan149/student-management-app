<template>
  <button :class="['btn', type, {'disable': disable}]"  @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
import "./ButtonComponent.css";

import { defineProps, defineEmits } from "vue";

defineProps({
  type: {
    // Kiểu của button
    // Có thể nhận các giá trị primary, secondary, danger
    type: String, 
    default: "primary",
    disable: Boolean
  },
});

const emit = defineEmits(["click"]);

// Emit hành động click lên component cha
const handleClick = () => {
  emit("click");
};
</script>
