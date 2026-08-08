import { prisma } from "../../lib/db.js";

export default async function sessionFlights(req, res) {
  try {
    const boardingFlights = await prisma.flight.findMany({
      where: { boardingSession: { isNot: null } },
    });

    const now = new Date();
    const fiveHoursLater = new Date(now.getTime() + 5 * 60 * 60 * 1000);

    const upcomingFlights = await prisma.flight.findMany({
      where: {
        departure: {
          gte: now,
          lte: fiveHoursLater,
        },
      },
    });

    console.log("this is in sessionFlights");
    console.log(boardingFlights);
    console.log(upcomingFlights);
    res.json({
      success: true,
      boardingFlights,
      upcomingFlights,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in sessionFlights.js",
    });
  }
}
