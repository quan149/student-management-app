export const stringMessages = () => {
  const gender = {
    male: "Nam",
    female: "Nữ",
  };

  // Thông báo các trường bắt buộc
  const errorMessagesValidate = {
    studentId: "Mã học sinh không được để trống",
    fullName: "Họ và tên không được để trống",
    phone: "Số điện thoại không hợp lệ (Cần có 10 chữ số)",
    selectedDate: "Ngày sinh không được để trống",
    gender: "Giới tính không hợp lệ",
    address: "Địa chỉ không được để trống",
    email: "Email không hợp lệ",
    other: "Lỗi không xác định",
  };

  const titleForm = {
    createStudent: {
      none: "Thêm mới học sinh",
      success: "Thêm mới học sinh thành công",
      fail: "Thêm mới học sinh không thành công",
    },
    updateStudent: {
      none: "Thay đổi thông tin học sinh",
      success: "Thay đổi thông tin học sinh công",
      fail: "Thay đổi thông tin học sinh không thành công",
    },
    deleteStudent: {
      none: "Xóa học sinh",
      success: "Xóa học sinh thành công",
      fail: "Xóa học sinh không thành công",
    },
  };


  return {
    errorMessagesValidate,
    gender,
    titleForm,
  };
};
