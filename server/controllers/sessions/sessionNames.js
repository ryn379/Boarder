import { prisma } from "../../lib/db.js";

export default async function sessionNames(req, res) {
  try {
    const flightNames = await prisma.flight.findMany({
      where: {
        boardingSession: {
          isNot: null,
        },
      },
      select: {
        flightCode: true,
      },
    });

    return res.status(200).json({
      flightNames,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in sessionNames.js",
    });
  }
}
