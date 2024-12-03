// Handle accordion personal cart opening and closing

document.querySelectorAll('.personalCartSummary').forEach(summary => {
    summary.addEventListener('click', function () {
        const personalCart = this.closest('.personalCart');
        const dropdown = personalCart.querySelector('.personalCartDropdown');

        if (personalCart.classList.contains('expanded')) {
            // Collapse
            dropdown.style.maxHeight = '0';
            dropdown.style.padding = '0 20px';
            dropdown.style.width = '';
        } else {
            // Expand
            dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
            dropdown.style.padding = '20px 20px';
            dropdown.style.width = 'auto';
        }

        personalCart.classList.toggle('expanded');
    });
});

// Handle not toggling the accordion menu when clicking on the confirmation button

// Select all Confirm buttons
document.querySelectorAll('.cartConfirmButton').forEach(button => {
    button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevents the event from bubbling up
    });
});

// Retrieve the json file for the shops
fetch('http://localhost:8080/api/shops')
    .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error. Status code: ${response.status}');
            }
            return response.json();
        })
    .then(data => {
        sessionStorage.setItem('shops', JSON.stringify(data)); // Save shop to string
        }
    );

// Retrieve the json file for the items
fetch('http://localhost:8080/api/items')
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error. Status code: ${response.status}');
        }
        return response.json();
    })
    .then(data => {
            sessionStorage.setItem('items', JSON.stringify(data)); // Save shop to string
        }
    );

// Retrieve the selected shop
if((selectedShop = JSON.parse(localStorage.getItem('selectedShop'))) === null){
    fetch('http://localhost:8080/api/selectedShop')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error. Status code: ${response.status}');
            }
            return response.json();
        })
        .then(data => {
                sessionStorage.setItem('selectedShop', JSON.stringify(data)); // Save selectedShop to string
            }
        );
}

// Get the currently selected ID (from the shopping page) - If no ID is selected, can only view the cart without mods
const selectedID = JSON.parse(localStorage.getItem('selectedID'));

// Render carts not selected

const jsonData = {
    "2": {
        "firstname": "John",
        "lastname": "Davis",
        "cart": {
            "15": {
                "name": "Potatoes",
                "description": "Lorem ipsum",
                "image_link": "https://example.com/image.png",
                "price": 1.79,
                "quantity": 2
            },
            "27": {
                "name": "Carrots",
                "description": "Lorem ipsum 2",
                "image_link": "https://example.com/image2.png",
                "price": 2.50,
                "quantity": 1
            }
        }
    }
};

