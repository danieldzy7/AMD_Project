# Project Structure Documentation

## Overview
This document provides a detailed overview of the AMD PPM Dashboard project structure, explaining the purpose and organization of each directory and file.

## Root Directory Structure

```
AMD_Project/
├── frontend/                 # React frontend application
├── backend/                  # Node.js backend application
├── start.bat                # Windows startup script
├── package.json             # Root project configuration
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
└── PROJECT_STRUCTURE.md    # This file
```

## Frontend Structure (`frontend/`)

```
frontend/
├── public/                  # Static assets
│   ├── index.html          # Main HTML template
│   ├── favicon.ico         # Application icon
│   └── manifest.json       # PWA manifest
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── Dashboard.js    # Main dashboard component
│   │   ├── Header.js       # Application header
│   │   ├── Sidebar.js      # Navigation sidebar
│   │   ├── ProjectTable.js # Project management table
│   │   ├── ProjectForm.js  # Project form component
│   │   ├── Timeline.js     # Timeline/Gantt chart component
│   │   └── ResourcePlanning.js # Resource management component
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles
├── package.json            # Frontend dependencies
└── tailwind.config.js      # Tailwind CSS configuration
```

### Frontend Components

#### Core Components
- **Dashboard.js**: Main dashboard with charts and analytics
- **Header.js**: Application header with navigation and user info
- **Sidebar.js**: Navigation sidebar with menu items
- **ProjectTable.js**: AG Grid-based project management table
- **ProjectForm.js**: Form for creating/editing projects
- **Timeline.js**: Gantt chart and timeline visualization
- **ResourcePlanning.js**: Team and resource management

#### Key Features
- **AG Grid Integration**: Advanced data grid with sorting, filtering, and export
- **AG Charts**: Professional data visualization charts
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Live data synchronization with backend

## Backend Structure (`backend/`)

```
backend/
├── models/                 # Database models
│   └── Project.js         # Project data model
├── routes/                # API routes
│   └── projects.js        # Project-related API endpoints
├── server.js              # Main server file
├── package.json           # Backend dependencies
└── .env.example          # Environment variables template
```

### Backend Components

#### Models
- **Project.js**: Mongoose schema for project data with validation

#### Routes
- **projects.js**: RESTful API endpoints for project management
  - GET /api/projects - Get all projects
  - GET /api/projects/:id - Get project by ID
  - POST /api/projects - Create new project
  - PUT /api/projects/:id - Update project
  - DELETE /api/projects/:id - Delete project
  - DELETE /api/projects/clear-all - Clear all projects
  - POST /api/projects/seed - Add sample data
  - GET /api/projects/stats/dashboard - Get dashboard statistics

#### Server Configuration
- **server.js**: Express server setup with middleware and routes
- **Environment Variables**: Database connection and server configuration

## Configuration Files

### Root Level
- **package.json**: Project metadata and scripts
- **.gitignore**: Git ignore patterns
- **start.bat**: Windows startup script
- **README.md**: Project documentation

### Frontend Configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **package.json**: Frontend dependencies and scripts

### Backend Configuration
- **package.json**: Backend dependencies and scripts
- **.env.example**: Environment variables template

## Data Flow

### Frontend to Backend
1. **API Calls**: Frontend components make HTTP requests to backend API
2. **Data Fetching**: AG Grid and charts fetch data from REST endpoints
3. **Real-time Updates**: Components refresh data on user actions

### Backend to Database
1. **Mongoose Models**: Data validation and schema enforcement
2. **MongoDB Connection**: Secure database connection with error handling
3. **CRUD Operations**: Full create, read, update, delete functionality

## Development Workflow

### Local Development
1. **Installation**: Run `npm run install-all` to install all dependencies
2. **Startup**: Run `npm run dev` to start both frontend and backend
3. **Development**: Frontend runs on http://localhost:3000, backend on http://localhost:5000

### Code Organization
- **Components**: Modular React components with clear responsibilities
- **API Routes**: RESTful endpoints with proper error handling
- **Data Models**: Mongoose schemas with validation
- **Styling**: Tailwind CSS for consistent design

## Best Practices

### Frontend
- Use functional components with hooks
- Implement proper error handling
- Follow React best practices
- Use AG Grid and AG Charts effectively
- Maintain responsive design

### Backend
- Implement proper error handling
- Use async/await for database operations
- Follow RESTful API conventions
- Implement proper validation
- Use environment variables for configuration

### General
- Keep components small and focused
- Use meaningful variable and function names
- Implement proper error handling
- Follow consistent code formatting
- Document complex logic

## Deployment Considerations

### Frontend
- Build optimization for production
- Static asset optimization
- Environment-specific configurations

### Backend
- Environment variable management
- Database connection optimization
- Security middleware implementation
- Logging and monitoring setup

## Future Enhancements

### Planned Features
- User authentication and authorization
- Advanced reporting and analytics
- Real-time notifications
- Mobile application
- API documentation
- Unit and integration tests

### Technical Improvements
- Performance optimization
- Code splitting and lazy loading
- Progressive Web App features
- Advanced caching strategies
- Monitoring and logging 