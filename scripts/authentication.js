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
      })
      .then(function () {
        db.collection('users').doc(user.uid).collection('spending_data').add({})
        .then(function () {
          // alert('User Created!');
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
        // alert('User logged in!');
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

    db.collection("users").doc(currentUser.uid).update({
      name: newName,
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
      db.collection("users").doc(currentUser.uid).collection("spending_data").get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        })
        .then(() => {
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
        })
        .catch((error) => {
          console.error("Error deleting subcollection 'spending data': ", error);
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
