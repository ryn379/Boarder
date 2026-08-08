import { prisma } from "../../lib/prisma.js";

export default async function passengerSeated(req, res) {
  try {
    const { flightId } = req.params;
    let { queueNumber } = req.body;

    queueNumber = parseInt(queueNumber);

    if (Number.isNaN(queueNumber)) {
      return res.status(400).json({
        success: false,
        message: "queueNumber is required",
      });
    }

    const flight = await prisma.flight.findUnique({
      where: { flightCode: flightId },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight Not found in seated.js",
      });
    }

    const session = await prisma.boardingSession.findUnique({
      where: { flightId: flight.id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Boarding session not found",
      });
    }

    const sequence = session.sequence;
    const boardedMatrix = session.boardedMatrix;

    const passenger = sequence.find((item) => item.queueNumber === queueNumber);

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

    if (boardedMatrix[passenger.row][passenger.col]) {
      return res.status(400).json({
        success: false,
        message: "Passenger is already seated",
      });
    }

    boardedMatrix[passenger.row][passenger.col] = true;
    await prisma.passenger.update({
      where: { id: passenger.id },
      data: { boarded: true },
    });

    const boardedPassengers = session.boardedPassengers + 1;
    const group = passenger.row <= 10 ? "A" : passenger.row <= 20 ? "B" : "C";
    const boardedEvent = {
      id: passenger.id,
      queueNumber: passenger.queueNumber,
      name: passenger.name,
      seat: passenger.seat,
      group,
      boardedAt: new Date().toISOString(),
    };
    const boardingEvents = [...session.boardingEvents, boardedEvent];

    await prisma.boardingSession.update({
      where: { flightId: flight.id },
      data: {
        boardedMatrix,
        boardedPassengers,
        boardingEvents,
        endTime:
          boardedPassengers === session.totalPassengers
            ? new Date()
            : undefined,
      },
    });

    res.json({
      success: true,
      seatedPassenger: passenger,
      seatedCount: boardedPassengers,
      totalPassengers: session.totalPassengers,
      boardedMatrix,
      boardingComplete: boardedPassengers === session.totalPassengers,
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in seated.js",
    });
  }
}
