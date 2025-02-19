<template>
  <div class="overlay-form" v-if="showDialog"></div>
  <DialogComponent :show="showDialog" :action-cancel="handleHiddenDialog">
    <template #title-header-dialog>{{ titleDialog }}</template>
    <template #content-dialog>
      <div v-for="(content, index) in contentDialog" :key="index" style="margin-top: 6px">
        <div v-if="typeDialog === 'error'">
          <i class="pi pi-exclamation-circle" style="font-size: 1rem; color: red"></i> {{ content }}
        </div>
        <div v-if="typeDialog === 'success'">
          <i class="pi pi-verified" style="font-size: 1rem; color: green"></i> {{ content }}
        </div>
      </div>
    </template>
  </DialogComponent>
  <div class="student-form" v-if="props.show">
    <div class="student-form__header">
      <slot name="title-header"></slot>
    </div>

    <div class="student-form__body">
      <div class="student-form__row">
        <div class="student-form__input student-form__input--id">
          <div class="student-form__title">Mã học sinh</div>
          <InputComponent
            :is_text="true"
            :is_disable="true"
            v-model="student.studentId"
          ></InputComponent>
        </div>
        <div class="student-form__input student-form__input--name">
          <div class="student-form__title">Họ và tên</div>
          <InputComponent
            :is_text="true"
            v-model="student.fullName"
          ></InputComponent>
        </div>
        <div class="student-form__input student-form__input--dob">
          <div class="student-form__title">Ngày sinh</div>
          <InputComponent
            :is_date-picker="true"
            v-model:modelDatePicker="student.selectedDate"
          ></InputComponent>
        </div>
        <div class="student-form__input student-form__input--gender">
          <div class="student-form__title">Giới tính</div>
          <div class="student-form__gender-options">
            <InputComponent
              :is_radio="true"
              id="male"
              name="gender"
              value="Nam"
              label="Nam"
              v-model:modelRadio="student.gender"
            ></InputComponent>
            <InputComponent
              :is_radio="true"
              id="female"
              name="gender"
              value="Nữ"
              label="Nữ"
              v-model:modelRadio="student.gender"
            ></InputComponent>
          </div>
        </div>
      </div>

      <div class="student-form__row">
        <div class="student-form__input student-form__input--address">
          <div class="student-form__title">Địa chỉ</div>
          <InputComponent
            :is_text="true"
            v-model="student.address"
          ></InputComponent>
        </div>
      </div>

      <div class="student-form__row">
        <div class="student-form__input student-form__input--phone">
          <div class="student-form__title">Số điện thoại</div>
          <InputComponent
            :is_text="true"
            v-model="student.phone"
          ></InputComponent>
        </div>
        <div class="student-form__input student-form__input--email">
          <div class="student-form__title">Địa chỉ email</div>
          <InputComponent :is_text="true" v-model="student.email"></InputComponent>
        </div>
      </div>

      <div class="student-form__row">
        <div class="student-form__input student-form__input--class">
          <div class="student-form__title">Lớp học</div>
          <DropDownComponent :value="currentClass" :is_disable="true" class="student-form__dropdown">
          </DropDownComponent>
        </div>
        <div class="student-form__input student-form__input--grade">
          <div class="student-form__title">Khối học</div>
          <InputComponent
            :is_disable="true"
            :is_text="true"
            v-model="currentGrade"
          ></InputComponent>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="student-form__footer">
      <div class="student-form__buttons">
        <ButtonComponent
          class="student-form__button student-form__button--confirm"
          :action="handleSubmitFormInput"
        >
          <div>Xác nhận</div>
        </ButtonComponent>
        <ButtonComponent
          :is_delete="true"
          :action="action_hidden"
          class="student-form__button student-form__button--cancel"
        >
          <div>Hủy</div>
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputComponent from "@/components/InputComponent/InputComponent.vue";
import "./FormStudentView.css";
import { ref, onMounted, watch } from "vue";
import DropDownComponent from "@/components/DropDownComponent/DropDownComponent.vue";
import { useApi } from "@/composables/useApi";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent.vue";
import DialogComponent from "@/components/DialogComponent/DialogComponent.vue";
import { useValidation } from "@/composables/validateInput";
import "primeicons/primeicons.css";
import { stringMessages } from "@/composables/stringMessage";

const api = useApi();
const { titleForm } = stringMessages();

const props = defineProps({
  show: Boolean,
  action_hidden: Function,
  action_submit: Function,
  type: String,
  student_id: String,
});

const classList = ref([]);
const currentGrade = ref("");
const currentClass = ref("");
const typeDialog = ref("");
const showSubmitButton = ref(false);
const student = ref({
  studentId: "",
  fullName: "",
  selectedDate: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
  classId: Number(localStorage.getItem("user")),
  gradeId: 0,
});
const showDialog = ref(false);
const titleDialog = ref("");
const contentDialog = ref("");

