<?php
// 1. MỞ CỬA CHO REACT (Sửa lỗi CORS đỏ lòm lúc nãy)
include '../config/api_header.php';
include '../config/connect.php';

// 2. NHẬN ID CỦA NGƯỜI ĐANG XEM VÉ (Gửi từ React sang)
$user_id = isset($_GET['user_id']) ? mysqli_real_escape_string($conn, $_GET['user_id']) : '';

if (empty($user_id)) {
    echo json_encode(["success" => false, "message" => "Cậu chưa đăng nhập!"]);
    exit;
}

// 3. CÂU SQL SIÊU CẤP (Kết nối 7 bảng + LỌC ĐÚNG ID NGƯỜI DÙNG)
$sql = "
SELECT 
    b.id AS booking_id,
    b.total_price AS price,
    b.status,
    b.booking_time,
    t.departure_time,
    r.departure AS from_location,
    r.destination AS to_location,
    c.ten_hang AS company_name,
    c.hotline AS hotline,
    bs.license_plate,
    bt.type_name AS bus_type,
    (SELECT GROUP_CONCAT(seat_number SEPARATOR ', ') 
     FROM booking_details 
     WHERE booking_id = b.id) AS seat_numbers
FROM bookings b
JOIN trips t ON b.trip_id = t.id
JOIN routes r ON t.route_id = r.id
JOIN buses bs ON t.bus_id = bs.id
JOIN bus_types bt ON bs.bustype_id = bt.id
JOIN companies c ON bs.company_id = c.id
WHERE b.user_id = '$user_id'
ORDER BY b.booking_time DESC
";

$result = $conn->query($sql);
$data = [];
while ($row = $result->fetch_assoc()) { 
    $data[] = $row; 
}

// 4. TRẢ VỀ KẾT QUẢ CHO REACT
echo json_encode(["success" => true, "data" => $data]);
?>
