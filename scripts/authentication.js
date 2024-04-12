/**
 * The register function is used to collect user registration details from the form fields.
 * It validates the email and password entered by the user.
 * If either the email or password is invalid, it alerts the user and stops execution.
 * If the validation is successful, it creates a new user in Firebase Authentication.
 * It then adds the user's details to a Firestore document and initializes their spending data.
 * If any of these operations fail, it alerts the user with the error message.
 */
function register() {
  // Get the full name from the form field with id 'name'
  var fullname = document.getElementById('name').value;

  // Get the email from the form field with id 'signup-email'
  var email = document.getElementById('signup-email').value;

  // Get the password from the form field with id 'signup-password'
  var password = document.getElementById('signup-password').value;

  // Validate the email and password
  // If either is invalid, alert the user and stop execution
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Invalid Password/Email');
    return;
  }

  // Create a new user in Firebase Authentication
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      // Get the user details from the user credential
      var user = userCredential.user;

      // Add the user's details to a Firestore document
      db.collection('users').doc(user.uid).set({
        name: fullname,
        email: email,
      })
      .then(function () {
        // Initialize the user's spending data
        db.collection('users').doc(user.uid).collection('spending_data').add({})
        .then(function () {
          // Redirect the user to the home page
          window.location.href = 'home.html';
        })
        .catch(function (error) {
          // Alert the user if there was an error adding the spending data
          alert('Error adding spending data: ' + error.message);
        });
      })
      .catch(function (error) {
        // Alert the user if there was an error adding the user to Firestore
        alert('Error adding user to Firestore: ' + error.message);
      });
    })
    .catch(function (error) {
      // Alert the user if there was an error creating the user
      alert('Error creating user: ' + error.message);
    });
}

  
/**
 * The login function is used to authenticate a user.
 * It collects the user's email and password from the form fields and attempts to sign in using Firebase Authentication.
 * If the sign-in is successful, it redirects the user to the home page.
 * If the sign-in fails, it alerts the user with the error message.
 */
function login() {
  // Get the email from the form field with id 'login-email'
  var email = document.getElementById('login-email').value;

  // Get the password from the form field with id 'login-password'
  var password = document.getElementById('login-password').value;

  // Attempt to sign in using Firebase Authentication
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      // Redirect the user to the home page
      window.location.href = 'home.html';
    })
    .catch(function (error) {
      // Alert the user if there was an error logging in
      alert('Error logging in: ' + error.message);
    });
}
  
/**
 * Validates an email address.
 * 
 * This function checks if the provided email address is in a valid format.
 * It uses a regular expression to check if the email address contains at least one character before and after the '@' symbol and a period ('.').
 * It does not allow spaces. The check is case-insensitive.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email address is valid, false otherwise.
 */
function validate_email(email) {
  // Regular expression for email validation
  var expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email address against the regular expression
  // Convert the email address to lower case to make the check case-insensitive
  return expression.test(String(email).toLowerCase());
}
  
/**
 * Validates a password.
 * 
 * This function checks if the provided password meets the minimum length requirement.
 * The minimum length for a valid password is 6 characters.
 * 
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
function validate_password(password) {
  // Check if the password meets the minimum length requirement
  return password.length >= 6;
}
  
/**
 * Saves changes to the user's information.
 * 
 * This function gets the current user from Firebase Authentication.
 * If a user is signed in, it gets the new name from the form field with id 'name' and updates the user's name in Firestore.
 * If the update is successful, it logs a success message to the console and alerts the user.
 * If the update fails, it logs the error to the console.
 * If no user is signed in, it logs a message to the console.
 */
function saveChanges() {
  // Get the current user from Firebase Authentication
  const currentUser = auth.currentUser;

  // Check if a user is signed in
  if (currentUser) {
    // Get the new name from the form field with id 'name'
    const newName = document.getElementById('name').value;

    // Update the user's name in Firestore
    db.collection("users").doc(currentUser.uid).update({
      name: newName,
    })
    .then(() => {
      // Log a success message to the console and alert the user if the update was successful
      console.log("User information updated successfully");
      alert("Changes saved successfully!");
    })
    .catch((error) => {
      // Log the error to the console if the update failed
      console.error("Error updating user information: ", error);
    });
  } else {
    // Log a message to the console if no user is signed in
    console.log("No user is signed in");
  }
}

