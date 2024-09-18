require("dotenv").config();

const mongoose = require("mongoose");
const { urlFromContainer, urlFromLocal } = require("../db.config");

const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT;

let url = urlFromContainer;
if (process.env.NODE_ENV === "development") {
  url = urlFromLocal;
}

console.log(urlFromLocal);

mongoose
  .connect(url)
  .then(console.log("connect to mongo db server"))
  .catch((err) => console.log(err));
async function startServer() {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}
startServer();
