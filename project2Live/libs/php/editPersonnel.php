<?php

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

    $personnelId = $_POST['id'];
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $jobTitle = $_POST['jobTitle'];
    $deptName = $_POST['deptName'];
    $deptID = $_POST['departmentID'];
    $email= $_POST['email'];

    //call to db to get current personnel info for individual
    $query = $conn->prepare('SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.id=?');

    $query->bind_param("i", $personnelId);
    $query->execute();
    $result = $query->get_result();
    $prevData = $result->fetch_assoc();
    
    //save previous state
    $output['prevData'] = $prevData;

    //call to update personnel record
	$query = $conn->prepare('UPDATE personnel SET firstName=?, lastName=?, jobTitle=?, email=?, departmentID=? WHERE id=?');
	
	$query->bind_param("ssssii", $firstName, $lastName, $jobTitle, $email, $deptID, $personnelId);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

 
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['newData'] = [$firstName, $lastName, $jobTitle, $email, $deptName];

    mysqli_close($conn);

	echo json_encode($output); 

?>