<template>
  <div>
    <TableComponent
      :data="data"
      :columns="columns"
      :page="page"
      :totalPages="totalPage"
      @updatePage="updatePage"
      @updateLimitRows="updateLimitRows"
      :limit="limit"
    >
      <template #name-button-filter>Tìm kiếm lớp học</template>
      <template #name-button-create>Thêm lớp học</template>
      <template #name-button-delete>Xóa lớp học</template></TableComponent
    >
  </div>
</template>
<script setup>
import TableComponent from "@/components/TableComponent/TableComponent.vue";
import { useApi } from "@/composables/useApi.js";
import { onMounted, ref } from "vue";
import "./ClassView.css";
const { get, data, totalPage } = useApi();
const columns = ref([
  { id: 1, name: "Mã lớp học", field: "class_id", show: true },
  { id: 2, name: "Tên lớp", field: "class_name", show: true },
  { id: 3, name: "Khối", field: "grade.grade_name", show: true },
]);

// Hàm lấy dữ liệu học sinh từ API
const fetchClassess = async () => {
  try {
    await get(`/classes/`);
    console.log(data.value);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }
};

// Gọi fetchStudents khi component được render
onMounted(() => {
  fetchClassess();
});
</script>
