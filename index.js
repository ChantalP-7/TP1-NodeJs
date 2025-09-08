const express = require("express");
const app = express();
const fs = require("fs");
const request = require("request");
const config = require("./config.js");
const path = require("path");

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// API route to fetch data and save to JSON file
app.get("/ticker=:id", function (req, res) {
	const ticker = req.params.id;
	const url = `https://api.thecatapi.com/v1/images/&symbol=${ticker}&url=url&api_key=${config.API_KEY}`;
	//const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${config.API_KEY}`;
	request.get({ url, json: true }, (err, response, data) => {
		if (err || response.statusCode !== 200) {
			return res.status(500).send("Error fetching data");
		}

		fs.writeFile(`${ticker}.json`, JSON.stringify(data), (err) => {
			if (err) return res.status(500).send("Error saving file");
			res.redirect(`/view?ticker=${ticker}`); // Redirect to view page
		});
	});
});

// Serve HTML page with stock data
app.get("/view", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve stock data as JSON for frontend to fetch
app.get("/data/:id", (req, res) => {
	const filePath = `${__dirname}/${req.params.id}.json`;
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) return res.status(404).send({ error: "Data not found" });
		res.json(JSON.parse(data));
	});
});

//const PORT = 3000;

app.listen(config.PORT, () => {
	console.log(`✅ Server running at http://localhost:${config.PORT}`);
});


/*app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});*/
