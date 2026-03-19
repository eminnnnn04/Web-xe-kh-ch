<?php
include 'connect.php';

if (isset($_POST['submit'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $pass = $_POST['password'];

    $sql = "INSERT INTO users(name, email, phone, password)
            VALUES('$name', '$email', '$phone', '$pass')";
    
    mysqli_query($conn, $sql);

    echo "Đăng ký thành công";
}
?>

<h2>Đăng ký</h2>
<form method="POST">
    <input type="text" name="name" placeholder="Tên"><br><br>
    <input type="email" name="email" placeholder="Email"><br><br>
    <input type="text" name="phone" placeholder="Số điện thoại"><br><br>
    <input type="password" name="password" placeholder="Mật khẩu"><br><br>
    <button name="submit">Đăng ký</button>
</form>