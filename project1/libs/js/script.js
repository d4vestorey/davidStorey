const map = L.map('map');

const tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  zoomControl: false,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

let geojsonLayer = L.geoJSON().addTo(map);



//preloader
$(window).on('load', function () {
  if ($('#preloader').length) {
      $('#preloader').delay(2000).fadeOut('slow', function () {
          $(this).remove();
      });
  }



navigator.geolocation.getCurrentPosition(function(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  
  // Ajax calls to php routines on initial load
  
  $.ajax({
    url: "libs/php/getCountryIso.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: latitude,
      long: longitude,
  },
    
    success: function(first) {

          $.ajax({
            url: "libs/php/getCountryInfoWithIso.php",
            type: 'GET',
            dataType: 'json',
            data: {
              countryIso: first.data.countryCode,
            },
            
            success: function(second) {

              $.ajax({
                url: "libs/php/getCountryOutline.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: second.data[0].isoAlpha3, //get the last 3 characters of the selected country and pass as the country code
                },
                
                success: function(third) {

                  $.ajax({
                    url: "libs/php/getWeatherForecast.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        capital: second.data[0].capital, //get the capital city
                    },
                   
                  success: function(fourth) {

                    $.ajax({
                      url: "libs/php/getCurrencySymbol.php",
                      type: 'POST',
                      dataType: 'json',
                  
                      success: function(fifth) {

                        $.ajax({
                          url: "libs/php/getExchangeRates.php",
                          type: 'POST',
                          dataType: 'json',
                          
                          success: function(sixth) {

                            $.ajax({
                              url: "libs/php/getWiki.php",
                              type: 'POST',
                              dataType: 'json',
                              data: {
                                  country: second.data[0].countryCode, //get the country code to use with the first api call
                              },
                                success: function(seven) {

                                    seven.data.forEach(function(landmark){
                                        if(landmark.feature == 'landmark'){
                                            let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + "target =_blank>More<a/>";
                                            landmarksGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: landmarksIcon}).bindPopup(popUpContent));
                                            
                                        }
                                        if(landmark.feature == 'city'){
                                            let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + "target =_blank>More<a/>";
                                            citiesGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: citiesIcon}).bindPopup(popUpContent));
                                            
                                        }
                                        if(landmark.feature == 'airport'){
                                            let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + "target =_blank>More<a/>";
                                            airportsGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: airportsIcon}).bindPopup(popUpContent));
                                          
                                        }
                                    })
                                    map.addLayer(landmarksGroup);
                                    map.addLayer(citiesGroup);
                                    map.addLayer(airportsGroup);
                              
                        
                                    let currencyCode = second.data[0].currencyCode;
                                
                                    $('#exchange').html(sixth.data.conversion_rates[currencyCode]);
                                    
                        
                        
                        
                                      let countryCurrencyIso = second.data[0].isoAlpha3;
                                      
                                      for(let i = 0; i < fifth.data.length; i++){
                                          if(fifth.data[i].abbreviation == countryCurrencyIso){
                                              $('#currencySymbol').html(fifth.data[i].symbol);
                                              $('#currencyName').html(fifth.data[i].currency);
                                          }
                                      }
                    

                                        //current weather
                                        $('#curTemp').html(fourth.data.current.temp_c);
                                        $('#curFeelsTemp').html(fourth.data.current.feelslike_c);
                                        $('#curCondition').html(fourth.data.forecast.forecastday[0].day.condition.text);;
                                        $('#curRain').html(fourth.data.current.precip_mm);
                                        $('#curWind').html(fourth.data.current.wind_mph);
                                        $('#curWindDir').html(fourth.data.current.wind_dir);
                                    
                                        //tomorrow
                                        $('#tomSunrise').html(fourth.data.forecast.forecastday[1].astro.sunrise);
                                        $('#tomGenCondition').html(fourth.data.forecast.forecastday[1].day.condition.text);
                                        $('#tomMaxTemp').html(fourth.data.forecast.forecastday[1].day.maxtemp_c);
                                        $('#tomMinTemp').html(fourth.data.forecast.forecastday[1].day.mintemp_c);
                                        $('#tomRainChance').html(fourth.data.forecast.forecastday[1].day.daily_chance_of_rain);
                                        $('#tomMaxWind').html(fourth.data.forecast.forecastday[1].day.maxwind_mph);
                                        $('#tomSunset').html(fourth.data.forecast.forecastday[1].astro.sunset);
                    
          
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
                                        
                                        let isoForFlag = second.data[0].countryCode.toLowerCase();

                                        $('#capital').html(second.data[0].capital);
                                        $('#population').html(second.data[0].population);
                                        $('#continent').html(second.data[0].continentName);
                                        $('#currencyCode').html(second.data[0].currencyCode);
                                        $('#area').html(second.data[0].areaInSqKm);
                                        $('#selCountry').html(second.data[0].countryName);
                                        $('#countryCode').html(second.data[0].countryCode);
                                        $('#overviewFlagWrap').append('<td><img id=overviewFlag src="https://img.geonames.org/flags/x/'+isoForFlag+'.gif"/></td>');

                                        let north = second.data[0].north;
                                        let east = second.data[0].east;
                                        let south = second.data[0].south;
                                        let west = second.data[0].west;

                                        let southWest = L.latLng(south, west);
                                        let northEast = L.latLng(north, east);
                                        let bounds = L.latLngBounds(southWest, northEast);

                                        const latLng = L.latLng(latitude,longitude);
                                        console.log(latLng);
                                        map.fitBounds(bounds);

                                      },
                                      error: function(jqXHR, textStatus, errorThrown) {
                                          // your error code
                                      }
                                  });
                                  },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    // your error code
                                }
                            });
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                // your error code
                            }
                        });    
                      },
                      error: function(jqXHR, textStatus, errorThrown) {
                          // your error code
                      } 
                  });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // your error code
                }
            });      
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
    }
});
});
});



