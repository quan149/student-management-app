<template>
  <div 
    @click="emit('click', $event)" 
    :class="(type === 'pagination') ?`button--${type}` : `button button--${type}`" 
  >
    <slot></slot>
  </div>
</template>

<script setup>
import './ButtonComponent.css'
import { defineEmits, defineProps } from 'vue';

defineProps({
  // Kiểu button, nhận giá trị primary, secondary, warning, danger, pagination, disable
  type: {
    type: String,
    default: 'primary'
   } 
});

const emit = defineEmits(["click"]);
</script>


