<?php
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
}
?>

<h2>Trang chính</h2>
<p>Xin chào: <?php echo $_SESSION['user']; ?></p>