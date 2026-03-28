import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// IMPORT CÁC API & COMPONENTS
import { getTrips } from "./api/tripApi";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import SearchBox from "./components/SearchBox";
import TripList from "./components/TripList";

// IMPORT CÁC TRANG (PAGES)
import SeatPage from "./pages/SeatPage";
import PaymentPage from "./pages/PaymentPage";
import MyTicketsPage from "./pages/MyTicketsPage";

/**
 * COMPONENT CHÍNH: HOME
 * Chức năng: Hiển thị thanh tìm kiếm và danh sách chuyến xe.
 */
function Home({ provinces, trips, loading, onSearch }) {
  return (
    <div style={homeContainerStyle}>
      <div className="header-search" style={headerPinkStyle}>
        <h1 className="logo">🚍 VEXERE CUTE</h1>
        {/* Thanh tìm kiếm: Truyền danh sách tỉnh và hàm kích hoạt tìm kiếm */}
        <SearchBox onSearch={onSearch} provinces={provinces} />
      </div>

      <div className="content" style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ color: "#FF85A1", textAlign: "left" }}>✨ Chuyến xe dành cho bạn</h2>
        {/* Nếu đang tải thì hiện loading, nếu xong thì hiện danh sách xe */}
        {loading ? (
          <p style={{ textAlign: "center", padding: "50px" }}>🎀 Đang tìm chuyến xe phù hợp...</p>
        ) : (
          <TripList trips={trips} />
        )}
      </div>
    </div>
  );
}

/**
 * COMPONENT TỔNG: APP
 * Chức năng: Quản lý Routes (định tuyến), State người dùng và Modal Đăng nhập.
 */
function App() {
  // 1. STATE QUẢN LÝ DỮ LIỆU XE
  const [trips, setTrips] = useState([]);           // Danh sách chuyến xe
  const [provinces, setProvinces] = useState([]);   // Danh sách tỉnh thành
  const [loading, setLoading] = useState(false);    // Trạng thái chờ tải dữ liệu

  // 2. STATE QUẢN LÝ NGƯỜI DÙNG (USER)
  // Khởi tạo user bằng cách đọc từ localStorage (để F5 không bị mất đăng nhập)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 3. STATE QUẢN LÝ MODAL ĐĂNG NHẬP
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 4. HÀM TẢI DỮ LIỆU TỪ API
  const loadTrips = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getTrips(params);
      // Giả sử API trả về cấu hình: res.data.data (mảng xe) và res.data.locations (tỉnh)
      setTrips(res.data.data || []);
      setProvinces(res.data.locations?.provinces || []);
    } catch (err) {
      console.error("Lỗi khi tải chuyến xe:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tự động tải dữ liệu lần đầu khi vừa mở web
  useEffect(() => {
    loadTrips();
  }, []);

  // 5. XỬ LÝ KHI ĐĂNG NHẬP THÀNH CÔNG
  const handleLoginSuccess = (userData) => {
    setUser(userData);    // Lưu vào State để đổi giao diện Navbar
    setIsAuthOpen(false); // Tự động đóng cửa sổ đăng nhập
  };

  return (
    <BrowserRouter>
      {/* CỐ ĐỊNH: Navbar luôn nằm trên cùng của mọi trang */}
      <Navbar 
        user={user} 
        onOpenAuth={() => setIsAuthOpen(true)} 
        setUser={setUser} 
      />

      {/* CỐ ĐỊNH: AuthModal nằm ngoài để có thể 'đè' lên bất kỳ trang nào */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* HỆ THỐNG CHUYỂN TRANG */}
      <Routes>
        {/* TRANG CHỦ */}
        <Route 
          path="/" 
          element={
            <Home 
              provinces={provinces} 
              trips={trips} 
              loading={loading} 
              onSearch={loadTrips} 
            />
          } 
        />
        
        {/* TRANG CHỌN GHẾ: Truyền thêm hàm mở Auth nếu khách chưa login */}
        <Route 
          path="/seats" 
          element={<SeatPage onRequireLogin={() => setIsAuthOpen(true)} />} 
        />
        
        {/* TRANG THANH TOÁN */}
        <Route path="/payment" element={<PaymentPage />} /> 

        {/* TRANG QUẢN LÝ VÉ CÁ NHÂN */}
        <Route path="/my-tickets" element={<MyTicketsPage />} />

        {/* LƯU Ý: Không cần Route cho Login/Register riêng vì đã dùng Modal */}
      </Routes>
    </BrowserRouter>
  );
}

// --- CSS GIAO DIỆN (TONE HỒNG CUTE) ---
const homeContainerStyle = { background: "#FFF0F3", minHeight: "100vh" };
const headerPinkStyle = { 
  background: "#FF85A1", padding: "60px 20px", textAlign: "center",
  borderBottom: "5px solid #FFB3C1" 
};

export default App;
