import { reactive } from "vue";
import { stringMessages } from "./stringMessage";

export function useValidation() {
  const errors = reactive([]);
  const {errorMessagesValidate, gender} = stringMessages();

  function validate(student) {
    errors.length = 0;

    // Kiểm tra mã học sinh
    if (!student.studentId || student.studentId.trim() === "") {
      errors.push(errorMessagesValidate.studentId);
    }

    // Kiểm tra họ và tên
    if (!student.fullName || student.fullName.trim() === "") {
      errors.push(errorMessagesValidate.fullName);
    }

    // Kiểm tra số điện thoại (đủ 10 số hay không)
    const phoneRegex = /^[0-9]{10}$/;
    if (!student.phone || !phoneRegex.test(student.phone)) {
      errors.push(errorMessagesValidate.phone);
    }

    // Kiểm tra email đúng định dạng hay không
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (student.email && !emailRegex.test(student.email)) {
      errors.push(errorMessagesValidate.email);
    }

    // Kiểm tra ngày sinh 
    if (!student.selectedDate) {
      errors.push(errorMessagesValidate.selectedDate);
    }

    // Kiểm tra giới tính
    if (!student.gender || (student.gender !== gender.male && student.gender !== gender.female)) {
      errors.push(errorMessagesValidate.gender);
    }

    // Kiểm tra địa chỉ
    if (!student.address || student.address.trim() === "") {
      errors.push(errorMessagesValidate.address);
    }

    return errors;
  }

  return {
    errors,
    validate,
  };
}
