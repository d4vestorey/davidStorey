<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
    $countryCode = $_REQUEST['countryCode'];

    $url = 'https://api.worldnewsapi.com/search-news?source-countries='.$countryCode.'&number=20&sort-direction=DESC&api-key=9ab337d64a2c4e76b2358aff7614c139';

	//$url = 'https://api.worldnewsapi.com/search-news?source-countries=GB&number=6&sort-direction=DESC&api-key=9ab337d64a2c4e76b2358aff7614c139';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

  
	//$output['status']['code'] = "200";
	//$output['status']['name'] = "ok";
	//$output['status']['description'] = "success";
	//$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output = $decode['news'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>