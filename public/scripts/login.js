'use strict';

// Signs-in Friendly Chat.
function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
  firebase.auth().onAuthStateChanged(authStateObserver);
  
}

function signInFb() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider);
  firebase.auth().onAuthStateChanged(authStateObserver);

}

function signInWithEmail() {
  // Sign in Firebase using popup auth and Google as the identity provider.

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
  		//Successfully login with email/password
  		alert('Successfully logged in!!');
		}).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;

 // alert(errorMessage);
  var snackbarContainer = document.querySelector('#demo-snackbar-example');


    var data = {
      message: errorMessage,
      timeout: 5000,
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
});

  
}


function register() {
   $("#includedContent").empty();
   $("#includedContent").load("../pages/register.html"); 
  
}

function registerUser() {

  var email = document.getElementById('reg_email').value;
  var password = document.getElementById('reg_password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
	}).catch(function(error) {
	var errorCode = error.code;
  	var errorMessage = error.message;

  //alert(errorMessage);

   var snackbarContainer = document.querySelector('#demo-snackbar-example');


    var data = {
      message: errorMessage,
      timeout: 5000,
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
	});

}

function resetPassword() {

 
var auth = firebase.auth();
var emailAddress = document.getElementById('reset_email').value;

auth.sendPasswordResetEmail(emailAddress).then(function() {
  alert("Check your email!")
}).catch(function(error) {
  alert("Something went wrong!");
});
}


if ($('#register-button').length > 0) { 
var registerUserElement=document.getElementById('register-button');
registerUserElement.addEventListener('click', registerUser);
}
if ($('#sign-in').length > 0) { 
var signInButtonElement = document.getElementById('sign-in');
signInButtonElement.addEventListener('click', signIn);

}
if ($('#login-fb-button').length > 0) { 
var signInFbButtonElement = document.getElementById('login-fb-button');
signInFbButtonElement.addEventListener('click', signInFb);

}
if ($('#login-button').length > 0) { 
var signInWithEmailButtonElement = document.getElementById('login-button');
signInWithEmailButtonElement.addEventListener('click', signInWithEmail);

}
if ($('#register').length > 0) { 
var registerButtonElement = document.getElementById('register');
registerButtonElement.addEventListener('click', register);

}

if ($('#resetpassword').length > 0) { 
	var resetButtonElement = document.getElementById('resetpassword');
	resetButtonElement.addEventListener('click', resetPassword);
}





