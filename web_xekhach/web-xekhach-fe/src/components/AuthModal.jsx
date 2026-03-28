import React, { useState } from "react";

/**
 * COMPONENT: AuthModal
 * @param isOpen: Trạng thái đóng/mở modal (true/false)
 * @param onClose: Hàm dùng để đóng modal khi bấm nút X hoặc bên ngoài
 * @param onLoginSuccess: Hàm gọi về App.js để báo rằng đã đăng nhập thành công
 */
const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  // 1. STATE QUẢN LÝ GIAO DIỆN: Đang ở chế độ Đăng nhập (true) hay Đăng ký (false)
  const [isLoginView, setIsLoginView] = useState(true);

  // 2. STATE QUẢN LÝ DỮ LIỆU: Lưu trữ thông tin người dùng nhập vào các ô Input
  const [formData, setFormData] = useState({
    user: "",      // Dùng cho Email hoặc SĐT (Login)
    password: "",  // Mật khẩu
    name: "",      // Họ tên (Chỉ dùng khi Đăng ký)
    email: "",     // Email riêng (Dùng khi Đăng ký)
    phone: ""      // SĐT riêng (Dùng khi Đăng ký)
  });

  // Nếu modal không được kích hoạt mở, không trả về bất cứ giao diện nào
  if (!isOpen) return null;

  // 3. HÀM XỬ LÝ KHI SUBMIT FORM (Nhấn nút Đăng nhập / Đăng ký)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang web tải lại (mặc định của form)

    // Xác định file PHP sẽ gọi dựa trên trạng thái giao diện hiện tại
    const apiPath = isLoginView ? "login.php" : "register.php";
    
    // Đối với Đăng ký, PHP cần 'email' và 'phone' riêng biệt, 
    // nên ta gán giá trị từ ô 'user' vào cả 2 nếu đang ở chế độ đăng ký
    const payload = isLoginView 
      ? formData 
      : { ...formData, email: formData.user, phone: formData.user };

    try {
      // Gọi API đến Server PHP
      const res = await fetch(`http://localhost/WEB_XEKHACH/Api/${apiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Chuyển dữ liệu sang chuỗi JSON để PHP đọc
      });

      const data = await res.json(); // Chờ phản hồi từ PHP và chuyển sang Object JS

      if (data.success) {
        // A. Lưu thông tin người dùng vào LocalStorage để không bị mất khi F5 trang
        localStorage.setItem("user", JSON.stringify(data.user));
        
        alert(isLoginView ? "Đăng nhập thành công! 🎉" : "Đăng ký thành công! Chào mừng bạn.");
        
        // B. Thông báo cho Component Cha (App.js) cập nhật lại trạng thái Đã đăng nhập
        onLoginSuccess(data.user); 
        
        // C. Đóng modal sau khi hoàn tất
        onClose(); 
      } else {
        // Hiển thị thông báo lỗi từ PHP (Ví dụ: "Sai mật khẩu", "Email đã tồn tại")
        alert(data.message);
      }
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
      alert("Không thể kết nối đến máy chủ!");
    }
  };

  // 4. HÀM CẬP NHẬT STATE KHI NGƯỜI DÙNG GÕ CHỮ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Giữ nguyên các giá trị cũ (...formData) và chỉ cập nhật trường đang gõ [name]
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={overlayStyle}> {/* Lớp nền mờ bao phủ toàn màn hình */}
      <div style={modalStyle}> {/* Khung hộp thoại chính */}
        
        {/* Nút đóng modal (X) */}
        <button onClick={onClose} style={closeBtnStyle}>✕</button>
        
        <h2 style={{ color: "#1455FE", textAlign: "center", marginBottom: "20px" }}>
          {isLoginView ? "Đăng nhập" : "Đăng ký tài khoản"}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* HIỂN THỊ CÓ ĐIỀU KIỆN: Chỉ hiện ô nhập Tên khi đang ở chế độ Đăng ký */}
          {!isLoginView && (
            <input
              name="name"
              type="text"
              placeholder="Họ và tên của bạn"
              required
              style={inputStyle}
              onChange={handleInputChange}
            />
          )}

          <input
            name="user"
            type="text"
            placeholder="Số điện thoại hoặc Email"
            required
            style={inputStyle}
            onChange={handleInputChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            required
            style={inputStyle}
            onChange={handleInputChange}
          />
          
          <button type="submit" style={submitBtnStyle}>
            {isLoginView ? "ĐĂNG NHẬP" : "TẠO TÀI KHOẢN NGAY"}
          </button>
        </form>

        {/* PHẦN CHUYỂN ĐỔI: Cho phép người dùng chuyển qua lại giữa Đăng nhập/Đăng ký */}
        <p style={{ marginTop: "20px", fontSize: "14px", textAlign: "center" }}>
          {isLoginView ? "Chưa có tài khoản? " : "Đã có tài khoản rồi? "}
          <span 
            style={{ color: "#1455FE", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }} 
            onClick={() => setIsLoginView(!isLoginView)} // Đảo ngược giá trị true/false
          >
            {isLoginView ? "Đăng ký ngay" : "Quay lại Đăng nhập"}
          </span>
        </p>
      </div>
    </div>
  );
};

// --- HỆ THỐNG GIAO DIỆN (CSS-IN-JS) ---
const overlayStyle = { 
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
  backgroundColor: "rgba(0,0,0,0.6)", // Làm tối nền phía sau
  display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 
};

const modalStyle = { 
  background: "white", padding: "40px", borderRadius: "16px", width: "380px", 
  position: "relative", boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.3s ease" // Hiệu ứng hiện ra nhẹ nhàng
};

const inputStyle = { 
  width: "100%", padding: "14px", marginBottom: "15px", 
  border: "1px solid #ddd", borderRadius: "8px", boxSizing: "border-box",
  fontSize: "15px"
};

const submitBtnStyle = { 
  width: "100%", padding: "14px", background: "#1455FE", color: "white", 
  border: "none", borderRadius: "8px", cursor: "pointer", 
  fontWeight: "bold", fontSize: "16px", transition: "0.3s"
};

const closeBtnStyle = { 
  position: "absolute", top: "15px", right: "15px", 
  border: "none", background: "none", fontSize: "22px", cursor: "pointer", color: "#888" 
};

export default AuthModal;
