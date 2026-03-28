import React, { useEffect, useState } from "react";

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Hàm lấy danh sách vé
  const fetchTickets = () => {
    if (user && user.id) {
      setLoading(true);
      fetch(`http://localhost/WEB_XEKHACH/Api/get_my_tickets.php?user_id=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTickets(data.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Lỗi rồi baby:", err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user?.id]);

  // 2. Hàm xử lý HỦY VÉ
  const handleCancel = async (bookingId) => {
    if (window.confirm("Cậu có chắc chắn muốn hủy chiếc vé hồng này không? 🌸")) {
      try {
        const response = await fetch("http://localhost/WEB_XEKHACH/Api/cancel_ticket.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: bookingId }),
        });
        const result = await response.json();

        if (result.success) {
          alert("Đã hủy vé thành công! Ghế đã được mở lại cho người khác rồi nhé. ✨");
          fetchTickets(); // Load lại danh sách vé mới ngay lập tức
        } else {
          alert("Huhu, lỗi rồi: " + result.message);
        }
      } catch (error) {
        console.error("Lỗi hủy vé:", error);
      }
    }
  };

  if (!user) return <div style={{ textAlign: 'center', padding: '50px' }}>🎀 Đăng nhập đi rồi tớ cho xem vé!</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: '#FF85A1', textAlign: 'center' }}>🎫 Vé của tớ</h2>
      
      {loading ? (
        <p style={{ textAlign: 'center' }}>Đang lục tìm vali vé... 🌸</p>
      ) : tickets.length > 0 ? (
        tickets.map((tk) => (
          <div key={tk.booking_id} style={ticketStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: "#1455FE", margin: "0 0 10px 0" }}>{tk.company_name} - {tk.bus_type}</h3>
                <p>📍 {tk.from_location} → {tk.to_location}</p>
                <p>⏰ Khởi hành: <b>{tk.departure_time}</b></p>
                <p>🪑 Ghế: <b style={{ color: "#FF85A1" }}>{tk.seat_number}</b></p>
                <p style={{ color: '#FF4D6D', fontWeight: 'bold', fontSize: '18px' }}>💰 {Number(tk.price).toLocaleString()} đ</p>
              </div>

              {/* NÚT HỦY VÉ XINH XẮN */}
              <button 
                onClick={() => handleCancel(tk.booking_id)}
                style={btnCancelStyle}
              >
                Hủy vé
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center' }}>Cậu chưa có vé nào, đi du lịch thôi! 🚌</p>
      )}
    </div>
  );
};

// --- CSS STYLES ---
const ticketStyle = {
  background: "#fff", padding: "25px", borderRadius: "20px", marginBottom: "20px",
  boxShadow: "0 8px 20px rgba(255, 133, 161, 0.15)", borderLeft: "10px solid #FF85A1",
  transition: "0.3s"
};

const btnCancelStyle = {
  padding: "8px 15px",
  background: "none",
  color: "#FF4D6D",
  border: "1px solid #FFC1CC",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
  transition: "0.3s"
};

export default MyTicketsPage;
