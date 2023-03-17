<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);


	$result = file_get_contents('../data/countryBorders.geo.json');

	$decode = json_decode($result,true);

    //empty array to add countries to
    $countryArr=[];

    //iterate over the object to abstract the name of the country and append to empty array
    for($i = 0; $i < count($decode["features"]); $i++){
		$name = $decode["features"][$i]["properties"]["name"];
		$code = $decode["features"][$i]["properties"]["iso_a2"];
        array_push($countryArr,(object)['name'=> $name, 'code'=> $code]);
    }

    //sort the array into alphabetical order
    sort($countryArr);

    //convert newly sorted array into json format
    echo json_encode($countryArr);

?>