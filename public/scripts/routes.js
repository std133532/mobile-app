/*
	ver: 1.1
	Perigrafi: 
	------------
	1. Δημιουργία κουμπιού για την τοποθετηση πινεζας (κουμπι πινέζας)
	2. Πάτημα κουμπιού πινέζας
		a. Αυτόματος προσδιορισμός θέσης χρήστη
			i.  Κεντράρισμα Χάρτη στη θεση του χρήστη 
			ii. Τοποθέτηση πινεζας
    /*
	ver: 1.3
	Perigrafi: 
	------------
    1.  Υπολογισμός διαδρομής μεταξύ σταθμού και θέση χρήστη (Η θέση χρηστη εισάγεται με κλίκ στο στο χάρτη). 
    2.  Υποστηρίζεται λίστα οδηγιών διαδρομής η οποία μπορεί να τεθεί σε απόκριψη. 
    3.  Στη  θέση του χρήστη εμφανίζεται pop up window με την υπολοιπόμενη απόσταση απο το σταθμό προορισμού. 
    4.  Επιλογή του κοντινότερου σταθμού στο χρήστη

    	ver: 1.4
	Perigrafi: 
	------------
    1.  Υπολογισμός διαδρομής μεταξύ σταθμού και θέση χρήστη (Η θέση χρηστη εισάγεται αυτόματα με χρήση της geolocation). 
    2.  Υποστηρίζεται λίστα οδηγιών διαδρομής η οποία μπορεί να τεθεί σε απόκριψη. 
    3.  Στη  θέση του χρήστη εμφανίζεται pop up window με την υπολοιπόμενη απόσταση απο το σταθμό προορισμού. 
    4.  Επιλογή του κοντινότερου σταθμού στο χρήστη
    */
var stations;

fetch('../json/stations.json').then(function(kostas) {
    return kostas.json();
}).then(function(json) {
    stations = json;
 initialize();
}).catch(function(err) {
    console.log('Fetch problem: ' + err.message);
});

var routeHistory = [];
var el;
var eButton;
var radiusAcuracy;
var destinationMark;
var routingControl;
var routeEv;
var pointOnMap;
var stationDistances = [];
var originMark;

