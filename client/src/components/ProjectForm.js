import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, Plus } from 'lucide-react';
import axios from 'axios';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  useEffect(() => {
    if (project) {
      // Set form values using react-hook-form setValue
      setValue('projectId', project.projectId || '');
      setValue('projectName', project.projectName || '');
      setValue('startDate', project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '');
      setValue('endDate', project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '');
      setValue('stage', project.stage || '');
      setValue('resourceAllocated', project.resourceAllocated || '');
      setValue('performance', project.ppaTarget?.performance || '');
      setValue('power', project.ppaTarget?.power || '');
      setValue('area', project.ppaTarget?.area || '');
      setValue('eligibleRD', project.eligibleRD || '');
      setValue('actualSpend', project.actualSpend || '');
      setValue('forecastSpend', project.forecastSpend || '');
      setValue('taxCreditEligible', project.taxCreditEligible || '');
    }
  }, [project, setValue]);

  useEffect(() => {
    if (isEditing && id) {
      fetchProject();
    }
  }, [isEditing, id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      const projectData = response.data;
      setProject(projectData);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const projectData = {
        ...data,
        ppaTarget: {
          performance: data.performance,
          power: data.power,
          area: data.area
        }
      };

      if (isEditing) {
        await axios.put(`/api/projects/${id}`, projectData);
      } else {
        await axios.post('/api/projects', projectData);
      }
      
      navigate('/projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Save failed, please check your input data');
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    'Design',
    'In Progress', 
    'Validation',
    'R&D Prototype',
    'Completed',
    'On Hold'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Project' : 'New Project'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Update project information' : 'Create a new project record'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID *
              </label>
              <input
                type="text"
                {...register('projectId', { required: 'Project ID is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.projectId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., GPU-001"
              />
              {errors.projectId && (
                <p className="text-red-500 text-sm mt-1">{errors.projectId.message}</p>
              )}
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                {...register('projectName', { required: 'Project name is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.projectName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project name"
              />
              {errors.projectName && (
                <p className="text-red-500 text-sm mt-1">{errors.projectName.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stage *
              </label>
              <select
                {...register('stage', { required: 'Stage is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.stage ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select stage</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              {errors.stage && (
                <p className="text-red-500 text-sm mt-1">{errors.stage.message}</p>
              )}
            </div>

            {/* Resource Allocation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Allocation (FTEs) *
              </label>
              <input
                type="number"
                step="0.1"
                {...register('resourceAllocated', { 
                  required: 'Resource allocation is required',
                  min: { value: 0, message: 'Resource allocation cannot be negative' }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.resourceAllocated ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 3.0"
              />
              {errors.resourceAllocated && (
                <p className="text-red-500 text-sm mt-1">{errors.resourceAllocated.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* PPA Targets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">PPA Targets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Target *
              </label>
              <input
                type="text"
                {...register('performance', { required: 'Performance target is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.performance ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., +10% Perf"
              />
              {errors.performance && (
                <p className="text-red-500 text-sm mt-1">{errors.performance.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Power Target *
              </label>
              <input
                type="text"
                {...register('power', { required: 'Power target is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.power ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., -5% Power"
              />
              {errors.power && (
                <p className="text-red-500 text-sm mt-1">{errors.power.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Target *
              </label>
              <input
                type="text"
                {...register('area', { required: 'Area target is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., +0% Area"
              />
              {errors.area && (
                <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                R&D Eligible Percentage (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                {...register('eligibleRD', { 
                  required: 'R&D eligible percentage is required',
                  min: { value: 0, message: 'Percentage cannot be less than 0' },
                  max: { value: 100, message: 'Percentage cannot be greater than 100' }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.eligibleRD ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 80"
              />
              {errors.eligibleRD && (
                <p className="text-red-500 text-sm mt-1">{errors.eligibleRD.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Spend ($) *
              </label>
              <input
                type="number"
                min="0"
                {...register('actualSpend', { 
                  required: 'Actual spend is required',
                  min: { value: 0, message: 'Spend cannot be negative' }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.actualSpend ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 1200000"
              />
              {errors.actualSpend && (
                <p className="text-red-500 text-sm mt-1">{errors.actualSpend.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forecast Spend ($) *
              </label>
              <input
                type="number"
                min="0"
                {...register('forecastSpend', { 
                  required: 'Forecast spend is required',
                  min: { value: 0, message: 'Spend cannot be negative' }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.forecastSpend ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 1300000"
              />
              {errors.forecastSpend && (
                <p className="text-red-500 text-sm mt-1">{errors.forecastSpend.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Credit Eligible ($) *
              </label>
              <input
                type="number"
                min="0"
                {...register('taxCreditEligible', { 
                  required: 'Tax credit eligible amount is required',
                  min: { value: 0, message: 'Amount cannot be negative' }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amd-blue focus:border-transparent ${
                  errors.taxCreditEligible ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 960000"
              />
              {errors.taxCreditEligible && (
                <p className="text-red-500 text-sm mt-1">{errors.taxCreditEligible.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-amd-blue hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isEditing ? 'Update Project' : 'Create Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm; 