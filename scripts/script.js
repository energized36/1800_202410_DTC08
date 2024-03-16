function hamburger_click_handler() {
    $("#dropdown").toggleClass("hidden");
}

function add() {
    $("#data_gui").toggleClass("collapse");
}

function total() {

}

function add_data() {
    let category = $("input[name='category']:checked").val()
    let data_name = $("#data_name").val();
    let data_price = $("#data_price").val();
    let data_date = $("#data_date").val();
    $("#data_name").val("");
    $("#data_price").val("");
    $("#data_date").val("");
    $("input[name='category']").prop('checked', false);

    console.log(category)

    switch (category) {
        case "groceries":
            category = `<svg xmlns="http://www.w3.org/2000/svg"
                        class=" size-full icon icon-tabler icon-tabler-shopping-cart stroke-gold-main" width="44" height="44"
                        viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 17h-11v-14h-2" />
                        <path d="M6 5l14 1l-1 7h-13" />
                        </svg>`
            break;
        case "food":
            category = `<svg xmlns="http://www.w3.org/2000/svg"
            class=" size-full icon icon-tabler icon-tabler-tools-kitchen-2 stroke-gold-main" width="44" height="44"
            viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round"
            stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
                d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
        </svg>`
            break;
        case "clothing":
            category = ` <svg xmlns="http://www.w3.org/2000/svg" class="stroke-gold-main size-full icon icon-tabler icon-tabler-shirt"
            width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" fill="none"
            stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />
        </svg>`
            break;
        case "self_care":
            category = `<svg xmlns="http://www.w3.org/2000/svg"
                        class=" size-full icon icon-tabler icon-tabler-mood-heart stroke-gold-main" width="44" height="44"
                        viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M21 12a9 9 0 1 0 -8.012 8.946" />
                        <path d="M9 10h.01" />
                        <path d="M15 10h.01" />
                        <path d="M9.5 15a3.59 3.59 0 0 0 2.774 .99" />
                        <path d="M18.994 21.5l2.518 -2.58a1.74 1.74 0 0 0 .004 -2.413a1.627 1.627 0 0 0 -2.346 -.005l-.168 .172l-.168 -.172a1.627 1.627 0 0 0 -2.346 -.004a1.74 1.74 0 0 0 -.004 2.412l2.51 2.59z" />
                        </svg>`
            break;
        case "online_shopping":
            category = `<svg xmlns="http://www.w3.org/2000/svg"
                        class=" size-full icon icon-tabler icon-tabler-world-www stroke-gold-main" width="44" height="44"
                        viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4" />
                        <path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4" />
                        <path d="M12.5 3a16.989 16.989 0 0 1 1.828 4" />
                        <path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4" />
                        <path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4" />
                        <path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4" />
                        <path d="M2 10l1 4l1.5 -4l1.5 4l1 -4" />
                        <path d="M17 10l1 4l1.5 -4l1.5 4l1 -4" />
                        <path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4" />
                        </svg>`
            break;
        case "school":
            category = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-gold-main size-full icon icon-tabler icon-tabler-school" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
            <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
          </svg>`
            break;
        default:
            category = "empty"
            break;
    }


    if (category != "empty") {
        $("#data_row").append(`
        <div class="rounded-xl bg-white shadow-md mx-2 mt-2 flex items-center flex-col border">
            <div class="h-[28px] w-full bg-green-sub rounded-t-xl my-auto px-2 text-white font-semibold">` + data_name + `</div>
            <div class="flex items-center">
                <div class="size-[40px]">` + category + `</div>
                <div class="font-inter font-bold flex text-md px-3 justify-between w-full text-2xl">
                    <div class="text-green-accent text-opacity-7">`+ data_date + `</div>
                    <div class="text-green-accent">$ `+ data_price + `</div>
                </div>
            </div>
        </div>
        `)
    }

    add()

}

function setUp() {
    $("#dropdown").toggleClass("hidden");
    $("#Hamburger").click(hamburger_click_handler);
    $("#add").on("click", add);
    $("#save").on("click", add_data);
}

$("document").ready(setUp);



