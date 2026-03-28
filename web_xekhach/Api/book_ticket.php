<?php
// 1. Cấu hình Header (CORS) và kết nối cơ sở dữ liệu
include '../config/api_header.php';
include '../config/connect.php';

// 2. Nhận dữ liệu JSON từ phía React gửi lên (Fetch API)
$data = json_decode(file_get_contents("php://input"));

// 3. KIỂM TRA ĐẦU VÀO: Đảm bảo có đủ ID người dùng, ID chuyến xe và danh sách ghế chọn
if (!empty($data->user_id) && !empty($data->trip_id) && !empty($data->seats)) {
    
    // Lọc dữ liệu thô để chống SQL Injection
    $user_id = mysqli_real_escape_string($conn, $data->user_id);
    $trip_id = mysqli_real_escape_string($conn, $data->trip_id);
    $total_price = mysqli_real_escape_string($conn, $data->total_price);
    $seats = $data->seats; // Mảng các số ghế người dùng đã chọn (VD: [1, 2])

    // 4. TRANSACTION (GIAO DỊCH): Cực kỳ quan trọng!
    // Giúp đảm bảo nếu một bước bị lỗi (ví dụ: mất điện giữa chừng), 
    // toàn bộ quá trình sẽ hủy bỏ để tránh tình trạng 'tạo đơn hàng nhưng không có ghế'.
    mysqli_begin_transaction($conn);

    try {
        // 5. LƯU ĐƠN HÀNG TỔNG (Bảng bookings)
        // Ghi lại ai đặt, chuyến nào, tổng bao nhiêu tiền và trạng thái
        $sql_booking = "INSERT INTO bookings (user_id, trip_id, total_price, status) 
                        VALUES ('$user_id', '$trip_id', '$total_price', 'đã thanh toán')";
        mysqli_query($conn, $sql_booking);
        
        // Lấy ID của đơn hàng vừa được tạo tự động để dùng cho bảng chi tiết
        $booking_id = mysqli_insert_id($conn); 

        // 6. XỬ LÝ TỪNG GHẾ TRONG DANH SÁCH
        foreach ($seats as $seat_number) {
            // A. CẬP NHẬT TRẠNG THÁI GHẾ: Chuyển 'is_booked' thành 1 (Ghế đã có chủ)
            // Việc này giúp người sau khi vào trang chọn ghế sẽ thấy ghế này đã bị khóa
            $sql_update_seat = "UPDATE seats SET is_booked = 1 
                                WHERE trip_id = '$trip_id' AND seat_number = '$seat_number'
                                AND is_booked = 0";
            mysqli_query($conn, $sql_update_seat);
                if (mysqli_affected_rows($conn) <= 0) {
                throw new Exception("Huhu, ghế số $seat_number vừa có người nhanh tay đặt mất rồi! 🌸");
                }

            // B. LƯU CHI TIẾT VÉ (Bảng booking_details)
            // Ghi rõ đơn hàng #ID này gồm những ghế cụ thể nào
            $sql_detail = "INSERT INTO booking_details (booking_id, seat_number) 
                           VALUES ('$booking_id', '$seat_number')";
            mysqli_query($conn, $sql_detail);
        }

        // 7. HOÀN TẤT: Lưu mọi thay đổi vĩnh viễn vào Database
        mysqli_commit($conn);

        echo json_encode(["success" => true, "message" => "Đặt vé thành công!"]);

    } catch (Exception $e) {
        // 8. ROLLBACK: Nếu có bất kỳ lỗi nào xảy ra trong khối 'try', 
        // lệnh này sẽ thu hồi (xóa) hết các dữ liệu đã chèn dở dang ở trên.
        mysqli_rollback($conn);
        echo json_encode(["success" => false, "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }

} else {
    // Thông báo nếu React gửi thiếu dữ liệu cần thiết
    echo json_encode(["success" => false, "message" => "Thiếu thông tin đặt vé!"]);
}
?>
