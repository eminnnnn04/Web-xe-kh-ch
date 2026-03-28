import React from "react";
import { useNavigate } from "react-router-dom";

function TripCard({ trip }) {
  const navigate = useNavigate(); 

  // 1. Định dạng giá tiền chuyên nghiệp
  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + " đ";

  // 2. Hàm xử lý logic thời gian (Lấy từ PHP gửi lên)
  const calculateTime = (startTimeStr, duration) => {
    if (!startTimeStr) return { start: "--:--", end: "--:--", duration: 0 };

    // Tách lấy phần giờ "08:00" từ chuỗi "2026-03-24 08:00:00"
    const timeOnly = startTimeStr.includes(" ") ? startTimeStr.split(" ")[1] : startTimeStr;
    const [h, m] = timeOnly.split(":").map(Number);

    // Tính giờ đến = Giờ đi + Thời gian chạy
    let arrivalH = h + Number(duration);
    let nextDay = Math.floor(arrivalH / 24); // Kiểm tra nếu chạy xuyên ngày (ví dụ đi Hà Nội 32 tiếng)
    arrivalH = arrivalH % 24;

    const start = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    const end = `${arrivalH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    return { start, end, nextDay, duration };
  };

  const timeData = calculateTime(trip.departure_time, trip.duration_hours);

  const handleBook = (id) => {
    navigate(`/seats?trip_id=${id}&seats=${trip.seat_count}&price=${trip.final_price}`);
  };

  return (
    <div style={cardStyle}>
      {/* PHẦN TRÁI: THÔNG TIN LỊCH TRÌNH */}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#1455FE", fontSize: "18px" }}>
          {trip.company_name}
        </h3>

        {/* THANH TIMELINE THỜI GIAN (Xịn như Vexere) */}
        <div style={timeRowStyle}>
          <div style={timeBox}>
            <span style={timeText}>{timeData.start}</span>
            <span style={locText}>{trip.departure}</span>
          </div>

          <div style={durationLine}>
            <span style={durationText}>⏱ {timeData.duration} giờ</span>
            <div style={dotLine}></div>
          </div>

          <div style={timeBox}>
            <span style={timeText}>
              {timeData.end} 
              {timeData.nextDay > 0 && <small style={nextDayStyle}>+{timeData.nextDay}n</small>}
            </span>
            <span style={locText}>{trip.destination}</span>
          </div>
        </div>

        <p style={infoStyle}>🚍 {trip.type_name} • Còn {trip.seat_count} chỗ trống</p>
      </div>

      {/* PHẦN PHẢI: GIÁ VÀ NÚT BẤM */}
      <div style={rightSideStyle}>
        <h3 style={priceTextStyle}>
          {formatPrice(trip.final_price)}
        </h3>

        <button onClick={() => handleBook(trip.trip_id)} style={btnBookStyle}>
          Chọn Chỗ
        </button>
      </div>
    </div>
  );
}

// --- HỆ THỐNG GIAO DIỆN (PINK CUTE UI) ---
const cardStyle = {
  background: "#fff", padding: "20px", borderRadius: "18px", display: "flex",
  justifyContent: "space-between", marginBottom: "15px",
  boxShadow: "0 4px 15px rgba(255, 133, 161, 0.15)", // Đổ bóng màu hồng nhạt
  borderLeft: "8px solid #FF85A1", // Viền hồng đậm bên trái
  transition: "0.3s"
};

const timeRowStyle = { display: "flex", alignItems: "center", gap: "15px", margin: "10px 0" };
const timeBox = { display: "flex", flexDirection: "column" };
const timeText = { fontSize: "20px", fontWeight: "bold", color: "#333" };
const locText = { fontSize: "13px", color: "#777", marginTop: "2px" };

const durationLine = { flex: 1, textAlign: "center", position: "relative", minWidth: "100px" };
const durationText = { fontSize: "12px", color: "#FF85A1", fontWeight: "bold" };
const dotLine = { height: "2px", background: "#FFB3C1", width: "100%", marginTop: "5px", borderRadius: "2px" };

const infoStyle = { margin: "15px 0 0 0", fontSize: "14px", color: "#888", fontWeight: "500" };
const nextDayStyle = { color: "#FF4D6D", fontSize: "12px", marginLeft: "4px", verticalAlign: "top" };

const rightSideStyle = { 
  textAlign: "right", display: "flex", flexDirection: "column", 
  justifyContent: "space-between", minWidth: "140px" 
};
const priceTextStyle = { color: "#FF4D6D", fontSize: "22px", fontWeight: "bold", margin: 0 };

const btnBookStyle = {
  padding: "12px 20px", background: "#1455FE", color: "#fff",
  border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer"
};

export default TripCard;
