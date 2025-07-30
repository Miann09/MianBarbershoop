<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Konfigurasi database
$hostname = 'localhost';
$username = 'root';
$password = ''; // sesuaikan jika ada password
$database = 'barbershop_app';
$charset = 'utf8';

$dsn = "mysql:host=$hostname;dbname=$database;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'msg' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}
?>
