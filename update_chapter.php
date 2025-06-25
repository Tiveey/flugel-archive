<?php
header('Content-Type: application/json');

// Fungsi untuk memvalidasi input
function validateInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Baca file JSON yang ada
    $jsonFile = 'data/chapters.json';
    $jsonData = json_decode(file_get_contents($jsonFile), true);

    // Ambil data dari form
    $newChapter = [
        'arc' => (int)validateInput($_POST['arc']),
        'chapter' => (int)validateInput($_POST['chapter']),
        'title' => validateInput($_POST['title']),
        'description' => validateInput($_POST['description']),
        'url' => validateInput($_POST['url']),
        'timestamp' => date('c')
    ];

    // Update latest chapter
    $jsonData['latest_chapter'] = $newChapter;

    // Tambahkan ke array chapters
    array_unshift($jsonData['chapters'], $newChapter);

    // Simpan kembali ke file JSON
    if (file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Chapter berhasil ditambahkan']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan chapter']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}
?> 