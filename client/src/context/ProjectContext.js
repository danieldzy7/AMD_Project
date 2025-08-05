import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../config/axios';

// Initial state
const initialState = {
  projects: [],
  stats: {
    totalProjects: 0,
    activeProjects: 0,
    totalBudget: 0,
    totalActualSpend: 0,
    avgRDPercentage: 0
  },
  loading: false,
  error: null,
  lastUpdated: null
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_STATS: 'SET_STATS',
  SET_ERROR: 'SET_ERROR',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  CLEAR_PROJECTS: 'CLEAR_PROJECTS',
  REFRESH_DATA: 'REFRESH_DATA'
};

// Reducer function
const projectReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_PROJECTS:
      return { 
        ...state, 
        projects: action.payload, 
        loading: false, 
        error: null,
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.SET_STATS:
      return { 
        ...state, 
        stats: action.payload, 
        loading: false, 
        error: null,
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.ADD_PROJECT:
      return { 
        ...state, 
        projects: [...state.projects, action.payload],
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.UPDATE_PROJECT:
      return { 
        ...state, 
        projects: state.projects.map(project => 
          project._id === action.payload._id ? action.payload : project
        ),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.DELETE_PROJECT:
      return { 
        ...state, 
        projects: state.projects.filter(project => project._id !== action.payload),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.CLEAR_PROJECTS:
      return { 
        ...state, 
        projects: [], 
        stats: initialState.stats,
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.REFRESH_DATA:
      return { ...state, lastUpdated: new Date().toISOString() };
    
    default:
      return state;
  }
};

// Create context
const ProjectContext = createContext();

// Provider component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await api.get('/api/projects');
      dispatch({ type: ACTIONS.SET_PROJECTS, payload: response.data });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/api/projects/stats/dashboard');
      dispatch({ type: ACTIONS.SET_STATS, payload: response.data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Add new project
  const addProject = async (projectData) => {
    try {
      const response = await api.post('/api/projects', projectData);
      dispatch({ type: ACTIONS.ADD_PROJECT, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to add project:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update project
  const updateProject = async (id, projectData) => {
    try {
      const response = await api.put(`/api/projects/${id}`, projectData);
      dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to update project:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      dispatch({ type: ACTIONS.DELETE_PROJECT, payload: id });
    } catch (error) {
      console.error('Failed to delete project:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Clear all projects
  const clearAllProjects = async () => {
    try {
      await api.delete('/api/projects/clear-all');
      dispatch({ type: ACTIONS.CLEAR_PROJECTS });
    } catch (error) {
      console.error('Failed to clear projects:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Seed sample data
  const seedSampleData = async () => {
    try {
      await api.post('/api/projects/seed');
      await fetchProjects(); // Refresh data after seeding
      await fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to seed data:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Refresh all data
  const refreshData = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      await Promise.all([fetchProjects(), fetchStats()]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Get project by ID
  const getProjectById = (id) => {
    return state.projects.find(project => project._id === id);
  };

  // Get most expensive project
  const getMostExpensiveProject = () => {
    if (state.projects.length === 0) return null;
    return state.projects.reduce((max, project) => 
      project.budget > max.budget ? project : max
    );
  };

  // Get projects by status
  const getProjectsByStatus = (status) => {
    return state.projects.filter(project => project.status === status);
  };

  // Get projects by category
  const getProjectsByCategory = (category) => {
    return state.projects.filter(project => project.category === category);
  };

  // Context value
  const value = {
    ...state,
    fetchProjects,
    fetchStats,
    addProject,
    updateProject,
    deleteProject,
    clearAllProjects,
    seedSampleData,
    refreshData,
    getProjectById,
    getMostExpensiveProject,
    getProjectsByStatus,
    getProjectsByCategory
  };

  // Load initial data
  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the context
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}; 