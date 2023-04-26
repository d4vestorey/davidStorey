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

    $deptID = $_POST['id'];

    //validation
    if (!isset($deptID) || empty($deptID)) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "Missing or empty department ID";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
    }

    // check if department is being referenced in personnel table
    
    $query = $conn->prepare('SELECT COUNT(p.id) as total FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id = ?');

    $query->bind_param("i", $deptID);

    $query->execute();

    $result = $query->get_result();

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();

        if ($row['total'] > 0) {

            $output['status']['code'] = "200";
            $output['status']['name'] = "unable to delete";
            $output['status']['description'] = "This department is being referenced in the personnel table. Unable to delete.";
            $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
            $output['data'] = [];

            mysqli_close($conn);

            echo json_encode($output);

            exit;

        }

    }


    $query = $conn->prepare('SELECT d.id, d.name as deptName, l.name as locationName FROM department d LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id =  ?');

	$query->bind_param("i", $deptID);

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
