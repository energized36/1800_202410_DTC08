// Displays hamburger menu when hamburger is clicked
function hamburgerClickHandler() {
    console.log("inside hamburger_click_handler");
    $('#dropdown').toggleClass("collapse");
}

// Displays the menu to add a new transaction entry
function add() {
    window.scrollTo(0, 0);
    console.log("Inside add function");
    $("#data_gui").toggleClass("collapse");
}

/**
 * Filter the given data list based on the specified time range.
 * @param {string} timeRange - The time range to filter by (e.g., "week", "month", "year", "all").
 * @param {Array} dataList - The array of objects containing data to filter.
 * @returns {Array} - The filtered array of objects based on the specified time range.
 */
function filterByTimeRange(timeRange, dataList) {

    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Extract current day, month, and year
    const dayOfWeek = currentDate.getDay();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dayOfMonth = currentDate.getDate();

    // Switch based on the specified time range
    switch (timeRange) {
        case "week":
            // Calculate the date of the previous Monday
            const previousMonday = new Date(currentDate);
            if (dayOfWeek === 0) {
                // If today is Sunday, set the date to 6 days ago (previous Monday)
                previousMonday.setDate(dayOfMonth - 6);
            } else {
                // Otherwise, set the date to the Monday of the current week
                previousMonday.setDate(dayOfMonth - dayOfWeek + 1);
            }
            // Filter the data list to include only items within the current week
            return dataList.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= previousMonday && itemDate <= currentDate;
            });
        case "month":
            // Calculate the date of the first day of the current month
            const firstDayOfMonth = new Date(year, month, 1);
            // Filter the data list to include only items within the current month
            return dataList.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= firstDayOfMonth && itemDate <= currentDate;
            });
        case "year":
            // Calculate the date of the first day of the current year
            const firstDayOfYear = new Date(year, 0, 1);
            // Filter the data list to include only items within the current year
            return dataList.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= firstDayOfYear && itemDate <= currentDate;
            });
        case "all":
            // Return the entire data list without filtering
            return dataList;
        default:
            // If an invalid time range is provided, log an error and return an empty array
            console.error("Invalid time range");
            return [];
    }
}

/**
 * Format the given date string based on its relation to the current date.
 * If the date is today, returns "Today".
 * If the date is yesterday, returns "Yesterday".
 * Otherwise, returns the date in a medium date style format. ex Mar 4, 2024
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(dateString) {
    // Convert the date string to a Date object
    const date = new Date(dateString);

    // Get today's date
    const todaysDate = new Date();

    // Get yesterday's date
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

    // Check if the date is today
    if (date.getDate() === todaysDate.getDate() &&
        date.getMonth() === todaysDate.getMonth() &&
        date.getFullYear() === todaysDate.getFullYear()) {
        return "Today";
    }

    // Check if the date is yesterday
    if (date.getDate() === yesterdaysDate.getDate() &&
        date.getMonth() === yesterdaysDate.getMonth() &&
        date.getFullYear() === yesterdaysDate.getFullYear()) {
        return "Yesterday";
    }

    // If the date is not today or yesterday, format it using the medium date style
    return date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

/**
 * Add spending data to the database for the specified user.
 * @param {string} userID - The ID of the user.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function addData(userID) {
    // Get the selected category, data name, price, and date from the input fields
    var category = $("input[name='category']:checked").val();
    var dataName = $("#data_name").val();
    var dataPrice = $("#data_price").val();
    var dataDate = $("#data_date").val();
    
    // Reference to the user's document in the database
    var userRef = db.collection("users").doc(userID);

    // Clear input fields
    $("#data_name").val("");
    $("#data_price").val("");
    $("#data_date").val("");
    $("input[name='category']").prop("checked", false);

    // Check if category and price are provided
    if (category && dataPrice) {
        // Log adding data
        console.log("Adding data to", userID, category, dataDate, dataName, dataPrice);
        
        // Document attributes to be added to the spending_data collection
        var documentAttributes = {
            category: category,
            name: dataName,
            price: parseFloat(dataPrice).toFixed(2),
            date: dataDate
        };

        // Add document to the spending_data collection
        return userRef.collection("spending_data").add(documentAttributes)
            .then(function (docRef) {
                console.log("Document added with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    } else {
        // Display error message if category or price is missing
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
    // Trigger add function to display the input menu
    add();
}


/**
 * Return a SVG icon based on the provided category name.
 * @param {string} name - The name of the category.
 * @returns {string|null} - The SVG icon as a string or null if the category is not recognized.
 */
