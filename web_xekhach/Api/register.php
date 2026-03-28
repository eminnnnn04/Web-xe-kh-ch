<?php
// 1. Nhập các file cấu hình hệ thống (CORS cho React và Kết nối DB)
include '../config/api_header.php'; 
include '../config/connect.php';

// 2. Đọc dữ liệu JSON từ React (name, email, phone, password)
$data = json_decode(file_get_contents("php://input"));

// 3. Kiểm tra xem tất cả các trường dữ liệu có bị bỏ trống hay không
if (!empty($data->name) && !empty($data->email) && !empty($data->phone) && !empty($data->password)) {
    
    // 4. Lọc dữ liệu để tránh lỗi SQL Injection (Bảo mật cơ bản)
    $name = mysqli_real_escape_string($conn, $data->name);
    $email = mysqli_real_escape_string($conn, $data->email);
    $phone = mysqli_real_escape_string($conn, $data->phone);
    $pass = mysqli_real_escape_string($conn, $data->password);

    // 5. BƯỚC QUAN TRỌNG: Kiểm tra xem Email hoặc SĐT này đã có người dùng chưa
    // Việc này giúp tránh tạo ra các tài khoản trùng lặp thông tin duy nhất
    $checkUser = "SELECT id FROM users WHERE email='$email' OR phone='$phone'";
    $resultCheck = mysqli_query($conn, $checkUser);

    if (mysqli_num_rows($resultCheck) > 0) {
        // Trả về lỗi nếu dữ liệu đã tồn tại trong hệ thống
        echo json_encode(["success" => false, "message" => "Email hoặc Số điện thoại đã tồn tại!"]);
    } else {
        // 6. THÊM MỚI: Chèn dữ liệu vào bảng users
        // Mặc định gán 'role = 0' (thường là quyền Khách hàng/User thường)
        $sql = "INSERT INTO users (name, email, phone, password, role) 
                VALUES ('$name', '$email', '$phone', '$pass', 0)";
        
        if (mysqli_query($conn, $sql)) {
            // Trả về thành công để React có thể chuyển hướng người dùng sang trang Login
            echo json_encode(["success" => true, "message" => "Đăng ký thành công!"]);
        } else {
            // Trình báo lỗi từ phía Database nếu có (ví dụ: sai tên cột, mất kết nối)
            echo json_encode(["success" => false, "message" => "Lỗi server: " . mysqli_error($conn)]);
        }
    }
} else {
    // Thông báo khi người dùng nhấn Đăng ký mà chưa điền đủ các ô input
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ thông tin!"]);
}
?>
