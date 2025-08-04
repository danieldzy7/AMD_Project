# Dashboard

AMD Project Portfolio Management (PPM) Dashboard is a modern web application built on the MERN stack for managing and monitoring AMD's R&D projects.

## Features

- 📊 **Real-time Dashboard** - Project overview and key metrics
- 📋 **Project Management** - Complete CRUD operations
- 📈 **Data Visualization** - Project data visualization using AG Charts
- 🗂️ **Advanced Tables** - Powerful data tables using AG Grid
- 💰 **Financial Tracking** - Budget, spending, and tax credit management
- 📅 **Timeline Management** - Project timeline and Gantt charts
- 👥 **Resource Planning** - Team capacity and resource allocation
- 📊 **Reports & Analytics** - Comprehensive reporting and insights

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **AG Grid** - Enterprise-grade data grid
- **AG Charts** - Professional data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## Project Structure

```
AMD_Project/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── App.js          # Main application component
│   │   └── index.js        # Application entry point
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
├── start.bat               # Windows startup script
├── package.json            # Root dependencies
└── README.md              # Project documentation
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AMD_Project
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   # Using npm script (recommended)
   npm run dev
   
   # Or using the Windows batch file
   start.bat
   ```

### Manual Startup

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `DELETE /api/projects/clear-all` - Clear all projects
- `POST /api/projects/seed` - Add sample data

### Dashboard Statistics
- `GET /api/projects/stats/dashboard` - Get dashboard statistics

## Database Schema

### Project Model
```javascript
{
  projectId: String,           // Unique project identifier
  projectName: String,         // Project name
  startDate: Date,            // Project start date
  endDate: Date,              // Project end date
  stage: String,              // Project stage (Design, In Progress, etc.)
  resourceAllocated: Number,   // FTEs allocated
  ppaTarget: {                // Performance/Power/Area targets
    performance: String,
    power: String,
    area: String
  },
  eligibleRD: Number,         // R&D eligibility percentage
  actualSpend: Number,        // Actual spending amount
  forecastSpend: Number,      // Forecasted spending
  taxCreditEligible: Number   // Calculated tax credit
}
```

## Key Features

### Dashboard
- Real-time project statistics
- Interactive charts and visualizations
- Workload trends analysis
- Project status distribution

### Project Management
- Advanced data grid with sorting and filtering
- Bulk operations and data export
- Real-time data updates
- Tax credit calculation guide

### Timeline
- Interactive Gantt chart visualization
- Project timeline management
- Milestone tracking
- Resource allocation timeline

### Resource Planning
- Team member management
- Capacity planning and utilization
- Skill matrix visualization
- Department overview

## Development

### Available Scripts

**Root Directory:**
- `npm run dev` - Start both frontend and backend
- `npm run install-all` - Install all dependencies

**Backend:**
- `npm start` - Start development server
- `npm run dev` - Start with nodemon

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software developed for AMD Corporation.

## Support

For technical support or questions, please contact the development team.

---

**Dashboard** - Project Portfolio Management System v1.0.0 