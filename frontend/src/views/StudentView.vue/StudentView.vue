<template>
  <div class="logout-menu">
    <div class="logout-menu__content">
      <i class="pi pi-user account-icon"></i>
      <div class="account-info">
        <div>Tài khoản: {{ user }}</div>
        <div @click="handleLogOut" class="logout-menu__action">Đăng xuất</div>
      </div>
    </div>
  </div>

  <FormStudentView
    :show="showFormInput"
    :action_hidden="handleHiddenFormInput"
    :type="typeForm"
    :student_id="studentId"
  >
    <template #title-header>{{ titleFormInput }}</template>
  </FormStudentView>

  <DialogComponent :show="showDialog" @close="handleHiddenDailog" :content="content" :header="header">
  </DialogComponent>

  <div class="student-update-modal" v-if="showUpdateClass">
    <div class="student-update__header">
      <div class="student-update__title">{{ notifyMessage.changeClass.header }}</div>
    </div>
    <div class="student-update__body">
      <div class="student-update__info">
        <i class="pi pi-question-circle" style="font-size: 1rem; color: red"></i>
        {{ notifyMessage.changeClass.content(selectedStudentIds) }}
      </div>
      <div class="class-selection">
        <div class="class-selection__label">Lớp sau khi thay đổi:</div>
        <DropDownComponent class="class-selection__dropdown" :value="newClass">
          <div
            v-for="classItem in classList"
            class="option-in-menu class-selection__dropdown"
            :key="classItem.class_id"
            @click="handleSelectClass(classItem.class_id, classItem.class_name)"
            :class="{ checked: newClass === classItem.class_name }"
          >
            {{ classItem.class_name }}
          </div>
        </DropDownComponent>
      </div>
      <div class="content-section">
        {{ notifyMessage.changeClass.note }}
      </div>
    </div>
    <div class="student-update__footer">
      <ButtonComponent type="primary" class="button-group" @click="handleUpdateClass">Xác nhận</ButtonComponent>
      <ButtonComponent type="warning" @click="handleHiddenUpdateClass">Hủy</ButtonComponent>
    </div>
  </div>

  <div class="student-table">
    <TableComponent
      :data="studentList"
      :columns="tableColumns"
      :page="currentPage"
      :totalPages="totalPageCount"
      @updatePage="handlePageUpdate"
      @updateLimitRows="handleLimitUpdate"
      @updateSelectedRows="handleSelectedRows"
      :limit="itemsPerPage"
      :action_add="handleShowFormInput"
      :action_delete="handleShowDailog"
      :action_update="handleUpdateStudent"
      :action_filter="handleShowFilterForm"
      v-model:searchQuery="searchName"
    >
      <template #name-button-filter>Tìm kiếm</template>
      <template #filter-form>
        <div class="student-filter" v-if="showFilterForm">
          <div class="student-filter__header">
            <div class="student-filter__title">Tìm kiếm học sinh</div>
            <i
              class="pi pi-times student-filter__icon"
              style="font-size: 12px"
              @click="handleShowFilterForm"
            ></i>
          </div>
          <div class="student-filter__body">
            <div class="student-filter__criteria">
              <div class="student-filter__title">Họ và tên học sinh</div>
              <InputComponent type="text" v-model="filterByName"></InputComponent>
            </div>
            <div class="student-filter__criteria">
              <div class="student-filter__title">Địa chỉ</div>
              <InputComponent type="text" v-model="filterByAddress"></InputComponent>
            </div>
            <div class="student-filter__criteria" v-if="!checkedRole">
              <div class="student-filter__title">Lớp học</div>
              <DropDownComponent :value="newClass">
                <div
                  v-for="classItem in classList"
                  class="option-in-menu class-selection__dropdown"
                  :key="classItem.class_id"
                  @click="handleSelectClass(classItem.class_id, classItem.class_name)"
                  :class="{ checked: newClass === classItem.class_name }"
                >
                  {{ classItem.class_name }}
                </div>
              </DropDownComponent>
            </div>
          </div>
          <div class="student-filter__footer">
            <div class="student-filter__clear" @click="clearFilterCriteria">Xóa điều kiện lọc</div>
            <ButtonComponent @click="handleFilterStudent"><div>Xác nhận</div></ButtonComponent>
          </div>
        </div>
      </template>
      <template #name-button-create>Thêm học sinh</template>
      <template #name-button-update>Cập nhật thông tin</template>
      <template #name-button-delete>Xóa học sinh</template>
      <template #other-button>
        <ButtonComponent
          v-if="checkedRole"
          :type="(selectedStudentIds.length !== 0) ? 'warning' : 'disabled'"
          class="button-group"
          @click="handleShowUpdateClass"
          >Chuyển lớp</ButtonComponent
        >
      </template>
    </TableComponent>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits, computed } from "vue";
import { useApi } from "@/composables/useApi.js";
import { notifyMessage } from "@/constants/notifyMessage";
import TableComponent from "@/components/TableComponent/TableComponent.vue";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent.vue";
import DropDownComponent from "@/components/DropDownComponent/DropDownComponent.vue";
import "./StudentView.css";
import "primeicons/primeicons.css";
import DialogComponent from "@/components/DialogComponent/DialogComponent.vue";
import FormStudentView from "../FormStudentView/FormStudentView.vue";
import InputComponent from "@/components/InputComponent/InputComponent.vue";
import router from "@/components/router";
import { useDialog } from "@/composables/useDialog";

const api = useApi();
const {showDialog, header, content, openDialog, closeDialog} = useDialog()

