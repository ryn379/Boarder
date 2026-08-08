import express from "express";
import sessionNames from "../controllers/sessions/sessionNames.js";
import sessionFlights from "../controllers/sessions/sessionFlights.js";

const router = express.Router();

router.get("/", sessionNames);

router.get("/flights", sessionFlights);
export default router;
