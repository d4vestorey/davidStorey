$('#weatherBtn').click(function() {

    $.ajax({
        url: "libs/php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#weatherLat').val(),
            lng: $('#weatherLon').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                //$('#txtContinent').html(result['data'][0]['continent']);
                //$('#txtCapital').html(result['data'][0]['capital']);
                //$('#txtLanguages').html(result['data'][0]['languages']);
                //$('#txtPopulation').html(result['data'][0]['population']);
                //$('#txtArea').html(result['data'][0]['areaInSqKm']);

                $('#station').html(result['data']['stationName']);
                $('#temp').html(result['data']['temperature']);
                $('#cloud').html(result['data']['clouds']);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});