<?php

    // example use from browser
    // http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&location=<location>

    
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
    
    $newDept = trim(ucwords($_POST['deptName']));
	$newDeptLocationID = $_POST['locationID'];
	$newDeptLocation = $_POST['locationName'];
    

    if (!isset($newDept) || empty($newDept) || !isset($newDeptLocationID) || empty($newDeptLocationID)) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "Missing or empty location ID or Department name";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
    }
    
    
    $query = $conn->prepare('SELECT * FROM department WHERE name = ?');

    $query->bind_param("s", $newDept);

    $query->execute();

    $result = $query->get_result();


    if ($result->num_rows > 0) {
        // dept already exists
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "The $newDept department already exists in the database";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
    } else {
        // dept does not exist, insert new dept
		$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?,?)');

		$query->bind_param("si", $newDept, $newDeptLocationID);
    
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
        $output['status']['description'] = "The $newDept department in $newDeptLocation has been added to the database";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
        
        mysqli_close($conn);
    
        echo json_encode($output);
    }
    // SQL statement accepts parameters and so is prepared to avoid SQL injection.
    // $_REQUEST used for development / debugging. Remember to change to $_POST for production
    
?>