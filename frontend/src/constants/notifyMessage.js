export const notifyMessage = {
  changeClass: {
    header: "Chọn lớp cần chuyển",
    content: (studentIds) =>
      `Bạn muốn cập nhật lớp cho các học sinh có mã học sinh là ${studentIds}`,
    note: "Sau khi cập nhật, những học sinh này sẽ không trong phạm vi quản lý của bạn nữa. Hãy chắc chắn trước khi XÁC NHẬN hoặc chọn HỦY để quay trở lại trang quản lý học sinh.",
  },

  deleteStudent: {
    header: "Xóa học sinh",
    content: "Bạn có chắc chắn muốn xóa các học sinh đã được chọn?",
  },
};
