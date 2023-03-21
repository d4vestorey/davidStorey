/////// Leaflet initialisations

const map = L.map('map');

const tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  zoomControl: false,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

let geojsonLayer = L.geoJSON().addTo(map);

//easy buttons for leaflet map

L.easyButton('fa-circle-info', function(){
    $('#infoModal').modal('toggle');
},'Country Information').addTo(map);


L.easyButton('fa-sterling-sign', function(){
    $('#moneyModal').modal('toggle');
},'Currency Information').addTo(map);


L.easyButton('fa-sun', function(){
    $('#weathModal').modal('toggle');
},'Weather Information').addTo(map);

L.easyButton('fa-newspaper', function(){
    $('#newsModal').modal('toggle');
},'News').addTo(map);


L.easyButton('fa-location-crosshairs', function(){
    getUserLocation();
}, "Return to local country").addTo(map);


//leaftlet marker cluster groups and custom marker icons for each group
let landmarksGroup = L.markerClusterGroup();
let landmarksIcon = L.icon({iconUrl: 'libs/images/pinMarker.png', iconSize: [30, 30]});

let citiesGroup = L.markerClusterGroup();
let citiesIcon = L.icon({iconUrl: 'libs/images/cityMarker.png', iconSize: [30, 30]});

let airportsGroup = L.markerClusterGroup();
let airportsIcon = L.icon({iconUrl: 'libs/images/airportMarker.png', iconSize: [30, 30]});

///////////

//preloader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(3000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
  });

//load data from the geojson document to populate the drop down select and call the getUserLocation function

let openDeferred = $.Deferred();
let deferred = $.Deferred();
let countryIso;
let currencyCode;
let countryCurrencyIso;
let capitalCity;
let latitude;
let longitude;
let north; 
let east; 
let south;
let west;


