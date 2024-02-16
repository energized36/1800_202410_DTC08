function hamburger_click_handler() {
    $("#dropdown").toggleClass("hidden");
}

function setUp() {
    $("#dropdown").toggleClass("hidden");
    $("#Hamburger").click(hamburger_click_handler);
}

$("document").ready(setUp);
