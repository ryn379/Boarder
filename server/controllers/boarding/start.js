import { prisma } from "../../lib/db.js";
import { SteffenPerfect } from "../../steffen.js";

export default async function startBoarding(req, res) {
  try {
    const { flightId } = req.params;

    const flight = await prisma.flight.findUnique({
      where: {
        flightCode: flightId,
      },
      include: {
        passengers: true,
      },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found",
      });
    }

    const existingSession = await prisma.boardingSession.findUnique({
      where: {
        flightId: flight.id,
      },
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "Boarding already started",
      });
    }

    const sequence = SteffenPerfect(flight);

    const boardedMatrix = flight.seats.map((row) =>
      row.map((seat) => (seat === 0 ? null : false)),
    );

    await prisma.boardingSession.create({
      data: {
        flightId: flight.id,
        sequence,
        boardedMatrix,
        startTime: new Date(),
        totalPassengers: sequence.length,
      },
    });

    res.json({
      success: true,
      message: "Boarding Started",
      boardedMatrix,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
