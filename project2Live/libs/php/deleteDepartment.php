<?php

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
    $deptID = $_POST['deptID'];
    $locationID = $_POST['locationID'];
    $deptAndLocationName = $_POST['deptAndLocationName'];

    // check if department is being referenced in personnel table
    $query = "SELECT COUNT(*) as total FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id = $deptID AND l.id = $locationID";
    
    $result = $conn->query($query);

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();

        if ($row['total'] > 0) {

            $output['status']['code'] = "400";
            $output['status']['name'] = "failure";
            $output['status']['description'] = "The department $deptAndLocationName is being referenced in the personnel table. Unable to delete this department at this location";
            $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
            $output['data'] = [];

            mysqli_close($conn);

            echo json_encode($output);

            exit;

        }

    }

    // delete location
	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	
	$query->bind_param("i", $deptID);

	$query->execute();

    if (!$result) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "query failed";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "The $deptAndLocationName department has been deleted from the database";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

?>
