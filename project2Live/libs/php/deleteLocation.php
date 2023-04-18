<?php

    // example use from browser
    // http://localhost/companydirectory/libs/php/deleteLocation.php?id=<id>

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

    $locationID = $_POST['locationID'];
    $location = $_POST['name'];

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
    $query = $conn->prepare("SELECT COUNT(*) as total FROM department WHERE locationID = ?");

    $query->bind_param("i", $locationID);

    $query->execute();

    $result = $query->get_result();


    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();

        if ($row['total'] > 0) {

            $output['status']['code'] = "400";
            $output['status']['name'] = "failure";
            $output['status']['description'] = "$location is being referenced in the department table, unable to delete this location";
            $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
            $output['data'] = [];

            mysqli_close($conn);

            echo json_encode($output);

            exit;

        }

    }

    // delete location
    $delQuery = $conn->prepare("DELETE FROM location WHERE id = ?");

    $delQuery->bind_param("i", $locationID);

    $delQuery->execute();

    if ($delQuery->error) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = $delQuery->error;
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "The location '$location' has been deleted from the database";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

?>
