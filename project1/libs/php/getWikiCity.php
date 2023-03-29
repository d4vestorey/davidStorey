<?php

	// remove for production
/*
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    /////////////// call to first api to obtain bouding box

    $countryCode = $_REQUEST['country'];

    $url = 'http://api.geonames.org/countryInfoJSON?formatted=true&country='.$countryCode.'&username=d4vestorey';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

	$output['data'] = $decode['geonames'];
	
	header('Content-Type: application/json; charset=UTF-8');

	$south = ($output['data'][0]['south']);
    $north = ($output['data'][0]['north']); 
    $east = ($output['data'][0]['east']); 
    $west = ($output['data'][0]['west']); 
*/
    //////// Second API call to wikipedia articles in bounding box

	
	$countryCode = $_REQUEST['countryCode'];

    $url = 'http://api.geonames.org/searchJSON?country='.$countryCode.'&cities1500&featureCode=PPL&maxRows=50&username=d4vestorey';


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

    $output = $decode['geonames'];


	echo json_encode($output);


?>