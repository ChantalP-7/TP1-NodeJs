const express = require("express");
const app = express();
const fs = require("fs");
const request = require("request");
const config = require("./config.js");
const path = require("path");
const axios = require('axios');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

const catApiUrl = "https://api.thecatapi.com/v1/images/search";

app.get(`/random-cats`, async (req, res) => {
	const limit = parseInt(req.query.limit) || 5;
	
	try {
		const response = await axios.get(
			`https://api.thecatapi.com/v1/images/search?limit=${limit}`,
			{
				// const response = await axios.get(`${catApiUrl}?${limit}`, {
				headers: {
					"x-api-key": `${config.API_KEY}`,
				},
			}
		);

		const imagesChat = response.data.map(cat  => cat.url);

		res.json({ images: imagesChat });
	} catch (error) {
		console.error("Erreur lors de l'appel de l'appi : ", error.message);
		res.status(500).json({ error: "Ne peux pas récupérer l'image" });
	}
});


/*app.get(`/med&mime_types=jpg&format=json&has_breeds=true&order=ASC&page=0&limit=${limit}&include_breeds=1&include_categories=1`, async (req, res) => {
	try {

		const response = await axios.get(catApiUrl, {
			headers: {
				'x-api-key': `${config.API_KEY}`
			}
		});
		
		const imageChat = response.data[0]?.url;
		res.json ({ imageUrl : imageChat});
	} catch (error) {
		console.error("Erreur lors de l'appel de l'appi : ", error.message);
		res.status(500).json({error: 'Ne peux pas récupérer l\'image'});
	}
})*/



// API route to fetch data and save to JSON file
/*app.get("/ticker=:id", function (req, res) {
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
});*/



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
