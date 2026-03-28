import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Nhận dữ liệu từ trang chọn ghế gửi sang
  const selectedSeats = location.state?.selectedSeats || [];
  const pricePerSeat = location.state?.pricePerSeat || 0;
  const trip_id = location.state?.trip_id; 

  const totalPrice = selectedSeats.length * pricePerSeat;

  // --- CẬP NHẬT HÀM XỬ LÝ ĐẶT VÉ THỰC TẾ ---
  const handleConfirmPayment = async () => {
    // 1. Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Cậu ơi, đăng nhập mới đặt được vé chứ! 🌸");
      return;
    }

    // 2. Chuẩn bị dữ liệu gửi đi (khớp với file book_ticket.php yêu cầu)
    const bookingData = {
      user_id: user.id,
      trip_id: trip_id,
      seats: selectedSeats, // Mảng ghế [1, 2, 5...]
      total_price: totalPrice
    };

    try {
      // 3. Gọi API lưu vé vào Database
      const response = await fetch("http://localhost/WEB_XEKHACH/Api/book_ticket.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        // 4. Nếu thành công: Báo tin vui và chuyển trang
        alert(`🎉 Chúc mừng ${user.name}! Đã đặt thành công ghế: ${selectedSeats.join(", ")}`);
        navigate("/my-tickets"); 
      } else {
        // Nếu Server báo lỗi (ví dụ: mất kết nối DB)
        alert("Huhu lỗi rồi: " + result.message);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      alert("Máy chủ bận rồi, cậu thử lại sau nhé! 🎀");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>💳 Xác nhận thanh toán</h2>
      
      {selectedSeats.length > 0 ? (
        <div style={invoiceCardStyle}>
          <div style={detailRowStyle}>
            <span>Danh sách ghế:</span>
            <b style={{ color: "#1455FE" }}>{selectedSeats.join(", ")}</b>
          </div>

          <div style={detailRowStyle}>
            <span>Số lượng vé:</span>
            <b>{selectedSeats.length} vé</b>
          </div>

          <div style={detailRowStyle}>
            <span>Giá mỗi ghế:</span>
            <b>{Number(pricePerSeat).toLocaleString()} đ</b>
          </div>

          <hr style={dividerStyle} />

          <div style={totalRowStyle}>
            <span>TỔNG TIỀN:</span>
            <span style={totalPriceStyle}>{totalPrice.toLocaleString()} đ</span>
          </div>
          
          <button onClick={handleConfirmPayment} style={confirmBtnStyle}>
            XÁC NHẬN ĐẶT VÉ
          </button>
        </div>
      ) : (
        <div style={errorBoxStyle}>
          <p>⚠️ Không có dữ liệu ghế. Vui lòng quay lại.</p>
          <button onClick={() => navigate("/")} style={backBtnStyle}>Về trang chủ</button>
        </div>
      )}

      <button onClick={() => navigate(-1)} style={backLinkStyle}>
        ← Quay lại chọn lại ghế
      </button>
    </div>
  );
}

// --- GIỮ NGUYÊN CSS NHƯ CŨ ---
const containerStyle = { padding: "40px 20px", maxWidth: "500px", margin: "0 auto" };
const titleStyle = { textAlign: "center", color: "#333", marginBottom: "30px" };
const invoiceCardStyle = { background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid #eee" };
const detailRowStyle = { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "16px" };
const dividerStyle = { border: "none", borderTop: "1px dashed #ccc", margin: "20px 0" };
const totalRowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" };
const totalPriceStyle = { fontSize: "24px", color: "#ef5222", fontWeight: "bold" };
const confirmBtnStyle = { width: "100%", padding: "15px", background: "#ef5222", color: "#fff", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer" };
const errorBoxStyle = { textAlign: "center", padding: "20px", background: "#fff5f5", borderRadius: "8px" };
const backBtnStyle = { padding: "10px 20px", background: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" };
const backLinkStyle = { display: "block", marginTop: "20px", textAlign: "center", color: "#888", background: "none", border: "none", cursor: "pointer", width: "100%" };

export default PaymentPage;
