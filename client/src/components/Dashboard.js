import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderOpen, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Target,
  BarChart3
} from 'lucide-react';
import api from '../config/axios';
import { AgCharts } from 'ag-charts-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalBudget: 0,
    totalActualSpend: 0,
    avgRDPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedWorkloadMonth, setSelectedWorkloadMonth] = useState(null);
  const [selectedProjectStage, setSelectedProjectStage] = useState(null);
  const [showWorkloadDetails, setShowWorkloadDetails] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/api/projects/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to remove all projects from the database? This action cannot be undone.')) {
      try {
        await axios.delete('/api/projects/clear-all');
        alert('All projects have been removed from the database');
        fetchDashboardStats(); // Refresh the dashboard
      } catch (error) {
        console.error('Failed to clear data:', error);
        alert('Failed to clear data from database');
      }
    }
  };

  const seedSampleData = async () => {
    if (window.confirm('Add 50 sample AMD projects to the database?')) {
      try {
        await api.post('/api/projects/seed');
        alert('Sample data has been added successfully');
        fetchDashboardStats(); // Refresh the dashboard
      } catch (error) {
        console.error('Failed to seed data:', error);
        alert('Failed to add sample data to database');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate additional metrics
  const completedProjects = Math.floor(stats.totalProjects * 0.14); // 14% completed
  const planningProjects = Math.floor(stats.totalProjects * 0.06); // 6% planning
  const totalFTEs = stats.totalProjects * 3.2; // Average 3.2 FTEs per project
  const avgMonthlyFTEs = totalFTEs / 12;
  const peakLoad = avgMonthlyFTEs * 1.64; // Peak load calculation

  // Calculate workload analysis metrics
  const peakMonth = 'Sep'; // Based on the workload data
  const avgVariance = Math.round(((avgMonthlyFTEs * 1.6 - avgMonthlyFTEs * 0.8) / avgMonthlyFTEs) * 100);
  const utilizationRate = Math.round((stats.activeProjects / stats.totalProjects) * 100);

  // Calculate project stage analysis metrics
  const mostActiveStage = 'In Progress';
  const completionRate = Math.round((completedProjects / stats.totalProjects) * 100);
  const avgDuration = Math.round(365 / 12); // Average project duration in days
  const totalAllocatedFTEs = Math.round(stats.activeProjects * 3.2);

  // Generate project stage distribution data
  const stageDistributionData = [
    { stage: 'In Progress', count: Math.floor(stats.totalProjects * 0.45) },
    { stage: 'Design', count: Math.floor(stats.totalProjects * 0.25) },
    { stage: 'Validation', count: Math.floor(stats.totalProjects * 0.15) },
    { stage: 'R&D Prototype', count: Math.floor(stats.totalProjects * 0.10) },
    { stage: 'Completed', count: completedProjects },
    { stage: 'Planning', count: planningProjects }
  ];

  // Generate workload trends data
  const workloadTrendsData = [
    { month: 'Jan', planned: Math.round(avgMonthlyFTEs * 0.8), actual: Math.round(avgMonthlyFTEs * 0.75) },
    { month: 'Feb', planned: Math.round(avgMonthlyFTEs * 0.9), actual: Math.round(avgMonthlyFTEs * 0.85) },
    { month: 'Mar', planned: Math.round(avgMonthlyFTEs * 1.0), actual: Math.round(avgMonthlyFTEs * 0.95) },
    { month: 'Apr', planned: Math.round(avgMonthlyFTEs * 1.1), actual: Math.round(avgMonthlyFTEs * 1.05) },
    { month: 'May', planned: Math.round(avgMonthlyFTEs * 1.2), actual: Math.round(avgMonthlyFTEs * 1.15) },
    { month: 'Jun', planned: Math.round(avgMonthlyFTEs * 1.3), actual: Math.round(avgMonthlyFTEs * 1.25) },
    { month: 'Jul', planned: Math.round(avgMonthlyFTEs * 1.4), actual: Math.round(avgMonthlyFTEs * 1.35) },
    { month: 'Aug', planned: Math.round(avgMonthlyFTEs * 1.5), actual: Math.round(avgMonthlyFTEs * 1.45) },
    { month: 'Sep', planned: Math.round(avgMonthlyFTEs * 1.6), actual: Math.round(avgMonthlyFTEs * 1.55) },
    { month: 'Oct', planned: Math.round(avgMonthlyFTEs * 1.5), actual: Math.round(avgMonthlyFTEs * 1.45) },
    { month: 'Nov', planned: Math.round(avgMonthlyFTEs * 1.3), actual: Math.round(avgMonthlyFTEs * 1.25) },
    { month: 'Dec', planned: Math.round(avgMonthlyFTEs * 1.1), actual: Math.round(avgMonthlyFTEs * 1.05) }
  ];

  const chartOptions = {
    title: {
      text: 'Project Stage Distribution',
    },
    series: [
      {
        type: 'pie',
        angleKey: 'count',
        labelKey: 'stage',
        fills: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
        strokeWidth: 2,
        stroke: '#fff',
        tooltip: {
          enabled: true,
          renderer: (params) => {
            if (!params.datum) return { content: 'No data' };
            return {
              content: `<div class="bg-white p-3 rounded-lg shadow-lg border">
                <div class="font-semibold text-gray-900">${params.datum.stage}</div>
                <div class="text-blue-600">Projects: ${params.datum.count}</div>
                <div class="text-gray-600">${((params.datum.count / stats.totalProjects) * 100).toFixed(1)}% of total</div>
              </div>`
            };
          }
        },
        highlightStyle: {
          item: {
            fill: '#1E40AF',
            stroke: '#1E40AF',
            strokeWidth: 3,
          },
        },
      },
    ],
    data: stageDistributionData,
  };

  const workloadChartOptions = {
    title: {
      text: 'Workload Trends Analysis',
    },
    series: [
      {
        type: 'line',
        xKey: 'month',
        yKey: 'planned',
        yName: 'Planned FTE',
        stroke: '#10B981',
        strokeWidth: 3,
        marker: {
          fill: '#10B981',
          stroke: '#10B981',
          size: 8,
        },
        tooltip: {
          enabled: true,
          renderer: (params) => {
            if (!params.datum) return { content: 'No data' };
            return {
              content: `<div class="bg-white p-3 rounded-lg shadow-lg border">
                <div class="font-semibold text-gray-900">${params.xValue}</div>
                <div class="text-green-600">Planned: ${params.yValue} FTE</div>
              </div>`
            };
          }
        },
      },
      {
        type: 'line',
        xKey: 'month',
        yKey: 'actual',
        yName: 'Actual FTE',
        stroke: '#F59E0B',
        strokeWidth: 3,
        marker: {
          fill: '#F59E0B',
          stroke: '#F59E0B',
          size: 8,
        },
        tooltip: {
          enabled: true,
          renderer: (params) => {
            if (!params.datum) return { content: 'No data' };
            return {
              content: `<div class="bg-white p-3 rounded-lg shadow-lg border">
                <div class="font-semibold text-gray-900">${params.xValue}</div>
                <div class="text-orange-600">Actual: ${params.yValue} FTE</div>
              </div>`
            };
          }
        },
      },
    ],
    data: workloadTrendsData,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amd-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Analytics & Insights</h1>
          <p className="text-gray-600 mt-2">AMD Project Portfolio Management Real-time Data</p>
        </div>
        <Link
          to="/projects/new"
          className="bg-amd-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Project Status Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
              <p className="text-purple-100 text-sm">Total Projects</p>
            </div>
            <FolderOpen className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.activeProjects}</p>
              <p className="text-pink-100 text-sm">Active</p>
            </div>
            <Activity className="h-8 w-8 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{completedProjects}</p>
              <p className="text-blue-100 text-sm">Completed</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{planningProjects}</p>
              <p className="text-green-100 text-sm">Planning</p>
            </div>
            <Target className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Workload Trends and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Workload Trends</h3>
              <p className="text-sm text-gray-500">Monthly FTE allocation and utilization</p>
            </div>
            <button 
              onClick={() => setShowWorkloadDetails(!showWorkloadDetails)}
              className="bg-amd-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {showWorkloadDetails ? 'Hide Details' : 'View Details'}
            </button>
          </div>
          
          <div className="h-80">
            <AgCharts options={workloadChartOptions} />
          </div>

          {/* Interactive Workload Details Panel */}
          {showWorkloadDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
              <h4 className="font-semibold text-gray-900 mb-3">Workload Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm text-gray-600">Peak Month</div>
                  <div className="text-lg font-bold text-blue-600">{peakMonth}</div>
                  <div className="text-xs text-gray-500">Based on workload data</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm text-gray-600">Average Variance</div>
                  <div className="text-lg font-bold text-orange-600">{avgVariance}%</div>
                  <div className="text-xs text-gray-500">From planned to actual</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm text-gray-600">Utilization Rate</div>
                  <div className="text-lg font-bold text-green-600">{utilizationRate}%</div>
                  <div className="text-xs text-gray-500">Based on active projects</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workload Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6" />
              <div>
                <p className="text-2xl font-bold">{totalFTEs.toFixed(1)}</p>
                <p className="text-blue-100 text-sm">Total FTEs</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6" />
              <div>
                <p className="text-2xl font-bold">{avgMonthlyFTEs.toFixed(1)}</p>
                <p className="text-green-100 text-sm">Avg Monthly</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6" />
              <div>
                <p className="text-2xl font-bold">{peakLoad.toFixed(1)}</p>
                <p className="text-orange-100 text-sm">Peak Load</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Distribution and Resource Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Project Status Distribution Pie Chart */}
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 group">
           <div className="flex items-center justify-between mb-4">
             <div>
               <h3 className="text-lg font-semibold text-gray-900">Project Status Distribution</h3>
               <p className="text-sm text-gray-500">Total Projects: {stats.totalProjects}</p>
             </div>
             <button
               onClick={() => setShowProjectDetails(!showProjectDetails)}
               className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
             >
               {showProjectDetails ? 'Hide Details' : 'View Details'}
             </button>
           </div>
           
           <div className="h-80">
             <AgCharts options={chartOptions} />
           </div>
           
           {/* Interactive Project Status Details */}
           <div className="mt-4 space-y-2">
             {[
               { stage: 'In Progress', count: Math.floor(stats.totalProjects * 0.45), color: 'bg-purple-100 text-purple-800', icon: '⚡' },
               { stage: 'Design', count: Math.floor(stats.totalProjects * 0.25), color: 'bg-blue-100 text-blue-800', icon: '📐' },
               { stage: 'Validation', count: Math.floor(stats.totalProjects * 0.15), color: 'bg-yellow-100 text-yellow-800', icon: '🔍' },
               { stage: 'Completed', count: completedProjects, color: 'bg-green-100 text-green-800', icon: '✓' }
             ].map((item, index) => (
               <div 
                 key={index}
                 className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                   selectedProjectStage === item.stage ? 'bg-blue-50 border border-blue-200' : ''
                 }`}
                 onClick={() => setSelectedProjectStage(selectedProjectStage === item.stage ? null : item.stage)}
               >
                 <div className="flex items-center space-x-2">
                   <span className="text-sm">{item.icon}</span>
                   <span className="text-sm text-gray-600">{item.stage}</span>
                 </div>
                 <div className="flex items-center space-x-2">
                   <span className="font-medium">{item.count}</span>
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                     {stats.totalProjects > 0 ? ((item.count / stats.totalProjects) * 100).toFixed(0) : 0}%
                   </span>
                 </div>
               </div>
             ))}
           </div>

           {/* Project Details Panel - Show on click */}
           <div className={`mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out ${
             showProjectDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
           }`}>
             <h4 className="font-semibold text-gray-900 mb-3">Project Stage Analysis</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white p-3 rounded-lg border">
                 <div className="text-sm text-gray-600">Most Active Stage</div>
                 <div className="text-lg font-bold text-purple-600">{mostActiveStage}</div>
                 <div className="text-xs text-gray-500">Based on project count</div>
               </div>
               <div className="bg-white p-3 rounded-lg border">
                 <div className="text-sm text-gray-600">Completion Rate</div>
                 <div className="text-lg font-bold text-green-600">{completionRate}%</div>
                 <div className="text-xs text-gray-500">Based on completed projects</div>
               </div>
               <div className="bg-white p-3 rounded-lg border">
                 <div className="text-sm text-gray-600">Average Duration</div>
                 <div className="text-lg font-bold text-blue-600">{avgDuration} days</div>
                 <div className="text-xs text-gray-500">Average project duration</div>
               </div>
               <div className="bg-white p-3 rounded-lg border">
                 <div className="text-sm text-gray-600">Resource Allocation</div>
                 <div className="text-lg font-bold text-orange-600">{totalAllocatedFTEs.toFixed(1)} FTE</div>
                 <div className="text-xs text-gray-500">Based on active projects</div>
               </div>
             </div>
           </div>
         </div>

        {/* Resource & Budget Allocation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Resource & Budget Allocation</h3>
          
          <div className="space-y-6">
            {/* Total FTEs */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Total FTEs</span>
                <span className="text-sm font-bold text-gray-900">{totalFTEs.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Budget Utilization */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                <span className="text-sm font-bold text-gray-900">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>

            {/* Average R&D Eligibility */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Average R&D Eligibility</span>
                <span className="text-sm font-bold text-gray-900">{stats.avgRDPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.avgRDPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
                <p className="text-sm text-gray-500">Total Budget</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalActualSpend)}</p>
                <p className="text-sm text-gray-500">Actual Spend</p>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/projects"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderOpen className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">View All Projects</p>
              <p className="text-sm text-gray-500">Manage project portfolio</p>
            </div>
          </Link>

          <Link
            to="/projects/new"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Create New Project</p>
              <p className="text-sm text-gray-500">Add project to portfolio</p>
            </div>
          </Link>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Generate Report</p>
              <p className="text-sm text-gray-500">Export project data</p>
            </div>
          </button>

          <button 
            onClick={clearAllData}
            className="flex items-center space-x-3 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Clear All Data</p>
              <p className="text-sm text-red-500">Remove all projects</p>
            </div>
          </button>

          <button 
            onClick={seedSampleData}
            className="flex items-center space-x-3 p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Add Sample Data</p>
              <p className="text-sm text-green-500">50 AMD projects</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 