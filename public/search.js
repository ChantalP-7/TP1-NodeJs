const https = "https";
//const config = require(".././config.js");
//const https = require("follow-redirects/https");
//const fs = require("fs");


const options = {
	method: "GET",
	hostname: "api.thecatapi.com",
	path: "/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1",
	headers: {
		"Content-Type": "application/json",
		"x-api-key": config.API_KEY,
        "follow-redirects/http"  : "http",
        "follow-redirects/https" : "https"
	},
	maxRedirects: 20,
};



const req = https.request(options, function (res) {
	var chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function (chunk) {
		var body = Buffer.concat(chunks);
		console.log(body.toString());
	});

	res.on("error", function (error) {
		console.error(error);
	});
});

req.end();
