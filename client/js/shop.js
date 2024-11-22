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
		document.getElementById("shopLogoBackground").classList = currentShop;
	});
});
