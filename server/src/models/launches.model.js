const launchesDatabase = require("./launches.mongo");
const planets = require("./planet.momgo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexData.com/v4/launches/query";
("https://api.spacexdata.com/v4/launches/query");
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

const loadLaunchesData = async () => {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: "rocket",
          select: { name: 1 },
        },
        {
          path: "payloads",
          customers: 1,
        },
      ],
    },
  });

  const launchDocs = response.data.docs;
  for (const launchDoc in launchDocs) {
    const payloads = launchDoc?.["payloads"];
    console.log(payloads);
    const customers = payloads?.flatMap((payloads) => {
      return payloads["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["mission_name"],
      rocket: launchDoc["rocket"]?.["name"],
      launchDate: [" launchDoc"]?.["date_local"],
      success: launchDoc["success"],
      upcoming: launchDoc["upcoming"],
      customers,
    };
  }
  console.log(launch);
};
const getLastFlightNumber = async () => {
  const { flightNumber } = await launchesDatabase
    .findOne()
    .sort("-flightNumber");

  if (!flightNumber) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return flightNumber;
};
const saveLaunch = async (launch) => {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("no planet matching found..");
  }
  await launchesDatabase.findOneAndUpdate(
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
  try {
    return await launchesDatabase.find({}, { _id: 0, __v: 0 });
  } catch (error) {
    console.log(error);
  }
};

const scudualNewLaunch = async (launch) => {
  const flightNumber = (await getLastFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber,
    upcoming: true,
    success: true,
    customers: ["cm1", "cm2", "cm3"],
  });

  await saveLaunch(newLaunch);
};

const isExistsLaunchId = async (id) => {
  return await launchesDatabase.findOne({ flightNumber: id });
};
const abortLaunchById = async (id) => {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: id },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
};

saveLaunch(launch);

module.exports = {
  loadLaunchesData,
  isExistsLaunchId,
  getAllLaunches,
  scudualNewLaunch,
  abortLaunchById,
};
