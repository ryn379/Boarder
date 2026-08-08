import { prisma } from "../../lib/prisma.js";

export default async function nextGroup(req, res) {
  try {
    console.log("This is nextGroup in group.js");
    const { flightId } = req.params;
    const { group } = req.body;

    const flight = await prisma.flight.findUnique({
      where: { flightCode: flightId },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "flight not found in group.js",
      });
    }

    if (group === "C") {
      await prisma.boardingSession.delete({
        where: { flightCode: flightId },
      });
      return res.json({
        success: true,
        complete: true,
      });
    }

    if (group === "B") {
      return res.json({
        success: true,
        complete: false,
        group: "C",
      });
    }

    if (group === "A") {
      return res.json({
        success: true,
        group: "B",
      });
    }

    return res.status(404).json({
      success: false,
      complete: false,
      message: "Group Not Found",
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error in group.js",
    });
  }
}
