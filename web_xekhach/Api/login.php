<?php
// 1. Thiết lập Header cho API (CORS, Content-Type) và kết nối Database
include '../config/api_header.php'; 
include '../config/connect.php';

// 2. Lấy dữ liệu JSON thô từ luồng đầu vào (thường từ Axios/Fetch của React gửi lên)
$data = json_decode(file_get_contents("php://input"));

// 3. Kiểm tra xem người dùng đã nhập đủ tài khoản và mật khẩu chưa
if (!empty($data->user) && !empty($data->password)) {
    
    // 4. Lọc dữ liệu đầu vào để tránh lỗi SQL cơ bản (Chống SQL Injection)
    $user = mysqli_real_escape_string($conn, $data->user);
    $pass = mysqli_real_escape_string($conn, $data->password);

    // 5. Truy vấn: Tìm user khớp với Email HOẶC Số điện thoại VÀ mật khẩu
    // Lưu ý: Chỉ lấy các cột cần thiết, không nên lấy cột 'password' ra ngoài
    $sql = "SELECT id, name, email, role FROM users 
            WHERE (email='$user' OR phone='$user') 
            AND password='$pass'";
    
    $result = mysqli_query($conn, $sql);

    // 6. Kiểm tra xem có dòng dữ liệu nào khớp không (Tìm thấy user)
    if (mysqli_num_rows($result) > 0) {
        // Chuyển kết quả truy vấn thành mảng liên kết (Associative Array)
        $row = mysqli_fetch_assoc($result);
        
        // 7. Trả về phản hồi thành công kèm thông tin user dưới dạng JSON
        echo json_encode([
            "success" => true,
            "message" => "Đăng nhập thành công",
            "user" => $row
        ]);
    } else {
        // 8. Trả về thông báo lỗi nếu tài khoản/mật khẩu sai
        echo json_encode(["success" => false, "message" => "Sai tài khoản hoặc mật khẩu"]);
    }
} else {
    // 9. Trả về thông báo nếu client gửi thiếu dữ liệu
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đủ thông tin"]);
}
?>
