//const https = require("follow-redirects").https;

const urlParams = new URLSearchParams(window.location.search);
const ticker = urlParams.get("ticker");

fetch(`/data/${ticker}`)
	.then((res) => res.json())
	.then((data) => {
		const container = document.getElementById("data-container");
		const url = data["url"];

		/*if (!id) {
			container.innerHTML = "No data found for this ticker.";
			return;
		}*/

		const entries = Object.entries(url); /*.slice(0, 25)*/ // Limit to 5 results
		container.innerHTML = `
      <h2>${ticker.toUpperCase()}</h2>
      <ul>
        ${entries
			.map(
				([image, value]) => `
          <li><strong>${image}</strong> - url : ${value["url"]}, Width: ${value["width"]}, Height: ${value["height"]}</li>
        `
			)
			.join("")}
      </ul>
    `;
	})
	.catch((err) => {
		document.getElementById("data-container").innerText =
			"Error loading data";
	});