function mbar_initialize(){

    var map = L.map('map').setView([51.505, -0.09],7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
}
function initialize() {
    var myMap = L.map('map').setView([35.32681169624291, 25.138424634933475], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(myMap);


    addStationsOnMap();

    var setPinOnCurrentPositionButton = L.easyButton({
        id: 'id-for-the-button', // an id for the generated button
        position: 'topleft', // inherited from L.Control -- the corner it goes in
        type: 'replace', // set to animate when you're comfy with css
        leafletClasses: true, // use leaflet classes to style the button?
        states: [{ // specify different icons and responses for your button
            stateName: 'get-center',
            onClick: function(button, map) {
                //alert('Map is centered at: ' + map.getCenter().toString());
                setPinOnCurrentPosition(button, map);
            },
            title: 'Πινέζα στη Θέση μου',
            //icon: '<span class="star">&curren;</span>'
            icon: '<span class="star"><img src="https://cdn0.iconfinder.com/data/icons/map-4/500/map_7-512.png" alt="Trulli" width="30" height="45"></span>'
        }]
    }).addTo(myMap);;

    //disable pin button 
    //setPinOnCurrentPositionButton.disable();

    //add location found listener to myMap
    //myMap.on('locationfound', onLocationFound);

    /*function onLocationFound(e) {
        radiusAcuracy = e;
        //enable pin button
        //setPinOnCurrentPositionButton.enable();
        L.marker(myMap.getCenter()).addTo(myMap)
            //.bindPopup("You are within " + radiusAcuracy.accuracy + " meters from this point").openPopup();
            .bindPopup("Βρίσκεστε Εδώ").openPopup();
        L.circle(myMap.getCenter(), radiusAcuracy.accuracy).addTo(myMap);

    }
*/
    //add location noto found listener
    myMap.on('locationerror', onLocationError);

    function onLocationError(e) {
        //alert(e.message);
    }


    var popup = L.popup();
    //////////////////////////////////Αυτόματη Ανανέωση θέσης χρήστη //////////////////////////////////////////
    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(myMap)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(myMap);
    }

    myMap.on('locationfound', onMapClick);
    myMap.locate({ setView: true, watch: true, maxZoom: 18 });

    function onMapClick(e) {

        /*
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(myMap);
        */
        //alert( 'Alert Generale !!!');


        //Εμφάνιση διαδρομής στο χάρτη.

        findRoutes(e.latlng, getNearestStation(e.latlng));

        showRoute();

        //Εξαφάνιση διαδρομής απο το χάρτη
        //routingControl.remove(myMap);

        //hide route instruction side pannel 
        var krypse = document.getElementsByClassName("leaflet-top leaflet-right");
        krypse[0].style.visibility = 'visible';

        //Αυτό δεν δούλεψε --> 
        //.leaflet-control-container .leaflet-routing-container-hide {
        //   display: none;
        //}
    }

    myMap.on('click', onMapClick);

    function setPinOnCurrentPosition(btn, mp) {
        //alert( 'Alert Generale !!!')
        //el = element;
        //console.log (el);
        myMap.locate({ setView: true, maxZoom: 16 });

        //Εκαθάριση διαδρομών χάρτη 
        for (var i = 0; i < routeHistory.length; i++) {
            routeHistory[i].remove(myMap);
        }

    }

    function onButtonClick(element) {

        console.log("Button id = " + element.getAttribute("id"));
    }

    // Υπολογισμός Απόστασης μεταξύ δύο σημείων 
    function twoPointDistance(routesFoundEvent) {
        // routingControl[0].summary.totalDistance

        return routesFoundEvent[0].summary.totalDistance;

    }


    function addStationsOnMap() {

        var LeafIcon = L.Icon.extend({
            options: {
                iconSize: [60, 60],
                //shadowSize: [50, 64],
                iconAnchor: [30, 60],
                // shadowAnchor: [4, 62],
                // popupAnchor: [-3, -76]
            }
        });

        var eScooterIcon = new LeafIcon({ iconUrl: 'images/scooters.PNG' });

        for (var i = 0; i < stations.length; i++) {
            L.marker([stations[i].lat, stations[i].lng], {
                icon: eScooterIcon,
                zIndexOffset: 1000,
                opacity: 0.7
            }).bindPopup("Σταθμός " + stations[i].streetName.gr).addTo(myMap);
        }
    }

    function showRoute() {
        if (routingControl) {
            //Εκαθάριση διαδρομών χάρτη 
            for (var i = 0; i < routeHistory.length; i++) {
                routeHistory[i].remove(myMap);
            }
        }

        if (routingControl) {
            routingControl.addTo(myMap);
            routeHistory.push(routingControl);
        }
    }

    function showSpinner() {

    }

    function hideSpinner() {

    }

    function findRoutes(originMark, nearestStation) {

        routingControl = L.Routing.control({
                waypoints: [originMark, L.latLng([nearestStation.lat, nearestStation.lng])],
                routeWhileDragging: true
            })
            .on('routesfound', function(e) {
                routeEv = e.routes;

                //alert('Found ' + routes.length + ' route(s).');
                //Αφαίρεσε τον προηγούμενο marker
                if (pointOnMap)
                    pointOnMap.remove(myMap);
                /*
                                    var circle = L.circle([51.508, -0.11], {
                                        color: 'red',
                                        fillColor: '#f03',
                                        fillOpacity: 0.5,
                                        radius: 500
                                    }).addTo(mymap);

                 */ //Τοποθέτησε τον νέο marker
                pointOnMap = L.circle(originMark, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 5
                }).addTo(myMap).bindPopup("Σε " + "<b>" +
                    twoPointDistance(e.routes) + "μ" +
                    "</b>" + " φθάνετε " +
                    nearestStation.streetName.gr +
                    "<br>" + "<b>" + nearestStation.bikesAvailable + "</b>" + " πατίνια διαθέσιμα.").openPopup();

            })
            .on('routingstart', showSpinner)
            .on('routesfound routingerror', hideSpinner)
            .addTo(myMap);
    }

    function getNearestStation(currentPosition) {
        for (let i = 0; i < stations.length; i++) {
            console.log(stations[i].streetName.gr + ": " +
                L.latLng([currentPosition.lat, currentPosition.lng])
                .distanceTo([stations[i].lat, stations[i].lng]));
        }


        console.log("------------------------------------");
        //console.log("Chanioporta: " + L.latLng([currentPosition.lat, currentPosition.lng]).distanceTo([stations[2].lat, stations[2].lng]));

        var min = 1000000000000;
        var index;

        for (let i = 0; i < stations.length; i++) {
            var distance = L.latLng([currentPosition.lat, currentPosition.lng])
                .distanceTo([stations[i].lat, stations[i].lng]);

            if (distance < min) {
                min = distance;
                index = i;
            }

        }

        // console.log(stations[index].streetName.gr);

        return stations[index];
        //L.latLng([stations[index].lat, stations[index].lng]);

    }

}