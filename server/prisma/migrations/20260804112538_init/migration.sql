-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('SCHEDULED', 'BOARDING', 'DELAYED', 'DEPARTED');

-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL,
    "flightCode" TEXT NOT NULL,
    "aircraft" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departure" TIMESTAMP(3) NOT NULL,
    "arrival" TIMESTAMP(3) NOT NULL,
    "gate" TEXT,
    "terminal" TEXT,
    "delay" INTEGER NOT NULL DEFAULT 0,
    "status" "FlightStatus" NOT NULL DEFAULT 'SCHEDULED',
    "boardingStarted" TIMESTAMP(3),
    "layouts" TEXT[],
    "seats" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passenger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seat" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL,
    "boarded" BOOLEAN NOT NULL DEFAULT false,
    "flightId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardingSession" (
    "id" TEXT NOT NULL,
    "sequence" JSONB NOT NULL,
    "boardedMatrix" JSONB NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "totalPassengers" INTEGER NOT NULL DEFAULT 0,
    "boardedPassengers" INTEGER NOT NULL DEFAULT 0,
    "boardedEvents" INTEGER NOT NULL DEFAULT 0,
    "noShows" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flightId" TEXT NOT NULL,

    CONSTRAINT "BoardingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flight_flightCode_key" ON "Flight"("flightCode");

-- CreateIndex
CREATE INDEX "Passenger_flightId_idx" ON "Passenger"("flightId");

-- CreateIndex
CREATE UNIQUE INDEX "Passenger_flightId_seat_key" ON "Passenger"("flightId", "seat");

-- CreateIndex
CREATE UNIQUE INDEX "BoardingSession_flightId_key" ON "BoardingSession"("flightId");

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardingSession" ADD CONSTRAINT "BoardingSession_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE CASCADE ON UPDATE CASCADE;
