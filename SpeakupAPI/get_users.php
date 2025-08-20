<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
require_once "db.php";
$response = ["status"=>"error","message"=>"Algo salió mal"];

try {
    $stmt = $pdo->query("SELECT id, username, last_login FROM users ORDER BY last_login DESC");
    $users = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $users[] = [
            "id" => (int)$row["id"],
            "nombre" => $row["username"],
            "ultimoIngreso" => $row["last_login"]
        ];
    }
    $response = ["status"=>"success","users"=>$users];
} catch (PDOException $e) {
    $response = ["status"=>"error","message"=>$e->getMessage()];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
