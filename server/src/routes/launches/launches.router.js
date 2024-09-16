const express = require("express");
const launchesRouter = express.Router();
const {
  httpGetAllLaunches,
  httpCraeteLaunch,
  httpAbortLaunch,
} = require("./launches.controller");

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpCraeteLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
