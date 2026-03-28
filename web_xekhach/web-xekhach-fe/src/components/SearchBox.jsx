import React, { useState } from "react";

/**
 * COMPONENT: SearchBox
 * @param provinces: Danh sách các tỉnh thành truyền từ App.js (Dạng mảng: ["TP.HCM", "Hà Nội", ...])
 * @param onSearch: Hàm callback để gửi dữ liệu tìm kiếm ngược lại cho App.js xử lý
 */
function SearchBox({ provinces, onSearch }) {
  // 1. STATE QUẢN LÝ DỮ LIỆU TÌM KIẾM
  const [departure, setDeparture] = useState("");   // Điểm đi
  const [destination, setDestination] = useState(""); // Điểm đến
  const [travelDate, setDate] = useState("");         // Ngày đi

  // ĐỊNH DANH ĐIỂM TRUNG TÂM (Phải khớp 100% với tên trong Database của bạn)
  const HCM = "TP.HCM"; 

  // 2. LOGIC ĐỔI CHIỀU (SWAP)
  const handleSwap = () => {
    // Chỉ đổi nếu cả 2 ô đã chọn địa điểm
    if (departure && destination) {
      setDeparture(destination);
      setDestination(departure);
    }
  };

  // 3. LOGIC XỬ LÝ KHI CHỌN ĐỊA ĐIỂM (Ràng buộc tuyến đường)
  // Quy tắc: Nếu một đầu chọn Tỉnh lẻ, đầu kia phải TỰ ĐỘNG nhảy về TP.HCM
  const handleSelectLocation = (type, value) => {
    if (type === "departure") {
      setDeparture(value);
      // Nếu chọn điểm đi là Tỉnh lẻ, thì điểm đến bắt buộc là TP.HCM
      if (value !== "" && value !== HCM) {
        setDestination(HCM);
      }
    } else {
      setDestination(value);
      // Nếu chọn điểm đến là Tỉnh lẻ, thì điểm đi bắt buộc là TP.HCM
      if (value !== "" && value !== HCM) {
        setDeparture(HCM);
      }
    }
  };

  return (
    <div style={containerStyle}>
      
      {/* CỘM CHỌN ĐIỂM ĐI */}
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Điểm đi</label>
        <select 
          value={departure} 
          onChange={(e) => handleSelectLocation("departure", e.target.value)}
          style={selectStyle}
        >
          <option value="">Chọn điểm đi</option>
          {provinces.map((p, i) => (
            <option 
              key={i} 
              value={p}
              // Khóa (disabled) các tỉnh lẻ khác nếu điểm đến hiện tại đã là một tỉnh lẻ
              disabled={destination !== "" && destination !== HCM && p !== HCM}
            >
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* NÚT ĐỔI CHIỀU (⇄) */}
      <div onClick={handleSwap} style={swapBtnStyle} title="Đổi chiều">
        ⇄
      </div>

      {/* CỤM CHỌN ĐIỂM ĐẾN */}
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Điểm đến</label>
        <select 
          value={destination} 
          onChange={(e) => handleSelectLocation("destination", e.target.value)}
          style={selectStyle}
        >
          <option value="">Chọn điểm đến</option>
          {provinces.map((p, i) => (
            <option 
              key={i} 
              value={p}
              // Tương tự: Khóa các tỉnh lẻ nếu điểm đi đã là tỉnh lẻ
              disabled={departure !== "" && departure !== HCM && p !== HCM}
            >
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* CHỌN NGÀY ĐI */}
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Ngày đi</label>
        <input 
          type="date" 
          value={travelDate}
          min={new Date().toISOString().split("T")[0]} // Không cho chọn ngày trong quá khứ
          onChange={(e) => setDate(e.target.value)}
          style={selectStyle}
        />
      </div>

      {/* NÚT TÌM CHUYẾN */}
      <button 
        onClick={() => onSearch({ departure, destination, travelDate })}
        style={searchBtnStyle}
      >
        TÌM CHUYẾN
      </button>
    </div>
  );
}

// --- HỆ THỐNG GIAO DIỆN (UI STYLES) ---
const containerStyle = {
  display: "flex", alignItems: "flex-end", gap: "12px", 
  background: "#1a1a1a", padding: "20px", borderRadius: "12px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.3)", maxWidth: "1000px", margin: "0 auto"
};

const inputGroupStyle = { display: "flex", flexDirection: "column", flex: 1, gap: "8px" };

const labelStyle = { color: "#aaa", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" };

const selectStyle = { 
  width: "100%", padding: "12px", borderRadius: "8px", 
  background: "#333", color: "#fff", border: "1px solid #444", 
  fontSize: "15px", cursor: "pointer", outline: "none"
};

const swapBtnStyle = {
  width: "40px", height: "40px", borderRadius: "50%",
  background: "#fff", display: "flex", justifyContent: "center",
  alignItems: "center", cursor: "pointer", fontSize: "22px", color: "#000",
  flexShrink: 0, marginBottom: "5px", transition: "0.2s active",
  boxShadow: "0 2px 10px rgba(255,255,255,0.2)"
};

const searchBtnStyle = { 
  padding: "13px 30px", background: "#ef5222", color: "#fff", 
  border: "none", borderRadius: "8px", fontWeight: "bold", 
  cursor: "pointer", fontSize: "16px", marginBottom: "2px"
};

export default SearchBox;
