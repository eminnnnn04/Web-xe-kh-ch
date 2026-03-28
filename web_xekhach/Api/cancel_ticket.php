<?php
// 1. Cấu hình Headers để React không bị chặn (CORS)
include '../config/api_header.php';
include '../config/connect.php';


// 2. Nhận dữ liệu gửi từ React sang
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->booking_id)) {
    $booking_id = mysqli_real_escape_string($conn, $data->booking_id);

    // BƯỚC 1: Tìm xem đơn hàng này thuộc trip nào và đặt những ghế nào
    // Để mình còn biết đường mà "mở khóa" cho ghế đó thành trống
    $sql_get_info = "
        SELECT b.trip_id, d.seat_number 
        FROM booking_details d
        JOIN bookings b ON d.booking_id = b.id
        WHERE b.id = '$booking_id'
    ";
    $res_info = mysqli_query($conn, $sql_get_info);
    
    // Dùng Transaction để đảm bảo: Hoặc xóa hết, hoặc không xóa gì (Tránh lỗi dở dang)
    mysqli_begin_transaction($conn);

    try {
        // BƯỚC 2: Duyệt qua từng ghế trong đơn hàng để trả lại trạng thái trống (is_booked = 0)
        while ($row = mysqli_fetch_assoc($res_info)) {
            $trip_id = $row['trip_id'];
            $seat_no = $row['seat_number'];
            
            $sql_update_seat = "UPDATE seats SET is_booked = 0 
                                WHERE trip_id = '$trip_id' AND seat_number = '$seat_no'";
            mysqli_query($conn, $sql_update_seat);
        }

        // BƯỚC 3: Xóa dữ liệu ở bảng con trước (booking_details)
        mysqli_query($conn, "DELETE FROM booking_details WHERE booking_id = '$booking_id'");

        // BƯỚC 4: Xóa đơn hàng ở bảng cha (bookings)
        $sql_delete_booking = "DELETE FROM bookings WHERE id = '$booking_id'";
        
        if (mysqli_query($conn, $sql_delete_booking)) {
            mysqli_commit($conn);
            echo json_encode(["success" => true, "message" => "Đã hủy vé và mở lại ghế thành công! ✨"]);
        } else {
            throw new Exception(mysqli_error($conn));
        }

    } catch (Exception $e) {
        // Nếu có bất kỳ lỗi nào, hoàn tác lại toàn bộ quá trình
        mysqli_rollback($conn);
        echo json_encode(["success" => false, "message" => "Lỗi DB: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu mã đơn hàng rồi baby!"]);
}
?>
