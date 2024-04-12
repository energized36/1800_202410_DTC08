// When hamburger is clicked, display hamburger men
function hamburgerClickHandler() {
    console.log("inside hamburgerClickHandler");
    $("#dropdown").toggleClass("collapse");
}

function setUp(){
    $("#Hamburger").on("click", hamburgerClickHandler);
}

$("document").ready(() => {
    setUp();
})