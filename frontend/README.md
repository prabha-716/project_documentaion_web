# Project Management Frontend

Next.js web application for project management.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Application runs at: `http://localhost:3000`

## Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=190558460341-s3q2com9vufjoft78iv52m8bkmttsscr.apps.googleusercontent.com
```

## Pages

### `/` - Home
- Redirects to dashboard if authenticated
- Redirects to login if not authenticated

### `/login` - Login/Register
- Email/password login form
- Registration form
- Google Sign-in button
- Toggle between login and register modes

### `/oauth/callback` - OAuth Callback
- Receives JWT token from backend after Google login
- Stores token and fetches user data
- Redirects to dashboard

### `/dashboard` - Main Dashboard
- Lists all user projects
- Create new project button
- View, edit, delete project actions
- User info and logout button

### `/projects/new` - Create Project
- Form to create new project
- Fields: title, description, technologies, file path, GitHub link, documents

### `/projects/[id]` - View Project
- Displays all project details
- Edit and back buttons

### `/projects/edit/[id]` - Edit Project
- Pre-filled form with project data
- Save changes or cancel

## API Integration

All API calls use Axios with interceptors:

### Authentication Interceptor
```typescript
// Automatically adds JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error Interceptor
```typescript
// Redirects to login on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
    }
    return Promise.reject(error);
  }
);
```

## Services

### Auth Service (`lib/auth.ts`)
```typescript
authService.login(data)         // Login with email/password
authService.register(data)      // Register new user
authService.getCurrentUser()    // Get current user data
authService.logout()            // Logout and clear tokens
authService.isAuthenticated()   // Check if user is logged in
```

### Project Service (`lib/project.ts`)
```typescript
projectService.getAllProjects()           // Get all user projects
projectService.getProjectById(id)         // Get single project
projectService.createProject(data)        // Create new project
projectService.updateProject(id, data)    // Update project
projectService.deleteProject(id)          // Delete project
```

## Authentication Flow

### Email/Password Login
1. User submits login form
2. POST request to `/api/auth/login`
3. Backend returns JWT token + user data
4. Store token in localStorage
5. Redirect to dashboard

### Google OAuth Login
1. User clicks "Sign in with Google"
2. Redirect to `/oauth2/authorization/google`
3. Google authentication page
4. Backend handles callback
5. Backend redirects to `/oauth/callback?token={jwt}`
6. Frontend stores token and fetches user data
7. Redirect to dashboard

## State Management

Uses React hooks and localStorage:
- **Token**: `localStorage.getItem('token')`
- **User**: `localStorage.getItem('user')`

## Styling

Tailwind CSS utility classes:

```tsx
// Button
className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"

// Card
className="bg-white rounded-lg shadow p-6"

// Input
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
```

## Route Protection

Pages check authentication on mount:

```typescript
useEffect(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login');
  }
}, [router]);
```

## Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run lint
```

## TypeScript Interfaces

### User
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
  provider: string;
  createdAt: string;
}
```

### Project
```typescript
interface Project {
  id: number;
  title: string;
  description?: string;
  usedTechs?: string;
  filePath?: string;
  githubLink?: string;
  documents?: string;
  ownerId: number;
  ownerName: string;
  createdDate: string;
  lastModifiedDate: string;
}
```
