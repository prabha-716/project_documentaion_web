# Project Management Web Application

A full-stack project management system built with Spring Boot and Next.js.

## Features

- **Authentication**
  - Google OAuth2 Sign-in
  - Traditional username/password login
  - Secure JWT-based sessions

- **Project Management**
  - Create, read, update, and delete projects
  - Store project details (title, description, technologies)
  - Link to GitHub repositories
  - Attach file paths and document URLs
  - Track creation and modification dates

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0 (Java 17)
- **Database**: PostgreSQL
- **Security**: Spring Security with OAuth2 Client
- **Authentication**: JWT tokens
- **API**: RESTful JSON

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Language**: TypeScript

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Next.js       │         │   Spring Boot   │         │   PostgreSQL    │
│   Frontend      │────────▶│   Backend       │────────▶│   Database      │
│   (Port 3000)   │  Axios  │   (Port 8080)   │   JPA   │   (Port 5432)   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE project_data;
\q
```

The application will automatically create tables on first run.

### 2. Backend Setup

```bash
cd backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## Configuration

### Backend Configuration
Location: `backend/src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/project_data
spring.datasource.username=postgres
spring.datasource.password=1234

# OAuth2 Google
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET

# JWT
jwt.secret=YOUR_JWT_SECRET
jwt.expiration=86400000
```

### Frontend Configuration
Location: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user
- `GET /oauth2/authorization/google` - Google OAuth2 login

### Projects
- `GET /api/projects` - Get all user projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

## Project Structure

### Backend
```
backend/
├── src/main/java/com/projectmanager/
│   ├── config/          # Security & CORS configuration
│   ├── controller/      # REST controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── exception/      # Exception handlers
│   ├── repository/     # Data repositories
│   ├── security/       # Security components
│   └── service/        # Business logic
└── pom.xml
```

### Frontend
```
frontend/
├── src/
│   ├── lib/            # API clients & utilities
│   ├── pages/          # Next.js pages
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── dashboard.tsx
│   │   ├── oauth/
│   │   └── projects/
│   └── styles/         # Global styles
└── package.json
```

## OAuth2 Flow

1. User clicks "Sign in with Google"
2. Browser redirects to Google authentication
3. After successful login, Google redirects to backend
4. Backend creates/finds user in database
5. Backend generates JWT token
6. Backend redirects to frontend with token
7. Frontend stores token and fetches user data
8. User is logged in

## Security Features

- CORS configured for frontend origin
- JWT token authentication
- Password encryption with BCrypt
- OAuth2 integration with Google
- Protected API endpoints
- Session management

## Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production

Backend:
```bash
cd backend
mvn clean package
java -jar target/project-management-backend-1.0.0.jar
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

## License

MIT
