import { prisma } from "../../lib/db.js";
import { flights, passengers } from "../data.js";

async function main() {
  console.log("this is in seed.js");

  await prisma.passenger.deleteMany();
  await prisma.boardingSession.deleteMany();
  await prisma.flight.deleteMany();

  const flightToDB = new Map();
  const flightEntries = Object.values(flights);

  for (const f of flightEntries) {
    const newFlight = await prisma.flight.create({
      data: {
        flightCode: f.id,
        aircraft: f.aircraft,
        airline: f.airline,
        origin: f.from,
        destination: f.to,
        departure: new Date(f.departure),
        arrival: new Date(f.arrival),
        gate: f.gate,
        terminal: f.terminal,
        delay: f.delay,
        status: f.status,
        boardingStarted: f.boardingStarted ? new Date(f.boardingStarted) : null,
        layouts: f.layouts || [],
        seats: f.seats || [],
      },
    });
    flightToDB.set(f.id, newFlight.id);
  }

  for (const p of passengers) {
    const flightDbId = flightToDB.get(p.flight);
    if (!flightDbId) {
      console.warn(`Flight ${p.flight}" not found for passenger ${p.name}`);
      continue;
    }
    const passenger = await prisma.passenger.create({
      data: {
        name: p.name,
        seat: p.seat,
        row: p.row,
        col: p.col,
        boarded: p.boarded ?? false,
        flightId: flightDbId,
      },
    });
    console.log("Passenger ID:", passenger.id);
  }
}

main()
  .then(async () => {
    console.log("Seeding now");
  })
  .catch((err) => {
    console.log(err);
    console.log(err.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
