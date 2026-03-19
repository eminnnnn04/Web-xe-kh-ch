<?php
// 1. Kết nối Database 
$conn = mysqli_connect("localhost", "root", "", "bus_booking");

// Kiểm tra kết nối
if (!$conn) {
    header('Content-Type: application/json');
    die(json_encode(["status" => "error", "message" => "Kết nối DB thất bại"]));
}

mysqli_set_charset($conn, "utf8");

// 2. Câu lệnh SQL (Giữ nguyên logic của bạn, thêm LEFT JOIN để an toàn)
$sql = "SELECT 
    trips.departure_time,
    routes.duration_hours,
    DATE_ADD(trips.departure_time, INTERVAL routes.duration_hours HOUR) AS arrival_time,
    bus_types.type_name,
    route_prices.base_price,
    CASE 
        WHEN bus_types.type_name = 'Limousine' THEN route_prices.base_price * 1.5
        ELSE route_prices.base_price
    END AS price
FROM trips
JOIN routes ON trips.route_id = routes.id
JOIN buses ON trips.bus_id = buses.id
JOIN bus_types ON buses.bustype_id = bus_types.id
LEFT JOIN route_prices ON routes.id = route_prices.route_id"; // Đổi thành LEFT JOIN

// 3. Thực thi
$result = mysqli_query($conn, $sql);
$data = array();

if ($result) {
    while($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
}

// 4. Xuất JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
?>
