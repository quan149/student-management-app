export const successFormInput = {
  created_success: {
    header: "THÊM HỌC SINH THÀNH CÔNG",
    content: (student) =>
      `Bạn đã thêm học sinh có mã học sinh là ${student.student_id} và tên là ${student.full_name}`,
  },

  updated_success: {
    header: "THAY ĐỔI THÔNG TIN HỌC SINH THÀNH CÔNG",
    content: (student) =>
      `Bạn đã thay đổi thông tin của học sinh có mã học sinh là ${student.student_id}`,
  },
};
