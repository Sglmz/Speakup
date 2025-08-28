<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$category_id = $_GET['category_id'] ?? null;

if (!$category_id) {
  echo json_encode(['status' => 'error', 'message' => 'Falta category_id']);
  exit;
}

try {
  // get_games.php
$stmt = $pdo->prepare("
  SELECT id, name, description, code AS ruta
  FROM games
  WHERE category_id = ?
  ORDER BY id
");

  $stmt->execute([$category_id]);
  $games = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(['status' => 'success', 'games' => $games]);
} catch (PDOException $e) {
  echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
