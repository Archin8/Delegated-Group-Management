# Delegated Group Management System

A robust system for managing groups with customizable role-based access control (RBAC) and delegated administration capabilities.

## Features

- Hierarchical, multi-tier roles within groups
- Delegated admins with limited scope of management
- Custom role definitions per group
- Group-based access control with role-specific permissions
- Role conflict management
- Real-time notifications
- JWT-based authentication

## Tech Stack

- Backend:
  - TypeScript
  - Node.js
  - Express.js
  - TypeORM
  - PostgreSQL
  - JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd delegated-group-management-system
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install
```

3. Configure environment variables:

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
```

4. Database setup:

```bash
# Create PostgreSQL database
createdb delegated_group_management

# Run migrations (when available)
npm run typeorm migration:run
```

5. Start the development server:

```bash
npm run dev
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── entities/       # TypeORM entities
│   ├── middlewares/    # Custom middlewares
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── .env.example        # Example environment variables
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## API Documentation

The API documentation will be available at `/api-docs` when the server is running.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
