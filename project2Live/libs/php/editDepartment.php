<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

	$executionStartTime = microtime(true);

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

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

    $deptID = $_POST['deptID'];
    $deptName = trim(ucwords($_POST['deptName']));
    $locationID = $_POST['locationID'];


	if (!isset($deptID) || empty($deptID) || !isset($deptName) || empty($deptName) || !isset($locationID) || empty($locationID)) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "Missing or empty depatment ID, Name or Location";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
    }


    $query = $conn->prepare('SELECT * FROM department WHERE name = ? AND locationID = ?');

    $query->bind_param("si", $deptName, $locationID);

    $query->execute();

    $result = $query->get_result();


    if ($result->num_rows > 0) {
        // dept already exists
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "A $deptName department already exists in the database at this location. Record not updated";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
    } else {
        // dept does not exist, update the dept name
		$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');

		$query->bind_param("sii", $deptName, $locationID, $deptID);
    
        $query->execute();
    
        if (false === $query) {
    
            $output['status']['code'] = "400";
            $output['status']['name'] = "failure";
            $output['status']['description'] = "query failed";  
            $output['data'] = [];
    
            mysqli_close($conn);
    
            echo json_encode($output); 
    
            exit;
    
        }
    
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "The $deptName department record has been updated";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
        
        mysqli_close($conn);
    
        echo json_encode($output);
    }

?>