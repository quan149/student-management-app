import axios from 'axios';

const API_URL = 'http://localhost:3000/api/students'; // Địa chỉ API

// Hàm lấy danh sách học sinh
export const getStudents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;  // Trả về danh sách học sinh
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu học sinh:', error);
    throw error;  // Throw error nếu có lỗi xảy ra
  }
};
