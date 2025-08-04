import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Plus, 
  TrendingUp,
  Users,
  Clock,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/projects', icon: FolderOpen, label: 'Project Management', color: 'text-green-600' },
    { path: '/timeline', icon: Clock, label: 'Timeline', color: 'text-orange-600' },
    { path: '/resources', icon: Users, label: 'Resource Management', color: 'text-indigo-600' },
    { path: '/reports', icon: TrendingUp, label: 'Reports', color: 'text-teal-600' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
                <div className="flex items-center space-x-2 mb-8">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amd-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AMD Demo</h2>
              <p className="text-xs text-gray-500">Project Portfolio Management</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 