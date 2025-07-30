<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

include "db_config.php";

$postjson = json_decode(file_get_contents('php://input'), true);
$aksi = isset($postjson['aksi']) ? strip_tags($postjson['aksi']) : null;

if (!$aksi) {
    echo json_encode(['success' => false, 'msg' => 'Aksi tidak ditemukan dalam payload.']);
    exit;
}

switch ($aksi) {

    case "add_booking":
        $nama     = filter_var($postjson['nama'] ?? '', FILTER_SANITIZE_STRING);
        $telepon  = filter_var($postjson['telepon'] ?? '', FILTER_SANITIZE_STRING);
        $tanggal  = filter_var($postjson['tanggal'] ?? '', FILTER_SANITIZE_STRING);
        $jam      = filter_var($postjson['jam'] ?? '', FILTER_SANITIZE_STRING);
        $paket    = filter_var($postjson['paket'] ?? '', FILTER_SANITIZE_STRING);
        $catatan  = filter_var($postjson['catatan'] ?? '', FILTER_SANITIZE_STRING);
        $email    = filter_var($postjson['email'] ?? '', FILTER_SANITIZE_EMAIL);
        $barber   = filter_var($postjson['barber'] ?? '', FILTER_SANITIZE_STRING);
        $whatsapp = filter_var($postjson['whatsapp'] ?? '', FILTER_SANITIZE_STRING);
        $rating   = filter_var($postjson['rating'] ?? '', FILTER_SANITIZE_NUMBER_INT);

        try {
            $sql = "INSERT INTO booking 
                    (nama, telepon, tanggal, jam, paket, catatan, email, barber, whatsapp, rating) 
                    VALUES 
                    (:nama, :telepon, :tanggal, :jam, :paket, :catatan, :email, :barber, :whatsapp, :rating)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(compact('nama', 'telepon', 'tanggal', 'jam', 'paket', 'catatan', 'email', 'barber', 'whatsapp', 'rating'));

            echo json_encode(['success' => true, 'msg' => 'Booking berhasil disimpan.']);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => 'SQL Error: ' . $e->getMessage()]);
        }
        break;

    case "get_booking":
        try {
            $sql = "SELECT * FROM booking ORDER BY created_at DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'result' => $result]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => 'SQL Error: ' . $e->getMessage()]);
        }
        break;

    case "save_settings":
        $jam_buka   = filter_var($postjson['jam_buka'] ?? '', FILTER_SANITIZE_STRING);
        $jam_tutup  = filter_var($postjson['jam_tutup'] ?? '', FILTER_SANITIZE_STRING);
        $hari_libur = filter_var($postjson['hari_libur'] ?? '', FILTER_SANITIZE_STRING);

        try {
            $sql = "REPLACE INTO pengaturan (id, jam_buka, jam_tutup, hari_libur) VALUES (1, :jam_buka, :jam_tutup, :hari_libur)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(compact('jam_buka', 'jam_tutup', 'hari_libur'));

            echo json_encode(['success' => true, 'msg' => 'Pengaturan berhasil disimpan.']);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => 'SQL Error: ' . $e->getMessage()]);
        }
        break;

    case "get_settings":
        try {
            $sql = "SELECT * FROM pengaturan WHERE id = 1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'result' => $result]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => 'SQL Error: ' . $e->getMessage()]);
        }
        break;

    case "get_ulasan":
        try {
            $sql = "SELECT nama, rating, catatan FROM booking WHERE rating IS NOT NULL AND catatan != '' ORDER BY created_at DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $ulasan = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'result' => $ulasan]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => 'SQL Error: ' . $e->getMessage()]);
        }
        break;

    case "update_status":
        $id     = filter_var($postjson['id'] ?? 0, FILTER_VALIDATE_INT);
        $status = filter_var($postjson['status'] ?? '', FILTER_SANITIZE_STRING);

        if (!$id || !in_array($status, ['diterima', 'ditolak'])) {
            echo json_encode(['success' => false, 'msg' => 'ID atau status tidak valid.']);
            break;
        }

        try {
            $sql = "UPDATE booking SET status = :status WHERE id_booking = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':status' => $status, ':id' => $id]);
            echo json_encode(['success' => true, 'msg' => 'Status berhasil diperbarui.']);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => 'SQL Error: ' . $e->getMessage()]);
        }
        break;

    case "get_dashboard_summary":
        try {
            $bookingHariIni = $pdo->query("SELECT COUNT(*) FROM booking WHERE tanggal = CURDATE()")->fetchColumn();
            $antrian = $pdo->query("SELECT COUNT(*) FROM booking WHERE rating IS NULL OR rating = ''")->fetchColumn();
            $pelanggan = $pdo->query("SELECT COUNT(DISTINCT telepon) FROM booking")->fetchColumn();

            echo json_encode([
                'success' => true,
                'booking_hari_ini' => (int)$bookingHariIni,
                'antrian' => (int)$antrian,
                'pelanggan' => (int)$pelanggan
            ]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => 'SQL Error: ' . $e->getMessage()]);
        }
        break;

    case "login":
    $emailOrPhone = trim($postjson['emailOrPhone'] ?? '');
    $password     = trim($postjson['password'] ?? '');
    $role         = trim($postjson['role'] ?? '');

    if (!$emailOrPhone || !$password || !in_array($role, ['admin', 'pengguna'])) {
        echo json_encode(['success' => false, 'msg' => 'Data login tidak lengkap atau role tidak valid.']);
        break;
    }

    try {
        if ($role === 'admin') {
            $sql = "SELECT * FROM admin WHERE email = :email AND password = :password";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':email' => $emailOrPhone,
                ':password' => $password
            ]);
        } else {
            $sql = "SELECT * FROM pengguna 
                    WHERE (email = :email OR telepon = :telepon) 
                    AND password = :password";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':email' => $emailOrPhone,
                ':telepon' => $emailOrPhone,
                ':password' => $password
            ]);
        }

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode([
                'success' => true,
                'msg' => 'Login berhasil.',
                'data' => $user
            ]);
        } else {
            echo json_encode(['success' => false, 'msg' => 'Login gagal. Cek kembali data Anda.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'msg' => 'SQL Error: ' . $e->getMessage()]);
    }
    break;
}

?>