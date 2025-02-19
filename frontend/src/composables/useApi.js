import axios from "axios";
import { ref } from "vue";

// Composable function để gọi API
export function useApi(baseURL = "http://localhost:3000/api") {
  const data = ref(null); // Lưu dữ liệu API trả về
  const error = ref(null); // Lưu thông báo lỗi nếu có
  const totalPage = ref(null);

  // Hàm thực hiện gọi API với phương thức động (GET, POST, PUT, DELETE)
  // method: phương thức HTTP; payload: dữ liệu gửi lên; config chứa header, params,...
  const apiCall = async (method, endpoint, payload = null, config = {}) => {
    error.value = null;
    try {
      const token = localStorage.getItem("token");

      // Thêm Authorization vào headers
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        ...config.headers,
      };

      console.log(headers);
      

      const response = await axios({
        method,
        url: `${baseURL}${endpoint}`,
        data: payload,
        headers,
        ...config,
      });
      data.value = response.data?.data ?? response.data;
      totalPage.value = response.data?.totalPages ?? null;
      return {
        data: data.value,
        totalPage: totalPage.value,
      };
    } catch (err) {
      error.value = err.response ? err.response.data : err.message;
      throw err;
    }
  };

  // Các phương thức API
  const get = async (endpoint, config = {}) => apiCall("GET", endpoint, null, config);
  const post = async (endpoint, payload, config = {}) => apiCall("POST", endpoint, payload, config);
  const put = async (endpoint, payload, config = {}) => apiCall("PUT", endpoint, payload, config);
  const del = async (endpoint, config = {}) => apiCall("DELETE", endpoint, null, config);

  // Trả về các phương thức để component có thể sử dụng
  return {
    data,
    error,
    totalPage,
    get,
    post,
    put,
    del,
  };
}
