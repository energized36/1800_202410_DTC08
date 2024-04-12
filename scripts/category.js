function hamburgerClickHandler() {
    console.log("inside hamburger_click_handler");
    $('#dropdown').toggleClass("collapse");
}



function filterByTimeRange(timeRange, dataList) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    switch (timeRange) {
        case "week":
            const today = currentDate.getDay();
            const previousMonday = new Date(currentDate);
            previousMonday.setDate(currentDate.getDate() - today + (today === 0 ? -6 : 1));

            return dataList.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= previousMonday && itemDate <= currentDate;
            });
        case "month":
            const firstDayOfMonth = new Date(year, month - 1, 1);
            return dataList.filter(item => new Date(item.date) >= firstDayOfMonth && new Date(item.date) <= currentDate);
        case "year":
            const firstDayOfYear = new Date(year, 0, 1);
            return dataList.filter(item => new Date(item.date) >= firstDayOfYear && new Date(item.date) <= currentDate);
        case "all":
            return dataList;
        default:
            console.error("Invalid time range");
            return [];
    }
}

function add() {
    window.scrollTo(0, 0);
    console.log("Inside add function");
    $("#data_gui").toggleClass("collapse");
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

function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
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
                <div class='bg-white flex text-red-500 text-center items-center justify-center gap-1 font-inter' id='noCategorySelectedError'>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-alert-circle" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                    </svg>
                    Please select a category / input price
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
                            </svg>`
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

        let html = `
            <div class="bg-white mx-2 mt-2 flex items-center flex-col">
                <div class="rounded-t-xl my-auto px-2 text-green-main font-black font-inter text-xl w-full">${date}</div>`;

        logs.forEach(log => {
            html += `
                    <div class="font-inter font-bold flex text-md justify-between w-full text-lg pl-8">
                        <div class="text-green-accent text-opacity-7 capitalize">${log.name}</div>
                        <div class="text-green-accent">$ ${log.price}</div>
                    </div>`;
        });

        html += `</div>`;

        $(`#${targetID}`).append(html);
    });
}

function displayCategories(spendingData) {
    const categoryTotals = {};
    let total = 0;
    spendingData.forEach(log => {
        if (Object.keys(log).length != 0) {
            const { category, price } = log;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            total += parseFloat(price);
            categoryTotals[category] += parseFloat(price);
        }
    });

    const categoryResults = Object.keys(categoryTotals).map(category => {
        const categoryTotal = categoryTotals[category];
        const percentage = Math.round((categoryTotal / total) * 100);
        return { category, total: categoryTotal, percentage };
    });

    categoryResults.sort((a, b) => b.total - a.total);

    categoryResults.forEach(category => {
        const adjustedPercentage = Math.max(category.percentage, 1);
        const categoryLogs = spendingData.filter(log => log.category === category.category);
        $("#categories").append(`
        <div id="${category.category}">
            <div class="flex justify-between items-baseline">
                <div class="size-16">${getLogo(category.category)}</div>
                <div class="font-inter font-bold text-green-main text-3xl">${adjustedPercentage}%</div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-8 bg-green-main overflow-clip">
                <div class=" bg-green-accent h-8 rounded-full" style="width: ${adjustedPercentage}%"></div>
            </div>
            <div id="${category.category}-total" class="font-inter font-bold text-green-main text-xl text-right">${category.total.toFixed(2)}</div>
            <div id="${category.category}-logs" class="max-h-[200px] overflow-y-auto -z-10"></div>
        </div>`);

        displayUserData(categoryLogs, `${category.category}-logs`, false);
    });
}

function getUserTotal(spendingData) {
    let total = 0;
    spendingData.forEach(data => {
        total += parseFloat(data.price);
    });
    return total.toFixed(2);
}

function queryUserData(userID, timeRange) {
    db.collection("users").doc(userID).collection("spending_data").orderBy("date").onSnapshot(snapshot => {
        let spendingData = [];
        snapshot.docs.forEach(doc => {
            spendingData.push({ ...doc.data() });
        });
        spendingData = spendingData.reverse();
        $(`#data_row`).empty();
        $("#categories").empty();
        spendingData = filterByTimeRange(timeRange, spendingData);
        displayCategories(spendingData);
        displayUserData(spendingData, "data_row", true);
        $("#total").text(`$${getUserTotal(spendingData)}`);
        console.log(spendingData)
    }, error => {
        console.error("Error getting spending data:", error);
    });
}

async function getUserId() {
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

function setUp(userID) {
    queryUserData(userID, $('input[name="date-picker"]:checked').val());
    $("#Hamburger").on("click", hamburgerClickHandler);
    $("#add").on("click", add);
    $("#desktop_add_btn").on("click", add);
    $("#save").on("click", () => {
        addData(userID);
    });
    $("#cancel").on("click", add);
    $('input[name="date-picker"]').on("change", function () {
        queryUserData(userID, $(this).val());
    });
}

$("document").ready(() => {
    getUserId().then(userID => {
        setUp(userID);
    });
});
