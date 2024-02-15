function hamburger(){
    console.log("I have been click")
}

function setUp(){
    $("#Hamburger").click(hamburger);
}


$("document").ready(setUp);
