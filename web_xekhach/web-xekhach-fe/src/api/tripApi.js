import axios from "axios";

// Đường dẫn API (Lưu ý viết hoa/thường khớp với thư mục XAMPP của bạn)
const API_URL = "http://localhost/web_xekhach/Api/get_trips.php";

/**
 * Hàm lấy danh sách chuyến xe từ Database
 * @param params: Chứa dữ liệu lọc như { departure: "TP.HCM", destination: "Đà Lạt" }
 */
export const getTrips = (params = {}) => {
  // Axios tự động biến {id: 1} thành ?id=1 cho bạn
  return axios.get(API_URL, { params })
    .catch(error => {
      console.error("Lỗi kết nối API rồi cậu ơi! 🌸", error);
      // Trả về cấu trúc rỗng để giao diện không bị lỗi map()
      return { data: { data: [], locations: { provinces: [] } } };
    });
};
