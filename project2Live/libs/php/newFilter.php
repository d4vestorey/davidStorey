<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

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

	$selectedDeptValues = $_POST['array1'];
    $selectedLocationValues = $_POST['array2'];

    // prepare the statement
    $stmt = $conn->prepare("SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id IN (" . implode(",", array_fill(0, count($selectedDeptValues), "?")) . ") AND l.id IN (" . implode(",", array_fill(0, count($selectedLocationValues), "?")) . ")ORDER BY p.lastName, p.firstName, d.name, l.name");
        
    // bind the parameters
    $params = array_merge($selectedDeptValues, $selectedLocationValues);
    $types = str_repeat('i', count($params));
    $stmt->bind_param($types, ...$params);

    // execute the query and return the results
    $stmt->execute();
    $result = $stmt->get_result();


	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>