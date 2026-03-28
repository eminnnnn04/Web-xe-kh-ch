<?php
include '../config/api_header.php';

// 1. Tắt kiểm tra khóa ngoại để có thể xóa bảng
mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 0");

// 2. Xóa sạch dữ liệu cũ (Xóa bảng seats trước, trips sau cho an toàn)
mysqli_query($conn, "TRUNCATE TABLE seats");
mysqli_query($conn, "TRUNCATE TABLE trips");

// 3. Bật lại kiểm tra khóa ngoại
mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 1");

for ($day = 0; $day < 7; $day++) {
    $date = date('Y-m-d', strtotime("+$day days"));
    $schedules = mysqli_query($conn, "SELECT * FROM schedules");

    while ($sch = mysqli_fetch_assoc($schedules)) {
        $departure_full = $date . ' ' . $sch['departure_time_fixed'];
        
        // 1. Tạo chuyến xe thực tế (Trip)
        mysqli_query($conn, "INSERT INTO trips (schedule_id, bus_id, route_id, departure_time) 
                             VALUES ({$sch['id']}, {$sch['bus_id']}, {$sch['route_id']}, '$departure_full')");
        $new_trip_id = mysqli_insert_id($conn);
        
        // 2. Tạo ghế tự động theo loại xe (32 hoặc 24 ghế)
        $res_bus = mysqli_query($conn, "SELECT seat_count FROM buses WHERE id = {$sch['bus_id']}");
        $bus = mysqli_fetch_assoc($res_bus);
        for ($s = 1; $s <= $bus['seat_count']; $s++) {
            $s_name = "G" . str_pad($s, 2, "0", STR_PAD_LEFT);
            mysqli_query($conn, "INSERT INTO seats (trip_id, seat_number, is_booked) VALUES ($new_trip_id, '$s_name', 0)");
        }
    }
}
echo "Xong! Hệ thống đã sẵn sàng với hàng nghìn vé cho tuần tới.";
?>
