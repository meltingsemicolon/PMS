'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/DataContext';
import { useState } from 'react';
import { Search, Plus, Edit, Eye, AlertTriangle, Shield, X } from 'lucide-react';

export default function SecurityPage() {
  const { securityIncidents, inmates, addSecurityIncident } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    type: '' as 'fight' | 'contraband' | 'escape_attempt' | 'other' | '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    severity: '' as 'low' | 'medium' | 'high' | 'critical' | '',
    reportedBy: '',
    involvedInmates: [] as string[]
  });

  const toggleDescription = (incidentId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(incidentId)) {
      newExpanded.delete(incidentId);
    } else {
      newExpanded.add(incidentId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const handleViewIncident = (incident: any) => {
    setSelectedIncident(incident);
    setShowViewModal(true);
  };

  const handleEditIncident = (incident: any) => {
    setSelectedIncident(incident);
    setFormData({
      type: incident.type,
      description: incident.description,
      location: incident.location,
      date: incident.date,
      time: incident.time,
      severity: incident.severity,
      reportedBy: incident.reportedBy,
      involvedInmates: incident.involvedInmates || []
    });
    setShowEditModal(true);
  };

  // Filter security incidents
  let filteredIncidents = securityIncidents;
  if (searchQuery) {
    filteredIncidents = securityIncidents.filter(incident =>
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (typeFilter) {
    filteredIncidents = filteredIncidents.filter(incident => incident.type === typeFilter);
  }
  if (statusFilter) {
    filteredIncidents = filteredIncidents.filter(incident => incident.status === statusFilter);
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInmateName = (inmateId: string) => {
    const inmate = inmates.find(i => i.id === inmateId);
    return inmate ? `${inmate.firstName} ${inmate.lastName}` : 'Unknown';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInmateSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInmateId = e.target.value;
    if (selectedInmateId && !formData.involvedInmates.includes(selectedInmateId)) {
      setFormData(prev => ({
        ...prev,
        involvedInmates: [...prev.involvedInmates, selectedInmateId]
      }));
    }
  };

  const removeInmate = (inmateId: string) => {
    setFormData(prev => ({
      ...prev,
      involvedInmates: prev.involvedInmates.filter(id => id !== inmateId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.type || !formData.severity) {
      return;
    }
    
    // Get inmate names from IDs
    const involvedInmatesNames = formData.involvedInmates.map(inmateId => getInmateName(inmateId));
    
    const newIncident = {
      type: formData.type as 'fight' | 'contraband' | 'escape_attempt' | 'other',
      description: formData.description,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      severity: formData.severity as 'low' | 'medium' | 'high' | 'critical',
      reportedBy: formData.reportedBy,
      involvedInmates: formData.involvedInmates,
      involvedInmatesNames: involvedInmatesNames,
      status: 'open' as const
    };
    
    addSecurityIncident(newIncident);
    setShowAddModal(false);
    
    // Reset form
    setFormData({
      type: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      severity: '',
      reportedBy: '',
      involvedInmates: []
    });
  };

  return (
    <ProtectedRoute permission="security">
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Security Incidents</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage incident reports, investigations, and security alerts
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Incident
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
                  placeholder="Search by description, location, or reporter..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="fight">Fight</option>
                <option value="contraband">Contraband</option>
                <option value="escape_attempt">Escape Attempt</option>
                <option value="other">Other</option>
              </select>
              
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">{securityIncidents.filter(i => i.status === 'open').length}</div>
              <div className="text-sm text-gray-500">Open Incidents</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">{securityIncidents.filter(i => i.status === 'investigating').length}</div>
              <div className="text-sm text-gray-500">Under Investigation</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600">{securityIncidents.filter(i => i.severity === 'critical').length}</div>
              <div className="text-sm text-gray-500">Critical</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{securityIncidents.filter(i => i.status === 'resolved').length}</div>
              <div className="text-sm text-gray-500">Resolved</div>
            </div>
          </div>

          {/* Incidents Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-hidden">
              <table className="w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Incident
                    </th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Location
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Date & Time
                    </th>
                    <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Inmates
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Severity
                    </th>
                    <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Status
                    </th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Reporter
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {incident.type.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {expandedDescriptions.has(incident.id) ? (
                                <>
                                  <p className="whitespace-pre-wrap">{incident.description}</p>
                                  <button
                                    onClick={() => toggleDescription(incident.id)}
                                    className="mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium focus:outline-none"
                                  >
                                    Show less
                                  </button>
                                </>
                              ) : (
                                <>
                                  <p className="break-words">
                                    {incident.description.length > 80 
                                      ? `${incident.description.substring(0, 80)}...` 
                                      : incident.description
                                    }
                                  </p>
                                  {incident.description.length > 80 && (
                                    <button
                                      onClick={() => toggleDescription(incident.id)}
                                      className="mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium focus:outline-none"
                                    >
                                      Show more
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-4 text-sm text-gray-900">
                        <div className="truncate max-w-20">{incident.location}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        <div className="text-xs">{new Date(incident.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        <div className="text-xs text-gray-500">{incident.time}</div>
                      </td>
                      <td className="hidden md:table-cell px-3 py-4">
                        <div className="text-sm text-gray-900">
                          {incident.involvedInmatesNames?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {incident.involvedInmatesNames.slice(0, 2).map((name, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {name.split(' ')[0]}
                                </span>
                              ))}
                              {incident.involvedInmatesNames.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  +{incident.involvedInmatesNames.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-3 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-4 text-sm">
                        <div className="text-sm text-gray-900 truncate max-w-20">{incident.reportedBy}</div>
                        {incident.reportedByBadge && (
                          <div className="text-xs text-gray-500">#{incident.reportedByBadge}</div>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleViewIncident(incident)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditIncident(incident)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            title="Edit Incident"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredIncidents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No security incidents found matching your criteria.</div>
            </div>
          )}

          {/* Report Incident Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Report Security Incident</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Incident Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="fight">Fight</option>
                        <option value="contraband">Contraband</option>
                        <option value="escape_attempt">Escape Attempt</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Severity *
                      </label>
                      <select
                        name="severity"
                        value={formData.severity}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Severity</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Cafeteria, Cell Block A, Yard"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reported By *
                    </label>
                    <input
                      type="text"
                      name="reportedBy"
                      value={formData.reportedBy}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Officer name or ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed description of the incident..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Involved Inmates
                    </label>
                    <select
                      onChange={handleInmateSelection}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                    >
                      <option value="">Select inmates involved...</option>
                      {inmates.filter(i => i.status === 'active').map((inmate) => (
                        <option key={inmate.id} value={inmate.id}>
                          {inmate.firstName} {inmate.lastName} (#{inmate.inmateNumber})
                        </option>
                      ))}
                    </select>
                    
                    {formData.involvedInmates.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.involvedInmates.map((inmateId) => (
                          <span
                            key={inmateId}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {getInmateName(inmateId)}
                            <button
                              type="button"
                              onClick={() => removeInmate(inmateId)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                    >
                      Report Incident
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* View Details Modal */}
          {showViewModal && selectedIncident && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      Incident Details
                    </h3>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Incident Type</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">
                          {selectedIncident.type.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Severity</label>
                        <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getSeverityColor(selectedIncident.severity)}`}>
                          {selectedIncident.severity}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                        {selectedIncident.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedIncident.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedIncident.date).toLocaleDateString()} at {selectedIncident.time}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Involved Inmates</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedIncident.involvedInmatesNames?.length > 0 ? (
                          selectedIncident.involvedInmatesNames.map((name: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No inmates involved</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reported By</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedIncident.reportedBy}</p>
                        {selectedIncident.reportedByBadge && (
                          <p className="text-xs text-gray-500">Badge: {selectedIncident.reportedByBadge}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedIncident.status)}`}>
                          {selectedIncident.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditIncident(selectedIncident);
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      Edit Incident
                    </button>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Incident Modal */}
          {showEditModal && selectedIncident && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Edit className="h-5 w-5 text-green-500 mr-2" />
                      Edit Incident
                    </h3>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    // Here you would implement the update logic
                    console.log('Update incident:', selectedIncident.id, formData);
                    setShowEditModal(false);
                    setSelectedIncident(null);
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Incident Type *
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        >
                          <option value="">Select type...</option>
                          <option value="fight">Fight</option>
                          <option value="contraband">Contraband</option>
                          <option value="escape_attempt">Escape Attempt</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Severity *
                        </label>
                        <select
                          name="severity"
                          value={formData.severity}
                          onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        >
                          <option value="">Select severity...</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        placeholder="Detailed description of the incident..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          placeholder="Cell block, yard, cafeteria, etc."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Reporter *
                        </label>
                        <input
                          type="text"
                          name="reportedBy"
                          value={formData.reportedBy}
                          onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          placeholder="Officer name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Time *
                        </label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
                      >
                        Update Incident
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}