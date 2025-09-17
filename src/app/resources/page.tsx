'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for resources
  const mockResources = [
    {
      id: '1',
      name: 'Medical Supplies',
      category: 'Medical',
      quantity: 150,
      unit: 'units',
      lastUpdated: '2024-01-15',
      status: 'In Stock'
    },
    {
      id: '2',
      name: 'Security Equipment',
      category: 'Security',
      quantity: 45,
      unit: 'pieces',
      lastUpdated: '2024-01-14',
      status: 'Low Stock'
    },
    {
      id: '3',
      name: 'Food Supplies',
      category: 'Kitchen',
      quantity: 500,
      unit: 'kg',
      lastUpdated: '2024-01-16',
      status: 'In Stock'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute permission="resources">
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage facility resources, inventory, and supplies
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:text-black sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <select className="block w-full pl-3 pr-10 py-2 text-gray-900 font-medium text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:text-black sm:text-sm rounded-md">
                  <option value="">All Categories</option>
                  <option value="Medical">Medical</option>
                  <option value="Security">Security</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                
                <select className="block w-full pl-3 pr-10 py-2 text-gray-900 font-medium text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:text-black sm:text-sm rounded-md">
                  <option value="">All Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-blue-900">Resource Management - Coming Soon</h3>
                <p className="text-blue-700 mt-1">
                  This feature is under development. Full resource and inventory management capabilities will be available soon.
                </p>
              </div>
            </div>
          </div>

          {/* Mock Resource Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{resource.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Category:</span>
                      <span className="text-sm text-gray-900">{resource.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <span className="text-sm text-gray-900">{resource.quantity} {resource.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Updated:</span>
                      <span className="text-sm text-gray-900">{new Date(resource.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="p-2 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-50 transition-colors" title="View Details">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:text-green-900 rounded hover:bg-green-50 transition-colors" title="Edit Resource">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-50 transition-colors" title="Delete Resource">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}