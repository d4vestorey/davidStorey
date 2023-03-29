/////// Leaflet initialisations

//// map layers

const topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

const streetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const sateliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

const basemaps = {
    'Street' : streetMap,
    'Topography': topoMap,
    'Satelite': sateliteMap
};


///////////

const map = L.map('map', {
    layers: [streetMap]
});


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

L.easyButton('fa-calendar-days', function(){
    $('#holidayModal').modal('toggle');
},'Holidays').addTo(map);


L.easyButton('fa-location-crosshairs', function(){
    getUserLocation();
}, "Return to local country").addTo(map);


//leaftlet marker cluster groups and custom marker icons for each group

let citiesGroup = L.markerClusterGroup({
    polygonOptions:{
        fillColor: 'red',
        color: '#fff',
        dashArray: '5, 5',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.5
    }
});

var cityMarker = L.ExtraMarkers.icon({
    icon: 'fa-city',
    markerColor: 'blue',
    shape: 'circle',
    prefix: 'fa'
  });

let airportsGroup = L.markerClusterGroup({
    polygonOptions:{
        fillColor: 'red',
        color: '#fff',
        dashArray: '5, 5',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.5
    }
});

var airportMarker = L.ExtraMarkers.icon({
    icon: 'fa-plane',
    markerColor: 'yellow',
    shape: 'penta',
    prefix: 'fa'
  });

let wikiGroup = L.markerClusterGroup({
    polygonOptions:{
        fillColor: 'red',
        color: '#fff',
        dashArray: '5, 5',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.5
    }
});

var wikiMarker = L.ExtraMarkers.icon({
    icon: 'fa-brands fa-wikipedia-w',
    markerColor: 'grey',
    shape: 'square',
    prefix: 'fa'
  });


  let cameraGroup = L.markerClusterGroup({
    polygonOptions:{
        fillColor: 'red',
        color: '#fff',
        dashArray: '5, 5',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.5
    }
});

var cameraMarker = L.ExtraMarkers.icon({
    icon: 'fa-video',
    markerColor: 'green',
    shape: 'square',
    prefix: 'fa'
  });

//// leaflet layer groups and control

let layerGroups = L.layerGroup([citiesGroup, airportsGroup, wikiGroup, cameraGroup]);

let overlays = {
    'Airports': airportsGroup,
    'Cities': citiesGroup,
    'Wikipedia': wikiGroup,
    'Cameras': cameraGroup
};

let layerControl = L.control.layers(basemaps, overlays).addTo(map);


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
let currencyExchangeTo;
let countryCurrencyIso;
let capitalCity;
let latitude;
let longitude;
let north; 
let east; 
let south;
let west;
let currentYear = new Date().getFullYear();
const table = document.getElementById('newsTable');


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
    if(wikiGroup || citiesGroup || airportsGroup || cameraGroup){
        wikiGroup.clearLayers();
        citiesGroup.clearLayers();
        airportsGroup.clearLayers();
        cameraGroup.clearLayers();
    };

    map.removeLayer(geojsonLayer);

    if($("#overviewFlagWrap").html().length > 0){
        $("#overviewFlagWrap").empty();
    }

    deferred = $.Deferred();
    console.log('reset has run');

    $('#convertedResult').empty();

    $('#convertInput').val('1');

    $('#currencySelect').val('Select Currency');

    removeAllRows();
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
          getWikipediaLandmarks();
          getCities();
          getAirports();
          getCountryOutLine();
          getWeather();
          getCurrency();
          getNews();
          getHolidays();
          getCameras();
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
          getWikipediaLandmarks();
          getCities();
          getAirports();
          getCountryOutLine();
          getWeather();
          getCurrency();
          getNews();
          getHolidays();
          getCameras();
});
};


