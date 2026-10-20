# Boarder

### Real-Time Airline Boarding Optimization System

Boarder is a full-stack web application that helps airline staff manage and monitor boarding sessions using the **Steffen Perfect boarding method**. It provides an interactive aircraft seating map, live passenger tracking, and real-time synchronization across all connected gate agents.

---

## View

**Passenger boarding pass — seat 5D, queue #16, flight AIR101 (Delhi → Mumbai)**
![Passenger home dashboard showing boarding pass, flight info, and boarded status](./client/public/home.png)

**Aircraft Dashboard — live view of flights currently boarding**
![Aircraft dashboard showing AIR205 and AIR101 with BOARDING status](./client/public/aircrafts.png)

**Live Boarding Status — interactive seat map updating in real time via Socket.IO**
![Live boarding status page showing seat map for AIR101 with 2/21 passengers boarded at 10% complete](./client/public/matrix.png)

---

## The Problem

Standard airline boarding methods — back-to-front, random, or zone-based — suffer from a shared failure: passengers in aisle seats sit down before window passengers arrive, forcing repeated stand-ups and slowing the entire plane. Studies show this adds **10–20 minutes** to average boarding time.

### The Solution

Boarder implements the **Steffen Perfect Method**, a mathematically optimized boarding sequence that:

1. **Boards window seats first** (outermost column tier), then middle, then aisle — eliminating the most common aisle-blocking scenario.
2. **Alternates between even and odd rows within each tier** — so adjacent passengers never compete for the overhead bin at the same time.
3. **Works back-to-front within each tier** — preserving the natural rear-to-front advantage without the aisle-blocking of pure back-to-front boarding.

The result is a deterministic queue where each passenger sits down without interference, minimizing total boarding time.

---

## Features

- **Boarding Optimization** — Generate a structured Steffen boarding sequence for any flight's seating layout.
- **Interactive Seat Map** — Visualize the aircraft cabin; seats update to boarded/unboarded in real time across all connected clients.
- **Real-Time Synchronization** — Socket.IO broadcasts boarding status updates to every gate agent the moment a passenger scans in.
- **Boarding Session Management** — Staff can start and stop boarding sessions; the system tracks the full boarding matrix and event timeline.
- **Boarding Group Progression** — Advance through groups (Window → Middle → Aisle) with a single staff action.
- **Passenger Lookup** — Search passengers by flight and retrieve individual passenger details.
- **Analytics Dashboard** — Live session metrics: boarding rate, average time per passenger, estimated completion, and group distribution.
- **JWT Authentication** — Stateless access tokens with cookie-based refresh token rotation.
- **Role-Based Access** — Separate staff and passenger views; staff-only routes enforced at the middleware layer.

---

## Tech Stack

| Layer          | Technologies                         |
| -------------- | ------------------------------------ |
| Frontend       | React 19, Vite                       |
| Styling        | Tailwind CSS 4                       |
| Routing & HTTP | React Router 7, Axios                |
| Backend        | Node.js, Express 5                   |
| Database       | PostgreSQL                           |
| ORM            | Prisma 7 (with `@prisma/adapter-pg`) |
| Real-Time      | Socket.IO 4                          |
| Authentication | JWT (`jsonwebtoken`), `bcrypt`       |

---

## Architecture

```mermaid
flowchart TD
    A["React Frontend (Vite)"]
    B["Express Backend (Node.js)"]
    C["Prisma ORM"]
    D[("PostgreSQL")]
    E["Steffen Algorithm (steffen.js)"]
    F["Socket.IO"]

    A -->|"REST API (Axios)"| B
    A <-->|"Socket.IO events"| F
    F <--> B
    B --> C
    C --> D
    B --> E
    E -->|"Computed sequence"| B
```

### How a boarding scan works

1. A passenger opens their boarding pass on the **React frontend** and taps "Check In".
2. The frontend sends a `POST /api/boarding/:flightId/seated` request with the passenger's JWT.
3. The **`authenticate` middleware** verifies the JWT; **`authorizeFlight` middleware** confirms the passenger belongs to this flight.
4. The **`passengerSeated` controller** reads the current `boardedMatrix` from PostgreSQL, marks the passenger's seat as `true`, and writes the updated matrix back.
5. The controller then calls `getIO().to(flightCode).emit("boardingUpdate", ...)`, broadcasting the new matrix and progress stats to **every client that joined the `flightCode` Socket.IO room**.
6. All connected staff dashboards and the passenger's own view update instantly — no polling required.

### How the Steffen sequence is built

When staff starts boarding (`POST /api/boarding/:flightId/start`), `SteffenPerfect(flight)` runs:

```
For each occupied seat:
  colTier = min(colIndex, totalColumns - 1 - colIndex)
  // 0 = window, 1 = middle, 2+ = aisle

Sort all passengers by:
  1. colTier ascending      → window boards before aisle
  2. even rows before odd   → alternating row interleaving
  3. row descending          → back of plane before front
  4. col ascending           → side-to-side slide alternation
```

Each passenger receives a `queueNumber` from this sort, which is their position in the optimal boarding order.

---

## Getting Started

### Prerequisites

