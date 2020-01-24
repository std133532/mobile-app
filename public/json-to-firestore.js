



const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDTocav3zl-s7-si_pwwiN70hKC65meGT4",
  authDomain: "cultural-escooter.firebaseapp.com",
  projectId: "cultural-escooter",
  });
  
var db = firebase.firestore();

var menu =[{
        "name": { "en": "Liontaria", "gr": "Λιοντάρια" },
        "description": "mpla mpla mpla mpla mpla mplampla mpla mplampla mpla mplampla mpla mpla ",
        "category": "culture",
        "photo": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Morozini_Fontein_Heraklion.jpg",
        "url": "",
        "points": 9,
        "lat": 35.339095,
        "lng": 25.133264
    },

    {
        "name": { "en": "Logia", "gr": "Λότζια" },
        "description": "mpla mpla mpla mpla mpla mplampla mpla mplampla mpla mplampla mpla mpla ",
        "category": "culture",
        "photo": "https://upload.wikimedia.org/wikipedia/commons/4/47/Kreta_-_Iraklion_-_Venezianische_Loggia.jpg",
        "url": "",
        "points": 9,
        "lat": 35.339795,
        "lng": 25.134155
    },

    {
        "name": { "en": "Knosos", "gr": "Κνωσός" },
        "description": "mpla mpla mpla mpla mpla mplampla mpla mplampla mpla mplampla mpla mpla ",
        "category": "culture",
        "photo": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Knossos_-_North_Portico_02.jpg",
        "url": "",
        "points": 10,
        "lat": 35.298244,
        "lng": 25.160993
    },

    {
        "name": { "en": "Kazantzakis Grave", "gr": "Τάφος Καζαντζάκη" },
        "description": "mpla mpla mpla mpla mpla mplampla mpla mplampla mpla mplampla mpla mpla ",
        "category": "culture",
        "photo": "https://upload.wikimedia.org/wikipedia/commons/5/56/Kazantzakisgrave.jpg",
        "url": "",
        "points": 10,
        "lat": 35.33303,
        "lng": 25.130668
    },

    {
        "name": { "en": "Mare", "gr": "Μάρε" },
        "description": "mpla mpla mpla mpla mpla mplampla mpla mplampla mpla mplampla mpla mpla ",
        "category": "entertainment",
        "photo": "http://www.mare-cafe.gr/assets/img/gallery/Mare_coffee_bar_&_food_fountain.jpg",
        "url": "",
        "points": 10,
        "lat": 35.341913,
        "lng": 25.130389
    }


]
menu.forEach(function(obj) {
    db.collection("poi").add({
        name: obj.name,
        description: obj.description,
        category: obj.category,
        photo: obj.photo,
                url: obj.url,
                 points: obj.points,
                   points: obj.points,

    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});