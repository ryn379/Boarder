import { prisma } from "../../lib/prisma.js";

export default async function getAnalytics(req, res) {
  try {
    console.log("this is getAnalytics in analytics.js");
    const { flightId } = req.params;

    const flight = await prisma.flight.findUnique({
      where: { flightCode: flightId },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found in analytics.js",
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

    const boardingEvents = Array.isArray(session.boardingEvents)
      ? session.boardingEvents
      : [];
    const noShows = Array.isArray(session.noShows) ? session.noShows : [];
    const startTime = session.startTime;
    const totalPassengers = session.totalPassengers;
    const boardedPassengers = session.boardedPassengers;

    const elapsed = (Date.now() - startTime) / 1000;

    const progress =
      totalPassengers === 0
        ? 0
        : Number(((boardedPassengers / totalPassengers) * 100).toFixed(1));

    const averageBoardingTime =
      boardedPassengers === 0
        ? 0
        : Number((elapsed / boardedPassengers).toFixed(2));

    const boardingRate =
      elapsed === 0 ? 0 : Number((boardedPassengers / elapsed).toFixed(2));

    const remainingPassengers = totalPassengers - boardedPassengers;

    const estimatedCompletion =
      boardedPassengers === 0
        ? null
        : Math.round(remainingPassengers * averageBoardingTime);

    const groupDistribution = {
      A: 0,
      B: 0,
      C: 0,
    };

    boardingEvents.forEach((event) => {
      if (event.group in groupDistribution) {
        groupDistribution[event.group]++;
      }
    });

    const timeline = boardingEvents.map((event) => ({
      ...event,
      elapsed: Number(
        (
          (new Date(event.boardedAt).getTime() - startTime.getTime()) /
          1000
        ).toFixed(1),
      ),
    }));

    res.json({
      success: true,
      analytics: {
        totalPassengers,
        boardedPassengers,
        remainingPassengers,
        progress,
        averageBoardingTime,
        boardingRate,
        estimatedCompletion,
        noShows: noShows.length,
        groupDistribution,
        boardingEvents: timeline,
      },
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in analytics.js",
    });
  }
}
