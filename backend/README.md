# Backend API

This is the backend API for the portfolio project with admin panel.

## Environment Setup

### Development
Create a `.env` file in the backend directory with:
```
MONGO_URI=mongodb://localhost:27017/atelier
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Production (Render)
Set the following environment variables in your Render project settings:
```
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=https://your-frontend-app.vercel.app
NODE_ENV=production
```

Replace:
- `your_mongodb_connection_string` with your MongoDB Atlas connection string
- `your-frontend-app.vercel.app` with your actual Vercel frontend URL

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run the development server:
```bash
npm start
```

4. The server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - Get all published projects
- `GET /api/projects/:slug` - Get project by slug
- `GET /api/projects/admin/all` - Get all projects (admin)
- `GET /api/projects/admin/:id` - Get project by ID (admin)
- `POST /api/projects` - Create new project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

## File Uploads

The server serves uploaded files from the `/uploads` directory. Files are accessible at:
`https://your-backend-app.onrender.com/uploads/filename.ext`

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000` (development)
- `https://atelier-rho-indol.vercel.app` (production)
- Any URL specified in `FRONTEND_URL` environment variable

## Deployment

The application is configured for deployment on Render. Make sure to:

1. Set all required environment variables in Render
2. Ensure your MongoDB database is accessible
3. Configure the build command and start command in Render
4. Set the health check endpoint to `/api/health` 