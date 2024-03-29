var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        var user = authResult.user;                           
        if (authResult.additionalUserInfo.isNewUser) {        
            db.collection("users").doc(user.uid).set({      
                   name: user.displayName,           
                   email: user.email,                       
            }).then(function () {
                   console.log("New user added to firestore");
                   window.location.assign("home.html");       
            }).catch(function (error) {
                   console.log("Error adding new user: " + error);
            }).then(function () {
              db.collection("users").doc(user.uid).collection("spending_data").doc().set({})
                .then(function() {
                  console.log("User document created with spending_data collection.");
                })
                .catch(function(error) {
                  console.error("Error adding spending_data collection: ", error);
                });
            })
        } else {
            return true;
        }
            return false;
        },

      uiShown: function() {

        document.getElementById('loader').style.display = 'none';
      }
    },
    signInFlow: 'popup',
    signInSuccessUrl: 'home.html',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

ui.start('#firebaseui-auth-container', uiConfig);
