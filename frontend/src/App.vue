<template>
  <div class="overlay" v-if="show"></div>
  <div>
    <router-view @updateShowOverlay="handleShowOverlay" />
  </div>
</template>

<script setup>
import { ref} from "vue";
import "primeicons/primeicons.css";

const show = ref(false);
const handleShowOverlay = (newValue) => {
  show.value = newValue;
};
</script>
<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); /* Làm tối nền mạnh hơn */
  backdrop-filter: blur(5px); /* Hiệu ứng mờ nền */
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
