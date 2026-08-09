import express from "express";

import passengerSearch from "../controllers/passenger/searching.js";
import passengerDetails from "../controllers/passenger/details.js";

import authenticate from "../middleware/authenticate.js";
import authorizeFlight from "../middleware/authorize.js";

const router = express.Router();

router.get("/:flightId/search", authenticate, authorizeFlight, passengerSearch);
router.get("/details", authenticate, passengerDetails);

export default router;
