# WebExplorer - Backend

A robust backend for the Web Explorer application, built with [Elysia](https://elysiajs.com/) and [Bun](https://bun.sh/). This API handles file system metadata, folder structures, and search functionality using a Clean Architecture approach.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia](https://elysiajs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)
- **Middleware**: 
  - Custom Request Logger
  - CORS Support
  - Rate Limiting (50 req / 5s)

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
3. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
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

All endpoints are prefixed with `/v1/items`.

### `GET /v1/items`

Unified endpoint for listing and searching items. Controlled by query parameters:

| Query Param | Type | Description |
|-------------|------|-------------|
| `parentId` | `string` | Filter by parent folder ID. Omit for root-level items. |
| `keyword` | `string` | Search items by name. Combined with `parentId` to scope search within a folder. |
| `sortBy` | `string` | Sort field: `name`, `kind`, `createdAt`. Default: `name`. |
| `order` | `string` | Sort direction: `asc` or `desc`. Default: `asc`. |
| `limit` | `number` | Page size. Default: `50`. |
| `lastId` | `string` | Cursor for pagination (ID of the last item from previous page). |

**Examples:**

```
GET /v1/items                          → root children
GET /v1/items?parentId=<id>            → children of a folder
GET /v1/items?keyword=report           → global search
GET /v1/items?parentId=<id>&keyword=r  → search within a folder
GET /v1/items?sortBy=kind&order=desc   → sorted root children
```

### `POST /v1/items`
Create a new file or folder.

### `PATCH /v1/items/:id`
Update item metadata (e.g., rename).

### `DELETE /v1/items/:id`
Delete an item by ID.
