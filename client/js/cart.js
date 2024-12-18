total = 0;
subtotals = {}; 

function renderHero(shopName, shopImage, shopColor) {
  const shopBackground = document.getElementById("shopLogoBackground");
  shopBackground.style.backgroundColor = `#${shopColor}`;
  const shopLogo = document.getElementById("shopLogo");
  shopLogo.style.backgroundImage = `url(${shopImage})`;
  shopLogo.alt = `${shopName} Logo`;
}

function renderCart(
  userId,
  firstname,
  lastname,
  cartInfo,
  deliveryFeeSplit,
  cartSubtotal,
  confirmed
) {
  const container = document.createElement("div");
  container.classList.add("personalCart", "layer1container");
  container.id = userId;
  const summaryDiv = document.createElement("div");
  summaryDiv.classList.add("personalCartSummary");
  summaryDiv.id = userId;
  summaryDiv.innerHTML = `
        <span class="dropdownIcon">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-360 280-560h400L480-360Z"/></svg>
        </span>
        <h3 class="cartPersonName">${firstname + " " + lastname}</h3>
        <h4 class="cartPersonTotal">£${cartSubtotal.toFixed(2)}</h4>
        <button class="cartConfirmButton layer2container buttonText ${
          confirmed ? "confirmed" : ""
        } confirmButton" disabled>
        ${confirmed ? "Confirmed" : "Awaiting Confirmation"}
        </button>
    `;
  container.appendChild(summaryDiv);

  // Handle the confirm button
  const confirmButton = summaryDiv.getElementsByClassName("cartConfirmButton")[0];
  confirmButton.addEventListener("click", async () => {
    console.log(`Confirming cart for user ${userId}`);
    const originalText = confirmButton.innerText;
    const originalBackgroundColor = confirmButton.style.backgroundColor;
    const originalColor = confirmButton.style.color;
    const isConfirmed = await getAPIRequest("getCart/updateStatus", `userId=${userId}`);
    if (isConfirmed) {
      console.log(`Confirmed cart for user ${userId}`);
      confirmButton.classList.add("confirmed");
      confirmButton.innerText = "Unconfirm";
      showNotification("success", `Confirmed cart for ${firstname} ${lastname}`);
    } else if (isConfirmed === false) {
      console.log(`Unconfirmed cart for user ${userId}`);
      confirmButton.classList.remove("confirmed");
      confirmButton.innerText = "Confirm";
      showNotification("success", `Unconfirmed cart for ${firstname} ${lastname}`);
    } else {
      console.error(`Failed to confirm cart for user ${userId}`);
      showNotification("error", `Failed to confirm cart for ${firstname} ${lastname}`);
      confirmButton.innerText = "Failed to Confirm";
      confirmButton.style.backgroundColor = "#AF0F0F";
      confirmButton.style.color = "#FFFFFF";
      confirmButton.disabled = true;
      setTimeout(() => {
        confirmButton.innerText = originalText;
        confirmButton.style.backgroundColor = originalBackgroundColor;
        confirmButton.style.color = originalColor;
        confirmButton.disabled = false;
      }, 2000);
    }
  });

  // Accordian dropdown functionality
  summaryDiv.addEventListener("click", () => {
    container.classList.toggle("expanded");
  });

  // Create the dropdown section
  const dropdownDiv = document.createElement("div");
  dropdownDiv.classList.add("personalCartDropdown");

  // Create the item list
  const itemList = document.createElement("div");
  itemList.classList.add("itemList");

  // Loop through cart items
  for (let i = 0; i < cartInfo.length; i++) {
    const item = cartInfo[i];
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("itemContainer", "layer2container");
    itemDiv.innerHTML = `
              <div class="itemImageContainer layer3container">
                  <div class="itemImage" style="background-image: url('${
                    item.ImageLink
                  }');"></div>
              </div>
              <div class="itemMeta">
                  <h4 class="itemName">${item.ItemName}</h4>
                  <p class="itemDescription">${item.ItemDescription}</p>
              </div>
              <span class="itemPrice itemPriceText">£${item.ItemCost.toFixed(2)}</span>
              <label>Quantity: <input type="number" class="itemQuantity layer3container" name="quantity" min="1" max="99" value="${
                item.Quantity
              }" disabled data-itemid="${item._id}"></label>
              <input type="submit" class="removeButton buttonText layer3container" value="Remove" disabled data-itemid="${item._id}">
            `;
    itemList.appendChild(itemDiv);

    // Handle quantity updates
    const quantityInput = itemDiv.querySelector(".itemQuantity");
    quantityInput.addEventListener("change", async (event) => {
      let newQuantity = event.target.value;
      isNewQuantity = await getAPIRequest("getCart/updateQuantity", `userId=${userId}&itemId=${item._id}&quantity=${newQuantity}`);
      if (newQuantity) {
        showNotification("success", `${item.ItemName} quantity updated to ${newQuantity}`);
        console.log(`Quantity for item ${item._id} updated to ${newQuantity}`);
        refreshCart();
      } else {
        showNotification("error", `Failed to update quantity for ${item.ItemName}`);
        console.error(`Failed to update quantity for item ${item._id}`);
        refreshCart();
      }
    });

    // Handle item Removal
    const removeButton = itemDiv.querySelector(".removeButton");
    removeButton.addEventListener("click", async (event) => {
      console.log(`Removing item ${item._id}`);
      const isRemoved = await getAPIRequest("getCart/deleteItem", `userId=${userId}&itemId=${item._id}`);
      if (isRemoved) {
        showNotification("success", `Removed item ${item.ItemName}`);
        console.log(`Removed item ${item._id}`);
        itemDiv.remove();
        refreshCart();
      } else {
        showNotification("error", `Failed to remove item ${item.ItemName}`);
        console.error(`Failed to remove item ${item._id}`);
        refreshCart();
      }
    });
  }
  dropdownDiv.appendChild(itemList);

  // Add the checkout section
  const checkoutWrapper = document.createElement("div");
  checkoutWrapper.classList.add("personalCartCheckoutWrapper");
  checkoutWrapper.innerHTML = `
    <div class="personalCartCheckout">
        <div class="personalCartTotal personalCartTotalItem">
            <span class="personalCartTotalName">Cart Total</span>
            <span class="personalCartTotalResult">£${parseFloat(cartSubtotal).toFixed(2)}</span>
        </div>
        <div class="personalDeliveryFee personalCartTotalItem">
            <span class="personalDeliveryFeeName">Delivery Fee Split</span>
            <span class="personalDeliveryFeeResult">£${parseFloat(deliveryFeeSplit).toFixed(2)}</span>
        </div>
        <hr class="personalDivider ">
        <div class="personalTotal personalCartTotalItem">
            <span class="personalTotalName">Your Total</span>
            <span class="personalTotalResult">£${
              (parseFloat(cartSubtotal) + parseFloat(deliveryFeeSplit)).toFixed(2)
            }</span>
        </div>
    </div>
  `;
  dropdownDiv.appendChild(checkoutWrapper);

  container.appendChild(dropdownDiv);

  // Append the constructed cart to the body or a specific container
  const personalCartsDiv = document.getElementById("personalCarts");
  personalCartsDiv.appendChild(container);
}

