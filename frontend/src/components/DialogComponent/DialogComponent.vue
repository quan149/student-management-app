<template>
  <div class="dialog-overlay" v-if="show">
    <div class="dialog__header">
      <div class="dialog__title">
        <slot name="title-header-dialog"></slot>
      </div>
    </div>
    <div class="dialog__body">
      <div class="dialog__content">
        <slot name="content-dialog"></slot>
      </div>
    </div>
    <div class="dialog__buttons">
      <ButtonComponent :type="'primary'" class="dialog__button--left" @click="submit">
        <div>Xác nhận</div>
      </ButtonComponent>
      <ButtonComponent :type="'secondary'" @click="close" v-if="showCancel">
        <div>Hủy</div>
      </ButtonComponent>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import ButtonComponent from "../ButtonComponent/ButtonComponent.vue";

defineProps({
  show: Boolean, // Hiển thị dialog
  // Hiển thị nút HỦY hay không
  showCancel: { 
    type: Boolean, 
    default: true 
  },
});

const emit = defineEmits(["close", "submit"]);

const close = () => emit("close");
const submit = () => emit("submit");
</script>
