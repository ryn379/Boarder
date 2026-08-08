import { prisma } from "../../lib/prisma.js";

export default async function boardingStatus(req, res) {
  try {
    const { flightId } = req.params;

    const flight = await prisma.flight.findUnique({
      where: { flightCode: flightId },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found in status.js",
      });
    }

    const session = await prisma.boardingSession.findUnique({
      where: { flightId: flight.id },
    });

    if (!session) {
      return res.json({
        success: false,
        message: "Boarding session not found in status.js",
      });
    }

    const sequence = session.sequence;
    const boardedMatrix = session.boardedMatrix;

    const passengers = sequence.map((passenger) => ({
      ...passenger,
      seated: boardedMatrix[passenger.row][passenger.col],
    }));

    const seatedCount = passengers.filter(
      (passenger) => passenger.seated,
    ).length;

    const progress =
      session.sequence.length === 0
        ? 100
        : Math.round((seatedCount / session.sequence.length) * 100);

    res.json({
      success: true,
      passengers,
      seatedCount,
      totalPassengers: passengers.length,
      progress,
      boardedMatrix: session.boardedMatrix,
      boardingComplete: seatedCount === passengers.length,
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in status.js",
    });
  }
}
