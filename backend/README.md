# Project Management Backend

Spring Boot REST API for project management system.

## Quick Start

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

Server starts at: `http://localhost:8080`

## Database Configuration

PostgreSQL connection (configured in `application.properties`):
- **URL**: `jdbc:postgresql://localhost:5432/project_data`
- **Username**: `postgres`
- **Password**: `1234`

## API Documentation

### Auth Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "provider": "LOCAL",
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer eyJhbGc...

Response: 200 OK
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "profileImage": null,
  "provider": "LOCAL",
  "createdAt": "2024-01-01T10:00:00"
}
```

### Project Endpoints

#### Create Project
```http
POST /api/projects
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "title": "My Web App",
  "description": "A full-stack application",
  "usedTechs": "React, Node.js, PostgreSQL",
  "filePath": "/documents/project",
  "githubLink": "https://github.com/user/repo",
  "documents": "https://doc1.com, https://doc2.com"
}

Response: 201 Created
{
  "id": 1,
  "title": "My Web App",
  "description": "A full-stack application",
  "usedTechs": "React, Node.js, PostgreSQL",
  "filePath": "/documents/project",
  "githubLink": "https://github.com/user/repo",
  "documents": "https://doc1.com, https://doc2.com",
  "ownerId": 1,
  "ownerName": "John Doe",
  "createdDate": "2024-01-01T10:00:00",
  "lastModifiedDate": "2024-01-01T10:00:00"
}
```

#### Get All User Projects
```http
GET /api/projects
Authorization: Bearer eyJhbGc...

Response: 200 OK
[
  {
    "id": 1,
    "title": "My Web App",
    ...
  }
]
```

#### Get Project by ID
```http
GET /api/projects/1
Authorization: Bearer eyJhbGc...

Response: 200 OK
{
  "id": 1,
  "title": "My Web App",
  ...
}
```

#### Update Project
```http
PUT /api/projects/1
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  ...
}

Response: 200 OK
{
  "id": 1,
  "title": "Updated Title",
  ...
}
```

#### Delete Project
```http
DELETE /api/projects/1
Authorization: Bearer eyJhbGc...

Response: 204 No Content
```

## OAuth2 Google Login

```http
GET /oauth2/authorization/google
```

This redirects to Google login. After successful authentication:
1. User is created/updated in database
2. JWT token is generated
3. Redirects to: `http://localhost:3000/oauth/callback?token={jwt_token}`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  password VARCHAR(255),
  provider VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  used_techs TEXT,
  file_path VARCHAR(255),
  github_link VARCHAR(255),
  documents TEXT,
  owner_id BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL,
  last_modified_date TIMESTAMP NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

## Security

- All `/api/projects/**` endpoints require authentication
- `/api/auth/**` endpoints are public (except `/api/auth/me`)
- CORS enabled for `http://localhost:3000`
- JWT tokens expire after 24 hours
- Passwords are encrypted with BCrypt

## Error Handling

All errors return standardized JSON:

```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2024-01-01T10:00:00"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
