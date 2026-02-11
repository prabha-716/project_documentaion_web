# Complete Setup Guide

## Prerequisites Installation

### 1. Install Java 17
```bash
# Windows: Download from https://adoptium.net/
# Mac: 
brew install openjdk@17

# Linux:
sudo apt update
sudo apt install openjdk-17-jdk
```

Verify: `java -version` should show version 17+

### 2. Install Maven
```bash
# Windows: Download from https://maven.apache.org/download.cgi
# Mac:
brew install maven

# Linux:
sudo apt install maven
```

Verify: `mvn -version`

### 3. Install Node.js & npm
```bash
# Download from https://nodejs.org/ (LTS version)
# Or use nvm:
nvm install 18
nvm use 18
```

Verify: `node -v` and `npm -v`

### 4. Install PostgreSQL
```bash
# Windows: Download from https://www.postgresql.org/download/
# Mac:
brew install postgresql@14
brew services start postgresql@14

# Linux:
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

Verify: `psql --version`

## Database Setup

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE project_data;

# List databases to verify
\l

# Exit
\q
```

### Update Password (if needed)
If your PostgreSQL password is not "1234", update:
- `backend/src/main/resources/application.properties`

```properties
spring.datasource.password=YOUR_PASSWORD
```

## Backend Setup

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Build Project
```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile Java code
- Run tests
- Create JAR file

### 3. Run Backend
```bash
mvn spring-boot:run
```

Expected output:
```
Started ProjectManagementApplication in X seconds
```

Backend is now running at: `http://localhost:8080`

### Verify Backend
Open browser: `http://localhost:8080/api/auth/login`
Should see login endpoint (will return 401 or 403)

## Frontend Setup

### 1. Navigate to Frontend
```bash
# Open new terminal
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Next.js
- React
- Axios
- Tailwind CSS
- TypeScript

### 3. Create Environment File
```bash
# Create .env.local file (already provided)
# Verify it contains:
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=190558460341-s3q2com9vufjoft78iv52m8bkmttsscr.apps.googleusercontent.com
```

### 4. Run Frontend
```bash
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000
```

Frontend is now running at: `http://localhost:3000`

## Testing the Application

### 1. Open Application
Navigate to: `http://localhost:3000`

### 2. Create Account
- Click "Register"
- Enter name, email, password
- Click "Register"

### 3. Login
- Use your credentials
- Or click "Sign in with Google"

### 4. Create Project
- Click "+ New Project"
- Fill in project details
- Click "Create Project"

### 5. Manage Projects
- View project list on dashboard
- Click "View" to see details
- Click "Edit" to modify
- Click "Delete" to remove

## Troubleshooting

### Backend Issues

#### Port 8080 already in use
```bash
# Find process
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill process or change port in application.properties
server.port=8081
```

#### Database connection failed
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database exists: `psql -U postgres -l`
- Verify credentials in `application.properties`

#### Maven build fails
```bash
# Clear Maven cache
mvn clean
rm -rf ~/.m2/repository

# Rebuild
mvn clean install -U
```

### Frontend Issues

#### Port 3000 already in use
```bash
# Kill process
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Or run on different port
npm run dev -- -p 3001
```

#### Cannot connect to backend
- Verify backend is running on port 8080
- Check CORS settings in SecurityConfig.java
- Verify API_URL in .env.local

#### npm install fails
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### OAuth2 Issues

#### Google Sign-in not working
- Verify Google credentials in `application.properties`
- Check redirect URI is registered in Google Console:
  - `http://localhost:8080/login/oauth2/code/google`
- Ensure cookies are enabled in browser

## Production Deployment

### Backend
```bash
cd backend
mvn clean package
java -jar target/project-management-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Environment Variables
Update for production:
- Database URL and credentials
- JWT secret (use strong random string)
- Google OAuth credentials (production)
- Frontend API URL

## Useful Commands

### Backend
```bash
mvn clean                # Clean build files
mvn compile              # Compile only
mvn test                 # Run tests
mvn package              # Create JAR
mvn spring-boot:run      # Run application
```

### Frontend
```bash
npm install              # Install dependencies
npm run dev              # Development server
npm run build            # Production build
npm start                # Production server
npm run lint             # Check code quality
```

### Database
```bash
psql -U postgres         # Connect to PostgreSQL
\l                       # List databases
\c project_data          # Connect to database
\dt                      # List tables
\d users                 # Describe users table
SELECT * FROM users;     # Query users
```

## Support

For issues:
1. Check logs in terminal
2. Verify all prerequisites are installed
3. Ensure database is running
4. Check network connections
5. Review error messages carefully

## Next Steps

1. Customize UI/UX with Tailwind CSS
2. Add file upload functionality
3. Implement search and filtering
4. Add user profile management
5. Deploy to production (Heroku, AWS, etc.)
