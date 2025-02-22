<template>
  <div class="login-form__background">
    <div class="login-form">
      <div class="login-form__header">
        <div class="login-form__title">ĐĂNG NHẬP HỆ THỐNG</div>
      </div>
      <div class="login-form__body">
        <div class="login-form__input-group">
          <div class="login-form__label">
            <i class="pi pi-user-edit" style="font-size: 1rem"></i> Tên đăng nhập
          </div>
          <InputComponent
            :is_text="true"
            placeholder="Nhập tên đăng nhập tại đây"
            v-model="username"
          />
        </div>
        <div class="login-form__input-group">
          <div class="login-form__label">
            <i class="pi pi-key" style="font-size: 1rem"></i> Mật khẩu
          </div>
          <InputComponent
            :is_password="true"
            placeholder="Nhập mật khẩu tại đây"
            v-model="password"
          />
        </div>
      </div>
      <div class="login-form__footer">
        <ButtonComponent :type="'primary'" @click="submitLogin">Đăng nhập</ButtonComponent>
      </div>
    </div>
  </div>
  <DialogComponent @click="handleHiddenDialog">
    <template #title-header-dialog>ĐĂNG NHẬP KHÔNG THÀNH CÔNG</template>
    <template #content-dialog>Tài khoản hoặc mật khẩu không đúng</template>
  </DialogComponent>
</template>

<script setup>
import InputComponent from "@/components/InputComponent/InputComponent.vue";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent.vue";
import "./FormLogin.css";
import "primeicons/primeicons.css";
import { ref } from "vue";
import router from "@/components/router";
import { useApi } from "@/composables/useApi";
import DialogComponent from "@/components/DialogComponent/DialogComponent.vue";

const username = ref("");
const password = ref("");
const showDialog = ref(false);

const api = useApi();
const submitLogin = async () => {
  try {
    const response = await api.post(`/auth/login`, {
      username: username.value,
      password: password.value,
    });

    if (response?.data?.authToken) {
      localStorage.setItem("token", response.data.authToken);
      localStorage.setItem("user", response.data.username); // Lưu JSON
      localStorage.setItem("role", response.data.role);
      router.push("/students");
    }
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err.response?.data?.message || err.message);
    showDialog.value = true;
  }
};

const handleHiddenDialog = () => {
  showDialog.value = false;
};
</script>
