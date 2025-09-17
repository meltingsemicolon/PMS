'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { useData, Staff } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  UserCheck,
  UserPlus,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Shield,
  Activity,
  Clock,
  Award,
  Phone,
  Mail,
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

export default function DashboardPage() {
  const { getDashboardStats, staff, addStaff, updateStaff, deleteStaff } = useData();
  const { user } = useAuth();
  
  const stats = getDashboardStats();
  const [activeTab, setActiveTab] = useState('overview');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [showViewStaffModal, setShowViewStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffFormData, setStaffFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    shift: undefined as 'day' | 'night' | 'rotating' | undefined,
    contactInfo: {
      email: '',
      phone: ''
    }
  });

  // Staff analytics data
  const staffByDepartment = [
    { department: 'Security', count: staff.filter(s => s.department === 'Security').length, color: '#3B82F6' },
    { department: 'Medical', count: staff.filter(s => s.department === 'Medical').length, color: '#10B981' },
    { department: 'Administration', count: staff.filter(s => s.department === 'Administration').length, color: '#F59E0B' },
    { department: 'Maintenance', count: staff.filter(s => s.department === 'Maintenance').length, color: '#8B5CF6' }
  ];

  const staffByShift = [
    { shift: 'Day', count: staff.filter(s => s.shift === 'day').length, color: '#3B82F6' },
    { shift: 'Night', count: staff.filter(s => s.shift === 'night').length, color: '#1F2937' },
    { shift: 'Rotating', count: staff.filter(s => s.shift === 'rotating').length, color: '#F59E0B' }
  ];

  // Filter staff based on search
  const filteredStaff = staff.filter(staffMember =>
    `${staffMember.firstName} ${staffMember.lastName}`.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    staffMember.employeeId.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    staffMember.position.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    staffMember.department.toLowerCase().includes(staffSearchQuery.toLowerCase())
  );

  // Staff management handlers
  const handleAddStaff = () => {
    setStaffFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      shift: undefined,
      contactInfo: {
        email: '',
        phone: ''
      }
    });
    setShowAddStaffModal(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setStaffFormData({
      employeeId: staffMember.employeeId,
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      position: staffMember.position,
      department: staffMember.department,
      shift: staffMember.shift,
      contactInfo: {
        email: staffMember.contactInfo.email,
        phone: staffMember.contactInfo.phone
      }
    });
    setShowEditStaffModal(true);
  };

  const handleViewStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setShowViewStaffModal(true);
  };

  const handleDeleteStaff = (staffMember: Staff) => {
    if (window.confirm(`Are you sure you want to delete ${staffMember.firstName} ${staffMember.lastName}?`)) {
      deleteStaff(staffMember.id);
    }
  };

  const handleSubmitStaff = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!staffFormData.shift) {
      alert('Please select a shift');
      return;
    }

    const staffData = {
      ...staffFormData,
      shift: staffFormData.shift,
      hireDate: new Date().toISOString().split('T')[0],
      status: 'active' as const
    };

    if (selectedStaff) {
      // Update existing staff
      updateStaff(selectedStaff.id, staffData);
      setShowEditStaffModal(false);
    } else {
      // Add new staff
      addStaff(staffData);
      setShowAddStaffModal(false);
    }
    
    setSelectedStaff(null);
    setStaffFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      shift: undefined,
      contactInfo: {
        email: '',
        phone: ''
      }
    });
  };

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
      <MainLayout>
        <div className="space-y-6">
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

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Activity className="h-4 w-4 inline-block mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'staff'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserCheck className="h-4 w-4 inline-block mr-2" />
                  Staff Management
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 inline-block mr-2" />
                  Analytics
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Recent Activities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">New inmate admission - Cell Block A</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Visitor approval pending - John Doe</p>
                          <p className="text-xs text-gray-500">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Security incident resolved - Cafeteria</p>
                          <p className="text-xs text-gray-500">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                        <UserPlus className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <span className="text-sm font-medium text-blue-900">Add Inmate</span>
                      </button>
                      <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
                        <UserCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <span className="text-sm font-medium text-green-900">Add Staff</span>
                      </button>
                      <button className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center">
                        <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        <span className="text-sm font-medium text-red-900">Report Incident</span>
                      </button>
                      <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
                        <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <span className="text-sm font-medium text-purple-900">Security Check</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'staff' && (
                <div className="space-y-6">
                  {/* Staff Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
                      <p className="text-sm text-gray-600">Manage your facility&apos;s staff members</p>
                    </div>
                    <button 
                      onClick={handleAddStaff}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Staff
                    </button>
                  </div>

                  {/* Staff Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search staff by name, ID, position, or department..."
                      value={staffSearchQuery}
                      onChange={(e) => setStaffSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Staff Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Total Staff</p>
                          <p className="text-2xl font-bold text-blue-900">{staff.length}</p>
                        </div>
                        <UserCheck className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Active Staff</p>
                          <p className="text-2xl font-bold text-green-900">{staff.filter(s => s.status === 'active').length}</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-600">Day Shift</p>
                          <p className="text-2xl font-bold text-yellow-900">{staff.filter(s => s.shift === 'day').length}</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-600" />
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">Departments</p>
                          <p className="text-2xl font-bold text-purple-900">{new Set(staff.map(s => s.department)).size}</p>
                        </div>
                        <Award className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Staff Table */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Staff Member
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Position
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Shift
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStaff.map((staffMember) => (
                            <tr key={staffMember.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      {staffMember.firstName[0]}{staffMember.lastName[0]}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {staffMember.firstName} {staffMember.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">ID: {staffMember.employeeId}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {staffMember.position}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {staffMember.department}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  staffMember.shift === 'day' ? 'bg-yellow-100 text-yellow-800' :
                                  staffMember.shift === 'night' ? 'bg-gray-100 text-gray-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {staffMember.shift}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  staffMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {staffMember.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center space-x-2">
                                  <a href={`mailto:${staffMember.contactInfo.email}`} className="text-blue-600 hover:text-blue-800">
                                    <Mail className="h-4 w-4" />
                                  </a>
                                  <a href={`tel:${staffMember.contactInfo.phone}`} className="text-green-600 hover:text-green-800">
                                    <Phone className="h-4 w-4" />
                                  </a>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => handleViewStaff(staffMember)}
                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleEditStaff(staffMember)}
                                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                    title="Edit Staff"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteStaff(staffMember)}
                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                    title="Delete Staff"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Analytics</h3>
                  </div>

                  {/* Analytics Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Staff by Department */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Staff by Department</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={staffByDepartment}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="count"
                          >
                            {staffByDepartment.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {staffByDepartment.map((dept, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: dept.color }}></div>
                            <span className="text-xs text-gray-600">{dept.department} ({dept.count})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Staff by Shift */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Staff by Shift</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={staffByShift}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="shift" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
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

          {/* Add Staff Modal */}
          {showAddStaffModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <UserPlus className="h-5 w-5 text-blue-500 mr-2" />
                      Add New Staff Member
                    </h3>
                    <button
                      onClick={() => setShowAddStaffModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmitStaff} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Employee ID *
                        </label>
                        <input
                          type="text"
                          value={staffFormData.employeeId}
                          onChange={(e) => setStaffFormData({ ...staffFormData, employeeId: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="EMP001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Department *
                        </label>
                        <select
                          value={staffFormData.department}
                          onChange={(e) => setStaffFormData({ ...staffFormData, department: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select department...</option>
                          <option value="Security">Security</option>
                          <option value="Medical">Medical</option>
                          <option value="Administration">Administration</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={staffFormData.firstName}
                          onChange={(e) => setStaffFormData({ ...staffFormData, firstName: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={staffFormData.lastName}
                          onChange={(e) => setStaffFormData({ ...staffFormData, lastName: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Position *
                        </label>
                        <input
                          type="text"
                          value={staffFormData.position}
                          onChange={(e) => setStaffFormData({ ...staffFormData, position: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Security Officer"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Shift *
                        </label>
                        <select
                          value={staffFormData.shift || ''}
                          onChange={(e) => setStaffFormData({ ...staffFormData, shift: e.target.value as 'day' | 'night' | 'rotating' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select shift...</option>
                          <option value="day">Day Shift</option>
                          <option value="night">Night Shift</option>
                          <option value="rotating">Rotating Shift</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={staffFormData.contactInfo.email}
                          onChange={(e) => setStaffFormData({ 
                            ...staffFormData, 
                            contactInfo: { ...staffFormData.contactInfo, email: e.target.value }
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john.doe@prison.gov"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={staffFormData.contactInfo.phone}
                          onChange={(e) => setStaffFormData({ 
                            ...staffFormData, 
                            contactInfo: { ...staffFormData.contactInfo, phone: e.target.value }
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+1234567890"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddStaffModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add Staff Member
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Staff Modal */}
          {showEditStaffModal && selectedStaff && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Edit className="h-5 w-5 text-green-500 mr-2" />
                      Edit Staff Member
                    </h3>
                    <button
                      onClick={() => setShowEditStaffModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmitStaff} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Employee ID *
                        </label>
                        <input
                          type="text"
                          value={staffFormData.employeeId}
                          onChange={(e) => setStaffFormData({ ...staffFormData, employeeId: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Department *
                        </label>
                        <select
                          value={staffFormData.department}
                          onChange={(e) => setStaffFormData({ ...staffFormData, department: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select department...</option>
                          <option value="Security">Security</option>
                          <option value="Medical">Medical</option>
                          <option value="Administration">Administration</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={staffFormData.firstName}
                          onChange={(e) => setStaffFormData({ ...staffFormData, firstName: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={staffFormData.lastName}
                          onChange={(e) => setStaffFormData({ ...staffFormData, lastName: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Position *
                        </label>
                        <input
                          type="text"
                          value={staffFormData.position}
                          onChange={(e) => setStaffFormData({ ...staffFormData, position: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Shift *
                        </label>
                        <select
                          value={staffFormData.shift || ''}
                          onChange={(e) => setStaffFormData({ ...staffFormData, shift: e.target.value as 'day' | 'night' | 'rotating' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select shift...</option>
                          <option value="day">Day Shift</option>
                          <option value="night">Night Shift</option>
                          <option value="rotating">Rotating Shift</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={staffFormData.contactInfo.email}
                          onChange={(e) => setStaffFormData({ 
                            ...staffFormData, 
                            contactInfo: { ...staffFormData.contactInfo, email: e.target.value }
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={staffFormData.contactInfo.phone}
                          onChange={(e) => setStaffFormData({ 
                            ...staffFormData, 
                            contactInfo: { ...staffFormData.contactInfo, phone: e.target.value }
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowEditStaffModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
                      >
                        Update Staff Member
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* View Staff Modal */}
          {showViewStaffModal && selectedStaff && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Eye className="h-5 w-5 text-blue-500 mr-2" />
                      Staff Member Details
                    </h3>
                    <button
                      onClick={() => setShowViewStaffModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <span className="text-lg font-medium text-gray-700">
                          {selectedStaff.firstName[0]}{selectedStaff.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedStaff.firstName} {selectedStaff.lastName}
                        </h4>
                        <p className="text-gray-600">{selectedStaff.position}</p>
                        <p className="text-sm text-gray-500">ID: {selectedStaff.employeeId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStaff.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Shift</label>
                        <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          selectedStaff.shift === 'day' ? 'bg-yellow-100 text-yellow-800' :
                          selectedStaff.shift === 'night' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedStaff.shift}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStaff.contactInfo.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStaff.contactInfo.phone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedStaff.hireDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedStaff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedStaff.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowViewStaffModal(false);
                        handleEditStaff(selectedStaff);
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      Edit Staff
                    </button>
                    <button
                      onClick={() => setShowViewStaffModal(false)}
                      className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}