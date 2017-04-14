$(document).ready(function() {

    var countriesCitiesObject;

    // when new country is selected update select element with new cities
    function updateListOfCities(countryCities) {
        $('#cities').empty();
        $.each(countryCities, function(i) {
            $('#cities').append($('<option>', {
                value: Utf8Decode(countryCities[i]),
                text: Utf8Decode(countryCities[i])
            }));
        });
    }

    // get all weather information about city
    function getAllData(city) {
        $.ajax({

            url: 'http://api.apixu.com/v1/current.json?key=1816306c161c4919b56131822170704&q=' + city,
            success: function(data) {
                displayData(data);
            },
            error: function() {
                console.log(error);
            }
        });
    }

    // display all related information to the website
    function displayData(data) {
        $('.weather-icon').remove();
        $('<img src="http:' + data.current.condition.icon + '" class="weather-icon">').prependTo('#current-information');
        $('#city').text(data.location.name);
        $('#temperature').text(data.current.temp_c + '°C / ' + data.current.temp_f + 'F');
        displayDetails(data);
    }

    function displayDetails(data) {
        var template = "Local datetime : {{datetime}} <br> " +
            "Windchill : {{windchill}} °C<br> " +
            "Wind speed : {{windspeed}} kph<br> " +
            "Pressure : {{pressure}} mb <br> " +
            "Humidity : {{humidity}} %";

        var objectData = {
            datetime: data.location.localtime,
            windchill: data.current.feelslike_c,
            windspeed: data.current.wind_kph,
            pressure: data.current.pressure_mb,
            humidity: data.current.humidity
        }

        var rendered = Mustache.to_html(template, objectData);
        $('#details-wrapper').html(rendered);
    }

    function getALlCitiesFromJson(country) {
        updateListOfCities(countriesCitiesObject[country]);
    };

    (function getAllCountriesFromJson() {
        $.getJSON("cities.json", function(data) {
            countriesCitiesObject = data;
            fillListOfCountries(countriesCitiesObject);
        });
    })();

    function fillListOfCountries(data) {
        $('#countries').empty();
        var keyNames = Object.keys(data);
        $.each(keyNames, function(i) {
            $('#countries').append($('<option>', {
                value: keyNames[i],
                text: keyNames[i]
            }));
        });
    }


    // event handlers
    $('#details').click(function() {
        $('#details-wrapper').slideToggle();
    });

    $('#countries').change(function() {
        var selectedCountry = $(this).val();
        getALlCitiesFromJson(selectedCountry);
    });

    $('button').click(function() {
        var selectedCity = $('#cities').val();
        getAllData(selectedCity);
    });

    function Utf8Decode(strUtf) {
        return String(strUtf).replace(
            /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, 
            function(c) { 
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            }
        ).replace(
            /[\u00c0-\u00df][\u0080-\u00bf]/g, 
            function(c) { 
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            }
        );
    }

});
