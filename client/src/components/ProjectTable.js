import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Plus, Edit, Trash2, Download, Filter, X } from 'lucide-react';
import api from '../config/axios';
import { format } from 'date-fns';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    projectId: '',
    projectName: '',
    startDate: '',
    endDate: '',
    stage: 'Design',
    resourceAllocated: 1.0,
    ppaTarget: {
      performance: '+0% Perf',
      power: '+0% Power',
      area: '+0% Area'
    },
    eligibleRD: 80,
    actualSpend: 0,
    forecastSpend: 0,
    taxCreditEligible: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${projectId}`);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleNewProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate tax credit eligible amount
      const taxCreditEligible = (newProject.actualSpend * newProject.eligibleRD) / 100;
      
      const projectData = {
        ...newProject,
        taxCreditEligible: Math.round(taxCreditEligible)
      };
      
      await api.post('/api/projects', projectData);
      setShowNewProjectModal(false);
      setNewProject({
        projectId: '',
        projectName: '',
        startDate: '',
        endDate: '',
        stage: 'Design',
        resourceAllocated: 1.0,
        ppaTarget: {
          performance: '+0% Perf',
          power: '+0% Power',
          area: '+0% Area'
        },
        eligibleRD: 80,
        actualSpend: 0,
        forecastSpend: 0,
        taxCreditEligible: 0
      });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewProject(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewProject(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  const getStageColor = (stage) => {
    const colors = {
      'Design': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-green-100 text-green-800',
      'Validation': 'bg-yellow-100 text-yellow-800',
      'R&D Prototype': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'On Hold': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const columnDefs = useMemo(() => [
    {
      headerName: 'Project ID',
      field: 'projectId',
      width: 120,
      sortable: true,
      filter: true,
      cellStyle: { fontWeight: 'bold' }
    },
    {
      headerName: 'Project Name',
      field: 'projectName',
      width: 250,
      sortable: true,
      filter: true,
      sort: 'asc',
      cellRenderer: (params) => (
        <div className="font-medium text-gray-900">{params.value}</div>
      )
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      width: 120,
      sortable: true,
      filter: true,
      cellRenderer: (params) => formatDate(params.value)
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      width: 120,
      sortable: true,
      filter: true,
      cellRenderer: (params) => formatDate(params.value)
    },
    {
      headerName: 'Stage',
      field: 'stage',
      width: 140,
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(params.value)}`}>
          {params.value}
        </span>
      )
    },
    {
      headerName: 'Resource Allocated (FTEs)',
      field: 'resourceAllocated',
      width: 180,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      cellRenderer: (params) => (
        <div className="text-center font-medium">{params.value}</div>
      )
    },
    {
      headerName: 'PPA Target (Performance/Power/Area)',
      field: 'ppaTarget',
      width: 280,
      sortable: false,
      cellRenderer: (params) => (
        <div className="text-xs">
          <div>Performance: {params.value.performance}</div>
          <div>Power: {params.value.power}</div>
          <div>Area: {params.value.area}</div>
        </div>
      )
    },
    {
      headerName: 'Eligible R&D %',
      field: 'eligibleRD',
      width: 140,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      cellRenderer: (params) => (
        <div className="text-center font-medium">{params.value}%</div>
      )
    },
    {
      headerName: 'Actual Spend ($)',
      field: 'actualSpend',
      width: 160,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      cellRenderer: (params) => formatCurrency(params.value)
    },
    {
      headerName: 'Forecast Spend ($)',
      field: 'forecastSpend',
      width: 160,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      cellRenderer: (params) => formatCurrency(params.value)
    },
    {
      headerName: 'Tax Credit Eligible ($)',
      field: 'taxCreditEligible',
      width: 180,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      cellRenderer: (params) => formatCurrency(params.value)
    },
    {
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <div className="flex space-x-2">
          <Link
            to={`/projects/edit/${params.data._id}`}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(params.data._id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  }), []);

  const onSelectionChanged = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const exportData = () => {
    const csvContent = projects.map(project => ({
      'Project ID': project.projectId,
      'Project Name': project.projectName,
      'Start Date': formatDate(project.startDate),
      'End Date': formatDate(project.endDate),
      'Stage': project.stage,
      'Resource Allocated': project.resourceAllocated,
      'R&D %': project.eligibleRD,
      'Actual Spend': project.actualSpend,
      'Forecast Spend': project.forecastSpend,
      'Tax Credit Eligible': project.taxCreditEligible
    }));

    const csv = [
      Object.keys(csvContent[0]).join(','),
      ...csvContent.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'projects.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {/* Page Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-2">View and manage all projects</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-amd-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Projects</p>
          <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Active Projects</p>
          <p className="text-2xl font-bold text-gray-900">
            {projects.filter(p => ['Design', 'In Progress', 'Validation', 'R&D Prototype'].includes(p.stage)).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Budget</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(projects.reduce((sum, p) => sum + p.forecastSpend, 0))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Avg R&D %</p>
          <p className="text-2xl font-bold text-gray-900">
            {(projects.reduce((sum, p) => sum + p.eligibleRD, 0) / projects.length).toFixed(1)}%
          </p>
        </div>
      </div>



      {/* AG Grid Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={projects}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            domLayout="normal"
          />
        </div>
      </div>

      {/* Selected Rows Info */}
      {selectedRows.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            {selectedRows.length} project(s) selected
          </p>
        </div>
      )}

      {/* Tax Credit Calculation Guide */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">R&D Tax Credit Calculator</h3>
                <p className="text-blue-100 text-sm mt-1">Calculate your project's tax credit eligibility and potential savings</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">20%</div>
              <div className="text-blue-100 text-sm">Federal Tax Credit Rate</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formula Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Calculation Formula</h4>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="text-center mb-4">
                  <div className="text-2xl font-mono font-bold text-blue-700">
                    Tax Credit = Actual Spend × R&D % × 0.20
                  </div>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span><strong>Actual Spend:</strong> Total project expenditure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                    <span><strong>R&D %:</strong> Percentage eligible for R&D credits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    <span><strong>0.20:</strong> 20% federal tax credit rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Example Calculation</h4>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Project Period:</span>
                    <span className="text-sm font-semibold text-slate-900">Jan–Dec 2025</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Total Spend:</span>
                    <span className="text-sm font-semibold text-slate-900">$1.2M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">R&D Eligibility:</span>
                    <span className="text-sm font-semibold text-slate-900">80%</span>
                  </div>
                  <div className="border-t border-green-200 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Eligible R&D Cost:</span>
                      <span className="text-lg font-bold text-green-600">$960K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Tax Credit:</span>
                      <span className="text-xl font-bold text-green-700">$192K</span>
                    </div>
                    <div className="text-xs text-green-600 mt-2 text-center">
                      Credit = $960K × 20% = $192K tax credit in 2025 filing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="text-sm font-medium text-slate-900">Eligibility Criteria</h5>
              </div>
              <p className="text-xs text-slate-600">Projects must involve technical uncertainty and systematic experimentation to qualify for R&D tax credits.</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="text-sm font-medium text-slate-900">Qualified Activities</h5>
              </div>
              <p className="text-xs text-slate-600">Research, development, testing, and engineering activities that advance technology or resolve technical challenges.</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="text-sm font-medium text-slate-900">Important Notice</h5>
              </div>
              <p className="text-xs text-slate-600">This calculator provides estimates only. Actual tax credits require professional consultation and vary by jurisdiction.</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Disclaimer:</strong> This calculation tool is for demonstration purposes only. Actual R&D tax credits depend on specific project details, jurisdiction requirements, and current tax laws. Always consult with qualified tax professionals for accurate calculations and compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleNewProjectSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.projectId}
                      onChange={(e) => handleInputChange('projectId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="e.g., GPU-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={newProject.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={newProject.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stage *
                    </label>
                    <select
                      value={newProject.stage}
                      onChange={(e) => handleInputChange('stage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                    >
                      <option value="Design">Design</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Validation">Validation</option>
                      <option value="R&D Prototype">R&D Prototype</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>
                
                {/* Resource and Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource & Financial</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Allocated (FTEs) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={newProject.resourceAllocated}
                      onChange={(e) => handleInputChange('resourceAllocated', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="1.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eligible R&D % *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={newProject.eligibleRD}
                      onChange={(e) => handleInputChange('eligibleRD', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="80"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Spend ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newProject.actualSpend}
                      onChange={(e) => handleInputChange('actualSpend', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="1000000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forecast Spend ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newProject.forecastSpend}
                      onChange={(e) => handleInputChange('forecastSpend', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="1200000"
                    />
                  </div>
                </div>
              </div>
              
              {/* PPA Target Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">PPA Target</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Target
                    </label>
                    <input
                      type="text"
                      value={newProject.ppaTarget.performance}
                      onChange={(e) => handleInputChange('ppaTarget.performance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="+10% Perf"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Power Target
                    </label>
                    <input
                      type="text"
                      value={newProject.ppaTarget.power}
                      onChange={(e) => handleInputChange('ppaTarget.power', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="-5% Power"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area Target
                    </label>
                    <input
                      type="text"
                      value={newProject.ppaTarget.area}
                      onChange={(e) => handleInputChange('ppaTarget.area', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent"
                      placeholder="+0% Area"
                    />
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amd-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTable; 