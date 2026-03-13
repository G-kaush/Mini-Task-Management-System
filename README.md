# Mini Task Management System

A full-stack web application for managing tasks with user authentication and role-based access control.

## Project Overview

This Mini Task Management System allows users to:
- Register and login with JWT-based authentication
- Create, update, delete, and view tasks
- Filter tasks by status and priority
- Sort tasks by due date or priority
- Mark tasks as completed

### Features
- **User Authentication**: JWT-based authentication with secure password handling (BCrypt)
- **Role-Based Access Control**: Two roles - ADMIN and USER
  - **ADMIN**: Can view all tasks in the system
  - **USER**: Can only manage their own tasks
- **Task Management**: Full CRUD operations with filtering, sorting, and pagination

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.5
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Axios for API calls
- js-cookie for token management

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](docs/SETUP.md) | Step-by-step setup guide |
| [BACKEND.md](docs/BACKEND.md) | Backend architecture and details |
| [FRONTEND.md](docs/FRONTEND.md) | Frontend structure and components |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture diagrams |
| [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Complete API reference |

## Project Structure

```
Mini-Task-Management-System/
├── backend/
│   └── task-management-system/
│       ├── src/main/java/com/taskmanager/system/
│       │   ├── config/          # Security and app configuration
│       │   ├── controller/      # REST API endpoints
│       │   ├── dto/             # Data Transfer Objects
│       │   ├── entity/          # JPA entities
│       │   ├── exception/       # Custom exceptions and global handler
│       │   ├── repository/      # JPA repositories
│       │   ├── security/        # JWT utilities and filters
│       │   └── service/         # Business logic
│       └── src/main/resources/
│           └── application.properties
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # Reusable React components
│   │   ├── context/             # React Context providers
│   │   ├── services/            # API service layer
│   │   └── types/               # TypeScript type definitions
│   ├── .env.local               # Environment variables
│   └── package.json
├── database/
│   └── schema.sql              # Database schema
├── docs/
│   ├── API_DOCUMENTATION.md    # API documentation
│   ├── ARCHITECTURE.md         # System architecture
│   ├── BACKEND.md              # Backend documentation
│   ├── FRONTEND.md             # Frontend documentation
│   └── SETUP.md                # Setup guide
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+ (for frontend)

### Database Configuration

1. **Create the database:**
   ```sql
   CREATE DATABASE task_management;
   ```

2. **Or run the schema file:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### Environment Variables

Create environment variables or update `application.properties`:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_URL` | Database JDBC URL | `jdbc:mysql://localhost:3306/task_management` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | `` |
| `JWT_SECRET` | Secret key for JWT (min 256 bits, Base64 encoded) | (default provided) |
| `JWT_EXPIRATION` | Token expiration in milliseconds | `86400000` (24 hours) |

**Generate a secure JWT secret:**
```bash
# Using OpenSSL
openssl rand -base64 64
```

### Running the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend/task-management-system
   ```

2. **Run with Maven:**
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run
   
   # Linux/Mac
   ./mvnw spring-boot:run
   ```

3. **Or build and run the JAR:**
   ```bash
   .\mvnw.cmd clean package -DskipTests
   java -jar target/task-management-system-0.0.1-SNAPSHOT.jar
   ```

The backend will start at `http://localhost:8081`

### Default Admin User

On first startup, a default admin user is created:
- **Username:** `admin`
- **Password:** `admin123`

> **Important:** Change the admin password in production!

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`

## API Documentation

See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete API documentation.

### Quick API Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/tasks` | Get all tasks (paginated) | Yes |
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks/{id}` | Get task by ID | Yes |
| PUT | `/api/tasks/{id}` | Update task | Yes |
| DELETE | `/api/tasks/{id}` | Delete task | Yes |
| PATCH | `/api/tasks/{id}/complete` | Mark task as done | Yes |
| GET | `/api/users/me` | Get current user | Yes |
| GET | `/api/users` | Get all users | Yes (Admin) |

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Create Task (with token):**
```bash
curl -X POST http://localhost:8081/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My First Task","description":"Task description","priority":"HIGH","dueDate":"2026-03-20"}'
```

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email |
| password | VARCHAR(255) | BCrypt hashed password |
| role | ENUM | USER or ADMIN |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Tasks Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| title | VARCHAR(255) | Task title |
| description | TEXT | Task description |
| status | ENUM | TODO, IN_PROGRESS, DONE |
| priority | ENUM | LOW, MEDIUM, HIGH |
| due_date | DATE | Task due date |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| user_id | BIGINT | Foreign key to users |

## Security Considerations

- Passwords are hashed using BCrypt
- JWT tokens expire after 24 hours (configurable)
- CORS is configured for localhost:3000
- All task endpoints require authentication
- Role-based access control on sensitive endpoints

