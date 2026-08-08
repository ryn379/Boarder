import express from "express";

import passengerSearch from "../controllers/passenger/searching.js";
import passengerDetails from "../controllers/passenger/details.js";

const router = express.Router();

router.get("/:flightId/:input/search", passengerSearch);
router.get("/:id/details", passengerDetails);

export default router;
