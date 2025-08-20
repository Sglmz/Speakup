<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->level)) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$id = $data->id;
$level = $data->level;

if (!in_array($level, ['Inicial', 'Medio'])) {
    http_response_code(400);
    echo json_encode(["error" => "Nivel inválido"]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE users SET level = ? WHERE id = ?");
    $stmt->execute([$level, $id]);

    echo json_encode(["message" => "Nivel actualizado a $level"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
