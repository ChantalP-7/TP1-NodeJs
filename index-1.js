const path = require("path");
const express = require("express");
const app = express();
const config = require("./config.js");
const request = require("request");
const fs = require("fs");
const PORT = 3000;
console.log("Coucou2");

//const PORT = config.PORT || 3737;

app.get("/", (req, res) => {
	res.send("Le serveur fonctionne ✅");
});

app.get("/ticker=:id", (req, res) => {
	const ticker = req.params.id;

	//var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${config.API_KEY}`;

	const url = `https://api.thecatapi.com/v1/images/?limit=10&breed_ids=beng&id=${ticker}&api_key=${config.API_KEY}`;

	request.get({ url, json: true }, (err, response, data) => {
		if (err || response.statusCode != 200) {
			return res.status(500).send("Error fetching data");
		}
		//console.log(data)
		fs.writeFile(`${ticker}.json`, JSON.stringify(data), (err) => {
			if (err) return res.status(500).send("Error saving file");
			res.redirect(`/view?ticker=${ticker}`);
			//res.send("Success");d
			//res.send(data);
			//console.log(data);
		});
	});

	console.log(url);
	//res.send("Hello World!");
});
//const PORT = 8081;
//console.log("coucou3");
/*app.get('/', (req, res) => {
  res.send('Hello from 8081!');
});*/

app.get("/view", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
	res.sendFile(path.join(__dirname, "public", "script.js"));
	res.sendFile(path.join(__dirname, "public", "style.css"));
});

// Serve stock data as JSON for frontend to fetch
app.get("/data/:id", (req, res) => {
	const filePath = `${__dirname}/${req.params.id}.json`;
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) return res.status(404).send({ error: "Data not found" });
		res.json(JSON.parse(data));
	});
});

/*const PORT = config.PORT || 3737;
app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});*/

app.listen(PORT, () => {
	console.log(`✅ Server running at http://localhost:${PORT}`);
});

/*app.listen(config.PORT, () => {
	console.log(`Chantal, tu est connectée.`);
});*/
