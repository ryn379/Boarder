import { prisma } from "../../lib/db.js";
import { SteffenPerfect } from "../../steffen.js";

import { getIO } from "../../socket.js";

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

    const io = getIO();

    io.to(flight.flightCode).emit("boardingUpdate", {
      flightCode: flight.flightCode,
      passengers: sequence.map((passenger) => ({
        ...passenger,
        seated: boardedMatrix[passenger.row][passenger.col],
      })),
      seatedCount: 0,
      totalPassengers: sequence.length,
      progress: 0,
      boardedMatrix,
      boardingComplete: false,
    });

    io.emit("sessionStarted", {
      flightCode: flight.flightCode,
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