/**
 * Deletes a user's account.
 * 
 * This function gets the current user from Firebase Authentication.
 * If a user is signed in, it asks for confirmation before proceeding.
 * If the user confirms, it deletes the user's spending data from Firestore, then deletes the user's document from Firestore, and finally deletes the user's account from Firebase Authentication.
 * If any of these operations fail, it logs the error to the console.
 * If the user does not confirm, it does nothing.
 * If no user is signed in, it logs a message to the console.
 */
function deleteAccount() {
  // Get the current user from Firebase Authentication
  const currentUser = auth.currentUser;

  // Check if a user is signed in
  if (currentUser) {
    // Ask for confirmation before proceeding
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (confirmation) {
      // Delete the user's spending data from Firestore
      db.collection("users").doc(currentUser.uid).collection("spending_data").get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Delete the user's document from Firestore
          db.collection("users").doc(currentUser.uid).delete()
            .then(() => {
              // Log a success message to the console
              console.log("User document deleted from Firestore");

              // Delete the user's account from Firebase Authentication
              currentUser.delete()
                .then(() => {
                  // Log a success message to the console and redirect the user to the index page
                  console.log("User account deleted successfully");
                  window.location.href = "index.html";
                })
                .catch((error) => {
                  // Log the error to the console if there was an error deleting the user's account
                  console.error("Error deleting user account: ", error);
                });
            })
            .catch((error) => {
              // Log the error to the console if there was an error deleting the user's document from Firestore
              console.error("Error deleting user document from Firestore: ", error);
            });
        })
        .catch((error) => {
          // Log the error to the console if there was an error deleting the user's spending data
          console.error("Error deleting subcollection 'spending data': ", error);
        });
    }
  } else {
    // Log a message to the console if no user is signed in
    console.log("No user is signed in");
  }
}


/**
 * Loads the user's data.
 * 
 * This function gets the current user from Firebase Authentication.
 * If a user is signed in, it gets the user's document from Firestore.
 * If the document exists, it gets the user's data and sets the values of the form fields with ids 'name' and 'email' to the user's name and email, respectively.
 * If the document does not exist, it logs a message to the console.
 * If there was an error getting the document, it logs the error to the console.
 * If no user is signed in, it logs a message to the console.
 */
function loadUserData() {
  // Get the current user from Firebase Authentication
  var user = firebase.auth().currentUser;

  // Check if a user is signed in
  if (user) {
    // Get the user's document from Firestore
    var docRef = db.collection("users").doc(user.uid);

    docRef.get().then(function(doc) {
      // Check if the document exists
      if (doc.exists) {
        // Get the user's data
        var userData = doc.data();

        // Set the values of the form fields with ids 'name' and 'email' to the user's name and email, respectively
        document.getElementById("name").value = userData.name || '';
        document.getElementById("email").value = userData.email || '';
      } else {
        // Log a message to the console if the document does not exist
        console.log("No such document!");
      }
    }).catch(function(error) {
      // Log the error to the console if there was an error getting the document
      console.log("Error getting document:", error);
    });
  } else {
    // Log a message to the console if no user is signed in
    console.log("User not logged in");
  }
}

/**
 * Initializes the application when the window loads.
 * 
 * This function sets up an observer on the Firebase Authentication state.
 * The observer is triggered every time the user signs in or out.
 * If a user is signed in, it loads the user's data.
 * If no user is signed in, it logs a message to the console.
 */
window.onload = function() {
  // Set up an observer on the Firebase Authentication state
  firebase.auth().onAuthStateChanged(function(user) {
    // Check if a user is signed in
    if (user) {
      // Load the user's data
      loadUserData();
    } else {
      // Log a message to the console if no user is signed in
      console.log("User not logged in");
    }
  });
};