function renderErrorCart(errorCode, errorMessage) {
  const container = document.createElement("div");
  container.classList.add("errorCart", "layer1container");
  container.innerHTML = `
        <div class="infoCartWrapper">
            <div class="infoCartSummary">
                <h2 class="infoCartHeading">Error: ${errorCode}</h2>
                <span class="infoCartMessage">${errorMessage}</span>
                <img id="errorImage" src="assets/errorimg.png" alt="Error Image">
                <button class="infoCartButton" class="button">Reload Cart</button>
            </div>
        </div>
    `;
  document.getElementById("personalCarts").appendChild(container);

  document
    .getElementsByClassName("errorButton")
    .addEventListener("click", () => location.reload());
}

function renderEmptyCart() {
  const container = document.createElement("div");
  container.classList.add("emptyCart", "layer1container");
  container.innerHTML = `
        <div class="infoCartWrapper">
            <div class="infoCartSummary">
                <h2 class="infoCartHeading">The Cart is Empty</h2>
                <span class="infoCartMessage">Head back to the shopping page and add items.</span>
                <a href="shop.html"><button class="infoCartButton" class="button">Back to Shopping</button></a>
            </div>
        </div>
    `;
    document.getElementById("personalCarts").appendChild(container);
  personalCartsDiv.appendChild(container);
}

function modifySelectedCart(userId) {
  const personalCartsDiv = document.getElementById("personalCarts");
  const personalCarts = document.getElementById(userId);
  if (!personalCarts) {
    return;
  }

  // Move the selected cart to the top of the list
  if (personalCartsDiv.firstChild !== personalCarts) {
    personalCartsDiv.insertBefore(personalCarts, personalCartsDiv.firstChild);
  }

  personalCarts.classList.add("expanded");

  const summaryDiv = personalCarts.getElementsByClassName("personalCartSummary")[0];
  const dropdownDiv = personalCarts.getElementsByClassName("personalCartDropdown")[0];
  const confirmButton = summaryDiv.getElementsByClassName("cartConfirmButton")[0];
  const dropdownItems = dropdownDiv.getElementsByClassName("itemContainer");

  confirmButton.disabled = false;
  confirmButton.classList.add("currentUserConfirmButton");
  if (confirmButton.classList.contains("confirmed")) {
    confirmButton.innerText = "Unconfirm Order";
  } else {
    confirmButton.innerText = "Confirm Order";
  }

  for (let j = 0; j < dropdownItems.length; j++) {
    const item = dropdownItems[j];
    const quantityInput = item.getElementsByClassName("itemQuantity")[0];
    const removeButton = item.getElementsByClassName("removeButton")[0];
    quantityInput.disabled = false;
    removeButton.disabled = false;
  }
}

