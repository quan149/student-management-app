<template>
  <div class="dialog-overlay" v-if="show">
    <div class="dialog" v-if="show">
      <div class="dialog__header">
        <div class="dialog__title">
          {{ header }}
        </div>
      </div>
      <div class="dialog__body">
        <pre class="dialog__content" v-html="content.replace(/^\s+/, '')"></pre>
      </div>
      <div class="dialog__buttons">
        <ButtonComponent
          @click="submit"
          class="dialog__button--left"
          type="primary"
          v-if="showSubmit"
        >
          <div>Xác nhận</div>
        </ButtonComponent>
        <ButtonComponent @click="close" type="warning">
          <div>Đóng</div>
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import "./DialogComponent.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent.vue";
import { defineProps, defineEmits } from "vue";

defineProps({
  show: Boolean,
  showSubmit: Boolean,
  header: String,
  content: [Array, String],
});

const emit = defineEmits(["submit", "close"]);

const close = () => emit("close");
const submit = () => emit("submit");
</script>
