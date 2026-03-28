import React from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * COMPONENT: Navbar
 * @param user: Đối tượng thông tin người dùng (Lấy từ State của App.js)
 * @param onOpenAuth: Hàm để mở Modal Đăng nhập/Đăng ký
 * @param setUser: Hàm cập nhật lại State người dùng (Dùng để đăng xuất)
 */
const Navbar = ({ user, onOpenAuth, setUser }) => {
  const navigate = useNavigate(); // Hook dùng để chuyển trang bằng code

  // 1. HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    // A. Xóa sạch dữ liệu người dùng trong bộ nhớ trình duyệt (LocalStorage)
    localStorage.removeItem("user"); 
    
    // B. Xóa dữ liệu trong State của React để giao diện thay đổi ngay lập tức
    setUser(null); 
    
    alert("Đã đăng xuất thành công! Hẹn gặp lại bạn.");
    
    // C. Chuyển hướng người dùng về trang chủ để đảm bảo an toàn bảo mật
    navigate("/"); 
  };

  return (
    <nav style={navStyle}>
      {/* 2. PHẦN LOGO: Sử dụng Link thay vì thẻ <a> để tránh load lại toàn trang */}
      <div className="logo">
        <Link to="/" style={logoStyle}>🚍 VEXERE CUTE</Link>
      </div>

      {/* 3. CỤM TIỆN ÍCH BÊN PHẢI */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        
        {/* Link xem lại lịch sử đặt vé - Luôn cho phép truy cập */}
        <Link to="/my-tickets" style={linkStyle}>Kiểm tra vé</Link>

        {/* 4. LOGIC HIỂN THỊ THEO TRẠNG THÁI ĐĂNG NHẬP (Conditional Rendering) */}
        {user ? (
          // TRƯỜNG HỢP: ĐÃ ĐĂNG NHẬP (Hiện tên và nút Logout)
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={welcomeStyle}>
              Chào, {user.name || "Thành viên"}
            </span>
            <button onClick={handleLogout} style={logoutBtnStyle}>
              Đăng xuất
            </button>
          </div>
        ) : (
          // TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP (Hiện nút mở Modal Auth)
          <button onClick={onOpenAuth} style={loginBtnStyle}>
            Đăng nhập / Đăng ký
          </button>
        )}
      </div>
    </nav>
  );
};

// --- HỆ THỐNG GIAO DIỆN (CSS STYLES) ---
const navStyle = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "15px 50px", background: "#ffffff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  position: "sticky", top: 0, zIndex: 100 // Giữ Navbar luôn nằm trên cùng khi cuộn trang
};

const logoStyle = {
  fontSize: "20px", fontWeight: "bold", color: "#1455FE", textDecoration: "none"
};

const linkStyle = {
  textDecoration: "none", color: "#333", fontSize: "14px", fontWeight: "500"
};

const welcomeStyle = {
  fontWeight: "bold", color: "#1455FE", fontSize: "14px"
};

const loginBtnStyle = {
  padding: "8px 20px", backgroundColor: "#1455FE", color: "white",
  border: "none", borderRadius: "6px", cursor: "pointer", 
  fontWeight: "bold", transition: "0.2s"
};

const logoutBtnStyle = {
  padding: "6px 12px", backgroundColor: "#fff", color: "#f44336",
  border: "1px solid #f44336", borderRadius: "5px", cursor: "pointer",
  fontSize: "12px", fontWeight: "bold", transition: "0.2s"
};

export default Navbar;
