let currentShop = "tesco";
let itemsArray = [];
let searchTerms = "";
let currentPage,
	maxPage = 1;
let selectedShop;

const throwError = () => {
	document.querySelector(".error404").style.display = "block";
};

// Open and close dropdown on clicking the logo
document.getElementById("shopLogoBackground").addEventListener("click", () => {
	if (!selectedShop) {
		document.querySelector(".shopDropdown").classList.toggle("open");
		document.querySelector(".searchBarHero").classList.toggle("open");
	}
});

const getSelectedShop = async () => {
	await axios
		.get("http://localhost:5500/getCart/getSelectedShop")
		.then((res) => {
			if (res.data.data) {
				selectedShop = res.data.data.shop;
				if (selectedShop) {
					document.getElementById("shopLogoBackground").classList =
						selectedShop.shopName.toLowerCase();
					localStorage.setItem("shopId", selectedShop._id);
				}
			}
		});
};
getSelectedShop();

document.getElementById("currentUserButton").addEventListener("click", () => {
	document.querySelector(".userSelectionDropdown").classList.toggle("open");
});

// Close all dropdowns when clicking anywhere else
document.addEventListener("click", (e) => {
	if (
		!document.querySelector(".shopDropdown").contains(e.target) &&
		!document.getElementById("shopLogoBackground").contains(e.target) &&
		!document.querySelector(".userSelection").contains(e.target)
	) {
		document.querySelector(".shopDropdown").classList.remove("open");
		document.querySelector(".searchBarHero").classList.remove("open");
		document
			.querySelector(".userSelectionDropdown")
			.classList.remove("open");
	}
});

const getShops = async () => {
	await axios.get(`http://localhost:5500/search/`).then((res) => {
		const shopList = res.data.data.shops;

		document.getElementById("shopLogoBackground").classList =
			shopList[0].shopName.toLowerCase();
		localStorage.setItem("shopId", shopList[0]._id);

		shopList.forEach((shop) => {
			let newShopDiv = document.createElement("div");
			newShopDiv.innerHTML = `<div class="shopOption ${shop.shopName.toLowerCase()}" id="${
				shop._id
			}">
						<div></div>
					</div>`;
			document.querySelector(".shopDropdown").appendChild(newShopDiv);
		});
	});
	// Change the currentShop and logo displayed
	document.querySelectorAll(".shopOption").forEach((el) => {
		el.addEventListener("click", (e) => {
			currentShop = e.target.closest(".shopOption").classList[1];
			localStorage.setItem("shopId", e.target.closest(".shopOption").id);
			selectedShop = currentShop;
			document.getElementById("shopLogoBackground").classList =
				currentShop;
			search();
		});
	});
};
getShops();

const getUsers = async () => {
	await axios.get(`http://localhost:5500/getCart/getUsers`).then((res) => {
		const userList = res.data.data.people;

		document.getElementById("currentUserButton").innerHTML = `<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#e8eaed"
					>
						<path
							d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"
						/>
					</svg>
				
				${userList[0].FirstName} ${userList[0].Surname[0]}`;
		localStorage.setItem("selectedID", userList[0]._id);
		updateQuantity(userList[0]._id);

		userList.forEach((user) => {
			let newShopDiv = document.createElement("div");
			newShopDiv.innerHTML = `<button
						class="layer2container navigationButton buttonText"
						id="${user._id}"
					>
						${user.FirstName} ${user.Surname[0]}
					</button>`;
			document
				.querySelector(".userSelectionDropdown")
				.appendChild(newShopDiv);
		});
	});

	document.querySelectorAll(".userSelectionDropdown button").forEach((el) => {
		el.addEventListener("click", () => {
			document.getElementById("currentUserButton").innerHTML = `<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#e8eaed"
						>
							<path
								d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"
							/>
						</svg> ${el.textContent.trim()}`;

			localStorage.setItem("selectedID", el.id);
			updateQuantity(el.id);
		});
	});
};
getUsers();

