const options = {
    chart: {
        id: "mychart",
        height: "100%",
        maxWidth: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
            enabled: true,
        },
        toolbar: {
            show: true,
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
            opacityTo: 0.25,
            shade: "#6DB423",
            gradientToColors: ["#1C64F2"],
        },
    },
    dataLabels: {
        enabled: false,
        formatter: function (val, opts) {
            return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    stroke: {
        curve: "straight",
        width: 2,
    },
    grid: {
        show: true,
        strokeDashArray: 4,
    },

    series: [
        {
            name: "Total Spent",
            data: [],
            color: "#4A9B30",
        },
    ],
    xaxis: {
        type: "datetime",
        min: new Date(Date.now() - 604800000).getTime(),
        categories: [],
        labels: {
            show: true,
            rotate: 45,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: true,
        },
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        show: true,
    },
}

const chart = new ApexCharts(document.getElementById("area-chart"), options);
chart.render();

function hamburgerClickHandler() {
    console.log("inside hamburgerClickHandler");
    $("#dropdown").toggleClass("collapse");
}

function add() {
    if ($("#noCategorySelectedError").length === 0) {
        window.scrollTo(0, 0);
        console.log("Inside add function")
        $("#data_gui").toggleClass("collapse");
    }
}

function cancelAdd() {
    window.scrollTo(0, 0);
    console.log("Inside add function");
    $("#data_gui").toggleClass("collapse");
    $("#noCategorySelectedError").remove()
}

function filterByTimeRange(timeRange, dataList) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const dayOfWeek = currentDate.getDay();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dayOfMonth= currentDate.getDate();

    switch (timeRange) {
        case "week":
            const previousMonday = new Date(currentDate);
            if (dayOfWeek === 0) {
                previousMonday.setDate(dayOfMonth - 6);
            } else {
                previousMonday.setDate(dayOfMonth - dayOfWeek + 1);
            }
            return dataList.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= previousMonday && itemDate <= currentDate;
            });
        case "month":
            const firstDayOfMonth = new Date(year, month, 1);
            return dataList.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= firstDayOfMonth && itemDate <= currentDate;
            });
        case "year":
            const firstDayOfYear = new Date(year, 0, 1);
            return dataList.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= firstDayOfYear && itemDate <= currentDate;
            });
        case "all":
            return dataList;
        default:
            console.error("Invalid time range");
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
    var dataName = $("#data_name").val();
    var dataPrice = $("#data_price").val();
    var dataDate = $("#data_date").val();
    var userRef = db.collection("users").doc(userID);
    $("#data_name").val("");
    $("#data_price").val("");
    $("#data_date").val("");
    $("input[name='category']").prop("checked", false);

    if (category && dataPrice) {

        console.log("adding data to", userID, category, dataDate, dataName, dataPrice);
        var documentAttributes = {
            category: category,
            name: dataName,
            price: parseFloat(dataPrice).toFixed(2),
            date: dataDate
        };

        userRef.collection("spending_data").add(documentAttributes)
            .then(function (docRef) {
                console.log("Document added with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }
    else {
        if ($("#noCategorySelectedError").length <= 0) {
            $("#data_gui_container").append(`
                <div class='bg-white flex text-red-500 text-center items-center justify-center gap-1' id='noCategorySelectedError'>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-alert-circle" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                    </svg>
                    Please select a category
                </div>`)
            $("#data_gui").toggleClass("animate-error")
            setTimeout(() => {
                $("#data_gui").toggleClass("animate-error")
            }, 500);
        }

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
                                </svg>`;
            break;
        case "food":
            categoryIcon = `<svg xmlns="http://www.w3.org/2000/svg"
                    class=" size-full icon icon-tabler icon-tabler-tools-kitchen-2 stroke-gold-main" width="44" height="44"
                    viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
                </svg>`;
            break;
        case "clothing":
            categoryIcon = ` <svg xmlns="http://www.w3.org/2000/svg" class="stroke-gold-main size-full icon icon-tabler icon-tabler-shirt"
                    width="44" height="44" viewBox="0 0 24 24" stroke-width="2" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />
                </svg>`;
            break;
        case "selfCare":
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
                                </svg>`;
            break;
        case "onlineShopping":
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
                                </svg>`;
            break;
        case "school":
            categoryIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-gold-main size-full icon icon-tabler icon-tabler-school" width="44" height="44" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
                    <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
                    </svg>`;
            break;
        default:
            categoryIcon = null;
            break;
    }
    return categoryIcon;
}

function displayUserData(spendingData, targetID, logo) {
    const groupedByDate = {};
    Object.keys(spendingData).forEach(key => {
        const date = formatDate(spendingData[key].date);
        if (!groupedByDate[date]) {
            groupedByDate[date] = [];
        }
        groupedByDate[date].push(spendingData[key]);
    });
    Object.keys(groupedByDate).forEach(date => {
        const logs = groupedByDate[date];
        let html = `
                    <div class="bg-white mx-2 mt-2 flex items-center flex-col">
                        <div class="rounded-t-xl my-auto px-2 text-green-main font-black font-inter text-xl w-full">${date}</div>`;
        logs.forEach(log => {
            html += `
                    <div class="flex items-center justify-between w-full">
                        <input type="checkbox" id="${log.id}" class="peer hidden">
                        <label for="${log.id}" class=" ml-4 inline-block relative rounded-full h-3 w-4 border-2 border-gray-300 cursor-pointer peer-checked:border-gold-main peer-checked:bg-gold-main"></label>
                        <div class="size-[60px] mx-4">
                            ${getLogo(log.category)}
                        </div>
                        <div class="font-inter font-bold flex text-md justify-between w-full text-lg">
                            <div class="text-green-accent text-opacity-7 capitalize">${log.name}</div>
                            <div class="text-green-accent">$ ${log.price}</div>
                        </div>
                    </div>`;
        });
        html += `</div>`;
        $(`#${targetID}`).append(html);
    });

    $(`#${targetID}_form`).on("submit", function (event) {
        event.preventDefault();
        $(this).find('input[type="checkbox"]:checked').each(function () {
            getUserID().then(userID => {
                var spendingData = db.collection("users").doc(userID).collection("spending_data").doc($(this).attr('id'));
                spendingData.delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch(function (error) {
                    console.error("Error deleting document: ", error);
                });
            });
        });
    });

    // $("#data_row_form input[type='reset']").on("click", () => {
    //     $("#Delete").removeClass("animate-pulse");
    // });

    // $("#data_row :checkbox").on("change", () => {
    //     let amount = $('#data_row input[type="checkbox"]:checked').length;
    //     if (amount > 0) {
    //         console.log("At least one checkbox checked");
    //         $("#Delete").addClass("animate-pulse");
    //     } else {
    //         $("#Delete").removeClass("animate-pulse");
    //         console.log("No checkbox checked");
    //     }
    // });


}

function getUserTotal(spendingData) {
    total = 0;
    spendingData.forEach(data => {
        total += parseFloat(data.price);
    });
    return total.toFixed(2);
}

function displayChart(spendingData) {
    spendingData.reverse();
    let userPriceArray = [];
    let userPurchaseDateArray = [];
    let total = 0;
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    spendingData.forEach(purchase => {
        let date = new Date(purchase.date);
        let purchaseDate = new Date(purchase.date);
        let purchaseDay = purchaseDate.getDate();
        let purchaseMonth = monthNames[purchaseDate.getMonth()];
        let purchaseYear = purchaseDate.getFullYear();
        let dateString = `${purchaseMonth}-${purchaseDay}-${purchaseYear}`;
        // console.log(dateString)
        if (userPurchaseDateArray.includes(dateString)) {
            userPriceArray[userPriceArray.length - 1] += parseFloat(purchase.price);
        }
        else {
            total = 0;
            userPriceArray.push(total += parseFloat(purchase.price));
            userPurchaseDateArray.push(dateString);
        }
    });
    chart.updateSeries([{
        data: userPriceArray
    }]);
    chart.updateOptions({
        xaxis: {
            categories: userPurchaseDateArray
        }
    });
}

function queryUserData(userID, timeRange) {
    db.collection("users").doc(userID).collection("spending_data").orderBy("date").onSnapshot(snapshot => {
        let spendingData = [];
        snapshot.docs.forEach((doc) => {
            spendingData.push({ ...doc.data(), id: doc.id });
        });
        spendingData = spendingData.reverse(); // orders it by newest to oldest
        $("#data_row").empty();
        $("#categories").empty();

        spendingData = filterByTimeRange(timeRange, spendingData); // Changes changes the time range
        displayUserData(spendingData, "data_row", true);
        $("#total").text(`$${getUserTotal(spendingData)}`);
        displayChart(spendingData);
    }, error => {
        console.error("Error getting spending data:", error);
    });
}

async function getUserID() {
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

function toggleBarGraph() {
    ApexCharts.exec("mychart", 'updateOptions', {
        chart: {
            type: "bar"
        },
    });
}

function toggleLineGraph() {
    chart.updateOptions({
        chart: {
            type: "area"
        }
    });
}

async function setUp(userID) {
    queryUserData(userID, $('input[name="date-picker"]:checked').val());
    $("#add").on("click", add);
    $("#Hamburger").on("click", hamburgerClickHandler);
    $("#desktop_add_btn").on("click", add);
    $("#save").on("click", () => {
        addData(userID);
    });
    $("#cancel").on("click", cancelAdd);
    $("#barGraphButton").on("click", toggleBarGraph);
    $("#lineGraphButton").on("click", toggleLineGraph);
    $('input[name="date-picker"]').on('change', function () {
        console.log("Date range initiates new Data")
        queryUserData(userID, $(this).val());
    });

    // Michael ToDo:
    // ToDo: About page

}

$("document").ready(() => {
    getUserID().then((userID) => {
        setUp(userID);
    });
});
