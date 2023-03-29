<?php

$countryCode = $_REQUEST['countryCode'];

$api_key = 'mx8oNTOovHffAelcbQSwXBs98kwdbg3N';

$url = 'https://api.windy.com/api/webcams/v2/list/country='.$countryCode.'/orderby=popularity/limit=30?show=webcams:location,player';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('x-windy-key: '.$api_key));
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output = $decode['result']['webcams'];

echo json_encode($output);

?>
