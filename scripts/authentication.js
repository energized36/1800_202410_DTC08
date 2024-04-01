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

      db.collection('users').doc(user.uid).set({
        name: fullname,
        email: email,
        last_login: Date.now()
      })
      .then(function () {
        db.collection('users').doc(user.uid).collection('spending_data').add({})
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
  
  function validate_email(email) {
    var expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expression.test(String(email).toLowerCase());
  }
  
  function validate_password(password) {
    return password.length >= 6;
  }
  
function saveChanges() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const newName = document.getElementById('name').value;
    const newBio = document.getElementById('message').value;

    db.collection("users").doc(currentUser.uid).update({
      name: newName,
      bio: newBio
    })
    .then(() => {
      console.log("User information updated successfully");
      alert("Changes saved successfully!");
    })
    .catch((error) => {
      console.error("Error updating user information: ", error);
    });
  } else {
    console.log("No user is signed in");
  }
}

function deleteAccount() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (confirmation) {
      db.collection("users").doc(currentUser.uid).delete()
        .then(() => {
          console.log("User document deleted from Firestore");
          currentUser.delete()
            .then(() => {
              console.log("User account deleted successfully");
              window.location.href = "index.html";
            })
            .catch((error) => {
              console.error("Error deleting user account: ", error);
            });
        })
        .catch((error) => {
          console.error("Error deleting user document from Firestore: ", error);
        });
    }
  } else {
    console.log("No user is signed in");
  }
}

function loadUserData() {
  var user = firebase.auth().currentUser;
  if (user) {
    var docRef = db.collection("users").doc(user.uid);

    docRef.get().then(function(doc) {
      if (doc.exists) {
        var userData = doc.data();
        document.getElementById("name").value = userData.name || '';
        document.getElementById("email").value = userData.email || '';
        document.getElementById("message").value = userData.bio || '';
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  } else {
    console.log("User not logged in");
  }
}

window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      loadUserData();
    } else {
      console.log("User not logged in");
    }
  });
};
