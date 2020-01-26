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

        ver: 1.5
    Perigrafi: 
    ------------
    1. Τροποποιήθηκε ώστε να υπολογίζεται η διαδρομή μεταξύ θέσης χρήστη και κοντινότερου σταθμού ο οποίος έχει διαθέσιμα πατίνια 
    2. προστέθηκαν τα αρχεία δεδομένων scooters.json pointsofInterest.json και τροποποιήθηκε το stations.json 
     
    ver: 1.6
    Perigrafi: 
    ------------
    1. Τροποποιήθηκε ώστε να υπολογίζονται τα κοντινότερα σημεία ενδιαφέροντος που απέχουν maxDistance απο τον κοντινότερο σταθμό ως προς τον χρήστη 
   
    ver: 1.7
    Perigrafi: 
    ------------
    1. Εμφανίζονται στο χάρτη τα κοντινότερα σημεία ενδιαφέροντος που απέχουν maxDistance απο τον κοντινότερο σταθμό ως προς τον χρήστη
    2. Οταν ο χρήστης βρίσκεται πολύ κοντά στο σταθμό προορισμού (50m), το εικονίδιο του σταθμού εξαφανίζεται (ToDo: στη θέση του θα εμφανιστουν τα πατίνια )
        ενώ όταν απομακρυνθεί σε απόσταση μεγαλύτερη των 50m τότε το εικονίδιο του σταθμού εμφανίζεται και αποκρύπτονται τα πατίνια. 

    ver: 1.8
    Perigrafi: 
    ------------
    1. Εμφανίζονται τα πατίνια όταν ο χρήστης πλησιάσει (50μ). Εξαφανίζονται όταν απομακρυνθεί. 
    2. Με κλίκ στο πατίνι εμφανίζεται ένα popup το οποίο περιέχει ενα κουμπί για ενοικίαση πατινιού 
    3. Πατώντας το κουμπί ενοικίασης το σύστημα μπορεί να πληροφορηθεί το ID πατινιού και να γινει η ενοικίαση. 
    4. Στην παρούσσα φάση εμφανίζεται alert μηνυματος που περιέχει το ID πατινιού που ενοικιάστηκε. 
    5. Εγινε αυξηση του μεγέθους και η αλλαγή χρώματος του κουμπιου Χ που κλείνει το παράθυρο popup, ώστε να ειναι ευκολη η διαδραση απο κινητη συσκευή. 
 
    ver: 1.9
    Perigrafi: 
    ------------

*/

/* 

    station IDs:
    --------------------
    1. Filellinon
    2. liontaria
    3. chanioporta
    4. port
    5. koules
    6. karavolas
    7. airport
    8. national garden
    9. omonia square
    10. monastiraki square

*/

var stations;
var pointsOfInterest;
var scooters;
var np;
var db = firebase.firestore();


const fSt = fetch('../json/stations.json').then(function(kostas) {
    return kostas.json();
}).then(function(json) {
    stations = json;
    //initialize(); // todo na ginei sto Promise parakatw
}).catch(function(err) {
    console.log('Fetch problem: ' + err.message);
});

const fpo = fetch('../json/pointsofInterest.json').then(function(pointsInterest) {
    return pointsInterest.json();
}).then(function(json) {
    pointsOfInterest = json;
}).catch(function(err) {
    console.log('Fetch problem: ' + err.message);
});

const fsc = fetch('../json/scooters.json').then(function(scoots) {
    return scoots.json();
}).then(function(json) {
    scooters = json;
}).catch(function(err) {
    console.log('Fetch problem: ' + err.message);
});

//Synchronization: When all fetch requests return a JSON file initialize 
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
//https://stackoverflow.com/questions/52151006/react-fetch-multiple-get-requests


const promises = [fSt, fpo, fsc];

Promise.allSettled(promises).
then((results) => results.forEach((result) => console.log(result.status))).
then(function() {
    initialize();
});

