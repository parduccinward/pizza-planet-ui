/**
 * POST the order on /pizza
 * @param order 
 */

function postOrder(order) {

    fetch('http://127.0.0.1:5000/order/', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then(res => res.json())
        .then(res => showNotification());


}

/**
 * Get the form and submit it with fetch API
 */
let orderForm = $("#order-form");
orderForm.submit(event => {

    let order = getOrderData();
    postOrder(order);

    event.preventDefault();
    event.currentTarget.reset();
});

/**
 * Gets the order data with JQuery
 */
function getOrderData() {
    let ingredients = [];
    $.each($("input[name='ingredients']:checked"), function (el) {
        ingredients.push($(this).val());
    });

    let beverages = [];

    $(".beverage-selector").each(function() {
        const selectedValue = $(this).find("option:selected").val();
        const numberOfBeverages = parseInt($(this).closest("tr").find(".beverage-number-input").val());
        if (selectedValue) {
            for(indexBeverages=0; indexBeverages<numberOfBeverages; indexBeverages++){
                beverages.push(selectedValue);
            }
        }
    });

    return {
        client_name: $("input[name='name']").val(),
        client_dni: $("input[name='dni']").val(),
        client_address: $("input[name='address']").val(),
        client_phone: $("input[name='phone']").val(),
        size_id: $("input[name='size']:checked").val(),
        ingredients,
        beverages
    };
}

/**
 * Shows a notification when the order is accepted
 */
function showNotification() {
    let orderAlert = $("#order-alert");
    orderAlert.toggle();
    setTimeout(() => orderAlert.toggle(), 5000);
}


// Gather information in a dynamic way

function fetchIngredients() {
    fetch('http://127.0.0.1:5000/ingredient/')
        .then(response => response.json())
        .then(ingredients => {
            let rows = ingredients.map(element => createIngredientTemplate(element));
            let table = $("#ingredients tbody");
            table.append(rows);
        });
}

function fetchOrderSizes() {
    fetch('http://127.0.0.1:5000/size/')
        .then(response => response.json())
        .then(sizes => {
            let rows = sizes.map(element => createSizeTemplate(element));
            let table = $("#sizes tbody");
            table.append(rows);
        });
}

function fetchOrderBeverages() {
    let beveragesData = [];

    fetch('http://127.0.0.1:5000/beverage/')
        .then(response => response.json())
        .then(beverages => {
            beveragesData = beverages;
            const selectElement = selectTemplate.content.querySelector('select');
            addBeverageOptionsToSelect(beveragesData, selectElement);
        });

    function addBeverageOptionsToSelect(beverageData, selectElement) {
        beverageData.forEach((beverage) => {
            const optionElement = document.createElement("option");
            optionElement.value = beverage._id;
            optionElement.textContent = `${beverage.name} ${beverage.size} - $${beverage.price}`;
            selectElement.appendChild(optionElement);
        });
    }

    const table = document.querySelector('#beverages tbody');
    const rowTemplate = document.querySelector('#row-template');
    const addRowBtn = document.querySelector('#add-row-btn');

    addRowBtn.addEventListener('click', () => {
        const newRow = rowTemplate.content.cloneNode(true);
        const selectElement = newRow.querySelector('select');
        addBeverageOptionsToSelect(beveragesData, selectElement);;
        table.appendChild(newRow);
    });
}

function createIngredientTemplate(ingredient) {
    let template = $("#ingredients-template")[0].innerHTML;
    return Mustache.render(template, ingredient);
}

function createSizeTemplate(size) {
    let template = $("#sizes-template")[0].innerHTML;
    return Mustache.render(template, size);
}

function createBeverageTemplate(beverage) {
    let template = $("#beverages-template")[0].innerHTML;
    return Mustache.render(template, beverage);
}

function loadInformation() {
    fetchIngredients();
    fetchOrderSizes();
    fetchOrderBeverages();
}


window.onload = loadInformation;