//leaftlet marker cluster groups and custom marker icons for each group
let landmarksGroup = L.markerClusterGroup();//L.featureGroup();
let landmarksIcon = L.icon({iconUrl: 'libs/images/pinMarker.png', iconSize: [30, 30]});

let citiesGroup = L.markerClusterGroup();//L.featureGroup();
let citiesIcon = L.icon({iconUrl: 'libs/images/cityMarker.png', iconSize: [30, 30]});

let airportsGroup = L.markerClusterGroup();//L.featureGroup();
let airportsIcon = L.icon({iconUrl: 'libs/images/airportMarker.png', iconSize: [30, 30]});


////////////////////////////////////////////////////////////


//load data from the geojson document to populate the drop down select

$(function() {

  $.ajax({
      url: "libs/php/loadFile.php",
      type: 'GET',
      data: 'json',
      success: function(result) {
          
          //convert the json into js object
          const country_object = JSON.parse(result);
          
          //loop through the object to extract the country names and append to select options
          $.each(country_object, function(i, p) {
          $('#countrySelect').append($('<option></option>').val(p).html(p));
          });
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
      }
  }); 

});


//get country info from geonames
$('#countrySelect').change(function() {
  $.ajax({
      url: "libs/php/getCountryInfo.php",
      type: 'POST',
      dataType: 'json',
      
      success: function(result) {
          
          if (result.status.name == "ok") {

              let countryIso = $("#countrySelect :selected").text().slice(-3);

              //checks to see if a map already exists in the div. If it does, it gets removed
              if($("#overviewFlagWrap").html().length > 0){
                  $("#overviewFlagWrap").empty();
              }
              
              for(let i = 0; i < result.data.length; i++){

                      if(result.data[i].isoAlpha3 == countryIso){
                          $('#capital').html(result.data[i].capital);
                          $('#population').html(result.data[i].population);
                          $('#continent').html(result.data[i].continentName);
                          $('#currencyCode').html(result.data[i].currencyCode);
                          $('#area').html(result.data[i].areaInSqKm);
                          $('#selCountry').html(result.data[i].countryName);
                          $('#countryCode').html(result.data[i].countryCode);
                          $('#overviewFlagWrap').append('<td><img id=overviewFlag src="https://img.geonames.org/flags/x/'+result.data[i].countryCode.toLowerCase()+'.gif"/></td>');
                      }
              }
              
          }
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
      }
  }); 

});



//when the country is changed in the dropdown, runs a php routine to retieve the coordinates for that country
//using the country iso to key into the object
$('#countrySelect').change(function() {
  $.ajax({
      url: "libs/php/getCountryOutline.php",
      type: 'POST',
      dataType: 'json',
      data: {
          country: $("#countrySelect :selected").text().slice(-3), //get the last 3 characters of the selected country and pass as the country code
      },
      success: function(result) {

          map.removeLayer(geojsonLayer);

          let geojsonFeature = {
              "type": "Feature",
              "properties": {
                  "name": "Coors Field",
                  "amenity": "Baseball Stadium",
                  "popupContent": "This is where the Rockies play!"
              },
              "geometry": {
                  "type": "MultiPolygon",
                  "coordinates": result
              }
          };


          geojsonLayer = L.geoJSON(geojsonFeature).addTo(map);


      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
      }
  }); 

});


//get the exchange rate
$('#countrySelect').change(function() {
  setTimeout(function(){
      $.ajax({
          url: "libs/php/getExchangeRates.php",
          type: 'POST',
          dataType: 'json',
          
          success: function(result) {
              
              //grab the currently selected currency code
              let currencyCode = $('#currencyCode').text();
              console.log(currencyCode);
  
              if (result.status.name == "ok") {
  
                  $('#exchange').html(result.data.conversion_rates[currencyCode]);
              }
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
              // your error code
          }
      }); 
  
  },800);
  });


