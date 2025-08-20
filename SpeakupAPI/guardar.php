<?php
require_once __DIR__ . 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id, $data->game_id, $data->correct_answers, $data->total_questions)) {
    http_response_code(400);
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

try {
    $check = $conn->prepare("SELECT id FROM progress WHERE user_id = ? AND game_id = ?");
    $check->execute([$data->user_id, $data->game_id]);

    if ($check->rowCount() > 0) {
        $stmt = $conn->prepare("UPDATE progress SET correct_answers=?, total_questions=? WHERE user_id=? AND game_id=?");
        $stmt->execute([$data->correct_answers, $data->total_questions, $data->user_id, $data->game_id]);
        echo json_encode(["message" => "Progreso actualizado"]);
    } else {
        $stmt = $conn->prepare("INSERT INTO progress (user_id, game_id, correct_answers, total_questions) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data->user_id, $data->game_id, $data->correct_answers, $data->total_questions]);
        echo json_encode(["message" => "Progreso guardado"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
