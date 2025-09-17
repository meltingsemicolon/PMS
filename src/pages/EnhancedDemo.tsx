'use client';

import React, { useState } from 'react';
import { DataProvider } from '../contexts/DataContext';
import { 
  EnhancedDashboard,
  AdvancedSearch,
  DataManagement,
  EnhancedInmateManagement,
  ComprehensiveAnalytics
} from '../components';

type ViewType = 'dashboard' | 'search' | 'inmates' | 'analytics' | 'data';

export const EnhancedPrisonManagementSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'search':
        return <AdvancedSearch />;
      case 'inmates':
        return <EnhancedInmateManagement />;
      case 'analytics':
        return <ComprehensiveAnalytics />;
      case 'data':
        return <DataManagement />;
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Demo Navigation Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Enhanced Prison Management System Demo
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Enhanced Dashboard
              </button>
              <button
                onClick={() => setCurrentView('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'search'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Advanced Search
              </button>
              <button
                onClick={() => setCurrentView('inmates')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'inmates'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Enhanced Inmates
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Comprehensive Analytics
              </button>
              <button
                onClick={() => setCurrentView('data')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'data'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Data Management
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>

        {/* Footer with feature highlights */}
        <div className="bg-white border-t mt-8">
          <div className="px-6 py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">📊 Advanced Analytics</h3>
                <p className="text-sm text-blue-700">
                  Comprehensive charts, trend analysis, and predictive insights with real-time data visualization.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">🔍 Smart Search</h3>
                <p className="text-sm text-green-700">
                  Advanced filtering, global search across all data types, and intelligent suggestions.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">💾 Data Management</h3>
                <p className="text-sm text-purple-700">
                  Export/import capabilities, comprehensive reporting, and data validation.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">👥 Enhanced UI</h3>
                <p className="text-sm text-orange-700">
                  Improved user experience with intuitive navigation and responsive design.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">⚡ Real-time Updates</h3>
                <p className="text-sm text-red-700">
                  Live dashboard updates, instant notifications, and dynamic data refresh.
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium text-indigo-900 mb-2">🔐 Better Data Utilization</h3>
                <p className="text-sm text-indigo-700">
                  Comprehensive use of all data fields with advanced CRUD operations and analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataProvider>
  );
};