# Boarding Optimization System

## Overview

A full-stack, real-time web application designed to optimize the airline boarding process using **Steffen Perfect Method**. This system provides airline staff with a real-time dashboard to manage boarding sessions, visualize aircraft seating, track passenger flow, and minimize boarding delays.

## The Problem It Solves

Traditional airline boarding methods such as strictly back-to-front or block boarding are notoriously inefficient, often leading to aisle congestion, passenger frustration, and costly flight delays.
This application tackles this real-world problem by:

1. **Algorithmic Boarding**: Implementing the **Steffen Method**, grouping passengers strategically: window-to-aisle, alternating rows to minimize luggage loading bottlenecks and aisle interference.
2. **Synchronization**: Utilizing WebSockets to instantly update passenger boarding statuses across all staff devices, preventing double-boarding and keeping the entire gate team in sync.
3. **Data-Driven Operations**: Providing analytics and an interactive order table to help staff actively monitor and refine the boarding process.

##

- **Algorithmic Implementation**: Translated the theoretical Steffen Perfect Boarding algorithm into a practical, dynamic JavaScript utility (`steffen.js`) that calculates optimal boarding queues based on complex, variable aircraft seating layouts.
- **State ßanagement**: `Socket.io` to maintain a live `boardedMatrix`, ensuring that concurrent boarding scans by multiple gate agents are synchronized instantly without race conditions.
- **Scalable Database Design**: Designed a relational schema using **Prisma** that efficiently handles Flights, multidimensional Seat Matrice, Passengers, and complex Boarding Sessions.
- **Role-Based Access Control**: Implemented secure JWT-based authentication to distinguish between airline Staff and Passengers, coupled with Protected Routes on the React frontend.

## Tech Stack

**Frontend:**

- **React** & **Vite**: Modern, blazing-fast component-based UI development.
- **Tailwind CSS**: Highly customizable, utility-first styling for a clean, professional dashboard.
- **Socket.io**: Real-time event listeners for live seating matrix updates.

**Backend:**

- **Node.js** & **Express**: Scalable RESTful API architecture.
- **Prisma ORM**: Type-safe database interactions and schema management.
- **PostgreSQL**: Reliable relational data storage.
- **Socket.io**: Bi-directional, event-based communication.
- **JWT & bcrypt**: Secure, stateless session management and password hashing.

## Key Features

- **Live Aircraft Seating Matrix**: Visual representation of the plane, updating instantly (color-coded) as passengers scan their boarding passes.
- **Automated Grouping System**: Boarding groups generated automatically based on seating tiers (Window -> Middle -> Aisle) rather than arbitrary assignment.
- **Interactive Dashboards**: Dedicated views for Analytics, Aircraft Configuration, Passenger Lookup, and Order Tables.
- **Staff Authentication**: Secure login and registration portal for gate agents.

## Local Setup & Installation

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running

### 1. Clone the repository

```bash
git clone https://github.com/ryn379/Boarder
cd Boarding
```

### 2. Backend Setup

```bash
cd my-app/server
npm install

# Create a .env file and add your database connection string and JWT secret
# DATABASE_URL="postgresql://user:password@localhost:5432/boarding_db"
# JWT_SECRET="your_secret_key"

# Run Prisma migrations
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd my-app/client
npm install

# Start the Vite development server
npm run dev
```

The client will run on `http://localhost:5173` and the server on `http://localhost:8008`.

---

_Built to demonstrate full-stack capabilities, real-time system architecture, and algorithmic problem-solving._
