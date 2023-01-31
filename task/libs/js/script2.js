$('#hoodBtn').click(function() {

    $.ajax({
        url: "libs/php/getHood.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#lat').val(),
            lng: $('#lng').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                //$('#txtContinent').html(result['data'][0]['continent']);
                //$('#txtCapital').html(result['data'][0]['capital']);
                //$('#txtLanguages').html(result['data'][0]['languages']);
                //$('#txtPopulation').html(result['data'][0]['population']);
                //$('#txtArea').html(result['data'][0]['areaInSqKm']);

                $('#hood').html(result['data']['city']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});