import { prisma } from "../lib/db.js";

export default async function authorizeFlight(req, res, next) {
  try {
    const userId = req.user?.id;
    const { flightId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (!flightId) {
      return res.status(400).json({
        success: false,
        message: "Flight Required",
      });
    }

    const passenger = await prisma.passenger.findUnique({
      where: { userId },
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger Not Found",
      });
    }

    const flight = await prisma.flight.findUnique({
      where: { flightCode: flightId },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight Not Found",
      });
    }

    if (passenger.flightId !== flight.id) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to see this flight",
      });
    }

    req.passenger = passenger;
    req.flight = flight;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
