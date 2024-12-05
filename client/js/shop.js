let currentShop = "tesco";

// Open and close dropdown on clicking the logo
document.getElementById("shopLogoBackground").addEventListener("click", () => {
	document.querySelector(".shopDropdown").classList.toggle("open");
	document.querySelector(".searchBarHero").classList.toggle("open");
});

// Close the dropdown when clicking anywhere else
document.addEventListener("click", (e) => {
	if (
		!document.querySelector(".shopDropdown").contains(e.target) &&
		!document.getElementById("shopLogoBackground").contains(e.target)
	) {
		document.querySelector(".shopDropdown").classList.remove("open");
		document.querySelector(".searchBarHero").classList.remove("open");
	}
});

// Change the currentShop and logo displayed
document.querySelectorAll(".shopOption").forEach((el) => {
	el.addEventListener("click", (e) => {
		currentShop = e.target.closest(".shopOption").classList[1];
		localStorage.setItem("shopId", e.target.closest(".shopOption").id);
		document.getElementById("shopLogoBackground").classList = currentShop;
	});
});

const search = async () => {
	const searchTerms = document
		.querySelector(".searchBar")
		.value.replace(/\s+/g, "-"); // Replace whitespace characters
	const shopId = localStorage.getItem("shopId");

	axios
		.get(`/search/${shopId}/?${searchTerms}`)
		.then((res) => {
			console.log(res);
		})
		.catch(function (error) {
			// handle error
			console.error(error);
		});
};

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
		.post(
			`/search/${shopId}`,
			JSON.stringify({
				PersonId: userId,
				ItemId: itemId,
				Quantity: quantity,
			})
		)
		.then((res) => {
			console.log(res);
		})
		.catch(function (error) {
			// handle error
			console.error(error);
		});
};

document.querySelectorAll(".addButton").forEach((el) => {
	el.addEventListener("click", (e) => {
		item = e.target.closest(".itemContainer");
		quantity = item.querySelector(".itemQuantity").value
			? item.querySelector(".itemQuantity").value
			: 1;
		addToCart(item.id, quantity);
	});
});
