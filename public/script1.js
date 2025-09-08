const urlParams = new URLSearchParams(window.location.search);
const ticker = urlParams.get("ticker");

fetch(`/data/${ticker}`)
	.then((res) => res.json())
	.then((data) => {
		const container = document.getElementById("data-container");
		const timeSeries = data["Time Series (5min)"];

		if (!timeSeries) {
			container.innerHTML = "No data found for this ticker.";
			return;
		}

		const entries = Object.entries(timeSeries).slice(0, 25); // Limit to 5 results
		container.innerHTML = `
      <h2>${ticker.toUpperCase()}</h2>
      <ul>
        ${entries
			.map(
				([time, value]) => `
          <li><strong>${time}</strong> - Open: ${value["1. open"]}, Close: ${value["4. close"]}</li>
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
