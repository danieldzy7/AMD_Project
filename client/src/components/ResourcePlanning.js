import React, { useState } from 'react';
import { Users, UserPlus, Calendar, TrendingUp, Target, Clock, Activity, User, Star, Briefcase, Zap, AlertCircle, CheckCircle, Table, Eye } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

const ResourcePlanning = () => {
  const { projects, loading, error } = useProjects();
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // table, compact, details

  // Mock team members data with different capacities and skills
  const teamMembers = [
    {
      id: 1,
      name: 'Tester1',
      role: 'Senior GPU Architect',
      capacity: 1.0,
      skills: ['GPU Design', 'Power Optimization', 'RTL Design'],
      experience: '8 years',
      availability: 0.85,
      dailyAvailability: {
        monday: 0.9,
        tuesday: 0.85,
        wednesday: 0.8,
        thursday: 0.9,
        friday: 0.8,
        saturday: 0.3,
        sunday: 0.1
      },
      currentProjects: ['GPU-001', 'GPU-015'],
      avatar: 'T1',
      level: 'Senior',
      department: 'GPU Engineering',
      location: 'Austin, TX',
      email: 'tester1@amd.com',
      phone: '+1 (512) 555-0101'
    },
    {
      id: 2,
      name: 'Tester2',
      role: 'CPU Microarchitect',
      capacity: 1.0,
      skills: ['CPU Design', 'Performance Analysis', 'Cache Design'],
      experience: '6 years',
      availability: 0.70,
      dailyAvailability: {
        monday: 0.75,
        tuesday: 0.7,
        wednesday: 0.65,
        thursday: 0.8,
        friday: 0.6,
        saturday: 0.2,
        sunday: 0.1
      },
      currentProjects: ['CPU-014', 'CPU-023'],
      avatar: 'T2',
      level: 'Senior',
      department: 'CPU Engineering',
      location: 'Santa Clara, CA',
      email: 'tester2@amd.com',
      phone: '+1 (408) 555-0102'
    },
    {
      id: 3,
      name: 'Tester3',
      role: 'AI/ML Engineer',
      capacity: 1.0,
      skills: ['AI Optimization', 'NPU Design', 'Machine Learning'],
      experience: '5 years',
      availability: 0.90,
      dailyAvailability: {
        monday: 0.95,
        tuesday: 0.9,
        wednesday: 0.85,
        thursday: 0.95,
        friday: 0.9,
        saturday: 0.4,
        sunday: 0.2
      },
      currentProjects: ['AI-008', 'AI-012'],
      avatar: 'T3',
      level: 'Mid',
      department: 'AI Engineering',
      location: 'Seattle, WA',
      email: 'tester3@amd.com',
      phone: '+1 (206) 555-0103'
    },
    {
      id: 4,
      name: 'Tester4',
      role: 'IP Design Engineer',
      capacity: 1.0,
      skills: ['IP Design', 'Interconnect', 'Protocol Design'],
      experience: '7 years',
      availability: 0.60,
      dailyAvailability: {
        monday: 0.65,
        tuesday: 0.6,
        wednesday: 0.55,
        thursday: 0.7,
        friday: 0.5,
        saturday: 0.1,
        sunday: 0.05
      },
      currentProjects: ['IP-022', 'IP-035'],
      avatar: 'T4',
      level: 'Senior',
      department: 'IP Engineering',
      location: 'Austin, TX',
      email: 'tester4@amd.com',
      phone: '+1 (512) 555-0104'
    },
    {
      id: 5,
      name: 'Tester5',
      role: 'SOC Integration Engineer',
      capacity: 1.0,
      skills: ['SOC Design', 'Integration', 'Verification'],
      experience: '4 years',
      availability: 0.75,
      dailyAvailability: {
        monday: 0.8,
        tuesday: 0.75,
        wednesday: 0.7,
        thursday: 0.8,
        friday: 0.7,
        saturday: 0.25,
        sunday: 0.1
      },
      currentProjects: ['SOC-007', 'SOC-018'],
      avatar: 'T5',
      level: 'Mid',
      department: 'SOC Engineering',
      location: 'Santa Clara, CA',
      email: 'tester5@amd.com',
      phone: '+1 (408) 555-0105'
    },
    {
      id: 6,
      name: 'Tester6',
      role: 'Validation Engineer',
      capacity: 1.0,
      skills: ['Validation', 'Testing', 'Quality Assurance'],
      experience: '3 years',
      availability: 0.80,
      dailyAvailability: {
        monday: 0.85,
        tuesday: 0.8,
        wednesday: 0.75,
        thursday: 0.85,
        friday: 0.75,
        saturday: 0.3,
        sunday: 0.15
      },
      currentProjects: ['GPU-001', 'CPU-014'],
      avatar: 'T6',
      level: 'Junior',
      department: 'Validation',
      location: 'Austin, TX',
      email: 'tester6@amd.com',
      phone: '+1 (512) 555-0106'
    },
    {
      id: 7,
      name: 'Tester7',
      role: 'Power Engineer',
      capacity: 1.0,
      skills: ['Power Analysis', 'Thermal Design', 'Optimization'],
      experience: '6 years',
      availability: 0.65,
      dailyAvailability: {
        monday: 0.7,
        tuesday: 0.65,
        wednesday: 0.6,
        thursday: 0.75,
        friday: 0.55,
        saturday: 0.2,
        sunday: 0.1
      },
      currentProjects: ['GPU-015', 'SOC-007'],
      avatar: 'T7',
      level: 'Senior',
      department: 'Power Engineering',
      location: 'Santa Clara, CA',
      email: 'tester7@amd.com',
      phone: '+1 (408) 555-0107'
    },
    {
      id: 8,
      name: 'Tester8',
      role: 'Performance Engineer',
      capacity: 1.0,
      skills: ['Performance Analysis', 'Benchmarking', 'Optimization'],
      experience: '5 years',
      availability: 0.70,
      dailyAvailability: {
        monday: 0.75,
        tuesday: 0.7,
        wednesday: 0.65,
        thursday: 0.8,
        friday: 0.6,
        saturday: 0.25,
        sunday: 0.1
      },
      currentProjects: ['CPU-023', 'AI-012'],
      avatar: 'T8',
      level: 'Mid',
      department: 'Performance Engineering',
      location: 'Seattle, WA',
      email: 'tester8@amd.com',
      phone: '+1 (206) 555-0108'
    },
    {
      id: 9,
      name: 'Tester9',
      role: 'Software Engineer',
      capacity: 1.0,
      skills: ['Software Development', 'Driver Development', 'System Integration'],
      experience: '4 years',
      availability: 0.85,
      dailyAvailability: {
        monday: 0.9,
        tuesday: 0.85,
        wednesday: 0.8,
        thursday: 0.9,
        friday: 0.8,
        saturday: 0.35,
        sunday: 0.15
      },
      currentProjects: ['SW-001', 'SW-015'],
      avatar: 'T9',
      level: 'Mid',
      department: 'Software Engineering',
      location: 'Austin, TX',
      email: 'tester9@amd.com',
      phone: '+1 (512) 555-0109'
    },
    {
      id: 10,
      name: 'Tester10',
      role: 'Test Engineer',
      capacity: 1.0,
      skills: ['Test Automation', 'Quality Assurance', 'Regression Testing'],
      experience: '3 years',
      availability: 0.90,
      dailyAvailability: {
        monday: 0.95,
        tuesday: 0.9,
        wednesday: 0.85,
        thursday: 0.95,
        friday: 0.85,
        saturday: 0.4,
        sunday: 0.2
      },
      currentProjects: ['TEST-001', 'TEST-015'],
      avatar: 'T10',
      level: 'Junior',
      department: 'Test Engineering',
      location: 'Santa Clara, CA',
      email: 'tester10@amd.com',
      phone: '+1 (408) 555-0110'
    }
  ];

  const getDepartmentColor = (department) => {
    const colors = {
      'GPU Engineering': 'bg-red-50 border-red-200',
      'CPU Engineering': 'bg-blue-50 border-blue-200',
      'AI Engineering': 'bg-purple-50 border-purple-200',
      'SOC Engineering': 'bg-yellow-50 border-yellow-200',
      'IP Engineering': 'bg-green-50 border-green-200',
      'Validation': 'bg-indigo-50 border-indigo-200',
      'Power Engineering': 'bg-pink-50 border-pink-200',
      'Performance Engineering': 'bg-orange-50 border-orange-200'
    };
    return colors[department] || 'bg-gray-50 border-gray-200';
  };

  // Calculate team statistics
  const totalCapacity = teamMembers.reduce((sum, member) => sum + member.capacity, 0);
  const totalAllocated = teamMembers.reduce((sum, member) => sum + (member.capacity * member.availability), 0);
  const utilizationRate = (totalAllocated / totalCapacity) * 100;
  const availableCapacity = totalCapacity - totalAllocated;

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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Resources</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">Resource Planning</h1>
          <p className="text-gray-600 mt-2">Team capacity management and skill allocation</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Table className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'compact' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('details')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'details' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {utilizationRate.toFixed(1)}% Utilization
          </div>
        </div>
      </div>

      {/* Key Metrics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Team Size</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teamMembers.length} Members</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Optimal
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Total Capacity</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalCapacity} FTEs</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Available
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Allocated</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalAllocated.toFixed(1)} FTEs</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {utilizationRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-purple-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Available</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{availableCapacity.toFixed(1)} FTEs</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ready
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <div className="text-sm text-gray-500">
              {viewMode === 'table' && 'Detailed Table View'}
              {viewMode === 'compact' && 'Compact View'}
              {viewMode === 'details' && 'Detailed View'}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {viewMode === 'table' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr 
                    key={member.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedMember?.id === member.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedMember(member)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {member.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            member.availability >= 0.8 ? 'bg-green-500' :
                            member.availability >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(member.department).replace('bg-', 'bg-').replace('border-', 'border-')}`}>
                        {member.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                        member.level === 'Mid' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {member.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          member.availability >= 0.8 ? 'text-green-600' :
                          member.availability >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {(member.availability * 100).toFixed(0)}%
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              member.availability >= 0.8 ? 'bg-green-500' :
                              member.availability >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${member.availability * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.currentProjects.length} projects
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                            +{member.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center space-x-1">
                         {Object.entries(member.dailyAvailability).map(([day, availability]) => (
                           <div key={day} className="flex flex-col items-center">
                             <div className="text-xs text-gray-500 font-medium mb-1">
                               {day.charAt(0).toUpperCase() + day.charAt(1)}
                             </div>
                             <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                               <div 
                                 className={`w-4 h-4 rounded-full ${
                                   availability >= 0.8 ? 'bg-green-500' :
                                   availability >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                 }`}
                                 style={{ opacity: availability }}
                               ></div>
                             </div>
                             <div className="text-xs text-gray-600 mt-1">
                               {(availability * 100).toFixed(0)}%
                             </div>
                           </div>
                         ))}
                       </div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {viewMode === 'compact' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Overview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr 
                    key={member.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedMember(member)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                          {member.avatar}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        member.availability >= 0.8 ? 'text-green-600' :
                        member.availability >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(member.availability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {Object.entries(member.dailyAvailability).slice(0, 5).map(([day, availability]) => (
                          <div key={day} className="flex flex-col items-center">
                            <div className="text-xs text-gray-500">
                              {day.charAt(0).toUpperCase()}
                            </div>
                            <div className="w-3 h-3 rounded-full border border-gray-200 flex items-center justify-center">
                              <div 
                                className={`w-2 h-2 rounded-full ${
                                  availability >= 0.8 ? 'bg-green-500' :
                                  availability >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ opacity: availability }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.currentProjects.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {viewMode === 'details' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Projects</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr 
                    key={member.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedMember(member)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                          {member.avatar}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                          <div className="text-sm text-gray-500">{member.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                      <div className="text-sm text-gray-500">{member.phone}</div>
                      <div className="text-sm text-gray-500">{member.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.experience}</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                        member.level === 'Mid' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {member.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.capacity} FTE</div>
                      <div className={`text-sm font-medium ${
                        member.availability >= 0.8 ? 'text-green-600' :
                        member.availability >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(member.availability * 100).toFixed(0)}% Available
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {member.currentProjects.map((projectId, index) => {
                          const project = projects.find(p => p.projectId === projectId);
                          return (
                            <div key={index} className="text-sm">
                              <span className="font-medium text-gray-900">{projectId}</span>
                              {project && (
                                <span className="text-gray-500 ml-1">- {project.projectName}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                  {selectedMember.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMember.name}</h3>
                  <p className="text-gray-600">{selectedMember.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Member Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Member Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Experience</span>
                      <span className="text-sm font-medium">{selectedMember.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedMember.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                        selectedMember.level === 'Mid' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedMember.level}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Department</span>
                      <span className="text-sm font-medium">{selectedMember.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location</span>
                      <span className="text-sm font-medium">{selectedMember.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Capacity</span>
                      <span className="text-sm font-medium">{selectedMember.capacity} FTE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Availability</span>
                      <span className={`text-sm font-medium ${
                        selectedMember.availability >= 0.8 ? 'text-green-600' :
                        selectedMember.availability >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(selectedMember.availability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm font-medium">{selectedMember.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phone</span>
                      <span className="text-sm font-medium">{selectedMember.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Daily Availability</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {Object.entries(selectedMember.dailyAvailability).map(([day, availability]) => (
                      <div key={day} className="text-center">
                        <div className="text-xs text-gray-500 font-medium mb-2">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center mb-1">
                          <div 
                            className={`w-6 h-6 rounded-full ${
                              availability >= 0.8 ? 'bg-green-500' :
                              availability >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ opacity: availability }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          {(availability * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Current Projects */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Current Projects</h4>
                <div className="space-y-3">
                  {selectedMember.currentProjects.map((projectId, index) => {
                    const project = projects.find(p => p.projectId === projectId);
                    if (!project) return null;
                    
                    return (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{project.projectName}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.stage === 'Design' ? 'bg-blue-100 text-blue-800' :
                            project.stage === 'In Progress' ? 'bg-green-100 text-green-800' :
                            project.stage === 'Validation' ? 'bg-yellow-100 text-yellow-800' :
                            project.stage === 'R&D Prototype' ? 'bg-purple-100 text-purple-800' :
                            project.stage === 'Completed' ? 'bg-gray-100 text-gray-800' :
                            project.stage === 'On Hold' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.stage}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>ID: {project.projectId}</div>
                          <div>Allocated: {project.resourceAllocated} FTEs</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcePlanning; 