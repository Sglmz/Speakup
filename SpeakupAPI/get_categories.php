<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

try {
  // ✅ Incluimos la columna locked en el SELECT
  $stmt = $pdo->query("SELECT id, name, description, locked FROM categories ORDER BY id");
  $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    'status' => 'success',
    'categories' => $categories
  ]);
} catch (PDOException $e) {
  echo json_encode([
    'status' => 'error',
    'message' => $e->getMessage()
  ]);
}