// Lấy danh sách lớp từ API
const fetchClasses = async () => {
  try {
    const response = await api.get(`/classes`);
    classList.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu lớp:", error);
  }
};

// Tạo id mới theo mã khối
const fetchGenerateNewId = async (value) => {
  try {
    const response = await api.get(`/students/random-id/${value}`);
    student.value.studentId = response.data;
    console.log(student.value);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu lớp:", error);
  }
};

// Tạo thông tin học sinh được chọn
const fetchStudentById = async () => {
  console.log(props.student_id);
  try {
    const response = await api.get(`/students/${props.student_id}`);
    console.log(response.data);
    student.value.studentId = String(response.data.student_id)
    student.value.fullName = response.data.full_name
    student.value.selectedDate = response.data.date_of_birth
    student.value.gender = response.data.gender
    student.value.phone = response.data.phone
    student.value.email = response.data.email
    student.value.classId = response.data.class_id
    student.value.address = response.data.address
    setClassAndGrade();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu lớp:", error);
  }
};

const setClassAndGrade = () => {
  const classItem = classList.value.find((item) => item.class_id === student.value.classId);
  console.log(classList.value);
  if (classItem) {
    currentClass.value = classItem.class_name;
    currentGrade.value = classItem["grade.grade_name"];
    student.value.gradeId = classItem.grade_id;
    if (props.type === 'create') fetchGenerateNewId(student.value.gradeId);
  }
};

// Hành động ẩn dialog thông báo
const handleHiddenDialog = () => {
  showDialog.value = false;
};

// Hành động submit form để thêm học sinh mới
const handleSubmitFormInput = async () => {
  const { validate } = useValidation();
  const validationErrors = validate(student.value);
  if (validationErrors.length === 0) {
    const newStudent = {
      student_id: student.value.studentId,
      full_name: student.value.fullName,
      date_of_birth: student.value.selectedDate,
      gender: student.value.gender,
      address: student.value.address,
      phone: student.value.phone,
      email: student.value.email,
      class_id: student.value.classId,
      grade_id: student.value.gradeId,
    };
    if (props.type === "create") {
      try {
        const response = await api.post(`/students/create-student`, newStudent);
        console.log(response.data);
        showDialog.value = true;
        titleDialog.value = titleForm.createStudent.success;
        typeDialog.value = "success";
        showSubmitButton.value = true;
        contentDialog.value = [
          `Bạn đã thêm học sinh có mã học sinh là ${newStudent.student_id} và tên là ${newStudent.full_name}`,
        ];
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lớp:", error);
        showDialog.value = true;
        typeDialog.value = "error";
        titleDialog.value = titleForm.createStudent.fail;
        contentDialog.value = ["Đã xảy ra lỗi khi thêm học sinh"];
        showSubmitButton.value = false;
      }
    } else if (props.type === "update") {
      try {
        const response = await api.put(
          `/students/update-student/${newStudent.student_id}`,
          newStudent
        );
        showDialog.value = true;
        titleDialog.value = titleForm.updateStudent.success;
        typeDialog.value = "success";
        contentDialog.value = [
          `Bạn đã thay đổi thông tin của học sinh có mã học sinh là ${newStudent.student_id}`,
        ];
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lớp:", error);
      }
    }
  } else {
    typeDialog.value = "error";
    showDialog.value = true;
    titleDialog.value = titleForm.createStudent.fail;
    console.log(validationErrors);
    contentDialog.value = validationErrors;
    showSubmitButton.value = false;
  }
};

// watch(
//   () => [student.value.fullName, student.value.address, student.value.phone],
//   (newValues) => {
//     const [newName, newAddress, newPhone] = newValues;
//     if (!newName || newName === "") {
//       showValidate.value.name = true;
//     } else {
//       showValidate.value.name = false;
//     }

//     if (!newAddress || newAddress === "") {
//       showValidate.value.address = true;
//     } else {
//       showValidate.value.address = false;
//     }

//     if (!newPhone || newPhone === "") {
//       showValidate.value.phone = true;
//     } else {
//       showValidate.value.phone = false;
//     }
//   },
//   { immediate: true } // Kiểm tra ngay khi component được mounted
// );

onMounted(async () => {
  await fetchClasses();
  setClassAndGrade();
});

watch(
  () => props.show,
  (newValue) => {
  if (props.type === "create" && newValue) {
    student.value = {
      studentId: "",
      fullName: "",
      selectedDate: "",
      gender: "",
      address: "",
      phone: "",
      email: "",
      classId: 0,
      gradeId: 0,
    };
  }
  if (props.type === 'update' && newValue) {
    fetchStudentById();
  }
})

watch(() => student.value.classId, () => {
  setClassAndGrade();
});
</script>
