import React from "react";
import TripCard from "./TripCard";

/**
 * COMPONENT: TripList
 * @param trips: Mảng danh sách các chuyến xe nhận được từ kết quả tìm kiếm (API)
 */
function TripList({ trips }) {
  
  // 1. KIỂM TRA DỮ LIỆU ĐẦU VÀO (Safety Check)
  // Nếu trips bị rỗng hoặc không tồn tại (null/undefined), hiển thị thông báo
  if (!trips || trips.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Hiện không có chuyến xe nào phù hợp với tìm kiếm của bạn. 🚌</p>
      </div>
    );
  }

  return (
    // 2. LAYOUT DANH SÁCH
    // Sử dụng Flexbox để các thẻ xe (TripCard) xếp chồng lên nhau theo chiều dọc
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
      
      {/* 3. VÒNG LẶP RENDER (Map function) */}
      {trips.map((t) => (
        <TripCard 
          key={t.trip_id} // Cực kỳ quan trọng: Key duy nhất giúp React quản lý DOM hiệu quả
          trip={t}        // Truyền toàn bộ thông tin của 1 chuyến xe xuống con
        />
      ))}
      
    </div>
  );
}

// --- CSS GIAO DIỆN ---
const emptyStyle = {
  textAlign: "center",
  padding: "40px",
  background: "#f9f9f9",
  borderRadius: "10px",
  color: "#888",
  border: "1px dashed #ccc",
  marginTop: "20px"
};

export default TripList;
