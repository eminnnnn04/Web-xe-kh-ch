<?php
session_start();
include 'connect.php';

if (isset($_POST['login'])) {
    $user = $_POST['user']; // email hoặc sdt
    $pass = $_POST['password'];

    $sql = "SELECT * FROM users 
            WHERE (email='$user' OR phone='$user') 
            AND password='$pass'";
    
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $_SESSION['user'] = $row['name'];

        header("Location: index.php");
    } else {
        echo "Sai tài khoản hoặc mật khẩu";
    }
}
?>

<h2>Đăng nhập</h2>
<form method="POST">
    <input type="text" name="user" placeholder="Email hoặc SĐT"><br><br>
    <input type="password" name="password" placeholder="Mật khẩu"><br><br>
    <button name="login">Đăng nhập</button>
</form>