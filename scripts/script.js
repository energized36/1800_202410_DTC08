function hamburger_click_handler() {
    console.log("inside hamburger_click_handler");
    $('#dropdown').toggleClass("collapse");
}

function add() {
    console.log("Inside add function")
    $("#data_gui").toggleClass("collapse");
}

async function add_data(userID) {
    var category = $("input[name='category']:checked").val()
    var data_name = $("#data_name").val();
    var data_price = $("#data_price").val();
    var data_date = $("#data_date").val();
    var user_ref = db.collection("users").doc(userID)
    $("#data_name").val("");
    $("#data_price").val("");
    $("#data_date").val("");
    $("input[name='category']").prop('checked', false);

    if (category != "empty" && data_price != "") {
        console.log("adding data to", userID, category, data_date, data_name, data_price)
        var document_attributes = {
            category: category,
            name: data_name,
            price: data_price,
            date: data_date
        };
        const current_total = await getTotal(userID);
        const new_total = parseFloat(current_total) + parseFloat(data_price);
        await db.collection("users").doc(userID).update({
            total: new_total
        });
        user_ref.collection("spending_data").add(document_attributes)
            .then(function (docRef) {
                console.log("Document added with ID: ", docRef.id)
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

    // closes the ui
    add();

}

function displayUserData(spendingData) {
    for (let key in spendingData) {
        switch (spendingData[key].category) {
            case "groceries":
                category_icon = `<svg xmlns="http://www.w3.org/2000/svg"
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
                category_icon = `<svg xmlns="http://www.w3.org/2000/svg"
                class=" size-full icon icon-tabler icon-tabler-tools-kitchen-2 stroke-gold-main" width="44" height="44"
                viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                    d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
            </svg>`
                break;
            case "clothing":
                category_icon = ` <svg xmlns="http://www.w3.org/2000/svg" class="stroke-gold-main size-full icon icon-tabler icon-tabler-shirt"
                width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />
            </svg>`
                break;
            case "self_care":
                category_icon = `<svg xmlns="http://www.w3.org/2000/svg"
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
                category_icon = `<svg xmlns="http://www.w3.org/2000/svg"
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
                category_icon = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-gold-main size-full icon icon-tabler icon-tabler-school" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
                <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
                </svg>`
                break;
            default:
                category_icon = "empty"
                break;
        }

        if (spendingData[key].category != "empty") {
            $("#data_row").append(`
            <div class="rounded-xl bg-white shadow-md mx-2 mt-2 flex items-center flex-col border">
                <div class="h-[28px] w-full bg-green-sub rounded-t-xl my-auto px-2 text-white font-semibold">${spendingData[key].name}</div>
                <div class="flex items-center justify-between w-full">
                    <div class="size-[40px] ">
                        ${category_icon}
                    </div>
                    <div class="font-inter font-bold flex text-md px-3 justify-between w-full text-2xl">
                        <div class="text-green-accent text-opacity-7">${spendingData[key].date}</div>
                        <div class="text-green-accent">$ ${spendingData[key].price}</div>
                    </div>
                </div>
            </div>
        `)
        }
    }
}

function getTotal(userID) {
    return new Promise((resolve, reject) => {
        db.collection("users").doc(userID).onSnapshot(snapshot => {
            const total = snapshot.data().total;
            console.log("Total:", total);
            resolve(total);
        }, error => {
            console.error("Error getting total:", error);
            reject(error);
        });
    });
}

async function getUserID() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log(user.uid);
                resolve(user.uid);
            } else {
                console.log("No user is logged in.");
                reject("No user is logged in.");
            }
        });
    });
}

async function getSpendingData(userID) {
    return new Promise((resolve, reject) => {
        db.collection("users").doc(userID).collection("spending_data").onSnapshot(snapshot => {
            let spendingData = []
            snapshot.docs.forEach((doc) => {
                spendingData.push({ ...doc.data() })
            })
            resolve(spendingData)
        }), error => {
            console.error("Error getting spending data:", error)
            reject(error);
        }
    })


}

async function add_geolocation_btn_hander(){
    const user_id = await get_user_id();
    const longitude = $("#longitude_input").val();
    const lattitude = $("#lattitude_input").val();
    const result = await db.collection("users").doc(user_id).collection("spending_data");

    result.add({
        "long": longitude,
        "lat": lattitude,
        "last_updated": firebase.firestore.FieldValue.serverTimestamp()
    })
    // console.log(result)
    display_geopoints()
}

async function display_geopoints(){
    $("#geoResults").empty() 
    const user_id = await get_user_id();

    return await db.collection("users").doc(user_id)
        .collection("spending_data")
        .orderBy(`lat`)
        .get()
        .then(snapshot => {
                snapshot.forEach(item => {
                    // console.log(item.id)
                    // console.log(item.data().long)
                    // console.log(item.data().lat)
                    // console.log(item.data())
                    $("#geoResults").append(`
                        <div class="border flex gap-2 w-max-content">
                            <div class="flex gap-2">
                                <label for="${item.id}"><strong>ID:</strong></label>
                                <div id="${item.id}">${item.id}</div>
                            </div>
                            <div class="flex gap-2">
                                <label for="${item.id}"><strong>Long</strong></label>
                                <div id="${item.id}">${item.data().long}</div>
                            </div>
                            <div class="flex gap-2">
                                <label for="lat_${item.id}"><strong>Lat</strong></label>
                                <div id="${item.id}">${item.data().lat}</div>
                            </div>
                        </div>
                        `)})
    })
}

async function setUp() {
    const userID = await getUserID();
    getSpendingData(userID).then(resp => {
        displayUserData(resp);
        console.log(resp)
    })

    getTotal(userID).then(resp => {
        $("#total").text(resp.toFixed(2))
    })

    $("#dropdown").toggleClass("hidden");
    $("#Hamburger").on("click", hamburger_click_handler);
    $("#add").on("click", add);
    $("#desktop_add_btn").on("click", add);
    $("#save").on("click", function () {
        add_data(userID);
    });
    $("#cancel").on("click", add);
    display_geopoints()
    $("#add_geolocation_btn").on("click", add_geolocation_btn_hander);
}

$("document").ready(setUp);




const options = {
    chart: {
      height: "100%",
      maxWidth: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#6DB423",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      },
    },
    series: [
      {
        name: "Nsew user",
        data: [10, 6418, 6456, 6526, 6356, 6456],
        color: "#4A9B30",
      },
    ],
    xaxis: {
      categories: ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  }
  
  if (document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("area-chart"), options);
    chart.render();
  }
  



