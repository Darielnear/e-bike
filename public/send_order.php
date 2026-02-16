<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        echo json_encode(['error' => 'Dati non validi']);
        exit;
    }

    $order = $data['order'];
    $items = $data['items'];
    $orderNumber = strtoupper(substr(md5(time()), 0, 8));

    // Payment Information
    $paymentInfo = [
        'IBAN' => 'IT52 PO35 7601 6010 1000 8072 943',
        'BIC' => 'BBVAITM2XXX',
        'Bank' => 'BBVA',
        'Beneficiary' => 'Cicli Volante'
    ];

    // Response for the frontend
    $response = [
        'success' => true,
        'orderNumber' => $orderNumber,
        'totalAmount' => $order['totalAmount'],
        'paymentInfo' => $paymentInfo,
        'message' => 'Ordine ricevuto. In attesa di pagamento.'
    ];

    // Email structure (Simulation)
    $to = $order['customerEmail'];
    $subject = "Conferma Ordine #$orderNumber - Cicli Volante";
    
    $message = "Ciao " . $order['customerName'] . ",\n\n";
    $message .= "Grazie per il tuo ordine su Cicli Volante!\n\n";
    $message .= "Numero Ordine: #$orderNumber\n";
    $message .= "Totale: € " . number_format($order['totalAmount'], 2, ',', '.') . "\n\n";
    $message .= "INFORMAZIONI PER IL PAGAMENTO:\n";
    $message .= "Effettua il bonifico o ricarica PostePay alle seguenti coordinate:\n";
    $message .= "IBAN: " . $paymentInfo['IBAN'] . "\n";
    $message .= "BIC/SWIFT: " . $paymentInfo['BIC'] . "\n";
    $message .= "Banca: " . $paymentInfo['Bank'] . "\n";
    $message .= "Beneficiario: " . $paymentInfo['Beneficiary'] . "\n";
    $message .= "Causale: Ordine #$orderNumber\n\n";
    $message .= "La spedizione con BRT/SDA avverrà entro 24-48h dalla ricezione del pagamento.\n\n";
    $message .= "Cordiali saluti,\nIl team Cicli Volante";

    // Mail sending (requires SMTP configuration)
    // mail($to, $subject, $message);
    // mail('info@ciclivolante.it', "Nuovo Ordine #$orderNumber", $message);

    echo json_encode($response);
} else {
    echo json_encode(['error' => 'Metodo non consentito']);
}
?>
