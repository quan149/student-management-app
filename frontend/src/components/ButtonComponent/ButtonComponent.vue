<template>
  <!-- Áp dụng các lớp CSS tương ứng -->
  <div 
    class="button" 
    @click="action" 
    :class="{
      'button--disabled': is_disable,
      'button--pagination': is_pagination,
      'button--danger': is_delete,
      'button--warning': is_update,
      'button--primary': is_primary
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import './ButtonComponent.css'

defineProps({
  action: Function, //Nhận hành động khi bấm vào button
  button_name: String, // Nhận tên của button
  is_disable: Boolean, // Trạng thái able hay disable của button
  is_pagination: Boolean, // Có phải button phân trang hay không
  is_delete: Boolean,
  is_update: Boolean,
  is_primary: Boolean
});
</script>


