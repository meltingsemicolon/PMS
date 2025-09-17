'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/DataContext';
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Mail, Phone, X, UserPlus } from 'lucide-react';

export default function StaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  
  // Modal states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [showViewStaffModal, setShowViewStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
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

  const handleEditStaff = (staffMember: any) => {
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

  const handleViewStaff = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setShowViewStaffModal(true);
  };

  const handleDeleteStaff = (staffMember: any) => {
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

  // Filter staff
  let filteredStaff = staff;
  if (searchQuery) {
    filteredStaff = staff.filter(member =>
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (departmentFilter) {
    filteredStaff = filteredStaff.filter(member => member.department === departmentFilter);
  }
  if (shiftFilter) {
    filteredStaff = filteredStaff.filter(member => member.shift === shiftFilter);
  }

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'day':
        return 'bg-blue-100 text-blue-800';
      case 'night':
        return 'bg-purple-100 text-purple-800';
      case 'rotating':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Security':
        return 'bg-red-100 text-red-800';
      case 'Medical':
        return 'bg-green-100 text-green-800';
      case 'Administration':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute permission="staff">
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage staff directory, schedules, and information
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={handleAddStaff}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Staff Member
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, ID, or position..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Security">Security</option>
                <option value="Medical">Medical</option>
                <option value="Administration">Administration</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
              >
                <option value="">All Shifts</option>
                <option value="day">Day Shift</option>
                <option value="night">Night Shift</option>
                <option value="rotating">Rotating</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">{staff.filter(s => s.status === 'active').length}</div>
              <div className="text-sm text-gray-500">Active Staff</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{staff.filter(s => s.department === 'Security').length}</div>
              <div className="text-sm text-gray-500">Security</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">{staff.filter(s => s.department === 'Medical').length}</div>
              <div className="text-sm text-gray-500">Medical</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-purple-600">{staff.filter(s => s.shift === 'day').length}</div>
              <div className="text-sm text-gray-500">Day Shift</div>
            </div>
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-700">
                          {member.firstName[0]}{member.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{member.position}</p>
                      <p className="text-xs text-gray-400">ID: {member.employeeId}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Department:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(member.department)}`}>
                        {member.department}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Shift:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getShiftColor(member.shift)}`}>
                        {member.shift}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Hire Date:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(member.hireDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{member.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Phone className="h-4 w-4" />
                      <span>{member.contactInfo.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleViewStaff(member)}
                      className="p-2 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditStaff(member)}
                      className="p-2 text-green-600 hover:text-green-900 rounded hover:bg-green-50 transition-colors"
                      title="Edit Staff"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteStaff(member)}
                      className="p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-50 transition-colors"
                      title="Delete Staff"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No staff members found matching your criteria.</div>
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