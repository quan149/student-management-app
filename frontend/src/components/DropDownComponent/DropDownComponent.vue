<template>
  <div class="dropdown" @click="setShowMenu" :class="{'dropdown--disable': is_disable}">
    <div class="dropdown__value">{{ props.value }}</div>
    <div class="dropdown__menu" ref="menu" :class="{'dropdown__menu--above': is_above, 'dropdown__menu--under': !is_above, 'dropdown__menu--visible': show}">
        <slot></slot>
    </div>
  </div>
</template>
<script setup>
import "./DropDownComponent.css";
import { defineProps, ref, watch, onBeforeUnmount } from "vue";

const props = defineProps({
  value: null, // Giá trị truyền vào DropdownComponent
  is_above: Boolean, // Hiển thị danh sách lựa chọn ở trên
  is_disable: Boolean // Input có phải disable hay không
});

const menu = ref(null);
const show = ref(false)

// Ẩn menu-options khi click bên ngoài phạm vi hiển thị
const handleClickOutside = (event) => {
  if (menu.value && !menu.value.contains(event.target)) {
    show.value = false;
  }
};

const setShowMenu = (event) => {
  // Ngừng sự kiện click khi nhấn vào nút, không thực hiện sự kiện ngoài
  event.stopPropagation();
  show.value = !show.value;
  console.log(show.value);
};


watch(show, (newVal) => {
  if (newVal) {
    // Nếu show = true, gắn sự kiện click vào document
    document.addEventListener("click", handleClickOutside);
  } else {
    // Nếu show = false, gỡ bỏ sự kiện click
    document.removeEventListener("click", handleClickOutside);
  }
});

// Sự kiện này đảm bảo rằng sự kiện click được gỡ bỏ khi component bị unmount
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