- Node.js 22.12 or newer
- PostgreSQL (running locally or remote)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/ryn379/Boarder.git
cd Boarder
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/boarder?schema=public"
JWT_SECRET="replace_with_a_long_random_secret"
```

Create a PostgreSQL database named `boarder` and update the credentials above to match.

### 3. Initialize the Database

Apply the existing migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

> **Note:** Use `migrate deploy` (not `migrate dev`) since migration files are already committed to the repository. Running `migrate dev` would attempt to create a duplicate initial migration.

To load development seed data (flights and passengers):

```bash
npx prisma db seed
```

> **Warning:** The seed script deletes all existing application data before reseeding. Only run this against a disposable development database.

### 4. Start the Backend

```bash
npm run dev
```

The server starts on `http://localhost:8008`. Verify it's running:

```
GET http://localhost:8008/api/health
→ { "success": true, "message": "Server is running" }
```

### 5. Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Overview

All protected endpoints require an `Authorization: Bearer <access_token>` header unless noted otherwise.

| Method | Endpoint                            | Auth         | Purpose                                    |
| ------ | ----------------------------------- | ------------ | ------------------------------------------ |
| GET    | `/api/health`                       | None         | Server health check                        |
| POST   | `/api/auth/register`                | None         | Register a new account                     |
| POST   | `/api/auth/login`                   | None         | Authenticate and receive tokens            |
| POST   | `/api/auth/logout`                  | JWT          | Revoke session                             |
| GET    | `/api/auth/refresh`                 | Cookie       | Rotate access token via refresh cookie     |
| GET    | `/api/boarding/:flightId`           | JWT + Flight | Get flight data and boarding sequence      |
| POST   | `/api/boarding/:flightId/start`     | JWT + Staff  | Start a boarding session                   |
| POST   | `/api/boarding/:flightId/stop`      | JWT + Staff  | End a boarding session                     |
| POST   | `/api/boarding/:flightId/seated`    | JWT + Flight | Mark the requesting passenger as seated    |
| POST   | `/api/boarding/:flightId/group`     | JWT + Staff  | Advance to the next boarding group         |
| GET    | `/api/boarding/:flightId/status`    | JWT + Flight | Get current boarding matrix and progress   |
| GET    | `/api/boarding/:flightId/analytics` | JWT          | Get session analytics and event timeline   |
| GET    | `/api/passenger/:flightId/search`   | JWT + Flight | Search passengers on a flight              |
| GET    | `/api/passenger/details`            | JWT          | Get the requesting user's passenger record |
| GET    | `/api/sessions`                     | None         | List active session names                  |
| GET    | `/api/sessions/flights`             | None         | List flights with active sessions          |

**Auth levels:**

- `JWT` — valid access token required
- `JWT + Flight` — token required; user must be a passenger on the specified flight
- `JWT + Staff` — token required; user must have the `STAFF` role

---

## Project Structure

```text
Boarder/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── api/               # Axios instance, token helpers
│   │   ├── context/           # Auth context, protected routes
│   │   ├── pages/             # Route-level components
│   │   └── utility/           # Data-fetching and action helpers
│   └── vite.config.js
│
└── server/                    # Node.js / Express backend
    ├── controllers/
    │   ├── auth/              # Register, login, logout, refresh
    │   ├── boarding/          # Start, stop, seated, status, analytics, group
    │   ├── passenger/         # Search and details
    │   └── sessions/          # Active session queries
    ├── middleware/
    │   ├── authenticate.js    # JWT verification
    │   ├── authorize.js       # Flight-level passenger authorization
    │   └── requireStaff.js    # Staff role guard
    ├── prisma/
    │   ├── schema.prisma      # Data model
    │   ├── seed.js            # Development seed data
    │   └── migrations/        # Committed migration history
    ├── lib/db.js              # Singleton Prisma client (pg adapter)
    ├── socket.js              # Socket.IO setup and room management
    ├── steffen.js             # Boarding sequence algorithm
    └── server.js              # Application entry point
```

---

## Development

### Frontend

```bash
cd client
npm run lint
npm run build
```

### Backend

Automated tests are not configured yet (see Future Improvements).

```bash
cd server
npm run dev   # nodemon with hot reload
```

---

## Current Limitations

- **No atomic boarding updates** — The `passengerSeated` handler reads, mutates, and writes the `boardedMatrix` in a non-atomic sequence. Two simultaneous boarding scans at the exact same moment could produce a last-write-wins race condition. A future fix would use a PostgreSQL row-level lock or an atomic JSON update.
- **No automated tests** — Unit and integration tests are not yet written.
- **Single-server Socket.IO** — The Socket.IO instance is tied to one Node.js process. Horizontal scaling would require a Redis adapter to share room state across instances.
- **In-memory session state** — `sessions.js` retains a simple in-memory object as a remnant of an earlier design; active session state is now stored in PostgreSQL via `BoardingSession`.

---

## Future Improvements

- Automated unit tests for the Steffen algorithm and integration tests for the boarding API
- PostgreSQL advisory locks or atomic JSON updates to handle concurrent boarding scans safely
- Redis-backed Socket.IO adapter for multi-instance deployments
- Docker Compose setup for one-command local development
- Improved analytics: boarding curve visualization, group-by-group timing breakdowns
- Push notifications or SMS for passenger boarding group calls

---

## License

No license is currently specified. Add a `LICENSE` file if you intend to distribute this project for reuse.
