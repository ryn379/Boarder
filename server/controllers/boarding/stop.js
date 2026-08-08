import { prisma } from "../../lib/prisma.js";

export default async function stopBoarding(req, res) {
  try {
    const { flightId } = req.params;

    const flight = await prisma.flight.findUnique({
      where: { flightCode: flightId },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found in stop.js",
      });
    }

    await prisma.boardingSession.delete({
      where: { flightId: flight.id },
    });
    return res.json({
      success: true,
      message: `${flightId} Boarding Complete`,
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in stop.js",
    });
  }
}
