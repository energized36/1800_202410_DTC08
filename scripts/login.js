/**
 * Toggles between sign-in and sign-up forms.
 * 
 * @returns {void}
 */
function toggleForm() {
    $("#sign-in-html").toggleClass("hidden");
    $("#sign-up-html").toggleClass("hidden");
}

/**
 * Checks if the password matches the confirmation password.
 * 
 * @returns {boolean} - Returns true if passwords match, false otherwise.
 */
function checkPassword() {
    return $("#signup-password").val() == $("#confirm-password").val();
}

/**
 * Clears input fields.
 * 
 * @returns {void}
 */
function clearInputs() {
    $('#login-email').val('');
    $('#login-password').val('');
    $('#signup-email').val('');
    $('#signup-password').val('');
    $('#confirm-password').val('');
}

/**
 * Handles click event for the hamburger icon to toggle dropdown.
 * 
 * @returns {void}
 */
function hamburgerClickHandler() {
    $("#dropdown").toggleClass("collapse");
}

$(document).ready(() => {
    clearInputs();

    $("#Hamburger").on("click", () => {
        hamburgerClickHandler();
    });

    $("#switchToSignUp, #switchToLogIn").on("click", () => {
        toggleForm();
    })
    
    $(".closedEye").on("click", () => {
        $(".closedEye").toggleClass("hidden");
        $(".openedEye").toggleClass("hidden");
        $("#login-password").attr("type", "text");
        $("#confirm-password").attr("type", "text");
        $("#signup-password").attr("type", "text");
    })
    
    $(".openedEye").on("click", () => {
        $(".openedEye").toggleClass("hidden");
        $(".closedEye").toggleClass("hidden");
        $("#login-password").attr("type", "password");
        $("#confirm-password").attr("type", "password");
        $("#signup-password").attr("type", "password");
    })

    $("#confirm-password").on("input", () => {
        if (!checkPassword()) {
            $("#passwordNoMatch").removeClass("invisible");
        } else {
            $("#passwordNoMatch").addClass("invisible");
        }
    })

    $("#signUp").on("click", () => {
        if (checkPassword()) {
            register();
        } else {
            console.log("Cannot register due to incorrect passwords.");
        }
    })
});