const maxDistance = 5000;


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
var hideRouteInstructions = true;
var nearestPoints;
var poiOnMap = [];
var stationMarkers = {};
var scooterMarkers = {};

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


    var nearestpoi = document.getElementById("nearestpoi");
    nearestpoi.addEventListener('click', showDestinations);


    var setPinOnCurrentPositionButton = L.easyButton({
        id: 'id-for-the-button', // an id for the generated button
        position: 'topleft', // inherited from L.Control -- the corner it goes in
        type: 'replace', // set to animate when you're comfy with css
        leafletClasses: true, // use leaflet classes to style the button?
        states: [{ // specify different icons and responses for your button 
            stateName: 'get-center',
            onClick: function(button, map) {
                //alert('Map is centered at: ' + map.getCenter().toString());
                //setPinOnCurrentPosition(button, map);
                toggleRouteInstructions();
            },
            title: 'Πινέζα στη Θέση μου',
            //icon: '<span class="star">&curren;</span>'
            icon: '<span class="star"><img src="../images/routeInstructions.png" alt="Trulli" width="30" height="45"></span>'
        }]
    }).addTo(myMap);

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
    //   myMap.on('locationerror', onLocationError);

    function onLocationError(e) {
        alert(e.message);
    }


    var popup = L.popup();

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(myMap)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(myMap);
    }
    //////////////////////////////////Αυτόματη Ανανέωση θέσης χρήστη //////////////////////////////////////////

    //  myMap.locate({ setView: true, watch: true, enableHighAccuracy: true, maximumAge: 1000 });
    //   myMap.on('locationfound', onMapClick);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function onMapClick(e) {
        np = []; //clear all points of interest
        /*
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(myMap);
        */
        //alert( 'Alert Generale !!!');


        //Εμφάνιση διαδρομής στο χάρτη.

        //findRoutes(e.latlng, getNearestStation(e.latlng));
        np = getNearestPointsOfInterest(getNearestStation(e.latlng));
        /* Check if the user is logged */
        if (isUserSignedIn) {
            var uid = getUserUid();
            setNearestPointsInFB(np, uid);
        }
        displayNearestPoints(np);
        displayScooters(getNearestStation(e.latlng), e.latlng);
        showRoute();

        //Εξαφάνιση διαδρομής απο το χάρτη
        //routingControl.remove(myMap);

        //hide or show route instruction side pannel 
        /*
        if (hideRouteInstructions)
            document.getElementsByClassName("leaflet-top leaflet-right")[0].style.visibility = 'hidden'
        else
            document.getElementsByClassName("leaflet-top leaflet-right")[0].style.visibility = 'visible'
            //var krypse = document.getElementsByClassName("leaflet-top leaflet-right");
            //krypse[0].style.visibility = 'hidden';
*/
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
        myMap.locate({
            setView: true,
            maxZoom: 16
        });

        //Εκαθάριση διαδρομών χάρτη 
        for (var i = 0; i < routeHistory.length; i++) {
            routeHistory[i].remove(myMap);
        }

    }
    var krypse = document.getElementsByClassName("leaflet-top leaflet-right");

    function toggleRouteInstructions() {

        hideRouteInstructions = !hideRouteInstructions;

        if (hideRouteInstructions) {
            krypse[0].style.visibility = 'visible';
        } else {
            krypse[0].style.visibility = 'hidden';
        }


        console.log(hideRouteInstructions);
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

        var eScooterIcon = new LeafIcon({
            iconUrl: '../images/scooters.PNG'
        });

        for (var i = 0; i < stations.length; i++) {
            var stationMarker = {
                "marker": L.marker([stations[i].lat, stations[i].lng], {
                    icon: eScooterIcon,
                    zIndexOffset: 1000,
                    opacity: 0.7
                }),

                "isOnMap": false
            };
            stationMarker.marker.bindPopup("Σταθμός " + stations[i].streetName.gr);
            if (stationMarker.marker.addTo(myMap))
                stationMarker.isOnMap = true;

            stationMarkers[stations[i].stationID] = stationMarker;

        }
    }

    function showRoute() {
        if (routingControl) {
            //Εκαθάριση διαδρομών απο το χάρτη 
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
        var st = stations;
        var sc = scooters;
        st = getStationsWithScooters(sc);

        for (let i = 0; i < st.length; i++) {
            console.log(st[i].streetName.gr + ": " +
                L.latLng([currentPosition.lat, currentPosition.lng])
                .distanceTo([st[i].lat, st[i].lng]));
        }


        console.log("------------------------------------");
        //console.log("Chanioporta: " + L.latLng([currentPosition.lat, currentPosition.lng]).distanceTo([stations[2].lat, stations[2].lng]));

        var min = 1000000000000;
        var index;

        for (let i = 0; i < st.length; i++) {
            var distance = L.latLng([currentPosition.lat, currentPosition.lng])
                .distanceTo([st[i].lat, st[i].lng]);

            if (distance < min) {
                min = distance;
                index = i;
            }

        }

        // console.log(stations[index].streetName.gr);

        return st[index];
        //L.latLng([stations[index].lat, stations[index].lng]);

    }

    function getStationsWithScooters(scooterList) {
        var stationsList = [];
        for (let j = 0; j < stations.length; j++) {
            for (let i = 0; i < scooters.length; i++) {
                if (scooters[i].stationID === (j + 1) && scooters[i].status === "vacant") {
                    stationsList.push(stations[j]);
                    break;
                }
            }
        }
        return stationsList;
    }

    function getAvailableScooters(scoots, stID) {
        var list = [];


        return list;

    }

    function getNearestPointsOfInterest(chosenStation) {
        var list = [];
        var poi = pointsOfInterest;

        for (var i = 0; i < poi.length;

            i++) {
            var distance = L.latLng([chosenStation.lat, chosenStation.lng])
                .distanceTo([poi[i].lat, poi[i].lng]);

            if (distance < maxDistance) {
                //προσθέτουμε την απόσταση απο το σταθμό πατινιών που βρίσκεται ο χρήστης στο αντικείμενο poi[i]  
                poi[i].distanceFromStation = distance;
                list.push(poi[i]);
            }



        }

        return list;
    }


    function setNearestPointsInFB(np, uid) {


        //  for (var i = 0; i < np.length; i++) {
        //alert(uid + "--" + np[i].name.gr + "----" + np[i].points)
        db.collection('destinations').doc(uid).set({
                uid: uid,
                point: np,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

        //}
    }


    function displayNearestPoints(npoints) {
        console.log("-- -- -- -- --Nearest Points-- -- -- -- -- -- -- -");
        npoints.forEach(function(item, index) {
            console.log(index, item.name.gr);
        });

        console.log("-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- - ");
        // Empty Map POIs First 
        for (var i = 0; i < poiOnMap.length; i++) {
            poiOnMap[i].remove(myMap);
        }
        poiOnMap = [];

        var LeafIcon = L.Icon.extend({
            options: {
                iconSize: [30, 30],
                //shadowSize: [50, 64],
                iconAnchor: [15, 30],
                // shadowAnchor: [4, 62],
                // popupAnchor: [-3, -76]
            }
        });



        for (var i = 0; i < npoints.length; i++) {
            if (npoints[i].category === "culture")
                var poiIcon = new LeafIcon({
                    iconUrl: '../images/icons8-greek-pillar-capital-128.png'
                });
            else if (npoints[i].category === "entertainment") {
                var poiIcon = new LeafIcon({
                    iconUrl: '../images/icons8-food-100.png'
                });
            }

            var poi = L.marker([npoints[i].lat, npoints[i].lng], {
                    icon: poiIcon,
                    zIndexOffset: 1000,
                    opacity: 0.7,
                    properties: {
                        id: +npoints[i].id
                    }
                }).bindPopup(npoints[i].category + " " + npoints[i].name.gr)
                .addTo(myMap);
            poiOnMap.push(poi);

            poi.addEventListener('click', showPOIDetails);

        }
    }

    function displayScooters(nearestStation, currentPosition) {
        //Αφαίρεση εικονιδίου σταθμού απο το χάρτη
        var distance = L.latLng([nearestStation.lat, nearestStation.lng]).distanceTo([currentPosition.lat, currentPosition.lng]);

        if (distance < 50) {
            stationMarkers[nearestStation.stationID].marker.remove(myMap);
            stationMarkers[nearestStation.stationID].isOnMap = false;
        } else {
            if (!stationMarkers[nearestStation.stationID].isOnMap)
                stationMarkers[nearestStation.stationID].marker.addTo(myMap);
        }

        //ToDo 
        //Εδώ θα εμφανίζονται τα σκουτερ

        //cls 
        for (const [key, value] of Object.entries(scooterMarkers)) {
            console.log("scooterMarkers -->", key, value);
            if (scooterMarkers[key].isOnMap)
                scooterMarkers[key].marker.remove(myMap);
        }

        var LeafIcon = L.Icon.extend({
            options: {
                iconSize: [60, 60],
                //shadowSize: [50, 64],
                iconAnchor: [30, 60],
                // shadowAnchor: [4, 62],
                // popupAnchor: [-3, -76]
            }
        });


        var scooterIcon = new LeafIcon({
            iconUrl: '../images/icons8-kick-scooter-emoji-48.png'
        });

        for (var i = 0; i < scooters.length; i++) {
            var scooterMarker = {
                "marker": L.marker([scooters[i].lat, scooters[i].lng], {
                    icon: scooterIcon,
                    zIndexOffset: 1000 + i,
                    opacity: 1,
                    properties: {
                        id: +scooters[i].id
                    }

                }),

                "isOnMap": false
            };
            var html = getScooterMarkerPopUpHTMLContent(scooters[i].id);
            scooterMarker.marker.addEventListener('click', showEscooterDetails);
            //scooterMarker.marker.bindPopup("scooterID: " + scooters[i].id);
            //    scooterMarker.marker.bindPopup('<dialog class="mdl-dialog"> <h4 class="mdl-dialog__title">Allow data collection?</h4><div class="mdl-dialog__content"><p> Allowing us to collect data will let us get you the information you want faster.</p></div></dialog>');
            //marker.bindPopup(popupContent).openPopup();
            //  if (distance < 50 && scooters[i].stationID === nearestStation.stationID) {
            scooterMarker.isOnMap = true;
            //   alert("to vrika")
            scooterMarker.marker.addTo(myMap);
            // }

            scooterMarkers[scooters[i].id] = scooterMarker;

            //Δεν δουλεύει έτσι:  
            //document.getElementById("sc" + scooters[i].id).addEventListener('click', function() {
            //    alert(this.getAttribute("id"));
            //});

        }
    }

    function showEscooterDetails(e) {

        $('ol').empty()

        var marker = e.target;
        esccoterid = marker.options.properties.id;
        var dialog = document.querySelector('#dialog-scooter');

        var paragraph = document.getElementById("dialog-text");
        paragraph.innerHTML = ("Το χαρακτηριστικά του πατινιού είναι ");
        //paragraph.append (" Επίπεδο μπαταρίας: " +scooters[esccoterid].battery );

        $("ol").append("<li>Κωδικός Πατινιού: <b>sc" + scooters[esccoterid].id + "</b> </li>");

        $("ol").append("<li>Επίπεδο μπαταρίας:<b> " + scooters[esccoterid].battery + "%</b> </li>");

        $("ol").append("<li>Υπολοιπόμενα χιλιόμετρα:<b> " + scooters[esccoterid].distance + "</b> </li>");

        dialog.showModal();

        dialog.querySelector('.close').addEventListener('click', function() {
            dialog.close();
        });
    }

    function showPOIDetails(e) {

        var poi;
        var marker = e.target;
        poi_id = marker.options.properties.id;

        for (var i = 0; i < np.length; i++) {
            if (np[i].id == poi_id) {
                poi = np[i]
                break;
            }


        }

        var dialog = document.querySelector('#dialog-poi');
        $(".mdl-card__title ").css('background-image', 'url(' + poi.photo + ')');
        $(".poi-name").text(poi.name.gr);
        $(".poi-description").text(poi.description);
        $(".poi-ctg-name").text(poi.category);
        var src;
        if (poi.category == 'culture') src = '../images/icons8-greek-pillar-capital-128.png';
        else src = '../images/icons8-food-100.png';
        $(".poi-catg-photo").attr("src", src);

        var el = document.querySelector('.poi-badges');
        el.setAttribute('data-badge', poi.points);
        //$('.poi-badges').data('badge',poi.points); //setter


        dialog.showModal();

        dialog.querySelector('.close-poi').addEventListener('click', function() {
            dialog.close();
        });

    }


    function getScooterMarkerPopUpHTMLContent(scooterID) {
        var html = new Array;
        html.push('<button onclick="scooterButtonClick(this)" class="scooters" id = "sc' + scooterID + '">');
        html.push('Ενοικίασέ με!');
        html.push('</button>');

        return html.join('');



    }


    // popUpCloseButtonEnlargement();
}

/* function popUpCloseButtonEnlargement() {
    var elements = document.getElementsByClassName("leaflet-popup-close-button");
    //.style.color = "blue";
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.color = "blue";
    }
} */

function scooterButtonClick(buttonElement) {
    alert("Το πατίνι " + buttonElement.getAttribute("id") + " ενοικιάστηκε");
}





function showDestinations(e) {
//Check if user is logged and if he has data in collection destinations
    if (isUserSignedIn()) {



        window.location.href = "../pages/destinations.html";

    } else
        alert("Πρέπει να συνδεθείς πρώτα");


    //if(uid==null) alert("Login first");

    /*
        if (np == null) alert ("Δεν έχουν οριστεί τα σημεία ενδιαφέροντος");

        else {
             window.location.href = "../pages/destinations.html";

            for (var i = 0; i < np.length; i++) {
                console.log(np[i].id + "---" + np[i].name.gr);



            }

        }
    */
}

