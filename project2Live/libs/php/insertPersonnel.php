<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

	$executionStartTime = microtime(true);
	
	// this includes the login details
	
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

    $firstName = trim(ucwords($_POST['firstName']));
    $lastName = trim(ucwords($_POST['lastName']));
    $jobTitle = trim(ucwords($_POST['jobTitle']));
    $email = trim($_POST['email']);
    $deptID = $_POST['departmentID'];
    $deptName = $_POST['deptName'];



	if (!isset($firstName) || empty($firstName) || !isset($lastName) || empty($lastName) || !isset($email) || empty($email) || !isset($deptID) || empty($deptID) || !isset($deptName) || empty($deptName)) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "There are one or more missing/empty inputs. Please make sure all necessary fields have input";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
    }


	$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?,?,?,?,?)');

	$query->bind_param("ssssi", $firstName, $lastName, $jobTitle, $email, $deptID);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "The query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "New record created for $firstname $lastName in the $deptName department";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>