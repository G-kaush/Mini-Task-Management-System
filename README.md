
# Mini Task Management System

A full-stack web application for managing tasks with secure authentication and role-based access control.

---

# Project Overview

The **Mini Task Management System** allows users to manage tasks efficiently through a web interface.

The system supports user authentication, task creation, updates, deletion, and status management.

## Key Features
- **User Authentication** using JWT
- **Secure password hashing** using BCrypt
- **Role-Based Access Control**
  - **ADMIN** – Can view all tasks in the system
  - **USER** – Can manage only their own tasks
- **Task Management**
  - Create tasks
  - Update tasks
  - Delete tasks
  - Mark tasks as completed
  - Filter tasks by status or priority
  - Sort tasks by due date or priority

## Technology Stack

### Backend
- Java 17
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Maven

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Axios

---

# Setup Instructions

## Prerequisites

Make sure the following software is installed:

- **Java 17 or higher**
- **Maven 3.6+**
- **MySQL 8.0+**
- **Node.js 18+**

Clone the repository:

```bash
git clone https://github.com/your-repository/Mini-Task-Management-System.git
cd Mini-Task-Management-System
```

---

# Database Configuration

## 1. Create the Database

```sql
CREATE DATABASE task_management;
```

## 2. Run the Schema File

```bash
mysql -u root -p < database/schema.sql
```

## 3. Configure Database Properties

Update the backend configuration file:

`backend/task-management-system/src/main/resources/application.properties`

Example configuration:

```
spring.datasource.url=jdbc:mysql://localhost:3306/task_management
spring.datasource.username=root
spring.datasource.password=your_password

jwt.secret=your_jwt_secret
jwt.expiration=86400000
```

## Generate JWT Secret (Optional)

```bash
openssl rand -base64 64
```

---

# Steps to Run the Application

## 1. Run the Backend

Navigate to the backend folder:

```bash
cd backend/task-management-system
```

Run using Maven:

**Windows**

```bash
.\mvnw.cmd spring-boot:run
```

**Linux / Mac**

```bash
./mvnw spring-boot:run
```

Backend server:

```
http://localhost:8081
```

---

## 2. Run the Frontend

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend application:

```
http://localhost:3000
```

---

## Default Admin Account

When the application starts for the first time, a default admin user is created:

```
Username: admin
Password: admin123
```
Change this password in production environments.
