const urlParams = new URLSearchParams(window.location.search);
const breed = urlParams.get("breed");

fetch(`/data/${breed}`)
	.then((res) => res.json())
	.then((data) => {
		const container = document.getElementById("data-container");
		const clickDetails = document.querySelector(".click-details");

		if (!data.images || data.images.length === 0) {
			container.innerHTML = "Aucune image trouvée.";
			return;
		}

		const images = data.images.slice(0, 5);

		container.innerHTML = images
			.map(
				(img) =>
					`<img src="${img.url}" alt="Chat" style="max-width:200px;margin:10px;">`
			)
			.join("");

		// Mise à jour du lien
		clickDetails.href = `/breed-details/${breed}`;
	})
	.catch((err) => {
		console.error("Erreur lors du chargement :", err);
		document.getElementById("data-container").innerText =
			"Erreur de chargement des données.";
	});
