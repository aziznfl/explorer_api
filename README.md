# WebExplorer - Backend

A robust backend for the Web Explorer application, built with [Hono](https://hono.dev/) and [Bun](https://bun.sh/). This API handles file system metadata, folder structures, and search functionality using a Clean Architecture approach.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Hono](https://hono.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)
- **Middleware**: 
  - Custom Request Logger
  - CORS Support
  - Rate Limiting (20 req / 5s)

## 🏗 Architecture

The project follows **Clean Architecture** principles to ensure maintainability, scalability, and testability:

- **src/domain**: Core business logic, Entities, DTOs, Repository Interfaces, and custom Errors.
- **src/application**: Use cases that coordinate domain objects.
- **src/infrastructure**: External tools implementation (Database, Repositories, Middlewares).
- **src/interfaces**: Controllers and Routes defining the API surface.

## 🛠 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- PostgreSQL database.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/explorer_db
   PORT=3000
   ```

### Database Management

- **Generate Migrations**: `bun run db:generate`
- **Run Migrations**: `bun run db:migrate`
- **Seed Data**: `bun run seed`
- **Drizzle Studio**: `bun run db:studio` (GUI for DB)

### Development

Run the development server with hot-reload:
```bash
bun run dev
```

### Testing

Run unit and integration tests:
```bash
bun run test
```

## 📡 API Endpoints

The primary endpoint is `/items`, which handles:

- `GET /items/root/children`: Fetch root-level items (folders and files).
- `GET /items/:id/children`: Fetch children of a specific folder.
- `GET /items/search`: Search for items across the file system.
- `POST /items`: Create new file or folder.
- `DELETE /items/:id`: Delete an item (soft or hard delete depending on implementation).
- `PATCH /items/:id`: Update item metadata (e.g., rename).
