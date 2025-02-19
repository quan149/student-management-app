<template>
  <div class="dialog" v-if="showDialog">
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
      <ButtonComponent :action="props.actionAccept" class="dialog__button--left" v-if="props.showSubmit">
        <div>Xác nhận</div>
      </ButtonComponent>
      <ButtonComponent :action="props.actionCancel" :is_delete="true">
        <div>Đóng</div>
      </ButtonComponent>
    </div>
  </div>
</template>

<script setup>
import "./DialogComponent.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent.vue";
import { ref, defineProps, watch } from "vue";

const showDialog = ref(false);

const props = defineProps({
  show: Boolean,
  actionAccept: Function,
  actionCancel: Function,
  showSubmit: Boolean
});

watch(
    () => props.show,
    (newData) => {
        showDialog.value = newData
    }
)
</script>
