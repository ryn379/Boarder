import { prisma } from "../../lib/db.js";
import { SteffenPerfect, BoardingGroups } from "../../steffen.js";

export default async function flightSearch(req, res) {
  try {
    const { flightId } = req.params;

    const flight = await prisma.flight.findUnique({
      where: { flightCode: flightId },
      include: { passengers: true },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found",
      });
    }

    const session = await prisma.boardingSession.findUnique({
      where: { flightId: flight.id },
    });

    const seq = SteffenPerfect(flight);
    const groups = BoardingGroups(seq, flight.layouts);

    const passengerMap = new Map();
    for (const p of flight.passengers) {
      passengerMap.set(p.seat, p.name);
    }

    const groupsWithNames = {};
    for (let i in groups) {
      groupsWithNames[i] = groups[i].map((person) => ({
        ...person,
        name: passengerMap[person.seat],
      }));
    }
    const boarding = Boolean(session);

    res.json({
      success: true,
      totalPassengers: seq.length,
      groups: groupsWithNames,
      sequence: seq,
      boarding,
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in flight.js",
    });
  }
}
