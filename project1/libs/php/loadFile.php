<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='http://davestorey.co.uk/protected/countryBorders.geo.json';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

    //empty array to add countries to
    $countryArr=[];

    //iterate over the object to abstract the name of the country and append to empty array
    for($i = 0; $i < 175; $i++){
        array_push($countryArr,($decode["features"][$i]["properties"]["name"]. ", ".$decode["features"][$i]["properties"]["iso_a3"]));
    }

    //sort the array into alphabetical order
    sort($countryArr);

    //convert newly sorted array into json format
    echo json_encode($countryArr);

?>