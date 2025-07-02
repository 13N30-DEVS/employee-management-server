# Employee Management System (EMS) Backend

A Fastify-based backend for employee management, featuring Sequelize ORM, Prisma migrations, JWT authentication, and modular API structure. This project is designed for scalability, maintainability, and ease of deployment (Docker-ready).

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Docker Usage](#docker-usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Fastify server with modular plugin and route loading
- Sequelize ORM for database access
- Prisma for migrations and seeders
- JWT-based authentication
- Swagger API documentation (`/docs` route)
- Docker and Docker Compose support
- Centralized error handling and logging

---

## Project Structure

```
EMS-BackEnd_Development/
├── src/
│   ├── api/v1/           # API version 1 (public/private routes)
│   ├── config/           # Environment and config
│   ├── helpers/          # Utilities (logger, response handler, etc.)
│   ├── interactors/      # Business logic
│   ├── models/           # Sequelize models
│   ├── plugins/          # Fastify plugins (JWT, Swagger, etc.)
│   ├── serializers/      # Response serializers
│   └── ...
├── prisma/               # Prisma schema, migrations, and seeders
├── Dockerfile            # Docker build file
├── compose.yaml          # Docker Compose file
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (or your configured DB)
- [Optional] Docker & Docker Compose

### Installation

```bash
npm install
```

### Database Setup

- Configure your `.env` file (see [Environment Variables](#environment-variables)).
- Run migrations:
  ```bash
  npm run migrate:create   # Create a new migration
  npm run migrate         # Run all migrations
  npm run seed            # Run all seeders
  ```

### Development

```bash
npm run dev
# or
npm run dev:local
```

### Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file in the root directory. Example variables:

```
DB_NAME=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
NODE_ENV=development
FRONT_END_URL=http://localhost:3000
S3_URL=your_s3_url
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET=your_aws_secret
AWS_BUCKET_NAME=your_bucket
BREVO_SMTP_SERVER=smtp.example.com
BREVO_PORT=587
BREVO_LOGIN=your_login
BREVO_USER=your_user
BREVO_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

---

## Available Scripts

- `npm run dev` / `npm run dev:local` — Start in development mode
- `npm start` — Start in production mode
- `npm run test` — Run tests
- `npm run migrate:create` — Create a new migration
- `npm run migrate` — Run all migrations
- `npm run seed` — Run all seeders

---

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/logIn`
  - Body: `{ "emailId": string, "password": string }`
  - Response: `{ "token": string, "meta": { "message": string } }`

### Departments

- **GET** `/api/v1/department/`
  - Query: `search`, `offset`, `limit`
  - Response: Paginated list of departments

### Designations

- **GET** `/api/v1/designation/`
  - Query: `search`, `offset`, `limit`
  - Response: Paginated list of designations

### File Upload (Private)

- **POST** `/api/v1/uploadFile/upload`
  - Headers: `Authorization: Bearer <token>`, `x-workspace-id: <id>`
  - Body: `multipart/form-data` with `file`
  - Response: `{ "fileName": string, "filePath": string, "fileURL": string, ... }`

---

## API Documentation

Interactive API docs available at: [http://localhost:3030/docs](http://localhost:3030/docs)

---

## Docker Usage

### Build Docker Image

```bash
docker build -t ems-backend .
```

### Run Docker Container

```bash
docker run -p 3030:3030 -d ems-backend
```

### Docker Compose

Edit `compose.yaml` as needed, then:

```bash
docker compose up --build
```

---

## Testing

```bash
npm run test
```

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

---

## License

[MIT](LICENSE)

---

## Contact

For questions, contact the maintainers or open an issue.
