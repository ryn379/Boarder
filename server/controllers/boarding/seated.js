import { prisma } from "../../lib/db.js";

export default async function passengerSeated(req, res) {
  try {
    const flight = req.flight;
    const passenger = req.passenger;

    const session = await prisma.boardingSession.findUnique({
      where: { flightId: flight.id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Boarding session not found",
      });
    }

    const sequence = Array.isArray(session.sequence) ? session.sequence : [];
    const boardedMatrix = Array.isArray(session.boardedMatrix)
      ? session.boardedMatrix
      : [];

    const passengerInSequence = sequence.find(
      (item) => item.id === passenger.id,
    );

    if (!passengerInSequence) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found in boarding sequence",
      });
    }

    if (boardedMatrix[passengerInSequence.row][passengerInSequence.col]) {
      return res.status(400).json({
        success: false,
        message: "Passenger is already seated",
      });
    }

    boardedMatrix[passengerInSequence.row][passengerInSequence.col] = true;

    await prisma.passenger.update({
      where: { id: passengerInSequence.id },
      data: { boarded: true },
    });

    const boardedPassengers = session.boardedPassengers + 1;
    const group =
      passengerInSequence.row <= 10
        ? "A"
        : passengerInSequence.row <= 20
          ? "B"
          : "C";
    const boardedEvent = {
      id: passengerInSequence.id,
      queueNumber: passengerInSequence.queueNumber,
      name: passengerInSequence.name,
      seat: passengerInSequence.seat,
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
      seatedPassenger: passengerInSequence,
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
