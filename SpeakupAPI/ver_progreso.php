<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php"; // aquí tienes $pdo disponible

if (!isset($_GET['userId']) || !isset($_GET['categoria'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan parámetros userId o categoria"
    ]);
    exit;
}

$userId = intval($_GET['userId']);
$categoriaId = intval($_GET['categoria']);

try {
    // 1. Contar total de juegos en esta categoría
    $sqlTotal = "SELECT COUNT(*) as total FROM games WHERE category_id = ?";
    $stmtTotal = $pdo->prepare($sqlTotal);
    $stmtTotal->execute([$categoriaId]);
    $rowTotal = $stmtTotal->fetch(PDO::FETCH_ASSOC);
    $totalGames = $rowTotal['total'] ?? 0;

    if ($totalGames == 0) {
        echo json_encode([
            "status" => "success",
            "progress" => 0,
            "message" => "No hay juegos en esta categoría"
        ]);
        exit;
    }

    // 2. Contar cuántos juegos completó el usuario en esta categoría
    $sqlDone = "
        SELECT COUNT(DISTINCT up.game_id) as completados
        FROM progress up
        INNER JOIN games g ON up.game_id = g.id
        WHERE up.user_id = ? AND g.category_id = ?
    ";
    $stmtDone = $pdo->prepare($sqlDone);
    $stmtDone->execute([$userId, $categoriaId]);
    $rowDone = $stmtDone->fetch(PDO::FETCH_ASSOC);
    $doneGames = $rowDone['completados'] ?? 0;

    $progress = round(($doneGames / $totalGames) * 100);

    echo json_encode([
        "status" => "success",
        "progress" => $progress,
        "completed" => $doneGames,
        "total" => $totalGames
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error en la consulta: " . $e->getMessage()
    ]);
}
?>