// Function to render the data
function renderCartData(data, id) {
    let personalSubtotal = calculatePersonalCartTotal(data.cart);

    const container = document.createElement("div");
    container.classList.add("personalCart", "layer1container");
    if (selectedID === id){
        container.classList.add("expanded");
    }
    // Create summary section
    const summaryDiv = document.createElement("div");
    summaryDiv.classList.add("personalCartSummary");
    if (selectedID === id && data.selected === "True"){
        summaryDiv.innerHTML = `
            <span class="dropdownIcon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </span>
            <h3 class="cartPersonName">${data.firstname+" "+data.lastname}</h3>
            <h4 class="cartPersonTotal">£${personalSubtotal.toFixed(2)+personalDeliveryFeeSplit.toFixed(2)}</h4>
            <button class="cartConfirmButton layer2container buttonText currentUserConfirmButton confirmed confirmButton">Confirmed</button>
          `;
    } else if (selectedID === id && data.selected === "False"){
        summaryDiv.innerHTML = `
            <span class="dropdownIcon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </span>
            <h3 class="cartPersonName">${data.firstname+" "+data.lastname}</h3>
            <h4 class="cartPersonTotal">£${personalSubtotal.toFixed(2)+personalDeliveryFeeSplit.toFixed(2)}</h4>
            <button class="cartConfirmButton layer2container buttonText currentUserConfirmButton confirmButton">Confirm Order</button>
          `;
    } else if (selectedID !== id && data.selected === "True") {
        summaryDiv.innerHTML = `
            <span class="dropdownIcon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </span>
            <h3 class="cartPersonName">${data.firstname + " " + data.lastname}</h3>
            <h4 class="cartPersonTotal">£${personalSubtotal.toFixed(2) + personalDeliveryFeeSplit.toFixed(2)}</h4>
            <button class="cartConfirmButton layer2container buttonText confirmed confirmButton">Confirmed</button>
          `;
    } else {
        summaryDiv.innerHTML = `
            <span class="dropdownIcon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </span>
            <h3 class="cartPersonName">${data.firstname + " " + data.lastname}</h3>
            <h4 class="cartPersonTotal">£${personalSubtotal.toFixed(2) + personalDeliveryFeeSplit.toFixed(2)}</h4>
            <button class="cartConfirmButton layer2container buttonText confirmButton">Awaiting Confirmation</button>
          `;
    }
    container.appendChild(summaryDiv);

    // Handle confirmation toggle

    const confirmationButton = summaryDiv.getElementsByClassName("currentUserConfirmButton");
    confirmationButton.addEventListener("click", () => {
        let confirmStatus = toggleConfirmStatus(id);
        if (confirmStatus === "True"){
            confirmationButton.innerText = "Confirmed";
            confirmationButton.classList.add("confirmed");
        } else{
            confirmationButton.innerText = "Confirm";
            confirmationButton.classList.remove("confirmed");
        }
    });


    // Create the dropdown section
    const dropdownDiv = document.createElement("div");
    dropdownDiv.classList.add("personalCartDropdown");

    // Create the item list
    const itemList = document.createElement("div");
    itemList.classList.add("itemList");

    // Loop through cart items
    for (const [key, item] of Object.entries(data.cart)) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("itemContainer", "layer2container");
        if (selectedID === id){
            itemDiv.innerHTML = `
              <div class="itemImageContainer layer3container">
                  <div class="itemImage" style="background-image: url('${item.image_link}');"></div>
              </div>
              <div class="itemMeta">
                  <h4 class="itemName">${item.name}</h4>
                  <p class="itemDescription">${item.description}</p>
              </div>
              <span class="itemPrice itemPriceText">£${item.price.toFixed(2)}</span>
              <label>Quantity: <input type="number" class="itemQuantity layer3container" name="quantity" min="1" max="99" value="${item.quantity}" data-itemid="${key}"></label>
              <input type="submit" class="removeButton buttonText layer3container" value="Remove" data-itemid="${key}">
            `;
        } else {
            itemDiv.innerHTML = `
              <div class="itemImageContainer layer3container">
                  <div class="itemImage" style="background-image: url('${item.image_link}');"></div>
              </div>
              <div class="itemMeta">
                  <h4 class="itemName">${item.name}</h4>
                  <p class="itemDescription">${item.description}</p>
              </div>
              <span class="itemPrice itemPriceText">£${item.price.toFixed(2)}</span>
              <label>Quantity: <input type="number" class="itemQuantity layer3container" name="quantity" min="1" max="99" value="${item.quantity}" disabled></label>
            `;
        }
        itemList.appendChild(itemDiv);

        // Handle quantity updates

        const quantityInput = itemDiv.querySelector(".itemQuantity");
        quantityInput.addEventListener("change", async (event) => {
            const newQuantity = event.target.value;
            const itemId = event.target.getAttribute("data-itemid");

            // Call the quantity update function
            const isUpdated = await updateQuantity(id, itemId, newQuantity);

            if (isUpdated) {
                console.log(`Quantity for item ${itemId} updated to ${newQuantity}`);
                personalSubtotal = calculatePersonalCartTotal(data.cart);
            } else {
                console.error(`Failed to update quantity for item ${itemId}`);
            }
        });

        // Handle item Removal
        const removeButton = itemDiv.getElementsByClassName("removeButton");
        removeButton.addEventListener("click", async (event) => {
            const itemId = event.target.getAttribute("data-itemid");
            const isRemoved = await removeItem(id, itemId);
            if (isRemoved){
                console.log(`Removed item${itemId}`);
                loadCartPage();
            }
        })
    }
    dropdownDiv.appendChild(itemList);

    // Add the checkout section
    const checkoutWrapper = document.createElement("div");
    checkoutWrapper.classList.add("personalCartCheckoutWrapper");
    checkoutWrapper.innerHTML = `
    <div class="personalCartCheckout">
        <div class="personalCartTotal personalCartTotalItem">
            <span class="personalCartTotalName">Cart Total</span>
            <span class="personalCartTotalResult">£${personalSubtotal.toFixed(2)}</span>
        </div>
        <div class="personalDeliveryFee personalCartTotalItem">
            <span class="personalDeliveryFeeName">Delivery Fee Split</span>
            <span class="personalDeliveryFeeResult">£${personalDeliveryFeeSplit.toFixed(2)}</span>
        </div>
        <hr class="personalDivider ">
        <div class="personalTotal personalCartTotalItem">
            <span class="personalTotalName">Your Total</span>
            <span class="personalTotalResult">£${personalSubtotal.toFixed(2)+personalDeliveryFeeSplit.toFixed(2)}</span>
        </div>
    </div>
  `;
    dropdownDiv.appendChild(checkoutWrapper);

    container.appendChild(dropdownDiv);

    // Append the constructed cart to the body or a specific container
    const personalCartsDiv = document.getElementById("personalCarts")
    personalCartsDiv.appendChild(container);
}

function renderCheckoutData(data){

}

// Input: Cart Items list
// Output: Total Price for list of items
function calculatePersonalCartTotal(data) {
    let total = 0.00;
    for (const [key, item] of Object.entries(data.cart)) {
        total += item.price;
    }
    return total;
}

function calculateDeliveryFeeSplit(){

}

function updateQuantity(id, itemId, newQuantity) {

}

function removeItem(id, itemId){

}

function toggleConfirmStatus(id){

}



function loadCartPage(){

}