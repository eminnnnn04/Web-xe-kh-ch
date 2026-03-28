<?php
// Cho phép tất cả các tên miền truy cập
header("Access-Control-Allow-Origin: *");
// Cho phép các phương thức phổ biến nhất
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
// Cho phép gửi dữ liệu dạng JSON (Content-Type)
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
// Luôn trả về định dạng JSON
header("Content-Type: application/json; charset=UTF-8");

include 'connect.php'; 
?>
