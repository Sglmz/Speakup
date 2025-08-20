<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$email || !$password) {
  echo json_encode(['status' => 'error', 'message' => 'Faltan datos.']);
  exit;
}

try {
  $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && password_verify($password, $user['password'])) {
    $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?")->execute([$user['id']]);

    if ($user['email'] === 'admin@speakup.com') {
      echo json_encode([
        'status' => 'success',
        'level' => 'admin',
        'username' => $user['username'],
        'id' => $user['id'],
        'message' => 'Bienvenido administrador'
      ]);
    } else {
      echo json_encode([
        'status' => 'success',
        'level' => $user['level'] ?? 'Inicial',
        'username' => $user['username'],
        'id' => $user['id'],
        'message' => 'Bienvenido'
      ]);
    }
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Credenciales incorrectas']);
  }
} catch (PDOException $e) {
  echo json_encode(['status' => 'error', 'message' => 'Error en el servidor']);
}
