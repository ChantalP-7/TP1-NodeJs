//const https = require("follow-redirects").https;

const urlParams = new URLSearchParams(window.location.search);
//const randomCats = urlParams.get("/random-cats");
const limit = urlParams.get("limit") || 10;


fetch(`/random-cats?limit=${limit}`)
	.then((res) => res.json())
	.then((data) => {
		const container = document.getElementById("data-container");
		const images = data["images"];

		if (!images || images.length === 0) {
			container.innerHTML = "Pas d'images trouvées.";
			return;
		}

		//const cats = response.data;

		/*const imagesHtml = cats
			.map(
				(cat) =>
					`<img src="${cat.url}" alt="chat" style="width: 200px; margin: 10px; border-radius: 10px;" />`
			)
			.join("");*/

		/*if (!id) {
			container.innerHTML = "No data found for this ticker.";
			return;
		}*/

		const entries = Object.entries(images); /*.slice(0, 25)*/ // Limit to 5 results
		container.innerHTML = `
      <h2>${randomCats.toUpperCase()}</h2>
        ${entries
			.map(
				(cat) =>
					`<img src="${cat.url}" alt="chat" style="width: 200px; margin: 10px; border-radius: 10px;" />`
			)
			.join("")}
    `;
	})
	.catch((err) => {
		document.getElementById("data-container").innerText =
			"Error loading data";
	});
