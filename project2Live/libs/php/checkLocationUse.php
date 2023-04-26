<?php

    // example use from browser
    // http://localhost/companydirectory/libs/php/checkLocationUse.php?id=1

    $executionStartTime = microtime(true);
    
    // this includes the login details
    
    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }

    $locationID = $_POST['id'];

    //validation
    if (!isset($locationID) || empty($locationID)) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "Missing or empty location ID";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
    }

    // check if location is being referenced in department table
    $query = $conn->prepare("SELECT COUNT(d.id) as count, l.name as locationName FROM department d JOIN location l on (d.locationID = l.id) WHERE locationID = ?");

    $query->bind_param("i", $locationID);

    $query->execute();

    $result = $query->get_result();
    

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();

        if ($row['count'] > 0) {

            $output['status']['code'] = "200";
            $output['status']['name'] = "unable to delete";
            $output['status']['description'] = "This location is being referenced in the department table, unable to delete this location";
            $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
            $output['data'] = [];

            mysqli_close($conn);

            echo json_encode($output);

            exit;

        }
    }


    $query = $conn->prepare('SELECT id, name as locationName FROM location WHERE id =  ?');

	$query->bind_param("i", $locationID);

	$query->execute();

	$result = $query->get_result();

   	$data = [];

    while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "100";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	echo json_encode($output); 

	mysqli_close($conn);

?>
