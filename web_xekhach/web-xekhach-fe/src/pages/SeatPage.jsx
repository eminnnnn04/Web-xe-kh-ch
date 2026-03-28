import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * COMPONENT: SeatPage
 * Chức năng: Hiển thị sơ đồ ghế, cho phép người dùng chọn chỗ và tính tiền tạm tính.
 */
function SeatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. LẤY THÔNG SỐ TỪ URL (Query Parameters)
  // Các thông số này được truyền từ trang TripCard sang (ví dụ: ?trip_id=1&seats=32&price=150000)
  const params = new URLSearchParams(location.search);
  const tripId = params.get("trip_id");
  const seatCount = Number(params.get("seats")) || 32;
  const pricePerSeat = Number(params.get("price")) || 0; 

  // 2. GIẢ LẬP DANH SÁCH GHẾ
  // Tạo một mảng số từ 1 đến seatCount (Ví dụ: [1, 2, 3, ..., 32])
  const seats = Array.from({ length: seatCount }, (_, i) => i + 1);

  // 3. STATE QUẢN LÝ GHẾ ĐÃ CHỌN
  // Lưu danh sách các số ghế mà người dùng nhấn vào (Dạng mảng: [5, 12, 14])
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 4. HÀM XỬ LÝ CHỌN/HUỶ CHỌN GHẾ (Toggle logic)
  const handleSelectSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      // Nếu ghế đã có trong danh sách -> Loại bỏ (Filter)
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      // Nếu ghế chưa có -> Thêm vào mảng bằng Spread Operator
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // 5. HÀM TIẾP TỤC SANG TRANG THANH TOÁN
  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một chỗ ngồi để tiếp tục!");
      return;
    }
    
    // ĐIỀU HƯỚNG: Chuyển sang /payment và truyền dữ liệu ngầm qua 'state'
    // Việc dùng state giúp dữ liệu không bị lộ trên thanh địa chỉ và bảo mật hơn
    navigate("/payment", { 
      state: { 
        trip_id: tripId,
        selectedSeats, 
        pricePerSeat 
      } 
    });
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#333", marginBottom: "5px" }}>🪑 Chọn chỗ ngồi</h2>
    
      {/* HIỂN THỊ TÓM TẮT LỰA CHỌN */}
      <div style={summaryStyle}>
        <p>Ghế đã chọn: <b style={{ color: "#1455FE" }}>{selectedSeats.sort((a,b)=>a-b).join(", ") || "Chưa chọn"}</b></p>
        <p>Tổng tiền tạm tính: <b style={{ color: "#ef5222", fontSize: "18px" }}>
          {(selectedSeats.length * pricePerSeat).toLocaleString()} đ
        </b></p>
      </div>

      {/* SƠ ĐỒ GHẾ (Gird Layout) */}
      <div style={seatGridStyle}>
        {seats.map((s) => {
          const isSelected = selectedSeats.includes(s);
          return (
            <div
              key={s}
              onClick={() => handleSelectSeat(s)}
              style={{
                ...seatItemStyle,
                background: isSelected ? "#27ae60" : "#fff", // Xanh khi chọn, trắng khi trống
                color: isSelected ? "#fff" : "#333",
                border: isSelected ? "1px solid #27ae60" : "1px solid #ddd",
              }}
            >
              {s}
            </div>
          );
        })}
      </div>

      {/* NÚT XÁC NHẬN */}
      <button 
        onClick={handleNext}
        style={{
          ...btnNextStyle,
          background: selectedSeats.length > 0 ? "#1455FE" : "#ccc",
          cursor: selectedSeats.length > 0 ? "pointer" : "not-allowed"
        }}
        disabled={selectedSeats.length === 0}
      >
        TIẾP THEO ({selectedSeats.length} GHẾ)
      </button>

      <p style={noteStyle}>ℹ️ Bạn có thể chọn nhiều ghế cùng lúc</p>
    </div>
  );
}

// --- HỆ THỐNG GIAO DIỆN (UI STYLES) ---
const containerStyle = { padding: "40px 20px", maxWidth: "450px", margin: "auto", textAlign: "center" };

const summaryStyle = { background: "#f8f9fa", padding: "15px", borderRadius: "10px", margin: "20px 0", textAlign: "left", borderLeft: "4px solid #1455FE" };

const seatGridStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "20px", background: "#f1f1f1", padding: "20px", borderRadius: "15px" };

const seatItemStyle = { padding: "15px 0", textAlign: "center", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "0.2s shadow", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" };

const btnNextStyle = { marginTop: "30px", width: "100%", padding: "15px", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", transition: "0.3s" };

const noteStyle = { marginTop: "15px", fontSize: "12px", color: "#999" };

export default SeatPage;
