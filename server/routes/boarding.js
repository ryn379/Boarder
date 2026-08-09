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

import authenticate from "../middleware/authenticate.js";
import authorizeFlight from "../middleware/authorize.js";
import staff from "../middleware/requireStaff.js";

import sessions from "../sessions.js";

const router = express.Router();

router.post("/:flightId/start", authenticate, staff, startBoarding);
router.post("/:flightId/stop", authenticate, staff, stopBoarding);
router.post(
  "/:flightId/seated",
  authenticate,
  authorizeFlight,
  passengerSeated,
);
router.post("/:flightId/group", authenticate, staff, nextGroup);
router.get("/:flightId", flightSearch);
router.get("/:flightId/status", authenticate, authorizeFlight, boardingStatus);
router.get("/:flightId/analytics", authenticate, getAnalytics);

export default router;
