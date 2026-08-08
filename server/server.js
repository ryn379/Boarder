import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import boardingRouter from "./routes/boarding.js";
import passengerRouter from "./routes/passenger.js";
import sessionRouter from "./routes/session.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api/boarding", boardingRouter);
app.use("/api/passenger", passengerRouter);
app.use("/api/sessions", sessionRouter);

const PORT = process.env.PORT || 8008;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
