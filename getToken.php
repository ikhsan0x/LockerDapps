<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $address = $data['address'];
}
else if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $address = isset($_REQUEST['address'])?$_REQUEST['address']:"";
}

function http_request($url, $apiKey){
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $headers = array(
        'TRON-PRO-API-KEY:' . $apiKey,
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $output = curl_exec($ch); 
    curl_close($ch);      
    return $output;
}

if($address){
    $url = "https://apilist.tronscanapi.com/api/account/tokens?address=$address&limit=200&show=2";
    $apiKey = 'b9a5d1ca-2863-4a41-9074-4aa352de1705';
    
    $response = http_request($url, $apiKey);
    $decodedData = json_decode($response);
    $prettyJson = json_encode($decodedData, JSON_PRETTY_PRINT);
    print $prettyJson;    
}
else{
    print '{"error" : "address not found"}';    
}