# Node.js Task Manager API

A modern task management API built with Node.js, Express, and MariaDB, containerized with Docker.

## 🚀 Features

- Full CRUD operations for tasks
- Docker containerization
- MariaDB database integration
- Health check monitoring
- RESTful API design
- Automatic database initialization

## 🛠 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MariaDB
- **Containerization**: Docker & Docker Compose
- **API**: RESTful with CORS support

## 🏃‍♂️ Quick Start

1. Clone and run with Docker:

```bash
git clone https://github.com/yourusername/node-task-manager-api.git
cd node-task-manager-api
docker-compose up --build
```

2. API will be available at `http://localhost:5002`

## 📡 API Endpoints

```bash
# Tasks
GET    /tasks     # Get all tasks
POST   /tasks     # Create task
PUT    /tasks/:id # Update task
DELETE /tasks/:id # Delete task

# Health
GET    /health    # Check API status
```

## 🏗️ Project Structure

```
node-task-manager-api/
├── src/          # Source code
├── docker/       # Docker configuration
└── config/       # App configuration
```

## 🔧 Development

```bash
# Start development
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 License

MIT License
