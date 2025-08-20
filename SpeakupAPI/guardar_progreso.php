<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
require 'db.php';

// Ruta del archivo de log
$logFile = __DIR__ . '/log.txt';

// Función para escribir logs
function logData($message) {
  global $logFile;
  file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] " . $message . "\n", FILE_APPEND);
}

$data = json_decode(file_get_contents("php://input"), true);
logData("Datos recibidos: " . json_encode($data));

$user_id = $data['user_id'] ?? null;
$game_id = $data['game_id'] ?? null;

if (!$user_id || !$game_id) {
  logData("❌ Faltan datos - user_id: $user_id | game_id: $game_id");
  echo json_encode(['status' => 'error', 'message' => 'Faltan datos']);
  exit;
}

try {
  // 1. Verifica si ya existe el registro
  $check = $pdo->prepare("SELECT id FROM progress WHERE user_id = ? AND game_id = ?");
  $check->execute([$user_id, $game_id]);

  if ($check->rowCount() === 0) {
    $insert = $pdo->prepare("INSERT INTO progress (user_id, game_id) VALUES (?, ?)");
    $insert->execute([$user_id, $game_id]);
    logData("✅ Insertado nuevo progreso para user_id: $user_id y game_id: $game_id");
  } else {
    logData("ℹ️ Progreso ya existía para user_id: $user_id y game_id: $game_id");
  }

  // 3. Obtener la categoría del juego
  $catQuery = $pdo->prepare("SELECT category_id FROM games WHERE id = ?");
  $catQuery->execute([$game_id]);
  $category_id = $catQuery->fetchColumn();
  logData("➡️ category_id obtenido: $category_id");

  // 4. Total juegos en categoría
  $totalQuery = $pdo->prepare("SELECT COUNT(*) FROM games WHERE category_id = ?");
  $totalQuery->execute([$category_id]);
  $totalGames = $totalQuery->fetchColumn();

  // 5. Juegos completados
  $doneQuery = $pdo->prepare("
    SELECT COUNT(*) FROM progress
    INNER JOIN games ON games.id = progress.game_id
    WHERE progress.user_id = ? AND games.category_id = ?
  ");
  $doneQuery->execute([$user_id, $category_id]);
  $completedGames = $doneQuery->fetchColumn();

  // 6. Calcular porcentaje
  $percentage = $totalGames > 0 ? round(($completedGames / $totalGames) * 100) : 0;

  logData("🎯 Progreso actualizado - Completados: $completedGames / $totalGames = $percentage%");

  echo json_encode([
    'status' => 'success',
    'message' => 'Progreso actualizado',
    'category_id' => $category_id,
    'porcentaje' => $percentage
  ]);

} catch (PDOException $e) {
  logData("❌ Error SQL: " . $e->getMessage());
  echo json_encode(['status' => 'error', 'message' => 'Error en el servidor']);
}
