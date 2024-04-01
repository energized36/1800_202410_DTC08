const options = {
    chart: {
        id: 'mychart',
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
            show: true,
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
        enabled: true,
        offsetX: 10,
    },
    stroke: {
        curve: "stepline",
        width: 2,
    },
    grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
            left: 50,
            right: 0
        },
    },

    series: [
        {
            name: "Total",
            data: [],
            color: "#4A9B30",
        },
    ],
    xaxis: {
        categories: [],
        labels: {
            show: true,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: true,
        },
    },
    yaxis: {
        show: false,
    },
}

const chart = new ApexCharts(document.getElementById("area-chart"), options);
chart.render()

function hamburger_click_handler() {
    console.log("inside hamburger_click_handler");
    $('#dropdown').toggleClass("collapse");
}

function add() {
    window.scrollTo(0, 0);
    console.log("Inside add function")
    $("#data_gui").toggleClass("collapse");
}

function filterByTimeRange(timeRange, dataList) {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const currentDate = new Date(year, month - 1, day)
    switch (timeRange) {
        case 'week':
            const lastMonday = new Date(currentDate)
            lastMonday.setDate(currentDate.getDate() - currentDate.getDay() + 1)
            return dataList.filter(item => new Date(item.date) >= lastMonday && new Date(item.date) <= currentDate);
        case 'month':
            const firstDayOfMonth = new Date(year, month - 1, 1);
            return dataList.filter(item => new Date(item.date) >= firstDayOfMonth && new Date(item.date) <= currentDate);
        case 'year':
            const firstDayOfYear = new Date(year, 0, 1);
            return dataList.filter(item => new Date(item.date) >= firstDayOfYear && new Date(item.date) <= currentDate);
        case 'all':
            return dataList;
        default:
            console.error('Invalid time range');
            return [];
    }
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const todaysDate = new Date();
    const yesterdaysDate = new Date();

    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

    if (date.getDate() === todaysDate.getDate() && 
        date.getMonth() === todaysDate.getMonth() &&
        date.getFullYear() === todaysDate.getFullYear()) {
        return "Today";
    }

    if (date.getDate() === yesterdaysDate.getDate() && 
        date.getMonth() === yesterdaysDate.getMonth() &&
        date.getFullYear() === yesterdaysDate.getFullYear()) {
        return "Yesterday";
    }

    return date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

async function addData(userID) {
    var category = $("input[name='category']:checked").val();
    var data_name = $("#data_name").val();
    var data_price = $("#data_price").val();
    var data_date = $("#data_date").val();
    var user_ref = db.collection("users").doc(userID);
    $("#data_name").val("");
    $("#data_price").val("");
    $("#data_date").val("");
    $("input[name='category']").prop('checked', false);

    if (category && data_price) {

        console.log("adding data to", userID, category, data_date, data_name, data_price);
        var document_attributes = {
            category: category,
            name: data_name,
            price: parseFloat(data_price).toFixed(2),
            date: data_date
        };
        var userDoc = await user_ref.get();
        var current_total = userDoc.exists ? parseFloat(userDoc.data().total || 0) : 0;
        var new_total = current_total + parseFloat(data_price);
        await user_ref.update({ total: new_total });

        user_ref.collection("spending_data").add(document_attributes)
            .then(function (docRef) {
                console.log("Document added with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }
    add();
}

function getLogo(name) {
    let categoryIcon;

    switch (name) {
        case "groceries":
            categoryIcon = `<svg xmlns="http://www.w3.org/2000/svg"
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
            categoryIcon = `<svg xmlns="http://www.w3.org/2000/svg"
                class=" size-full icon icon-tabler icon-tabler-tools-kitchen-2 stroke-gold-main" width="44" height="44"
                viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                    d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
            </svg>`
            break;
        case "clothing":
            categoryIcon = ` <svg xmlns="http://www.w3.org/2000/svg" class="stroke-gold-main size-full icon icon-tabler icon-tabler-shirt"
                width="44" height="44" viewBox="0 0 24 24" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />
            </svg>`
            break;
        case "self_care":
            categoryIcon = `<svg xmlns="http://www.w3.org/2000/svg"
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
            categoryIcon = `<svg xmlns="http://www.w3.org/2000/svg"
                            class=" size-full icon icon-tabler icon-tabler-world-www stroke-gold-main" width="44" height="44"
                            viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round"
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
            categoryIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-gold-main size-full icon icon-tabler icon-tabler-school" width="44" height="44" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
                <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
                </svg>`
            break;
        default:
            categoryIcon = null
            break;
    }
    return categoryIcon
}

function displayUserData(spendingData, targetID, logo) {
    const groupedByDate = {};

    // Group spending data by date
    Object.keys(spendingData).forEach(key => {
        const date = formatDate(spendingData[key].date);
        if (!groupedByDate[date]) {
            groupedByDate[date] = [];
        }
        groupedByDate[date].push(spendingData[key]);
    });

    // Generate HTML for each date group
    Object.keys(groupedByDate).forEach(date => {
        const logs = groupedByDate[date];
        const categoryIcon = logo ? getLogo(logs[0].category) : '';

        let html = `
            <div class="bg-white mx-2 mt-2 flex items-center flex-col">
                <div class="rounded-t-xl my-auto px-2 text-green-main font-black font-inter text-xl w-full">${date}</div>`;

        logs.forEach(log => {
            html += `
                    <div class="flex items-center justify-between w-full">
                    <div class="size-[60px] mx-4">
                        ${categoryIcon}
                    </div>
                    <div class="font-inter font-black flex text-md justify-between w-full text-lg">
                        <div class="text-green-accent text-opacity-7 capitalize">${log.name}</div>
                        <div class="text-green-accent">$ ${log.price}</div>
                    </div>
                </div>`;
        });

        html += `</div>`;

        $(`#${targetID}`).append(html);
    });
}

function displayUserTotal(spendingData) {
    total = 0
    spendingData.forEach(data => {
        total += parseFloat(data.price)
    })
    $("#total").text(`$${total}`)
}

function displayChart(spending_data) {
    spending_data.reverse()
    let userPriceArray = []
    let userPurchaseDateArray = []
    let total = 0
    const sevenDaysInMS = 604800000
    let dateLimit = Date.now() - sevenDaysInMS
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    spending_data.forEach(purchase => {
        let date = new Date(purchase.date)

        if (date >= dateLimit) {
            let purchaseDate = new Date(purchase.date)
            let purchaseDay = purchaseDate.getDate()
            let purchaseMonth = monthNames[purchaseDate.getMonth()]
            let purchaseYear = purchaseDate.getFullYear()
            let dateString = `${purchaseMonth}-${purchaseDay}-${purchaseYear}`
            // console.log(dateString)
            if (userPurchaseDateArray.includes(dateString)) {
                userPriceArray[userPriceArray.length - 1] += parseFloat(purchase.price)
            }
            else {
                userPriceArray.push(total += parseFloat(purchase.price))
                userPurchaseDateArray.push(dateString)
            }

        }

    })
    console.log(userPriceArray)
    // console.log(userPriceArray)
    // console.log(userPurchaseDateArray)
    chart.updateSeries([{
        data: userPriceArray
    }])
    chart.updateOptions({
        xaxis: {
            categories: userPurchaseDateArray
        }
    })

}

function queryUserData(userID, timeRange) {
    db.collection("users").doc(userID).collection("spending_data").orderBy("date").onSnapshot(snapshot => {
        let spendingData = [];
        snapshot.docs.forEach((doc) => {
            spendingData.push({ ...doc.data() });
        });
        spendingData = spendingData.reverse();
        $("#data_row").empty();
        $("#categories").empty();
        spendingData = filterByTimeRange(timeRange, spendingData);
        console.log(spendingData)
        displayUserData(spendingData, "data_row", true);
        displayUserTotal(spendingData)
        displayChart(spendingData);
    }, error => {
        console.error("Error getting spending data:", error);
    });
}



async function get_user_id() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // console.log(user.uid);
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

function toggleBarGraph() {
    ApexCharts.exec("mychart", 'updateOptions', {
        chart: {
            type: "bar"
        },
    })
}

function toggleLineGraph() {
    chart.updateOptions({
        chart: {
            type: "area"
        }

    })
}

async function setUp(userID) {
    queryUserData(userID, $('input[name="date-picker"]:checked').val());
    $("#Hamburger").on("click", hamburger_click_handler);
    $("#add").on("click", add);
    $("#desktop_add_btn").on("click", add);
    $("#save").on("click", () => {
        addData(userID);
    });
    $("#cancel").on("click", add);
    $("#barGraphButton").on("click", toggleBarGraph);
    $("#lineGraphButton").on("click", toggleLineGraph);
    $('input[name="date-picker"]').on('change', function() {
        queryUserData(userID, $(this).val());
    });

    // Michael ToDo:
    // ToDo: mobile navbar not working
    // ToDo: Add button on mobile and desktop not showing
    // ToDo: add $ sign to labels on charts
    // ToDo: About page
    // ToDo: fix lorem on landing page
}

$("document").ready(() => {
    get_user_id().then((userID) => {
        setUp(userID)
    })
});



