<?php
// 1. Nhúng file cấu hình và kết nối
include '../config/api_header.php'; 
include '../config/connect.php'; 

// Thiết lập phản hồi JSON tiếng Việt chuẩn
header('Content-Type: application/json; charset=utf-8');

// 2. Nhận trip_id từ trình duyệt (Ví dụ: ?trip_id=1)
$trip_id = isset($_GET['trip_id']) ? intval($_GET['trip_id']) : 0;

// Nếu không có trip_id hoặc trip_id = 0 thì báo lỗi
if ($trip_id <= 0) {
    echo json_encode([
        "status" => "error", 
        "message" => "Vui lòng nhập mã chuyến xe (trip_id) vào thanh địa chỉ!"
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); // Thêm UNESCAPED_UNICODE để hiện tiếng Việt
    exit;
}

/**
 * 3. TRUY VẤN LẤY GHẾ (Tối ưu cho 28.000 dòng)
 */
$stmt = $conn->prepare("
    SELECT 
        id AS seat_id,
        seat_number,
        is_booked
    FROM seats
    WHERE trip_id = ?
    ORDER BY seat_number ASC
");

$stmt->bind_param("i", $trip_id);
$stmt->execute();
$result = $stmt->get_result();

$seats_list = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['seat_id'] = (int)$row['seat_id'];
        $row['is_booked'] = (int)$row['is_booked'];
        $seats_list[] = $row;
    }

    // 4. Trả về kết quả JSON tiếng Việt đẹp mắt
    echo json_encode([
        "status" => "success",
        "trip_id" => $trip_id,
        "total_seats" => count($seats_list),
        "data" => $seats_list
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Lỗi truy vấn dữ liệu ghế: " . $conn->error
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

// 5. Đóng kết nối
$stmt->close();
$conn->close();
?>
