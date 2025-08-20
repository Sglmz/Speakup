<?php
require_once __DIR__ . 'db.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta el ID"]);
    exit;
}

$id = $_GET['id'];

try {
    $stmt = $conn->prepare("SELECT id, username, email, level, created_at, last_login FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["error" => "Usuario no encontrado"]);
    } else {
        echo json_encode($user);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
