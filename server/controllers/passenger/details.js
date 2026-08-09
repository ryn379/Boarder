import { prisma } from "../../lib/db.js";
import { SteffenPerfect } from "../../steffen.js";
import jwt from "jsonwebtoken";

export default async function passengerDetails(req, res) {
  try {
    const userId = req.user?.id;

    console.log("this is in details.js");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication Failed",
      });
    }

    const passenger = await prisma.passenger.findUnique({
      where: {
        userId,
      },
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger Not Found",
      });
    }

    const flight = await prisma.flight.findUnique({
      where: {
        id: passenger.flightId,
      },
      include: {
        passengers: true,
      },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight Not Found",
      });
    }

    const boarders = SteffenPerfect(flight);

    const boarder = boarders.find((b) => b.id === passenger.id);

    if (!boarder) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found in boarding sequence",
      });
    }

    const queue = boarder.queueNumber;

    return res.json({
      success: true,

      passenger: {
        ...passenger,
        queue,
      },

      flight,
    });
  } catch (err) {
    console.error("passengerDetails error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
