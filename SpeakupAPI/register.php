<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$username || !$password || !$email) {
  echo json_encode(['success' => false, 'message' => 'Faltan datos.']);
  exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

try {
  $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  $stmt->execute([$username, $email, $hashed]);
  echo json_encode(['success' => true, 'message' => 'Registro exitoso']);
} catch (PDOException $e) {
  echo json_encode(['success' => false, 'message' => 'Error: usuario ya registrado.']);
}
?>
