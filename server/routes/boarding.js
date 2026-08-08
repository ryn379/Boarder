import express from "express";
import { flights, passengers } from "../data.js";
import { SteffenPerfect, BoardingGroups } from "../steffen.js";

import startBoarding from "../controllers/boarding/start.js";
import flightSearch from "../controllers/boarding/flight.js";
import stopBoarding from "../controllers/boarding/stop.js";
import passengerSeated from "../controllers/boarding/seated.js";
import boardingStatus from "../controllers/boarding/status.js";
import nextGroup from "../controllers/boarding/group.js";
import getAnalytics from "../controllers/boarding/analytics.js";

import sessions from "../sessions.js";

const router = express.Router();

router.post("/:flightId/start", startBoarding);
router.post("/:flightId/stop", stopBoarding);
router.post("/:flightId/seated", passengerSeated);
router.post("/:flightId/group", nextGroup);
router.get("/:flightId", flightSearch);
router.get("/:flightId/status", boardingStatus);
router.get("/:flightId/analytics", getAnalytics);

export default router;
