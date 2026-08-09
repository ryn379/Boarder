import { prisma } from "../../lib/db.js";

export default async function passengerSearch(req, res) {
  try {
    const { flightId } = req.params;
    const { input } = req.query;

    const flight = req.flight;

    const session = await prisma.boardingSession.findUnique({
      where: { flightId: flight.id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "flight has not started boarding",
      });
    }

    console.log(flightId);
    console.log(session.sequence[0]);

    const sequence = Array.isArray(session.sequence) ? session.sequence : [];
    const boardedMatrix = Array.isArray(session.boardedMatrix)
      ? session.boardedMatrix
      : [];

    const search = input.trim();

    if (/^\d+$/.test(search)) {
      //QueueNumber
      console.log("this is in Queue Number");
      const queueNumber = parseInt(search);

      const passenger = sequence.find(
        (item) => item.queueNumber === queueNumber,
      );

      if (!passenger) {
        return res.status(404).json({
          success: false,
          message: "Queue Number Not Found",
        });
      }

      const seated = Boolean(boardedMatrix?.[passenger.row]?.[passenger.col]);
      let group = getColumnTier(passenger);

      return res.json({
        success: true,
        passengers: {
          ...passenger,
          group,
          seated,
        },
      });
    } else if (/^\d+[A-F]$/i.test(search)) {
      //Seat
      console.log("this is in Seat");
      const seat = search.toUpperCase();

      const passenger = sequence.find((item) => item.seat === seat);

      if (!passenger) {
        return res.status(404).json({
          success: false,
          message: "Seat Not Found",
        });
      }

      const seated = Boolean(boardedMatrix?.[passenger.row]?.[passenger.col]);
      let group = getColumnTier(passenger);

      return res.json({
        success: true,
        passengers: {
          ...passenger,
          group,
          seated,
        },
      });
    } else {
      //name
      const name = search.toLowerCase();
      const passenger = sequence.filter(
        (item) => item.name.toLowerCase() === name,
      );

      if (passenger.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Name Not Found",
        });
      }

      const result = passenger.map((name) => {
        const seated = Boolean(boardedMatrix?.[name.row]?.[name.col]);
        let group = getColumnTier(name);
        return {
          ...name,
          group,
          seated,
        };
      });
      return res.json({
        success: true,
        passengers: result,
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

function getColumnTier(name) {
  let group;
  if (name.colTier === 0) {
    group = "A";
  } else if (name.colTier === 1) {
    group = "B";
  } else {
    group = "C";
  }
  return group;
}
