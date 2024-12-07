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

    // Accordian dropdown functionality
    container.addEventListener("click", () => {
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
                item.Quantity.Quantity
              }" disabled data-itemid="${item._id}"></label>
              <input type="submit" class="removeButton buttonText layer3container" value="Remove" disabled data-itemid="${item._id}">
            `;
    itemList.appendChild(itemDiv);

    // Handle quantity updates
    const quantityInput = itemDiv.querySelector(".itemQuantity");
    quantityInput.addEventListener("change", async (event) => {
      let newQuantity = event.target.value;
      newQuantity = await sendAPIRequest("updateQuantity", {
        userId: userId,
        itemId: item._id,
        newQuantity: newQuantity,
      });

      if (newQuantity) {
        console.log(`Quantity for item ${item._id} updated to ${newQuantity}`);
        quantityInput.value = newQuantity;
      } else {
        console.error(`Failed to update quantity for item ${item._id}`);
      }
    });

    // Handle item Removal
    const removeButton = itemDiv.querySelector(".removeButton");
    removeButton.addEventListener("click", async (event) => {
      const isRemoved = await sendAPIRequest("removeItem", {
        userId: userId,
        itemId: item._id,
      });

      if (isRemoved) {
        console.log(`Removed item ${item._id}`);
        itemDiv.remove();
      } else {
        console.error(`Failed to remove item ${item._id}`);
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
        <div id="errorWrapper">
            <div id="errorSummary">
                <h3 id="errorCode">Error: ${errorCode}</h3>
                <p id="errorMessage">${errorMessage}</p>
                <button id="errorButton">Reload Cart</button>
            </div>
        </div>
    `;
  document.body.appendChild(container);

  document
    .getElementById("errorButton")
    .addEventListener("click", () => location.reload());
}

function renderEmptyCart() {
  const container = document.createElement("div");
  container.classList.add("emptyCart", "layer1container");
  container.innerHTML = `
        <div class="emptyCartSummary">
            <h3>Your cart is empty</h3>
            <p>Add items to your cart to see them here.</p>
        </div>
    `;
  const personalCartsDiv = document.getElementById("personalCarts");
  personalCartsDiv.appendChild(container);
}

function modifySelectedCart(userId) {
  const personalCarts = document.getElementsByClassName("personalCart");
  for (let i = 0; i < personalCarts.length; i++) {
    const personalCart = personalCarts[i];
    const summaryDiv = personalCart.getElementsByClassName(
      "personalCartSummary"
    )[0];
    const dropdownDiv = personalCart.getElementsByClassName(
      "personalCartDropdown"
    )[0];
    const confirmButton =
      summaryDiv.getElementsByClassName("cartConfirmButton")[0];
    const dropdownItems = dropdownDiv.getElementsByClassName("itemContainer");
    if (userId === i) {
      confirmButton.disabled = false;
      confirmButton.classList.add("currentUserConfirmButton");
      for (let j = 0; j < dropdownItems.length; j++) {
        const item = dropdownItems[j];
        const quantityInput = item.getElementsByClassName("itemQuantity")[0];
        const removeButton = item.getElementsByClassName("removeButton")[0];
        quantityInput.disabled = false;
        removeButton.disabled = false;
      }
    }
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
    total += item.ItemCost*item.Quantity.Quantity;
  });
  return total;
}

async function getAPIRequest(endpoint, data) {
  try {
    const response = await axios.get(`http://localhost:5500/${endpoint}/?${data}`);
    return response.data.data;
  } catch (error) {
    if (error.response) {
      renderErrorCart(error.response.status, error.response.statusText);
    } else {
      renderErrorCart(500, "Internal Server Error");
    }
    console.error(`Failed to send data for API ${endpoint}:`, error);
  }
}

// On page load, build the cart page
document.addEventListener("DOMContentLoaded", async function () {
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
    modifySelectedCart(selectedID); // Update the selected user to be able to confirm and update items for themselves
    renderCheckout(cartsSubtotal, shop.shop.DeliveryPrice);
  }
});
