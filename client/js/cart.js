function renderHero(shopName, shopImage, shopColor) {
  if (shopName !== "") {
    const shopBackground = document.getElementById("shopLogoBackground");
    shopBackground.style.backgroundColor = shopColor;
    const shopLogo = document.getElementById("shopLogo");
    shopLogo.src = shopImage;
    shopLogo.alt = shopName + " Logo";
  }
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
        <h4 class="cartPersonTotal">£${cartSubtotal}</h4>
        <button class="cartConfirmButton layer2container buttonText ${
          confirmed ? "confirmed" : ""
        } confirmButton" disabled>
            ${confirmed ? "Confirmed" : "Awaiting Confirmation"}
        </button>
    `;
  container.appendChild(summaryDiv);

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
                    item.image_link
                  }');"></div>
              </div>
              <div class="itemMeta">
                  <h4 class="itemName">${item.name}</h4>
                  <p class="itemDescription">${item.description}</p>
              </div>
              <span class="itemPrice itemPriceText">£${item.price.toFixed(
                2
              )}</span>
              <label>Quantity: <input type="number" class="itemQuantity layer3container" name="quantity" min="1" max="99" value="${
                item.quantity
              }" disabled data-itemid="${key}"></label>
              <input type="submit" class="removeButton buttonText layer3container" value="Remove" disabled data-itemid="${key}">
            `;
    itemList.appendChild(itemDiv);

    // Handle quantity updates

    const quantityInput = itemDiv.querySelector(".itemQuantity");
    quantityInput.addEventListener("change", async (event) => {
      let newQuantity = event.target.value;

      // Call the quantity update function
      newQuantity = await sendAPIRequest("updateQuantity", {
        userId: userId,
        itemId: item._id,
        newQuantity: newQuantity,
      });

      if (isUpdated) {
        console.log(`Quantity for item ${item._id} updated to ${newQuantity}`);
        quantityInput.value = newQuantity;
      } else {
        console.error(`Failed to update quantity for item ${item._id}`);
      }
    });

    // Handle item Removal

    const removeButton = itemDiv.getElementsByClassName("removeButton");
    removeButton.addEventListener("click", async (event) => {
      const isRemoved = await sendAPIRequest("removeItem", {
        userId: userId,
        itemId: item._id,
      });
      if (isRemoved) {
        console.log(`Removed item ${item._id}`);
        itemDiv.remove();
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
            <span class="personalCartTotalResult">£${cartSubtotal}</span>
        </div>
        <div class="personalDeliveryFee personalCartTotalItem">
            <span class="personalDeliveryFeeName">Delivery Fee Split</span>
            <span class="personalDeliveryFeeResult">£${deliveryFeeSplit}</span>
        </div>
        <hr class="personalDivider ">
        <div class="personalTotal personalCartTotalItem">
            <span class="personalTotalName">Your Total</span>
            <span class="personalTotalResult">£${
              cartSubtotal + deliveryFeeSplit
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
                    <h4 id="cartTotalResult">£${subtotal}</h4>
                </div>
                <div id="deliveryFeeTotal" class="checkoutItem">
                    <h4 id="deliveryFeeTotalName">
                        Delivery Fee:
                    </h4>
                    <h4 id="deliveryFeeTotalResult">£${deliveryFee}</h4>
                </div>
                <div id="totalPrice" class="checkoutItem">
                    <h3 id="totalPriceTotal">Total</h3>
                    <h3 id="totalPriceResult">£${subtotal + deliveryFee}</h3>
                </div>
            </div>
    `;
}

function calculatePersonalCartSubtotal(cart) {
  let total = 0.0;
  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    total += item.price;
  }
  return total;
}

async function sendAPIRequest(endpoint, data) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      renderErrorCart(response.status, response.statusText);
    }

    return await response.json();
  } catch (error) {
    renderErrorCart(500, "Internal Server Error");
    console.error("Failed to send data:", error);
  }
}

async function getAPIRequest(endpoint, data) {
  try {
    await axios
      .get("http://localhost:5500/getCart/?")
      .then((res) => {
        console.log(res.data.data);
        return res.data.data;
      })
      .catch(function (error) {
        renderErrorCart(error.errorCode, error.errorMessage);
      });
  } catch (error) {
    renderErrorCart(500, "Internal Server Error");
    console.error("Failed to send data:", error);
  }
}

// On page load, build the cart page
document.addEventListener("DOMContentLoaded", async function () {
  let carts = await getAPIRequest("getCart", "");
  if (carts.length === 0) {
    // If there are no user's in the cart, render the empty cart HTML
    renderEmptyCart();
  } else {
    let shop = await sendAPIRequest("getSelectedShop", {});
    renderHero(shop.name, shop.image, shop.color);
    const deliveryFeeSplit = (shop.deliveryfee / carts.length).toFixed(2);
    let cartsSubtotal = 0;
    // For each user with items in the cart, render their personal cart
    carts.forEach((cart) => {
      const subtotal = calculatePersonalCartSubtotal(cart.cart);
      cartsSubtotal += subtotal;
      renderCart(
        cart.userid,
        cart.firstname,
        cart.lastname,
        cart.cart,
        deliveryFeeSplit,
        subtotal,
        cart.confirmed
      );
    });
    let selectedID = localStorage.getItem("selectedID");
    modifySelectedCart(selectedID); // Update the selected user to be able to confirm and update items for themselves
    renderCheckout(cartsSubtotal, shop.deliveryfee);
  }
});
