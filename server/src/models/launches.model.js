const launchesDatabase = require("./launches.mongo");
const planets = require("./planet.momgo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexData.com/v5/launches/query";

const saveLaunch = async (launch) => {
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
const findLaunch = async (filter) => {
  return await launchesDatabase.findOne(filter);
};
const isExistsLaunchId = async (id) => {
  return await findLaunch({ flightNumber: id });
};
const populateLaunches = async () => {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: { name: 1 },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc?.["payloads"];
    const customers = payloads?.flatMap((payloads) => {
      return payloads["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]?.["name"],
      launchDate: launchDoc?.["date_local"],
      success: launchDoc["success"],
      upcoming: launchDoc["upcoming"],
      customers,
    };

    await saveLaunch(launch);
    console.log(`Launched ${launch.flightNumber} saved.`);
  }
};
const loadLaunchesData = async () => {
  const firstLaunch = await findLaunch({ flightNumber: 1, rocket: "Falcon 1" });
  if (firstLaunch) {
    console.log("Launches data already loaded.");
    return;
  } else {
    await populateLaunches();
    console.log("Launches data loaded successfully.");
  }
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
const getAllLaunches = async (skip, limit) => {
  try {
    return await launchesDatabase
      .find({}, { _id: 0, __v: 0 })
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit);
  } catch (error) {
    console.log(error);
  }
};
const scudualNewLaunch = async (launch) => {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("no planet matching found..");
  }
  const flightNumber = (await getLastFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber,
    upcoming: true,
    success: true,
    customers: ["cm1", "cm2", "cm3"],
  });

  await saveLaunch(newLaunch);
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

module.exports = {
  loadLaunchesData,
  isExistsLaunchId,
  getAllLaunches,
  scudualNewLaunch,
  abortLaunchById,
};