const updateQuantity = async (userId) => {
	await axios
		.get(`http://localhost:5500/getCart/getCartCount/?${userId}`)
		.then((res) => {
			const cartQuantity = res.data.data.cart.length;
			const quantityEl = document.getElementById("cartCount");
			if (cartQuantity < 1) quantityEl.style.display = "none";
			else {
				quantityEl.style.display = "block";
				quantityEl.textContent = cartQuantity;
			}
		});
};

const renderShopPage = async () => {
	await axios
		.get(
			`http://localhost:5500/search/${localStorage.getItem(
				"shopId"
			)}/?searchTerm=${searchTerms}&page=${currentPage}&limit=5`
		)
		.then((res) => {
			itemsArray = res.data.data.items;
			document.querySelector(".itemList").innerHTML = "";
			itemsArray.forEach((item) => {
				const itemId = item._id;
				const name = item.ItemName;
				const price = item.ItemCost;
				const imageSrc = item.ImageLink;
				const description = item.ItemDescription;
				let itemDiv = document.createElement("div");

				itemDiv.innerHTML = `
		<div class="itemContainer layer2container" id="${itemId}">
				<div class="itemAdvertisement">
					<div class="itemImageContainer layer3container">
						<div class="itemImage"><img src="${imageSrc}" alt="Picture of ${name}"></div>
					</div>
					<div class="itemMeta">
						<h4 class="itemName">
							${name}
						</h4>
						<p class="itemDescription">
							${description}
						</p>
					</div>
				</div>
				<div class="itemPurchasing">
					<span class="itemPrice itemPriceText">£${price}</span>
					<label
						>Quantity:
						<input
							type="number"
							class="itemQuantity layer3container"
							name="quantity"
							min="1"
							max="99"
							value="1"
					/></label>
					<input
						type="submit"
						class="addButton buttonText layer3container"
						value="Add"
					/>
				</div>
			</div>`;
				document.querySelector(".itemList").appendChild(itemDiv);
			});
			document.querySelectorAll(".addButton").forEach((el) => {
				el.addEventListener("click", (e) => {
					item = e.target.closest(".itemContainer");
					quantity = item.querySelector(".itemQuantity").value
						? item.querySelector(".itemQuantity").value
						: 1;
					addToCart(item.id, quantity);
				});
			});
		})
		.catch(function (error) {
			throwError();
			console.error(error);
		});
};

const search = async () => {
	currentPage = 1;
	searchTerms = document
		.querySelector(".searchBar")
		.value.replace(/\s+/g, "-"); // Replacing Whitespace characters
	showNotification("info", "Searching for items...");
	// Setting maxPage
	await axios
		.get(
			`http://localhost:5500/search/${searchTerms}/?searchTerm=${localStorage.getItem(
				"shopId"
			)}`
		)
		.then((res) => {
			showNotification(
				"success",
				"Successfully searched for items: " + searchTerms
			);
			maxPage = Math.ceil(res.data.results / 5);
		})
		.catch(function (error) {
			showNotification("error", "Failed to search for items");
			throwError();
			console.error(error);
		});

	renderShopPage();
};
search();

document.getElementById("previous").addEventListener("click", () => {
	if (currentPage > 1) {
		currentPage--;
		renderShopPage();
	}
});

document.getElementById("next").addEventListener("click", () => {
	if (currentPage < maxPage) {
		currentPage++;
		renderShopPage();
	}
});

document
	.getElementById("searchButton")
	.addEventListener("click", () => search());
document.querySelector(".searchBar").addEventListener("keypress", (e) => {
	if (e.keyCode == 13) search();
});

const addToCart = async (itemId, quantity) => {
	const userId = localStorage.getItem("selectedID");
	const shopId = localStorage.getItem("shopId");

	await axios
		.post(`http://localhost:5500/search/${shopId}`, {
			PersonId: userId,
			ItemId: itemId,
			Quantity: quantity,
		})
		.then((res) => {
			console.log(res);
		})
		.catch(function (error) {
			throwError();
			console.error(error);
		});
	updateQuantity(userId);
};