//On country change section
$('#countrySelect').change(function() {
    countryIso = $('#countrySelect').val();
          console.log(countryIso);
          reset();
          getCountryInfo();
          getWikipediaLandmarks();
          getCities();
          getAirports();
          getCountryOutLine();
          getWeather();
          getCurrency();
          getNews();
          getHolidays();
          getCameras();
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
        
        let population = numeral(second.data[0].population).format('O.Oa');
        let area = numeral(second.data[0].areaInSqKm).format('O,O');

        $('#capital').html(second.data[0].capital);
        $('#population').html(population);
        $('#continent').html(second.data[0].continentName);
        $('#currencyCode').html(second.data[0].currencyCode);
        $('#area').html(area + ' km\u00B2');
        $('#infoCountry').html(second.data[0].countryName);
        $('#currencyCountry').html(second.data[0].countryName);
        $('#weatherCountry').html(second.data[0].countryName);
        $('#newsCountry').html(second.data[0].countryName);
        $('#holidayCountry').html(second.data[0].countryName);
        $('#holidayYear').html('Observed Holidays ' + currentYear);
        $('#countryCode').html(second.data[0].countryCode);
        $('#overviewFlagWrap').append('<td><img id=overviewFlag src="https://img.geonames.org/flags/x/'+isoForFlag+'.gif"/></td>');
        
        north = second.data[0].north;
        east = second.data[0].east;
        south = second.data[0].south;
        west = second.data[0].west;

        let southWest = L.latLng(south, west);
        let northEast = L.latLng(north, east);
        let bounds = L.latLngBounds(southWest, northEast);

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

          geojsonLayer = L.geoJSON(geojsonFeature, {
            style: function(feature){
                return{
                    color: 'red',
                    opacity: 0.5,
                    fillOpacity: 0.1
                }
            }
          }).addTo(map);

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

    console.log(capitalCity);

    //location
    $('#weatherLocation').text(capitalCity + ' weather');

    //current weather
    let currentMaxTemp = Math.round(fourth.data.forecast.forecastday[0].day.maxtemp_c);
    $('#maxTemp').html(currentMaxTemp + '\u00B0C');
    let currentMinTemp = Math.round(fourth.data.forecast.forecastday[0].day.mintemp_c);
    $('#minTemp').html(currentMinTemp + '\u00B0C');
    $('#curCondition').html(fourth.data.forecast.forecastday[0].day.condition.text);
    $('#curIcon').attr("src", fourth.data.forecast.forecastday[0].day.condition.icon);

    //tomorrow
    $('#tomorrowDate').html(Date.parse(fourth.data.forecast.forecastday[1].date).toString("ddd dS"));
    let tomMaxTemp = Math.round(fourth.data.forecast.forecastday[1].day.maxtemp_c);
    $('#tomMaxTemp').html(tomMaxTemp + '\u00B0C');
    let tomMinTemp = Math.round(fourth.data.forecast.forecastday[1].day.mintemp_c)
    $('#tomMinTemp').html(tomMinTemp + '\u00B0C');
    $('#tomIcon').attr("src",fourth.data.forecast.forecastday[1].day.condition.icon);

    //next day
    $('#nextDayDate').html(Date.parse(fourth.data.forecast.forecastday[2].date).toString("ddd dS"));
    let nextDayMaxTemp = Math.round(fourth.data.forecast.forecastday[2].day.maxtemp_c);
    $('#nextMaxTemp').html(nextDayMaxTemp + '\u00B0C');
    let nextDayMinTemp = Math.round(fourth.data.forecast.forecastday[2].day.mintemp_c);
    $('#nextMinTemp').html(nextDayMinTemp + '\u00B0C');
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
    url: "libs/php/getCurrencySymbolNew.php",
    type: 'POST',
    dataType: 'json',

    success: function(fifth) {
                    
        console.log(fifth);

        $('#currencyName').html(fifth[currencyCode].description)

        //loop through the object to extract the country names and append to select options
        $.each(fifth, function(code, info) {
            const option = $("<option/>");
            option.text(`${code} - ${info.description}`); // format the option text
            option.val(code);
            $('#currencySelect').append(option);
          });
        
        console.log('fifth has run');

    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    } 
    });
});
};

function getExchangeRate(){
    $.ajax({
    url: "libs/php/getExchangeRateNew.php",
    type: 'POST',
    dataType: 'json',
    data: {
        from: currencyCode, 
        to: $('#currencySelect').val(),
        amount: $('#convertInput').val(),
    },

    success: function(sixth) {
    
        let converted = numeral(sixth).format('O.OO');

        $('#convertedResult').html($('#convertInput').val() + " " + currencyCode + " equals " + converted + " " + $('#currencySelect').val() );
        console.log('sixth has run');
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    }
    });
};

function getWikipediaLandmarks(){
    $.when(deferred).done(function(){
    $.ajax({
    url: "libs/php/getWikiLandmark.php",
    type: 'POST',
    dataType: 'json',
    data: {
        north: north,
        south: south,
        east: east,
        west: west,
        countryCode: countryIso,
    },
        success: function(seven) {

            console.log(countryIso);
            seven.forEach(function(landmark){
                
                let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary ;
                wikiGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: wikiMarker}).bindPopup(popUpContent));
            })
            map.addLayer(wikiGroup);

            console.log('seven has run');

        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});
};

