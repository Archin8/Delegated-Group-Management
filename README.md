# Delegated Group Management System

A robust system for managing groups with customizable role-based access control (RBAC) and delegated administration capabilities. This full-stack application provides a modern, secure, and scalable solution for group management.

## Features

- **Role-Based Access Control (RBAC)**

  - Hierarchical, multi-tier roles within groups
  - Custom role definitions per group
  - Role inheritance and priority system
  - Granular permission management

- **Group Management**

  - Create and manage multiple groups
  - Customizable group settings
  - Group member management
  - Join request system with approval workflow

- **User Management**

  - Secure authentication with JWT
  - User profile management
  - Role assignment and management
  - Permission-based access control

- **Security**
  - JWT-based authentication
  - Role-based authorization
  - Secure password handling
  - Protected API endpoints

## Tech Stack

### Frontend

- React with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls
- Redux Toolkit for state management

### Backend

- Node.js with TypeScript
- Express.js framework
- TypeORM for database operations
- PostgreSQL database
- JWT for authentication
- Class-validator for input validation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Git

## Setup

1. Clone the repository:

```bash
git clone https://github.com/nakulkalra/Delegated-Group-Management-System.git
cd delegated-group-management-system
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:

Backend (.env):

```bash
# Copy the example env file
cp .env.example .env

# Required environment variables
DATABASE_URL=postgresql://username:password@localhost:5432/delegated_group_management
JWT_SECRET=your_jwt_secret
PORT=3001
```

Frontend (.env):

```bash
# Copy the example env file
cp .env.example .env

# Required environment variables
REACT_APP_API_URL=http://localhost:3001
```

4. Database setup:

```bash
# Create PostgreSQL database
createdb delegated_group_management

# Run migrations
cd backend
npm run typeorm migration:run
```

5. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main application component
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
│
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── entities/      # TypeORM entities
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── .env.example       # Example environment variables
│   └── package.json       # Backend dependencies
│
└── README.md
```

## API Documentation

The API documentation is available at `/api-docs` when the backend server is running. The documentation includes:

- Available endpoints
- Request/response formats
- Authentication requirements
- Example requests

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style

The project uses ESLint and Prettier for code formatting. To check your code:

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
