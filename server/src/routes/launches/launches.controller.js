const {
  getAllLaunches,
  scudualNewLaunch,
  abortLaunchById,
  isExistsLaunchId,
} = require("../../models/launches.model");

const httpGetAllLaunches = async (req, res) => {
  const launches = await getAllLaunches();

  res.status(200).json(launches);
};

const httpCraeteLaunch = async (req, res) => {
  const newLaunch = req.body;
  newLaunch.launchDate = new Date(newLaunch.launchDate);
  await scudualNewLaunch(newLaunch);
  res.status(201).json(newLaunch);
};

const httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);
  const isExistsLaunch = await isExistsLaunchId(launchId);
  if (!isExistsLaunch) {
    res.status(404).json({ message: `Launch with ID ${launchId} not found.` });
  }
  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({ message: "Failed to abort launch." });
  }
  return res.status(200).json({ ok: true });
};

module.exports = {
  httpGetAllLaunches,
  httpCraeteLaunch,
  httpAbortLaunch,
};
