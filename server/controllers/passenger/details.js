import { prisma } from "../../lib/prisma.js";
import { SteffenPerfect } from "../../steffen.js";

export default async function passengerDetails(req, res) {
  const { id } = req.params;

  console.log("this is in details.js");

  const passenger = await prisma.passenger.findUnique({
    where: { id: id },
  });

  if (!passenger) {
    return res.status(404).json({
      success: false,
      message: "Passenger Not Found",
    });
  }

  const flight = await prisma.flight.findUnique({
    where: { id: passenger.flightId },
    include: { passengers: true },
  });

  if (!flight) {
    return res.status(404).json({
      success: false,
      message: "Flight Not Found",
    });
  }

  const boarders = SteffenPerfect(flight);
  const boarder = boarders.find((b) => b.id === id);

  if (!boarder) {
    return res.status(404).json({
      success: false,
      message: "Passenger not found in boarding sequence",
    });
  }
  const q = boarder.queueNumber;

  return res.json({
    success: true,
    passenger: {
      ...passenger,
      queue: q,
    },
    flight,
  });
}