function renderCheckout(subtotal, deliveryFee) {
  const checkoutDiv = document.getElementById("checkout");
  checkoutDiv.innerHTML = `
        <hr id="checkoutDivider">
        <div id="checkoutWrapper">
            <div id="checkoutSide">
                <div id="cartTotal" class="checkoutItem">
                    <h4 id="cartTotalName">
                        Cart Total:
                    </h4>
                    <h4 id="cartTotalResult">£${subtotal.toFixed(2)}</h4>
                </div>
                <div id="deliveryFeeTotal" class="checkoutItem">
                    <h4 id="deliveryFeeTotalName">
                        Delivery Fee:
                    </h4>
                    <h4 id="deliveryFeeTotalResult">£${deliveryFee.toFixed(2)}</h4>
                </div>
                <div id="totalPrice" class="checkoutItem">
                    <h3 id="totalPriceTotal">Total</h3>
                    <h3 id="totalPriceResult">£${(parseFloat(subtotal) + parseFloat(deliveryFee)).toFixed(2)}</h3>
                </div>
            </div>
    `;
}

function calculatePersonalCartSubtotal(cart) {
  let total = 0.0;
  cart.forEach((item) => {
      total += item.ItemCost * item.Quantity;
  });
  return total;
}

async function getAPIRequest(endpoint, data) {
  try {
    const response = await axios.get(`http://localhost:5500/${endpoint}/?${data}`);
    console.log(`Successfully sent data for API ${endpoint}:`, response.data.data);
    return response.data.data;
  } catch (error) {
    if (error.response) {
      renderErrorCart(error.response.status, error.message);
    } else {
      showNotification("error", "Failed to connect to the server");
      renderErrorCart(500, "Internal Server Error");
    }
    showNotification("error", `Failed to send data for API ${endpoint}: ${error}`);
    console.error(`Failed to send data for API ${endpoint}:`, error);
  }
}

async function refreshCart(){
  const scrollPosition = window.scrollY;
  let carts = await getAPIRequest("getCart", "");
  let shop = await getAPIRequest("getCart/getSelectedShop", "");
  const deliveryFeeSplit = (shop.shop.DeliveryPrice / carts.people.length).toFixed(2);
  let cartsSubtotal = 0;
  document.getElementById("personalCarts").innerHTML = ""; // Clear the current cart content
  carts.people.forEach((cart) => {
    let subtotal = calculatePersonalCartSubtotal(JSON.parse(cart.Cart));
    cartsSubtotal += subtotal;
    renderCart(
      cart._id,
      cart.FirstName,
      cart.Surname,
      JSON.parse(cart.Cart),
      deliveryFeeSplit,
      subtotal,
      cart.Confirmed
    );
  });
  let selectedID = localStorage.getItem("selectedID");
  modifySelectedCart(selectedID);
  renderCheckout(cartsSubtotal, shop.shop.DeliveryPrice);

  window.scrollTo(0, scrollPosition); // Restore the scroll position
}

// On page load, build the cart page
document.addEventListener("DOMContentLoaded", async function () {
  showNotification("info", "Loading cart...");
  let carts = await getAPIRequest("getCart", "");
  if (carts.people.length === 0) {
    // If there are no user's in the cart, render the empty cart HTML
    renderEmptyCart();
  } else {
    let shop = await getAPIRequest("getCart/getSelectedShop", "");
    renderHero(shop.shop.shopName, shop.shop.DeliveryLogo, shop.shop.Colour);
    const deliveryFeeSplit = (shop.shop.DeliveryPrice / carts.people.length).toFixed(2);
    let cartsSubtotal = 0;
    // For each user with items in the cart, render their personal cart
    carts.people.forEach(async (cart) => {
      let subtotal = calculatePersonalCartSubtotal(JSON.parse(cart.Cart));
      cartsSubtotal += subtotal;
      
      await renderCart(
        cart._id,
        cart.FirstName,
        cart.Surname,
        JSON.parse(cart.Cart),
        deliveryFeeSplit,
        subtotal,
        cart.Confirmed
      );
    });
    let selectedID = localStorage.getItem("selectedID");
    modifySelectedCart(selectedID); // Update the selected user to be able to confirm and update items for themselves
    renderCheckout(cartsSubtotal, shop.shop.DeliveryPrice);
  }
  showNotification("success", "Cart loaded successfully");
});