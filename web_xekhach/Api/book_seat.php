<?php
include '../config/api_header.php'; 
include '../config/connect.php';

header("Content-Type: application/json; charset=utf-8");

// 1. Kiểm tra đầu vào
if (!isset($_POST['trip_id'], $_POST['seat_number'], $_POST['customer_name'], $_POST['phone'])) {
    echo json_encode(["status" => "error", "message" => "Thiếu thông tin đầu vào"]);
    exit;
}

$trip_id = intval($_POST['trip_id']);
$seat_number = $_POST['seat_number'];
$customer_name = $_POST['customer_name'];
$phone = $_POST['phone'];

// 2. Bắt đầu Giao dịch (Transaction) để tránh đặt trùng ghế
$conn->begin_transaction();

try {
    // A. Kiểm tra và KHÓA dòng ghế đó lại (FOR UPDATE)
    $stmt = $conn->prepare("SELECT is_booked FROM seats WHERE trip_id = ? AND seat_number = ? FOR UPDATE");
    $stmt->bind_param("is", $trip_id, $seat_number);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    if (!$row) throw new Exception("Ghế không tồn tại");
    if ($row['is_booked'] == 1) throw new Exception("Ghế này đã có người đặt");

    // B. Lấy giá vé chính xác từ Database
    $price_stmt = $conn->prepare("
        SELECT 
            CASE 
                WHEN bt.type_name = 'Limousine' THEN rp.base_price * 1.5
                ELSE rp.base_price
            END AS price
        FROM trips t
        JOIN routes r ON t.route_id = r.id
        JOIN buses b ON t.bus_id = b.id
        JOIN bus_types bt ON b.bustype_id = bt.id
        JOIN route_prices rp ON r.id = rp.route_id -- Sử dụng r.id thay vì route_id để chuẩn xác
        WHERE t.id = ?
    ");
    $price_stmt->bind_param("i", $trip_id);
    $price_stmt->execute();
    $price_res = $price_stmt->get_result()->fetch_assoc();
    $price = $price_res['price'];

    // C. Cập nhật trạng thái ghế
    $up_stmt = $conn->prepare("UPDATE seats SET is_booked = 1 WHERE trip_id = ? AND seat_number = ?");
    $up_stmt->bind_param("is", $trip_id, $seat_number);
    $up_stmt->execute();

    // D. Lưu thông tin vé
    $ins_stmt = $conn->prepare("INSERT INTO tickets (trip_id, seat_number, customer_name, phone, price) VALUES (?, ?, ?, ?, ?)");
    $ins_stmt->bind_param("isssd", $trip_id, $seat_number, $customer_name, $phone, $price);
    $ins_stmt->execute();

    // Nếu mọi thứ OK, lưu vĩnh viễn vào DB
    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Đặt vé thành công", "price" => $price], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // Nếu có lỗi, hủy bỏ toàn bộ thay đổi (Rollback)
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>
