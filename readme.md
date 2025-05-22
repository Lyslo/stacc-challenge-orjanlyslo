# Budgeting and savings challenge solution 💰

# Full Stack Web Application

This is a full-stack web application built with React (TypeScript + Tailwind CSS) and FastAPI, using PostgreSQL as the database.

## Architecture

- Frontend: React with TypeScript and Tailwind CSS
- Backend: FastAPI (Python)
- Database: PostgreSQL
- Containerization: Docker and Docker Compose

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Lyslo/stacc-challenge-orjanlyslo.git
cd stacc-challenge-orjanlyslo
```

2. Start the application:
```bash
docker-compose up --build
```

This will start all services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

## Development

The application is configured with hot-reloading for both frontend and backend:

- Frontend changes will automatically reload in the browser
- Backend changes will automatically reload the server

## API Endpoints

- `GET /ping`: Health check endpoint
- `GET /health`: Database health check endpoint

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string (default: postgresql://postgres:postgres@db:5432/postgres)

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)
