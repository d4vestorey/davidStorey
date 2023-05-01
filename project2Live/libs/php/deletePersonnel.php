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
		$output['status']['description'] = "The database is unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

    $personnelId = $_POST['id'];
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $deptName = $_POST['deptName'];


	//validation
	if (!isset($personnelId) || empty($personnelId)) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Missing or empty personnel ID";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [$personnelId];
	
		mysqli_close($conn);
	
		echo json_encode($output);
	
		exit;
	}


	$query = $conn->prepare('DELETE FROM personnel WHERE id = ?');
	
	$query->bind_param("i", $personnelId);

	$query->execute();
	
	if ($query->error) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "There was an error with the execution of your request";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "The record for $firstName $lastName in the $deptName department has been deleted";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [$personnelId];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>