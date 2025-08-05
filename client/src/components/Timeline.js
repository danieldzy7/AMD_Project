import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Play, Pause, BarChart3, TrendingUp, Activity, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { format, addDays, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';

const Timeline = () => {
  const { projects, loading, error } = useProjects();
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const [viewMode, setViewMode] = useState('gantt'); // gantt, calendar, list, timeline

  // Pagination logic
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Completed': '#10B981',
      'In Progress': '#3B82F6',
      'Validation': '#F59E0B',
      'Design': '#8B5CF6',
      'R&D Prototype': '#06B6D4',
      'On Hold': '#EF4444'
    };
    return colors[stage] || '#6B7280';
  };

  const getStageBgColor = (stage) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Validation': 'bg-yellow-100 text-yellow-800',
      'Design': 'bg-purple-100 text-purple-800',
      'R&D Prototype': 'bg-cyan-100 text-cyan-800',
      'On Hold': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Calculate timeline statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.stage === 'In Progress').length;
  const completedProjects = projects.filter(p => p.stage === 'Completed').length;
  const upcomingProjects = projects.filter(p => new Date(p.startDate) > new Date()).length;
  const avgProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + calculateProgress(p.startDate, p.endDate), 0) / totalProjects : 0;

  // Group current projects by stage for Gantt chart
  const groupedProjects = currentProjects.reduce((acc, project) => {
    const stage = project.stage;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(project);
    return acc;
  }, {});

  // Calculate timeline bounds for current projects
  const allDates = currentProjects.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
  const minDate = allDates.length > 0 ? new Date(Math.min(...allDates)) : new Date();
  const maxDate = allDates.length > 0 ? new Date(Math.max(...allDates)) : new Date();
  const timelineStart = startOfMonth(minDate);
  const timelineEnd = endOfMonth(maxDate);
  const totalDays = differenceInDays(timelineEnd, timelineStart) + 1;

  // Generate milestone dates
  const milestones = [
    { date: addDays(timelineStart, Math.floor(totalDays * 0.25)), label: 'Q1 Review' },
    { date: addDays(timelineStart, Math.floor(totalDays * 0.5)), label: 'Mid-Year Check' },
    { date: addDays(timelineStart, Math.floor(totalDays * 0.75)), label: 'Q3 Review' },
    { date: timelineEnd, label: 'Year End' }
  ];

  const getBarPosition = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startOffset = differenceInDays(start, timelineStart);
    const duration = differenceInDays(end, start) + 1;
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amd-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Timeline</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Timeline</h1>
          <p className="text-gray-600 mt-2">Multiple timeline visualization options for project schedules</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('gantt')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'gantt' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Gantt Chart View"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Calendar View"
            >
              <Calendar className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List View"
            >
              <Activity className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'timeline' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Timeline View"
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {avgProgress.toFixed(1)}% Avg Progress
          </div>
        </div>
      </div>



      {/* Gantt Chart View */}
      {viewMode === 'gantt' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Gantt Chart</h3>
                <p className="text-gray-600 text-sm mt-1">Timeline visualization with milestones and progress tracking</p>
              </div>
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, totalProjects)} of {totalProjects} projects
              </div>
            </div>
          </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[1200px] p-6">
            {/* Timeline Header */}
            <div className="relative mb-8">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{formatDate(timelineStart)}</span>
                <span>{formatDate(timelineEnd)}</span>
              </div>
              
              {/* Timeline Grid */}
              <div className="relative h-2 bg-gray-200 rounded-full">
                {/* Milestone Markers */}
                {milestones.map((milestone, index) => {
                  const position = (differenceInDays(milestone.date, timelineStart) / totalDays) * 100;
                  return (
                    <div key={index} className="absolute top-0 w-px h-8 bg-gray-400 -mt-3" style={{ left: `${position}%` }}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                        {milestone.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gantt Chart Content */}
            <div className="space-y-4">
              {Object.entries(groupedProjects).map(([stage, stageProjects]) => (
                <div key={stage} className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{stage}</h4>
                  <div className="space-y-3">
                    {stageProjects.map((project) => {
                      const progress = calculateProgress(project.startDate, project.endDate);
                      const barPosition = getBarPosition(project.startDate, project.endDate);
                      const isOverdue = new Date() > new Date(project.endDate) && project.stage !== 'Completed';
                      
                      return (
                        <div key={project._id} className="relative">
                          <div className="flex items-center mb-2">
                            <div className="w-48 text-sm font-medium text-gray-900 truncate">
                              {project.projectName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(project.startDate)} - {formatDate(project.endDate)}
                            </div>
                          </div>
                          
                          <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                            {/* Progress Bar */}
                            <div
                              className="absolute top-0 left-0 h-full rounded-lg transition-all duration-300"
                              style={{
                                left: barPosition.left,
                                width: barPosition.width,
                                backgroundColor: getStageColor(project.stage),
                                opacity: 0.8
                              }}
                            >
                              {/* Progress Indicator */}
                              <div
                                className="h-full bg-white bg-opacity-30 rounded-lg"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            
                            {/* Project Label on Bar */}
                            <div
                              className="absolute top-1 left-0 text-xs font-medium text-white px-2 truncate"
                              style={{
                                left: `calc(${barPosition.left} + 4px)`,
                                maxWidth: `calc(${barPosition.width} - 8px)`
                              }}
                            >
                              {project.projectId}
                            </div>
                            
                            {/* Progress Percentage */}
                            <div
                              className="absolute top-1 right-1 text-xs font-bold text-white"
                              style={{
                                left: `calc(${barPosition.left} + ${barPosition.width} - 30px)`
                              }}
                            >
                              {progress}%
                            </div>
                          </div>
                          
                          {/* Status Indicator */}
                          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                            <div className={`w-3 h-3 rounded-full ${isOverdue ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Calendar View</h3>
                <p className="text-gray-600 text-sm mt-1">Monthly calendar with project milestones and deadlines</p>
              </div>
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, totalProjects)} of {totalProjects} projects
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4">
              {/* Calendar Header */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-700 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {Array.from({ length: 35 }, (_, i) => {
                const date = addDays(timelineStart, i);
                const dayProjects = currentProjects.filter(project => {
                  const projectStart = new Date(project.startDate);
                  const projectEnd = new Date(project.endDate);
                  return date >= projectStart && date <= projectEnd;
                });
                
                return (
                  <div key={i} className="min-h-[80px] border border-gray-200 p-2">
                    <div className="text-sm text-gray-600 mb-1">{format(date, 'd')}</div>
                    <div className="space-y-1">
                      {dayProjects.slice(0, 2).map(project => (
                        <div
                          key={project._id}
                          className="text-xs p-1 rounded"
                          style={{ backgroundColor: getStageColor(project.stage) + '20', color: getStageColor(project.stage) }}
                        >
                          {project.projectId}
                        </div>
                      ))}
                      {dayProjects.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayProjects.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">List View</h3>
                <p className="text-gray-600 text-sm mt-1">Detailed project list with timeline information</p>
              </div>
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, totalProjects)} of {totalProjects} projects
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProjects.map(project => {
                  const progress = calculateProgress(project.startDate, project.endDate);
                  const isOverdue = new Date() > new Date(project.endDate) && project.stage !== 'Completed';
                  
                  return (
                    <tr key={project._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.projectName}</div>
                          <div className="text-sm text-gray-500">{project.projectId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageBgColor(project.stage)}`}>
                          {project.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${progress}%`,
                                backgroundColor: getStageColor(project.stage)
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-3 h-3 rounded-full ${isOverdue ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Timeline View</h3>
                <p className="text-gray-600 text-sm mt-1">Vertical timeline with project milestones</p>
              </div>
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, totalProjects)} of {totalProjects} projects
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              <div className="space-y-8">
                {currentProjects.map((project, index) => {
                  const progress = calculateProgress(project.startDate, project.endDate);
                  const isOverdue = new Date() > new Date(project.endDate) && project.stage !== 'Completed';
                  
                  return (
                    <div key={project._id} className="relative flex items-start">
                      {/* Timeline Dot */}
                      <div className="absolute left-6 w-4 h-4 rounded-full border-4 border-white shadow-lg"
                           style={{ backgroundColor: getStageColor(project.stage), transform: 'translateX(-50%)' }}>
                      </div>
                      
                      {/* Project Content */}
                      <div className="ml-16 flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{project.projectName}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageBgColor(project.stage)}`}>
                              {project.stage}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{project.projectId}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                            <span className="font-medium">{progress}% Complete</span>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${progress}%`,
                                  backgroundColor: getStageColor(project.stage)
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, totalProjects)} of {totalProjects} projects
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Timeline Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Timeline Overview</h4>
              <p className="text-sm text-gray-600">Project scheduling</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Timeline Span</span>
              <span className="font-medium">{totalDays} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Milestones</span>
              <span className="font-medium">{milestones.length} planned</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Categories</span>
              <span className="font-medium">{Object.keys(groupedProjects).length} stages</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Progress Status</h4>
              <p className="text-sm text-gray-600">Completion tracking</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Progress</span>
              <span className="font-medium">{avgProgress.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="font-medium">{completedProjects} projects</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">On Track</span>
              <span className="font-medium text-green-600">
                {projects.filter(p => {
                  const progress = calculateProgress(p.startDate, p.endDate);
                  return progress >= 50 && p.stage !== 'Completed';
                }).length} projects
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Milestone Tracking</h4>
              <p className="text-sm text-gray-600">Key achievements</p>
            </div>
          </div>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{milestone.label}</span>
                <span className="font-medium">{formatDate(milestone.date)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline; 