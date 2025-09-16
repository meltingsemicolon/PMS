'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/DataContext';
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Calendar, Pill, Stethoscope, Heart } from 'lucide-react';

export default function MedicalPage() {
  const { medicalRecords, inmates } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Filter medical records
  let filteredRecords = medicalRecords;
  if (searchQuery) {
    filteredRecords = medicalRecords.filter(record => {
      const inmate = inmates.find(i => i.id === record.inmateId);
      const inmateName = inmate ? `${inmate.firstName} ${inmate.lastName}` : '';
      return inmateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             record.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }
  if (typeFilter) {
    filteredRecords = filteredRecords.filter(record => record.type === typeFilter);
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkup':
        return 'bg-blue-100 text-blue-800';
      case 'treatment':
        return 'bg-green-100 text-green-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'medication':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup':
        return Stethoscope;
      case 'treatment':
        return Heart;
      case 'emergency':
        return Heart;
      case 'medication':
        return Pill;
      default:
        return Stethoscope;
    }
  };

  const getInmateName = (inmateId: string) => {
    const inmate = inmates.find(i => i.id === inmateId);
    return inmate ? `${inmate.firstName} ${inmate.lastName}` : 'Unknown';
  };

  const getInmateNumber = (inmateId: string) => {
    const inmate = inmates.find(i => i.id === inmateId);
    return inmate ? inmate.inmateNumber : 'N/A';
  };

  return (
    <ProtectedRoute permission="medical">
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage inmate health records, treatments, and medical appointments
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Medical Record
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
                  placeholder="Search by inmate name, doctor, or description..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="checkup">Checkup</option>
                <option value="treatment">Treatment</option>
                <option value="emergency">Emergency</option>
                <option value="medication">Medication</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">{medicalRecords.filter(r => r.type === 'checkup').length}</div>
              <div className="text-sm text-gray-500">Checkups</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{medicalRecords.filter(r => r.type === 'treatment').length}</div>
              <div className="text-sm text-gray-500">Treatments</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">{medicalRecords.filter(r => r.type === 'emergency').length}</div>
              <div className="text-sm text-gray-500">Emergencies</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-purple-600">{medicalRecords.filter(r => r.nextAppointment).length}</div>
              <div className="text-sm text-gray-500">Scheduled</div>
            </div>
          </div>

          {/* Medical Records */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Appointment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => {
                    const TypeIcon = getTypeIcon(record.type);
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {getInmateName(record.inmateId).split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {getInmateName(record.inmateId)}
                              </div>
                              <div className="text-sm text-gray-500">
                                #{getInmateNumber(record.inmateId)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TypeIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(record.type)}`}>
                              {record.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{record.description}</div>
                          {record.medications.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Medications: {record.medications.join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.doctor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.nextAppointment ? (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-blue-400 mr-1" />
                              {new Date(record.nextAppointment).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No medical records found matching your criteria.</div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                {medicalRecords.filter(r => r.nextAppointment).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getInmateName(record.inmateId)}
                      </p>
                      <p className="text-xs text-gray-500">{record.type} with {record.doctor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {new Date(record.nextAppointment!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {medicalRecords.filter(r => r.nextAppointment).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Medical Activity</h3>
              <div className="space-y-3">
                {medicalRecords.slice(0, 5).map((record) => {
                  const TypeIcon = getTypeIcon(record.type);
                  return (
                    <div key={record.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        record.type === 'emergency' ? 'bg-red-100' :
                        record.type === 'treatment' ? 'bg-green-100' :
                        record.type === 'medication' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        <TypeIcon className={`h-4 w-4 ${
                          record.type === 'emergency' ? 'text-red-600' :
                          record.type === 'treatment' ? 'text-green-600' :
                          record.type === 'medication' ? 'text-purple-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{getInmateName(record.inmateId)}</p>
                        <p className="text-xs text-gray-500">{record.description}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}