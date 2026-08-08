import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import boardingRouter from "./routes/boarding.js";
import passengerRouter from "./routes/passenger.js";
import sessionRouter from "./routes/session.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api/boarding", boardingRouter);
app.use("/api/passenger", passengerRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 8008;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
