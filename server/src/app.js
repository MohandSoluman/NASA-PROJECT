const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const api = require("./routes/api");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
// support multi version
app.use("/v1", api);
//app.use('/v2',apiv2)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
