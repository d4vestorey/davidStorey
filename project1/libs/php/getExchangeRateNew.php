<?php


$from = $_REQUEST['from'];
$to = $_REQUEST['to'];
$amount = $_REQUEST['amount'];

//$url = 'https://api.exchangerate.host/convert?from=USD&to=EUR&amount=1000';
$url = 'https://api.exchangerate.host/convert?from='.$from.'&to='.$to.'&amount='.$amount;


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output = $decode['result'];


echo json_encode($output);

?>