const launches = new Map();

let lastFlightNum = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Falcon 9",
  launchDate: new Date("Decemper 27, 2030"),
  target: "kepler-224 b",
  customer: ["ZTM", "MohandSoluman"],
  success: true,
  upcoming: true,
};

launches.set(launch.flightNumber, launch);

const getAllLaunches = () => {
  return Array.from(launches.values());
};
const addNewLaunch = (launch) => {
  lastFlightNum++;
  launches.set(
    lastFlightNum,
    Object.assign(launch, {
      flightNumber: lastFlightNum,
      upcoming: true,
      success: true,
      customer: ["cm1", "cm2", "cm3"],
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

module.exports = {
  isExistsLaunchId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
