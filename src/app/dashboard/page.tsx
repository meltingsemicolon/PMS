'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { EnhancedNavigation } from '@/components/Navigation/EnhancedNavigation';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  UserCheck,
  UserPlus,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const { getDashboardStats } = useData();
  const { user } = useAuth();
  const stats = getDashboardStats();

  // Sample chart data
  const monthlyData = [
    { month: 'Jan', inmates: 245, incidents: 12 },
    { month: 'Feb', inmates: 258, incidents: 8 },
    { month: 'Mar', inmates: 267, incidents: 15 },
    { month: 'Apr', inmates: 251, incidents: 6 },
    { month: 'May', inmates: 263, incidents: 10 },
    { month: 'Jun', inmates: 278, incidents: 14 }
  ];

  const capacityData = [
    { name: 'Occupied', value: stats.totalInmates, color: '#3B82F6' },
    { name: 'Available', value: Math.max(0, 300 - stats.totalInmates), color: '#E5E7EB' }
  ];

  const statCards = [
    {
      title: 'Total Inmates',
      value: stats.totalInmates,
      icon: Users,
      color: 'blue',
      change: '+2.5%'
    },
    {
      title: 'Active Staff',
      value: stats.totalStaff,
      icon: UserCheck,
      color: 'green',
      change: '+1.2%'
    },
    {
      title: 'Pending Visitors',
      value: stats.pendingVisitors,
      icon: UserPlus,
      color: 'yellow',
      change: '-5.4%'
    },
    {
      title: 'Critical Incidents',
      value: stats.criticalIncidents,
      icon: AlertTriangle,
      color: 'red',
      change: '-12.3%'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <EnhancedNavigation />
        <main className="flex-1 overflow-hidden">
          <div className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Here&apos;s what&apos;s happening at your facility today.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{stat.change}</span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inmates" fill="#3B82F6" name="Inmates" />
                  <Bar dataKey="incidents" fill="#EF4444" name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Capacity Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Capacity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={capacityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {capacityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Occupied ({stats.totalInmates})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Available ({300 - stats.totalInmates})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Incidents */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Incidents</h3>
              <div className="space-y-4">
                {stats.recentIncidents.length > 0 ? (
                  stats.recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        incident.severity === 'critical' ? 'bg-red-100' :
                        incident.severity === 'high' ? 'bg-orange-100' :
                        incident.severity === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <Shield className={`h-4 w-4 ${
                          incident.severity === 'critical' ? 'text-red-600' :
                          incident.severity === 'high' ? 'text-orange-600' :
                          incident.severity === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{incident.description}</p>
                        <p className="text-xs text-gray-500">{incident.location} • {incident.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent incidents</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Add New Inmate</span>
                  </div>
                  <div className="text-blue-600">→</div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <UserPlus className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-900">Register Visitor</span>
                  </div>
                  <div className="text-green-600">→</div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                    <span className="font-medium text-gray-900">Report Incident</span>
                  </div>
                  <div className="text-red-600">→</div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900">Generate Report</span>
                  </div>
                  <div className="text-purple-600">→</div>
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Releases */}
          {stats.upcomingReleases > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Releases ({stats.upcomingReleases})
              </h3>
              <p className="text-gray-600">
                {stats.upcomingReleases} inmates are scheduled for release within the next 30 days.
              </p>
            </div>
          )}
        </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}