<?php
include 'connect.php';

function generateSeats($trip_id, $seat_count, $rows) {
    global $conn;

    $seats_per_floor = $seat_count / 2;  // vì có 2 tầng
    $seats_per_row = $seats_per_floor / $rows;

    $floors = ["A", "B"]; // A = tầng 1, B = tầng 2

    foreach ($floors as $floor) {
        for ($row = 1; $row <= $rows; $row++) {
            for ($i = 1; $i <= $seats_per_row; $i++) {
                // Tạo số ghế
                $number = (($row-1) * $seats_per_row) + $i;
                $seat_code = $floor . str_pad($number, 2, '0', STR_PAD_LEFT);

                // Lưu vào DB
                $sql = "INSERT INTO seats (trip_id, seat_number, is_booked) 
                        VALUES ('$trip_id', '$seat_code', 0)";
                $conn->query($sql);
            }
        }
    }

    echo "Đã tạo $seat_count ghế cho trip $trip_id!";
}

// Ví dụ:
// Xe 24 chỗ → 2 dãy
// Xe 32 chỗ → 3 dãy

// generateSeats(trip_id:1, seat_count:24, rows:2);
// generateSeats(trip_id:2, seat_count:32, rows:3);

?>generate_seats