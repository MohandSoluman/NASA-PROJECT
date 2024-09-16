const {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  isExistsLaunchId,
} = require("../../models/launches.model");

const httpGetAllLaunches = (req, res) => {
  res.status(200).json(getAllLaunches());
};

const httpCraeteLaunch = (req, res) => {
  const newLaunch = req.body;
  newLaunch.launchDate = new Date(newLaunch.launchDate);
  addNewLaunch(newLaunch);
  res.status(201).json(newLaunch);
};

const httpAbortLaunch = (req, res) => {
  const launchId = Number(req.params.id);
  if (!isExistsLaunchId(launchId)) {
    res.status(404).json({ message: `Launch with ID ${launchId} not found.` });
  }
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
};

module.exports = {
  httpGetAllLaunches,
  httpCraeteLaunch,
  httpAbortLaunch,
};
