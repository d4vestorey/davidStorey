<?php

//$countryCode = $_REQUEST['countryCode'];

$url = 'https://api.exchangerate.host/symbols';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output = $decode['symbols'];


echo json_encode($output);

?>