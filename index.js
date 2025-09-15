const path = require("path");
const express = require("express");
const app = express();
const config = require("./config.js");
const axios = require("axios");
const request = require("request");
const fs = require("fs");

app.use((req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self'; connect-src 'self'; script-src 'self'; img-src 'self' https://cdn2.thecatapi.com data:; style-src 'self';"
	);
	next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("Le serveur fonctionne ✅");
});

const MAX_RETRIES = 5;

async function fetchBreedData(breedId) {
	try {
		const allBreeds = await axios.get(
			"https://api.thecatapi.com/v1/breeds",
			{
				headers: { "x-api-key": config.API_KEY },
			}
		);

		const breedInfo = allBreeds.data.find((b) => b.id === breedId);

		if (!breedInfo) {
			throw new Error("Race introuvable");
		}

		const imageResponse = await axios.get(
			`https://api.thecatapi.com/v1/images/search?breed_id=${breedId}`,
			{
				headers: { "x-api-key": config.API_KEY },
			}
		);

		const imageUrl = imageResponse.data[0]?.url || null;

		// tableau copié avec les infos combinés
		return {
			...breedInfo,
			imageUrl,
		};
	} catch (err) {
		console.error("Erreur dans fetchBreedData:", err.message);
		throw err;
	}
}

app.get("/breed/:id", async (req, res) => {
	const breedId = req.params.id;

	try {
		const allBreeds = await axios.get(
			"https://api.thecatapi.com/v1/breeds",
			{
				headers: { "x-api-key": config.API_KEY },
			}
		);
		const breed = allBreeds.data.find((b) => b.id === breedId);

		if (!breed) {
			return res.status(404).send("Race non trouvée.");
		}

		// Récupérer plusieurs images
		const imgRes = await axios.get(
			`https://api.thecatapi.com/v1/images/search?breed_id=${breedId}&limit=10`,
			{
				headers: { "x-api-key": config.API_KEY },
			}
		);

		const images = imgRes.data.map((img) => ({
			url: img.url,
		}));

		// Image par défaut
		breed.imageUrl = images[0]?.url || "";

		// Images supplémentaires
		breed.images = images;

		//Sauvegarde dans un fichier JSON
		fs.writeFile(
			`${breedId}.json`,
			JSON.stringify(breed, null, 2),
			(err) => {
				if (err) {
					console.error("Erreur d'écriture :", err);
					return res
						.status(500)
						.send("Erreur lors de la sauvegarde.");
				}

				res.redirect(`/view?breed=${breedId}`);
			}
		);
	} catch (err) {
		console.error("Erreur dans /breed/:id :", err.message);
		res.status(500).send("Erreur lors de la récupération des données.");
	}
});

app.get("/view", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/breed-details/:id", (req, res) => {
	const breedId = req.params.id;
	const filePath = path.join(__dirname, `${breedId}.json`);

	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			console.error(" Fichier JSON introuvable :", err.message);
			return res.status(404).send("Race non trouvée.");
		}

		const breed = JSON.parse(data);

		if (!breed || !breed.name) {
			return res.status(404).send("Détails de la race indisponibles.");
		}
		const html = `
			<!DOCTYPE html>
			<html lang="fr">
			<head>
				<meta charset="UTF-8">
				<title>Détails de la race ${breed.name}</title>
				<link rel="stylesheet" href="/style.css">
				<link rel="preconnect" href="https://fonts.googleapis.com">
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
				<link href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Oswald:wght@200..700&family=Zen+Kaku+Gothic+New&display=swap" rel="stylesheet">
			</head>
			<body>
				<header>
					<nav>
						<a href="#">Accueil</a>
						<a href="#">API</a>
						<a href="#">Contact</a>
					</nav>
				</header>
				<main>				
					<div id=""  class="conteneur">
						<div id="breed-details" class="div-details">							
							<h1 class="h1">Détails de la race : ${breed.name}</h1>
							<img class="img-principale" src="${breed.imageUrl}" alt="${breed.name}">
							<p class="p"><strong>Origine :</strong> ${breed.origin}</p>
							<p class="p"><strong>Tempérament :</strong> ${breed.temperament}</p>
							<p class="p"><strong>Description :</strong> ${breed.description}</p>
							<p class="p"><a href="${breed.wikipedia_url}" target="_blank">Wikipedia</a></p>
							<hr>							
							<h3 class="h3">Retour race de chats</h3>
							<br><br>								
							<a class="click-details" href="http://localhost:3000/breed/${breedId}/">Cliquez</a>
						</div>						
					</div>
				</main>
				<footer>
					Tous droits réservés : Chantal Pépin
				</footer>
			</body>
			</html>
		`;
		res.send(html);
	});
});

// Données du fichier json pour fetche
app.get("/data/:id", (req, res) => {
	const filePath = path.join(__dirname, `${req.params.id}.json`);
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) return res.status(404).send({ error: "Data not found" });
		res.json(JSON.parse(data));
	});
});

app.listen(config.PORT, () => {
	console.log(`Server running at http://localhost:${config.PORT}`);
});

// gestion des erreurs dans la console

process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection:", reason);
});