$(function() {

    $.ajax({
        url: "libs/php/loadFile.php",
        type: 'GET',
        data: 'json',
        success: function(result) {

            openDeferred.resolve(result);
            
            //convert the json into js object
            const country_object = JSON.parse(result);
            
            //loop through the object to extract the country names and append to select options
            $.each(country_object, function(i, p) {
            $('#countrySelect').append($('<option></option>').val(p.code).html(p.name));
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 
  
  });

getUserLocation();


function getUserLocation(){
    navigator.geolocation.getCurrentPosition(locationEnabled, locationDisabled);
};


function reset(){
    if(landmarksGroup || citiesGroup || airportsGroup){
        landmarksGroup.clearLayers();
        citiesGroup.clearLayers();
        airportsGroup.clearLayers();
    };

    map.removeLayer(geojsonLayer);

    if($("#overviewFlagWrap").html().length > 0){
        $("#overviewFlagWrap").empty();
    }

    deferred = $.Deferred();
    console.log('reset has run');
};


function locationEnabled(position){
    reset();
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    
    $.ajax({
      url: "libs/php/getCountryIso.php",
      type: 'POST',
      dataType: 'json',
      data: {
        lat: latitude,
        long: longitude,
    },
      
      success: function(first) {
          $('#countrySelect').val(first.data.countryCode);
          
          countryIso = first.data.countryCode;
          console.log(countryIso);
          getCountryInfo();
          getWikipedia();
          getCountryOutLine();
          getWeather();
          getCurrency();
          getExchangeRate();
          getNews();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
};


//handle location settings when disabled by client
function locationDisabled(){
    $.when(openDeferred).done(function(){
    reset();
    $('#countrySelect').val('US');
    countryIso = $('#countrySelect').val();
          console.log(countryIso);
          getCountryInfo();
          getWikipedia();
          getCountryOutLine();
          getWeather();
          getCurrency();
          getExchangeRate();
          getNews();
});
};


//On country change section
$('#countrySelect').change(function() {
    countryIso = $('#countrySelect').val();
          console.log(countryIso);
          reset();
          getCountryInfo();
          getWikipedia();
          getCountryOutLine();
          getWeather();
          getCurrency();
          getExchangeRate();
          getNews();
});



                   
function getCountryInfo(){
    $.ajax({
    url: "libs/php/getCountryInfoWithIso.php",
    type: 'GET',
    dataType: 'json',
    data: {
    countryIso: countryIso,
    },
    
    success: function(second) {

        deferred.resolve(second.data);

        currencyCode = second.data[0].currencyCode;
        countryCurrencyIso = second.data[0].isoAlpha3;
        capitalCity = second.data[0].capital;
        
        let isoForFlag = countryIso.toLowerCase();
  
        $('#capital').html(second.data[0].capital);
        $('#population').html(second.data[0].population);
        $('#continent').html(second.data[0].continentName);
        $('#currencyCode').html(second.data[0].currencyCode);
        $('#area').html(second.data[0].areaInSqKm);
        $('#infoCountry').html(second.data[0].countryName);
        $('#currencyCountry').html(second.data[0].countryName);
        $('#weatherCountry').html(second.data[0].countryName);
        $('#newsCountry').html(second.data[0].countryName);
        $('#countryCode').html(second.data[0].countryCode);
        $('#overviewFlagWrap').append('<td><img id=overviewFlag src="https://img.geonames.org/flags/x/'+isoForFlag+'.gif"/></td>');
        
        north = second.data[0].north;
        east = second.data[0].east;
        south = second.data[0].south;
        west = second.data[0].west;

        let southWest = L.latLng(south, west);
        let northEast = L.latLng(north, east);
        let bounds = L.latLngBounds(southWest, northEast);

        //const latLng = L.latLng(latitude,longitude);
        //console.log(latLng);
        map.fitBounds(bounds);

        console.log('second has run');

    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    }
});
};

  
function getCountryOutLine(){
    $.when(deferred).done(function(data2){
    $.ajax({
    url: "libs/php/getCountryOutline.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: countryIso, 
    },
    
    success: function(third) {

        let geojsonFeature = {
            "type": "Feature",
            "properties": {
                "name": "Coors Field",
                "amenity": "Baseball Stadium",
                "popupContent": "This is where the Rockies play!"
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": third
            }
          };

          geojsonLayer = L.geoJSON(geojsonFeature).addTo(map);

          console.log('third has run');

    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    }
});
});
};

  
function getWeather(){
    $.when(deferred).done(function(data2){
    $.ajax({
    url: "libs/php/getWeatherForecast.php",
    type: 'POST',
    dataType: 'json',
    data: {
        capital: capitalCity, 
    },
    
success: function(fourth) {

    //current weather
    $('#maxTemp').html(fourth.data.forecast.forecastday[0].day.maxtemp_c);
    $('#minTemp').html(fourth.data.forecast.forecastday[0].day.mintemp_c);
    $('#curCondition').html(fourth.data.forecast.forecastday[0].day.condition.text);
    $('#curIcon').attr("src", fourth.data.forecast.forecastday[0].day.condition.icon);

    //tomorrow
    $('#tomMaxTemp').html(fourth.data.forecast.forecastday[1].day.maxtemp_c);
    $('#tomMinTemp').html(fourth.data.forecast.forecastday[1].day.mintemp_c);
    $('#tomIcon').attr("src",fourth.data.forecast.forecastday[1].day.condition.icon);

    //next day
    $('#nextMaxTemp').html(fourth.data.forecast.forecastday[2].day.maxtemp_c);
    $('#nextMinTemp').html(fourth.data.forecast.forecastday[2].day.mintemp_c);
    $('#nextIcon').attr("src",fourth.data.forecast.forecastday[2].day.condition.icon);

    console.log('fourth has run');
},
error: function(jqXHR, textStatus, errorThrown) {
    // your error code
}
}); 
});
}; 


function getCurrency(){
    $.when(deferred).done(function(data2){
    $.ajax({
    url: "libs/php/getCurrencySymbol.php",
    type: 'POST',
    dataType: 'json',

    success: function(fifth) {
                    
        for(let i = 0; i < fifth.data.length; i++){
            if(fifth.data[i].abbreviation == countryCurrencyIso){
                $('#currencySymbol').html(fifth.data[i].symbol);
                $('#currencyName').html(fifth.data[i].currency);
            }
        }

        console.log('fifth has run');

    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    } 
    });
});
};


function getExchangeRate(){
    $.when(deferred).done(function(data2){
    $.ajax({
    url: "libs/php/getExchangeRates.php",
    type: 'POST',
    dataType: 'json',

    success: function(sixth) {
                                    
        $('#exchange').html(sixth.data.conversion_rates[currencyCode]);
        console.log('sixth has run');
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    }
    });
});
};


function getWikipedia(){
    $.when(deferred).done(function(){
    $.ajax({
    url: "libs/php/getWiki.php",
    type: 'POST',
    dataType: 'json',
    data: {
        north: north,
        south: south,
        east: east,
        west: west,
    },
        success: function(seven) {

            console.log(countryIso);
            seven.data.forEach(function(landmark){
                if(landmark.feature == 'landmark'){
                    let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + " target =_blank>More<a/>";
                    landmarksGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: landmarksIcon}).bindPopup(popUpContent));
                    
                }
                if(landmark.feature == 'city'){
                    let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + " target =_blank>More<a/>";
                    citiesGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: citiesIcon}).bindPopup(popUpContent));
                    
                }
                if(landmark.feature == 'airport'){
                    let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + " target =_blank>More<a/>";
                    airportsGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: airportsIcon}).bindPopup(popUpContent));
                
                }
            })
            map.addLayer(landmarksGroup);
            map.addLayer(citiesGroup);
            map.addLayer(airportsGroup);

            console.log('seven has run');

        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});
};


function getNews(){ 
    $.when(deferred).done(function(data2){    
    $.ajax({
        url: "libs/php/getNews.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: countryIso, 
        },
        
        success: function(eight) {

            if(eight.data.length > 0){
                $('#newsUrl1').attr("href", eight.data[0].url).html('Read more');
                $('#newsTitle1').html(eight.data[0].title);
                $('#newsImage1').attr("src", eight.data[0].image);
                $('#newsUrl2').attr("href", eight.data[1].url).html('Read more');
                $('#newsTitle2').html(eight.data[1].title);
                $('#newsImage2').attr("src", eight.data[1].image);
                $('#newsUrl3').attr("href", eight.data[2].url).html('Read more');
                $('#newsTitle3').html(eight.data[2].title);
                $('#newsImage3').attr("src", eight.data[2].image);
                $('#newsUrl4').attr("href", eight.data[3].url).html('Read more');
                $('#newsTitle4').html(eight.data[3].title);
                $('#newsImage4').attr("src", eight.data[3].image);
                $('#newsUrl5').attr("href", eight.data[4].url).html('Read more');
                $('#newsTitle5').html(eight.data[4].title);
                $('#newsImage5').attr("src", eight.data[4].image);
                $('#newsUrl6').attr("href", eight.data[5].url).html('Read more');
                $('#newsTitle6').html(eight.data[5].title);
                $('#newsImage6').attr("src", eight.data[5].image);
                } else {
                    $('#newsUrl1').attr("href", '').html('');
                    $('#newsTitle1').html("No local news stories available");
                    $('#newsImage1').attr("src", '');
                    $('#newsUrl2').attr("href", '').html('');
                    $('#newsTitle2').html("No local news stories available");
                    $('#newsImage2').attr("src", '');
                    $('#newsUrl3').attr("href", '').html('');;
                    $('#newsTitle3').html("No local news stories available");
                    $('#newsImage3').attr("src", '');
                    $('#newsUrl4').attr("href", '').html('');;
                    $('#newsTitle4').html("No local news stories available");
                    $('#newsImage4').attr("src", '');
                    $('#newsUrl5').attr("href", '').html('');;
                    $('#newsTitle5').html("No local news stories available");
                    $('#newsImage5').attr("src", '');
                    $('#newsUrl6').attr("href", '').html('');;
                    $('#newsTitle6').html("No local news stories available");
                    $('#newsImage6').attr("src", '');
                }

                console.log('eight has run');

        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});
};
