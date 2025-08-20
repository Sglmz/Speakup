<?php
require_once __DIR__ . 'db.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta ID de usuario"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT g.name AS juego, p.correct_answers, p.total_questions, p.percentage, p.updated_at
        FROM progress p
        JOIN games g ON p.game_id = g.id
        WHERE p.user_id = ?
    ");
    $stmt->execute([$_GET['id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
