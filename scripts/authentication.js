// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// var uiConfig = {
//     callbacks: {
//       signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//         var user = authResult.user;                           
//         if (authResult.additionalUserInfo.isNewUser) {        
//             db.collection("users").doc(user.uid).set({      
//                    name: user.displayName,           
//                    email: user.email,                       
//             }).then(function () {
//                    console.log("New user added to firestore");
//                    window.location.assign("home.html");       
//             }).catch(function (error) {
//                    console.log("Error adding new user: " + error);
//             }).then(function () {
//               db.collection("users").doc(user.uid).collection("spending_data").doc().set({})
//                 .then(function() {
//                   console.log("User document created with spending_data collection.");
//                 })
//                 .catch(function(error) {
//                   console.error("Error adding spending_data collection: ", error);
//                 });
//             })
//         } else {
//             return true;
//         }
//             return false;
//         },

//       uiShown: function() {

//         document.getElementById('loader').style.display = 'none';
//       }
//     },
//     signInFlow: 'popup',
//     signInSuccessUrl: 'home.html',
//     signInOptions: [
//       firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     ],
//     tosUrl: '<your-tos-url>',
//     privacyPolicyUrl: '<your-privacy-policy-url>'
//   };

// ui.start('#firebaseui-auth-container', uiConfig);
//  <------------------------------------------------------------------------------------------------------------------------------------------------->

// firebase.initializeApp(firebaseConfig)
// const auth = firebase.auth()
// const database = firebase.database

// function register() {
//   fullname = document.getElementById('name').value
//   email = document.getElementById('email').value
//   password = document.getElementById('password').value

//   if (validate_email(email) == false || validate_password(password) == false) {
//     alert('Invalid Password/Email')
//     return
//   }

//   auth.createUserWithEmailAndPassword(email, password)
//     .then(function () {
//       var user = auth.currentUser

//       var database_ref = database.ref()
//       var user_data = {
//         email: email,
//         fullname: fullname,
//         last_login: Date.now()
//       }

//       database_ref.child('users/' + user.uid).set(user_data)

//       alert('User Created!')
//     })
//     .catch(function (error) {
//       var error_code = error.code
//       var error_message = error.message

//       alert(error_message)
//     })
// }

// function login() {
//   email = document.getElementById('email').value
//   password = document.getElementById('password').value

//   if (validate_email(email) == false || validate_password(password) == false) {
//     alert('Invalid Password/Email')
//     return
//   }

//   auth.signInWithEmailAndPassword(email, password)
//   .then(function() {
//     var user = auth.currentUser

//     var database_ref = database.ref()
//     var user_data = {
//       last_login : Date.now()
//     }

//     database_ref.child('users/' + user.uid).update(user_data)

//     alert('User logged in!')
//   })
//   .catch(function(error) {
//     var error_code = error.code
//     var error_message = error.message

//     alert(error_message)
//   })

//   function validate_email(email) {
//     expression = /^[^@]+@\w+(\- \w+)+\w$/
//     if (expression.test(email) == true) {
//       return true
//     }
//     else {
//       return false
//     }
//   }

//   function validate_password(password) {
//     if (password < 6) {
//       return false
//     }
//     else {
//       return true
//     }
//   }

//   function validate_field(field) {
//     if (field == null) {
//       return false
//     }
//     if (field <= 0) {
//       return false
//     }
//     else {
//       return true
//     }

//   }
// }



// registration.js
function register() {
    var fullname = document.getElementById('name').value;
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
  
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Invalid Password/Email');
      return;
    }
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        var user = userCredential.user;
  
        firestore.collection('users').doc(user.uid).set({
          name: fullname,
          email: email,
          last_login: Date.now()
        })
        .then(function () {
          firestore.collection('users').doc(user.uid).collection('spending_data').add({})
          .then(function () {
            alert('User Created!');
            window.location.href = 'home.html';
          })
          .catch(function (error) {
            alert('Error adding spending data: ' + error.message);
          });
        })
        .catch(function (error) {
          alert('Error adding user to Firestore: ' + error.message);
        });
      })
      .catch(function (error) {
        alert('Error creating user: ' + error.message);
      });
  }
  
  // login.js
  function login() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function () {
        alert('User logged in!');
        window.location.href = 'home.html';
      })
      .catch(function (error) {
        alert('Error logging in: ' + error.message);
      });
  }
  
  // Validation functions (unchanged)
  function validate_email(email) {
    var expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expression.test(String(email).toLowerCase());
  }
  
  function validate_password(password) {
    return password.length >= 6;
  }
  