function getLogo(name) {
    let categoryIcon;

    // Selects an SVG icon based on the category name
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


/**
 * Display user spending data grouped by date.
 * @param {Object} spendingData - The user's spending data.
 * @param {string} targetID - The ID of the HTML element where the data will be displayed.
 * @param {boolean} logo - Option to display Logos.
 */
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

        // Generate HTML for each spending log in the group
        logs.forEach(log => {
            html += `
                    <div class="font-inter font-bold flex text-md justify-between w-full text-lg pl-8">
                        <div class="text-green-accent text-opacity-7 capitalize">${log.name}</div>
                        <div class="text-green-accent">$ ${log.price}</div>
                    </div>`;
        });

        html += `</div>`;

        // Append the generated HTML to the target element
        $(`#${targetID}`).append(html);
    });
}


/**
 * Display spending categories with totals and percentages.
 * @param {Array} spendingData - The user's spending data.
 */
function displayCategories(spendingData) {
    const categoryTotals = {};
    let total = 0;

    // Calculate total spending and category totals
    spendingData.forEach(log => {
        if (Object.keys(log).length !== 0) {
            const { category, price } = log;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            total += parseFloat(price);
            categoryTotals[category] += parseFloat(price);
        }
    });

    // Calculate percentage of total spending for each category
    const categoryResults = Object.keys(categoryTotals).map(category => {
        const categoryTotal = categoryTotals[category];
        const percentage = Math.round((categoryTotal / total) * 100);
        return { category, total: categoryTotal, percentage };
    });

    // Sort categories by total spending
    categoryResults.sort((a, b) => b.total - a.total);

    // Display each category with its percentage, total spending, and logs
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

        // Display logs for the current category
        displayUserData(categoryLogs, `${category.category}-logs`, false);
    });
}


// Takes all of users spending data and returns the accumulated total
function getUserTotal(spendingData) {
    let total = 0;
    spendingData.forEach(data => {
        total += parseFloat(data.price);
    });
    return total.toFixed(2);
}

/**
 * Retrieves user data based on the specified time range and updates the UI accordingly.
 * 
 * @param {string} userID - The ID of the user whose data is being retrieved.
 * @param {string} timeRange - The time range for filtering the data (week, month, year, all).
 * @returns {void}
 */
function queryUserData(userID, timeRange) {
    // Firestore query to retrieve spending data
    db.collection("users").doc(userID).collection("spending_data").orderBy("date").onSnapshot(snapshot => {
        let spendingData = [];
        snapshot.docs.forEach(doc => {
            spendingData.push({ ...doc.data() });
        });
        spendingData = spendingData.reverse(); // Orders the data from newest to oldest
        $(`#data_row`).empty(); // Clear existing data from the DOM
        $("#categories").empty(); // Clear existing category data from the DOM
        
        // Filter the spending data based on the specified time range
        spendingData = filterByTimeRange(timeRange, spendingData);
        
        // Display spending categories with totals and percentages
        displayCategories(spendingData);
        
        // Display filtered spending data in the UI
        displayUserData(spendingData, "data_row", true);
        
        // Update the total amount displayed in the UI
        $("#total").text(`$${getUserTotal(spendingData)}`);
        
        console.log(spendingData);
    }, error => {
        console.error("Error getting spending data:", error);
    });
}


// Retrieves user ID
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


/**
 * Sets up event listeners and initializes UI based on user ID.
 * 
 * @param {string} userID - The ID of the user for setting up the UI.
 * @returns {void}
 */
function setUp(userID) {
    // Query user data and initialize UI based on selected date range
    queryUserData(userID, $('input[name="date-picker"]:checked').val());
    
    // Event listener for the hamburger icon
    $("#Hamburger").on("click", hamburgerClickHandler);
    
    // Event listener for the "Add" button
    $("#add").on("click", add);
    
    // Event listener for the "Add" button in desktop view
    $("#desktop_add_btn").on("click", add);
    
    // Event listener for the "Save" button
    $("#save").on("click", () => {
        addData(userID);
    });
    
    // Event listener for the "Cancel" button
    $("#cancel").on("click", add);
    
    // Event listener for changes in date picker selection
    $('input[name="date-picker"]').on("change", function () {
        // Query user data based on the selected date range
        queryUserData(userID, $(this).val());
    });
}


// When document is loaded, pass user ID to setup function above
$("document").ready(() => {
    getUserId().then(userID => {
        setUp(userID);
    });
});