//Get the currency symbol (if available)
$('#countrySelect').change(function() {
  $.ajax({
      url: "libs/php/getCurrencySymbol.php",
      type: 'POST',
      dataType: 'json',
  
      success: function(result) {
          
          let countryCurrencyIso = $("#countrySelect :selected").text().slice(-3);

          if($('#currencySymbol').text()){
              $('#currencySymbol').html("");
              $('#currencyName').html("");
          }
          
          for(let i = 0; i < result.data.length; i++){
              if(result.data[i].abbreviation == countryCurrencyIso){
                  $('#currencySymbol').html(result.data[i].symbol);
                  $('#currencyName').html(result.data[i].currency);
              }
      }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
      }
  }); 

});


  $('#countrySelect').change(function() {
      setTimeout(function(){//delay the running of this to allow the capital city to populate from another call
          $.ajax({
              url: "libs/php/getWeatherForecast.php",
              type: 'POST',
              dataType: 'json',
              data: {
                  capital: $("#capital").text(), //get the capital city
              },
             
          success: function(result) {
  
              
                  console.log(result);
                  //current weather
                  $('#curTemp').html(result.data.current.temp_c);
                  $('#curFeelsTemp').html(result.data.current.feelslike_c);
                  $('#curCondition').html(result.data.forecast.forecastday[0].day.condition.text);;
                  $('#curRain').html(result.data.current.precip_mm);
                  $('#curWind').html(result.data.current.wind_mph);
                  $('#curWindDir').html(result.data.current.wind_dir);
              
                  //tomorrow
                  $('#tomSunrise').html(result.data.forecast.forecastday[1].astro.sunrise);
                  $('#tomGenCondition').html(result.data.forecast.forecastday[1].day.condition.text);
                  $('#tomMaxTemp').html(result.data.forecast.forecastday[1].day.maxtemp_c);
                  $('#tomMinTemp').html(result.data.forecast.forecastday[1].day.mintemp_c);
                  $('#tomRainChance').html(result.data.forecast.forecastday[1].day.daily_chance_of_rain);
                  $('#tomMaxWind').html(result.data.forecast.forecastday[1].day.maxwind_mph);
                  $('#tomSunset').html(result.data.forecast.forecastday[1].astro.sunset);
              },
  
          error: function(jqXHR, textStatus, errorThrown) {
              // your error code
          } 
  
  });
  },800);
});
      

//fly map to new location
$('#countrySelect').change(function() {
  setTimeout(function(){//delay the running of this to allow the capital city to populate from another call
      $.ajax({
          url: "libs/php/getCoordinates.php",
          type: 'POST',
          dataType: 'json',
          data: {
              countryCode: $("#countryCode").text(), //get the country code
          },
         
      success: function(result) {
          
          let countryInfo = result.data[0];
          let coords = [[countryInfo.south, countryInfo.west],[countryInfo.north, countryInfo.east]];
          
          console.log(coords);

          map.flyToBounds(coords, {duration: 2});
              
          },

      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
      } 

});
},800);
});


//wiki data to populate map with features/poi's
$('#countrySelect').change(function() {
  setTimeout(function(){
      $.ajax({
          url: "libs/php/getWiki.php",
          type: 'POST',
          dataType: 'json',
          data: {
              country: $("#countryCode").text(), //get the country code to use with the first api call
          },
          success: function(result) {

              console.log($("#countryCode").text());
              
              
              if (result.status.name == "ok") {

                  if(landmarksGroup || citiesGroup || airportsGroup){
                      landmarksGroup.clearLayers();
                      citiesGroup.clearLayers();
                      airportsGroup.clearLayers();
                  }
                  

                  result.data.forEach(function(landmark){
                      if(landmark.feature == 'landmark'){
                          let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + "target =_blank>More<a/>";
                          landmarksGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: landmarksIcon}).bindPopup(popUpContent));
                          
                      }
                      if(landmark.feature == 'city'){
                          let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + "target =_blank>More<a/>";
                          citiesGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: citiesIcon}).bindPopup(popUpContent));
                          
                      }
                      if(landmark.feature == 'airport'){
                          let popUpContent = "<h4>" + landmark.title + "</h4><br>"+ landmark.summary + "<br> <a href=" + landmark.wikipediaURL + "target =_blank>More<a/>";
                          airportsGroup.addLayer(L.marker([landmark.lat,landmark.lng], {icon: airportsIcon}).bindPopup(popUpContent));
                          
                      }
                  })
                  map.addLayer(landmarksGroup);
                  map.addLayer(citiesGroup);
                  map.addLayer(airportsGroup);
              }
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
              // your error code
          }
      }); 
  
  },800);
  })
  