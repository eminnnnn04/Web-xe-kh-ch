<?php
include '../config/api_header.php';
include '../config/connect.php';



// ==========================
// 1. LẤY DANH SÁCH TỈNH (Giữ nguyên)
// ==========================
$provinces = [];
$loc_sql = "
    SELECT DISTINCT location FROM (
        SELECT departure AS location FROM routes
        UNION
        SELECT destination AS location FROM routes
    ) AS all_locs
    WHERE location NOT LIKE '%Hồ Chí Minh%'
    ORDER BY location ASC
";

$loc_stmt = $conn->prepare($loc_sql);
$loc_stmt->execute();
$loc_result = $loc_stmt->get_result();

while ($row = $loc_result->fetch_assoc()) {
    $provinces[] = $row['location'];
}

// ==========================
// 2. NHẬN THAM SỐ TỪ REACT
// ==========================
$departure   = $_GET['departure']   ?? '';
$destination = $_GET['destination'] ?? '';
$travel_date = $_GET['travel_date'] ?? date('Y-m-d'); 

// ==========================
// 3. QUERY CHÍNH (Đã bỏ CONCAT - Lấy trực tiếp cột departure_time)
// ==========================
$sql = "
    SELECT 
        t.id AS trip_id,
        c.ten_hang AS company_name,
        r.departure,
        r.destination,
        r.duration_hours,
        t.departure_time, -- <--- LẤY TRỰC TIẾP GIỜ THẬT TRONG DB
        bt.type_name,
        bt.seat_count,
        CASE 
            WHEN bt.type_name = 'Limousine' 
            THEN IFNULL(rp.base_price, 0) * 1.5 
            ELSE IFNULL(rp.base_price, 0)
        END AS final_price
    FROM trips t
    JOIN routes r ON t.route_id = r.id
    JOIN buses b ON t.bus_id = b.id
    JOIN bus_types bt ON b.bustype_id = bt.id
    JOIN companies c ON b.company_id = c.id
    LEFT JOIN route_prices rp ON r.id = rp.route_id
    WHERE t.status = 'active'
";

// ==========================
// 4. BUILD ĐIỀU KIỆN LỌC ĐỘNG
// ==========================
$params = [];
$types  = "";

// LỌC THEO NGÀY (QUAN TRỌNG: Tìm các chuyến từ 0h đến 23h59 của ngày khách chọn)
if (!empty($travel_date)) {
    $start_of_day = date('Y-m-d 00:00:00', strtotime($travel_date));
    $end_of_day   = date('Y-m-d 23:59:59', strtotime($travel_date));

    $sql .= " AND t.departure_time BETWEEN ? AND ?";
    $params[] = $start_of_day;
    $params[] = $end_of_day;
    $types .= "ss";
}

// Lọc điểm đi
if (!empty($departure)) {
    $sql .= " AND r.departure = ?";
    $params[] = $departure;
    $types .= "s";
}

// Lọc điểm đến
if (!empty($destination)) {
    $sql .= " AND r.destination = ?";
    $params[] = $destination;
    $types .= "s";
}

// Sắp xếp theo thời gian khởi hành sớm nhất lên đầu
$sql .= " ORDER BY t.departure_time ASC";

// ==========================
// 5. PREPARE & EXECUTE
// ==========================
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => $conn->error]);
    exit;
}

// Bind các tham số linh hoạt nếu có
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

// ==========================
// 6. LẤY DỮ LIỆU
// ==========================
$trips = [];
while ($row = $result->fetch_assoc()) {
    $trips[] = $row;
}

// ==========================
// 7. PHẢN HỒI JSON
// ==========================
echo json_encode([
    "status" => "success",
    "locations" => [
        "provinces" => $provinces
    ],
    "data" => $trips
], JSON_UNESCAPED_UNICODE);
?>
