require("dotenv").config();
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT;
async function startServer() {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}
startServer();