function getCities(){
    $.when(deferred).done(function(){
    $.ajax({
    url: "libs/php/getWikiCity.php",
    type: 'POST',
    dataType: 'json',
    data: {
        countryCode: countryIso,
    },
        success: function(eight) {

            console.log(countryIso);
            eight.forEach(function(landmark){
                let popUpContent = "<p>" + landmark.name + "</p>";
                citiesGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: cityMarker}).bindPopup(popUpContent));
                
            })
            
            map.addLayer(citiesGroup);
            console.log('eight has run');

        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});
};

function getAirports(){
    $.when(deferred).done(function(){
    $.ajax({
    url: "libs/php/getWikiAirport.php",
    type: 'POST',
    dataType: 'json',
    data: {
        countryCode: countryIso,
    },
        success: function(nine) {

            console.log(countryIso);
            nine.forEach(function(landmark){
                let popUpContent = "<p>" + landmark.name + "</p>";
                airportsGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: airportMarker}).bindPopup(popUpContent));
                
            })
            
            map.addLayer(airportsGroup);
            console.log('nine has run');

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
            
                if(eight.length > 0){
                eight.forEach(function(news){
                    const newRow = table.insertRow();
                    newRow.classList.add('align-middle');
                    const cell1 = newRow.insertCell();
                    const cell2 = newRow.insertCell();
                    const img = document.createElement('img');
                    img.onerror = function(){
                        img.src = './libs/images/no-image-available-icon.png';
                    };
                    img.src = news.image;
                    img.classList.add("img-fluid");
                    img.classList.add("img-thumbnail");
                    cell1.appendChild(img);
                    const link = document.createElement('a');
                    link.classList.add('text-body');
                    link.textContent = news.title;
                    link.setAttribute('target', '_blank');
                    link.href = news.url;
                    cell2.appendChild(link);
                });
                }else {
                    const newRow = table.insertRow();
                    const cell1 = newRow.insertCell();
                    cell1.innerText = "No news articles available";
                    cell1.classList.add('text-center');
                }

                console.log('eight has run');

        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    });
});
};


function getHolidays(){
    $.when(deferred).done(function(data2){
    $.ajax({
    url: "libs/php/getHolidays.php",
    type: 'GET',
    dataType: 'json',
    data: {
        countryCode: countryIso,
        year: currentYear,
    },

    success: function(ten) {
                    
        console.log(ten);

        const table = document.getElementById('holidayInfo');

        ten.forEach(function(holiday){
            let date = new Date(holiday.date);
            let formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            const newRow = table.insertRow();
            const cell1 = newRow.insertCell();
            const cell2 = newRow.insertCell();
            cell1.innerText = formattedDate;
            cell2.innerText = holiday.name;
            cell2.classList.add("text-end");
        })
        
        console.log('ten has run');

    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    } 
    });
});
};


function getCameras(){
    $.when(deferred).done(function(data2){
    $.ajax({
    url: "libs/php/getCameras.php",
    type: 'GET',
    dataType: 'json',
    data: {
        countryCode: countryIso,
    },

    success: function(eleven) {
                    
        console.log(eleven);

        eleven.forEach(function(camera){
            
            const div = document.createElement('div');
            div.classList.add("text-center");
            const h6 = document.createElement('h6');
            const iframe = document.createElement('iframe');
            const anchorTag = document.createElement('a');
            
            const textNode = document.createTextNode(camera.title);
            h6.appendChild(textNode);
            h6.classList.add('text-center');

            div.appendChild(h6);

            iframe.setAttribute('src', camera.player.day.embed);

            div.appendChild(iframe);

            if(camera.location.wikipedia){
            anchorTag.setAttribute('href', camera.location.wikipedia);
            anchorTag.setAttribute('target', '_blank');
            anchorTag.textContent = 'More about this location';
            div.appendChild(anchorTag);
            };

            let popUpContent = div;
            
            cameraGroup.addLayer(L.marker([camera.location.latitude,camera.location.longitude], {icon: cameraMarker}).bindPopup(popUpContent));
        })

        map.addLayer(cameraGroup);
        
        console.log('ten has run');

    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    } 
    });
});
};


/// event handlers for change events in the currency modal
$('#currencySelect').change(function(){
    getExchangeRate();
});

$('#convertInput').on('input',function(){
    getExchangeRate();
});

// Function to remove all rows from the news table
function removeAllRows() {
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }
  };
