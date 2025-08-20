<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

// Crear archivo log
$logFile = __DIR__ . '/log.txt';
file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] 📥 Inicio de ver_progreso\n", FILE_APPEND);

$user_id = $_GET['user_id'] ?? null;
file_put_contents($logFile, "🔹 user_id recibido: '" . $user_id . "'\n", FILE_APPEND);

if (!$user_id) {
  echo json_encode(['status' => 'error', 'message' => 'Falta user_id']);
  file_put_contents($logFile, "❌ Faltan datos: user_id vacío\n", FILE_APPEND);
  exit;
}

try {
  // Total de juegos por categoría
  $totales = $pdo->query("
    SELECT c.name AS nivel, COUNT(*) AS total
    FROM games g
    JOIN categories c ON g.category_id = c.id
    GROUP BY c.name
  ")->fetchAll(PDO::FETCH_ASSOC);

  // Juegos completados por usuario por categoría
  $stmt = $pdo->prepare("
    SELECT c.name AS nivel, COUNT(*) AS completados
    FROM progress p
    JOIN games g ON p.game_id = g.id
    JOIN categories c ON g.category_id = c.id
    WHERE p.user_id = ?
    GROUP BY c.name
  ");
  $stmt->execute([$user_id]);
  $completados = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Mapear progreso
  $respuesta = [];
  foreach ($totales as $nivel) {
    $name = $nivel['nivel'];
    $total = (int)$nivel['total'];
    $hechos = 0;

    foreach ($completados as $c) {
      if ($c['nivel'] === $name) {
        $hechos = (int)$c['completados'];
        break;
      }
    }

    $respuesta[] = [
      'nivel' => $name,
      'total' => $total,
      'completados' => $hechos,
      'percentage' => $total > 0 ? round(($hechos / $total) * 100, 2) : 0
    ];
  }

  echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
  file_put_contents($logFile, "✅ Progreso enviado correctamente\n", FILE_APPEND);
} catch (PDOException $e) {
  file_put_contents($logFile, "❌ Excepción: " . $e->getMessage() . "\n", FILE_APPEND);
  echo json_encode(['status' => 'error', 'message' => 'Error en el servidor']);
}
