$('#altitudeBtn').click(function() {

    $.ajax({
        url: "libs/php/getLatAndLon.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#selectLat').val(),
            lng: $('#selectLon').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                //$('#txtContinent').html(result['data'][0]['continent']);
                //$('#txtCapital').html(result['data'][0]['capital']);
                //$('#txtLanguages').html(result['data'][0]['languages']);
                //$('#txtPopulation').html(result['data'][0]['population']);
                //$('#txtArea').html(result['data'][0]['areaInSqKm']);

                $('#results').html(result['data']);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});