<?php

$countryCode = $_REQUEST['countryCode'];
$year = $_REQUEST['year'];

$api_key = 'baA3ZWYNC3tle/yj7f1xKQ==VPd3c6IEGpGIejxV';

$url = 'https://api.api-ninjas.com/v1/holidays?country='.$countryCode.'&year='.$year;


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-Api-Key: '.$api_key));
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$properties = ['name', 'date', 'day'];

// Use array_map() and an anonymous function to extract the desired properties
$extracted = array_map(function($user) use ($properties) {
  return array_intersect_key((array)$user, array_flip($properties));
}, $decode);


// custom comparison function to compare date property
function cmp($a, $b) {
    $dateA = strtotime($a['date']);
    $dateB = strtotime($b['date']);
    return $dateA - $dateB;
  }
  
  // sort the array of objects by date property
  usort($extracted, "cmp");


echo json_encode($extracted);

?>