<?php
include '../config/connect.php';

// 1. Dọn dẹp sạch sẽ để nạp bản 30 ngày "siêu cấp"
mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 0");
mysqli_query($conn, "TRUNCATE TABLE trips");
mysqli_query($conn, "TRUNCATE TABLE seats"); // Xóa ghế cũ để nạp ghế mới cho khớp
mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 1");

$days_to_generate = 30;
$start_date = date('Y-m-d');

// 2. Lấy toàn bộ 20 xe
$res_buses = mysqli_query($conn, "SELECT id FROM buses LIMIT 20");
$buses = [];
while($b = mysqli_fetch_assoc($res_buses)) { $buses[] = $b['id']; }

// 3. Vòng lặp NGÀY
for ($i = 0; $i < $days_to_generate; $i++) {
    $current_date = date('Y-m-d', strtotime("$start_date + $i days"));

    // 4. Vòng lặp từng TUYẾN ĐƯỜNG (Từ 1 đến 18)
    for ($route_id = 1; $route_id <= 18; $route_id++) {
        
        // Mỗi tuyến đường, bốc ngẫu nhiên 5 xe chạy (để tránh quá tải dữ liệu)
        $random_bus_keys = array_rand($buses, 5); 
        
        foreach ($random_bus_keys as $key) {
            $bus_id = $buses[$key];
            $route_ve = $route_id + 18;

            // Giờ chạy ngẫu nhiên
            $h = rand(5, 21);
            $time_di = "$current_date " . str_pad($h, 2, '0', STR_PAD_LEFT) . ":00:00";
            $time_ve = "$current_date " . str_pad(($h + 5) % 24, 2, '0', STR_PAD_LEFT) . ":30:00";

            // --- A. TẠO CHUYẾN ĐI & BƠM GHẾ ---
            mysqli_query($conn, "INSERT INTO trips (route_id, bus_id, departure_time, status) VALUES ($route_id, $bus_id, '$time_di', 'active')");
            $new_trip_id_di = mysqli_insert_id($conn);
            generateSeatsForTrip($conn, $new_trip_id_di); // Gọi hàm in ghế

            // --- B. TẠO CHUYẾN VỀ & BƠM GHẾ ---
            mysqli_query($conn, "INSERT INTO trips (route_id, bus_id, departure_time, status) VALUES ($route_ve, $bus_id, '$time_ve', 'active')");
            $new_trip_id_ve = mysqli_insert_id($conn);
            generateSeatsForTrip($conn, $new_trip_id_ve); // Gọi hàm in ghế
        }
    }
}

// 5. HÀM IN 30 GHẾ CHO MỖI CHUYẾN (Dùng kỹ thuật Insert nhanh)
function generateSeatsForTrip($conn, $trip_id) {
    $values = [];
    for ($s = 1; $s <= 30; $s++) {
        $values[] = "($trip_id, '$s', 0)";
    }
    $sql = "INSERT INTO seats (trip_id, seat_number, is_booked) VALUES " . implode(',', $values);
    mysqli_query($conn, $sql);
}

echo "🎉 ĐÃ NẠP XONG CHUYẾN XE & GHẾ CHO 30 NGÀY! Anh yêu vào đặt vé tẹt ga nhé! 🌸🚌🎫";
?>
