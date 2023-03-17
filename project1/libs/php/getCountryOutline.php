<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='http://davestorey.co.uk/protected/countryBorders.geo.json';

    $location = $_REQUEST['country'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$array = json_decode($result,true);

    foreach ($array['features'] as $feature) {
        if($feature['properties']['iso_a2'] == $location){
            if($feature['geometry']['type'] == 'MultiPolygon'){
                $coords = $feature['geometry']['coordinates'];
            } elseif($feature['geometry']['type'] == 'Polygon'){
                $coords = [$feature['geometry']['coordinates']];
            }
        }
    };
    
    echo json_encode($coords);

?>