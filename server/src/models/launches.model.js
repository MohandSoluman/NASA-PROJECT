const launches = require("./launches.mongo");
const planets = require("./planet.momgo");

let lastFlightNum = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Falcon 9",
  launchDate: new Date("Decemper 27, 2030"),
  target: "Kepler-1652 b",
  customers: ["ZTM", "MohandSoluman"],
  success: true,
  upcoming: true,
};

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("no planet matching found..");
  }
  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

const getAllLaunches = async () => {
  return await launches.find({}, { _id: 0, __v: 0 });
};
const addNewLaunch = async (launch) => {
  lastFlightNum++;
  await launches.create({});
  launches.set(
    lastFlightNum,
    Object.assign(launch, {
      flightNumber: lastFlightNum,
      upcoming: true,
      success: true,
      customers: ["cm1", "cm2", "cm3"],
    })
  );
};
const isExistsLaunchId = (id) => {
  return launches.has(id);
};
const abortLaunchById = (id) => {
  const aborted = launches.get(id);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
};
saveLaunch(launch);
module.exports = {
  isExistsLaunchId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