const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchName = ref("");
const searchAddress = ref("");
const searchClassId = ref("");
const studentList = ref([]);
const classList = ref([]);
const totalPageCount = ref(0);
const selectedStudentIds = ref("");
const newClass = ref("");
const showUpdateClass = ref(false);
const idNewClass = ref("");
const showFormInput = ref(false);
const titleFormInput = ref("");
const typeForm = ref("");
const studentId = ref("");
const filterByName = ref("");
const filterByAddress = ref("");
const showFilterForm = ref(false);
const user = ref("");

const emit = defineEmits(["updateShowOverlay"]);

// Cấu hình cột bảng
const tableColumns = ref([
  { id: 1, name: "Mã học sinh", field: "student_id", show: true },
  { id: 2, name: "Họ và tên", field: "full_name", show: true },
  { id: 3, name: "Ngày sinh", field: "date_of_birth", show: true },
  { id: 4, name: "Địa chỉ", field: "address", show: true },
  { id: 5, name: "Giới tính", field: "gender", show: true },
  { id: 6, name: "Lớp", field: "class.class_name", show: true },
  { id: 7, name: "Email", field: "email", show: true },
  { id: 8, name: "Số điện thoại", field: "phone", show: true },
]);

const checkedRole = computed(() => {
  return localStorage.getItem("role") == 2;
});

// Lấy danh sách học sinh từ API
const fetchStudents = async () => {
  try {
    const response = await api.get(
      `/students/filter?page=${currentPage.value}&limit=${itemsPerPage.value}&name=${searchName.value}&address=${searchAddress.value}&class_id=${searchClassId.value}`
    );
    studentList.value = response.data;
    totalPageCount.value = response.totalPage;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu học sinh:", error);
  }
};

// Lấy danh sách lớp từ API
const fetchClasses = async () => {
  try {
    const response = await api.get(`/classes`);
    classList.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu lớp:", error);
  }
};

// Xử lý cập nhật trang
const handlePageUpdate = (newPage) => {
  currentPage.value = newPage;
  console.log("Trang hiện tại:", currentPage.value);
};

// Xử lý cập nhật giới hạn số lượng bản ghi trên trang
const handleLimitUpdate = (newLimit) => {
  itemsPerPage.value = newLimit;
  console.log("Số bản ghi mỗi trang:", itemsPerPage.value);
};

// Xử lý cập nhật danh sách học sinh được chọn
const handleSelectedRows = (selectedRows) => {
  selectedStudentIds.value = Object.keys(selectedRows).join(", ");
  console.log("Học sinh được chọn:", selectedStudentIds.value);
};

// Hiển thị và ẩn form lọc khi nhấn vào button
const handleShowFilterForm = () => {
  showFilterForm.value = !showFilterForm.value;
};

const handleFilterStudent = () => {
  searchAddress.value = filterByAddress.value;
  searchClassId.value = idNewClass.value;
  searchName.value = filterByName.value;
  showFilterForm.value = false;
};

const clearFilterCriteria = () => {
  idNewClass.value = "";
  newClass.value = "";
  filterByName.value = "";
  filterByAddress.value = "";
  searchAddress.value = "";
  searchClassId.value = "";
  searchName.value = "";
};

// Xử lý hiện thị màn hình chuyển lớp
const handleShowUpdateClass = () => {
  showUpdateClass.value = true;
  emit("updateShowOverlay", true);
  newClass.value = "";
  idNewClass.value = "";
};

// Xử lý hành động chọn lớp trong dropdown
const handleSelectClass = (id, name) => {
  (newClass.value = name), (idNewClass.value = id);
};

// Xử lý hành động xác nhận chuyển lớp
const handleUpdateClass = async () => {
  try {
    const response = await api.put(`/students/update-class-student`, {
      student_ids: selectedStudentIds.value.split(",").map((item) => item.trim()),
      class_id: idNewClass.value,
    });
    console.log(response);
    fetchStudents();
    handleHiddenUpdateClass();
  } catch (error) {
    console.error("Lỗi khi cập nhật lớp:", error);
  }
};

// Xử lý tắt màn hình chuyển lớp
const handleHiddenUpdateClass = () => {
  showUpdateClass.value = false;
  emit("updateShowOverlay", false);
};

// Xử lý tắt màn hình dialog
const handleHiddenDailog = () => {
  closeDialog()
};

// Xử lý bật màn hình dialog
const handleShowDailog = () => {
  openDialog(notifyMessage.deleteStudent.header, notifyMessage.deleteStudent.content)
};

// Xử lý tắt màn hình dialog
const handleHiddenFormInput = () => {
  showFormInput.value = false;
  emit("updateShowOverlay", false);
};

const handleUpdateStudent = () => {
  studentId.value = selectedStudentIds.value;
  console.log(studentId.value);

  showFormInput.value = true;
  titleFormInput.value = "Cập nhật thông tin học sinh";
  emit("updateShowOverlay", true);
  typeForm.value = "update";
};

// Xử lý tắt màn hình dialog
const handleShowFormInput = () => {
  showFormInput.value = true;
  titleFormInput.value = "Thêm mới học sinh";
  typeForm.value = "create";
  emit("updateShowOverlay", true);
};

const handleLogOut = () => {
  localStorage.removeItem("token"); // Xóa token
  localStorage.removeItem("user"); // Xóa thông tin user
  localStorage.removeItem("role"); // Xóa quyền
  router.push("/"); // Chuyển về trang đăng nhập
};

// Theo dõi sự thay đổi để cập nhật danh sách học sinh
watch(
  [itemsPerPage, currentPage, searchName, showFormInput, searchAddress, searchClassId],
  fetchStudents,
  { immediate: true }
);

// Fetch dữ liệu khi component mounted
onMounted(() => {
  console.log(localStorage);
  if (localStorage.getItem("user")) {
    user.value = localStorage.getItem("user");
  }
  fetchStudents();
  fetchClasses();
});
</script>

<style scoped></style>
