'use client';

import React, { useState, useMemo } from 'react';
import { useData, Inmate } from '../../contexts/DataContext';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye,
  Calendar,
  MapPin,
  Phone,
  AlertCircle,
  Users,
  Clock,
  FileText
} from 'lucide-react';

export const EnhancedInmateManagement: React.FC = () => {
  const { inmates, updateInmate } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'admissionDate' | 'releaseDate' | 'cellNumber'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedInmate, setSelectedInmate] = useState<Inmate | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter and sort inmates
  const filteredAndSortedInmates = useMemo(() => {
    const filtered = inmates.filter(inmate => {
      const matchesSearch = !searchQuery || 
        `${inmate.firstName} ${inmate.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inmate.inmateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inmate.crimeType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || inmate.status === statusFilter;
      const matchesBlock = blockFilter === 'all' || inmate.block === blockFilter;
      
      return matchesSearch && matchesStatus && matchesBlock;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | Date, bValue: string | Date;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'admissionDate':
          aValue = new Date(a.admissionDate);
          bValue = new Date(b.admissionDate);
          break;
        case 'releaseDate':
          aValue = new Date(a.expectedReleaseDate);
          bValue = new Date(b.expectedReleaseDate);
          break;
        case 'cellNumber':
          aValue = a.cellNumber;
          bValue = b.cellNumber;
          break;
        default:
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }
      
      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [inmates, searchQuery, statusFilter, blockFilter, sortBy, sortOrder]);

  // Get unique blocks for filter
  const uniqueBlocks = useMemo(() => 
    [...new Set(inmates.map(i => i.block))].sort(), [inmates]
  );

  // Calculate age
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Check if release is upcoming (within 30 days)
  const isUpcomingRelease = (releaseDate: string): boolean => {
    const release = new Date(releaseDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return release <= thirtyDaysFromNow && release > new Date();
  };

  const handleStatusChange = async (inmateId: string, newStatus: 'active' | 'released' | 'transferred') => {
    updateInmate(inmateId, { status: newStatus });
  };

  const InmateCard: React.FC<{ inmate: Inmate }> = ({ inmate }) => {
    const age = calculateAge(inmate.dateOfBirth);
    const upcomingRelease = isUpcomingRelease(inmate.expectedReleaseDate);

    return (
      <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {inmate.firstName} {inmate.lastName}
              </h3>
              <p className="text-sm text-gray-600">#{inmate.inmateNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {upcomingRelease && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Upcoming Release
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              inmate.status === 'active' ? 'bg-green-100 text-green-800' :
              inmate.status === 'released' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {inmate.status.charAt(0).toUpperCase() + inmate.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            Cell {inmate.cellNumber}, Block {inmate.block}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Age: {age} years
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            {inmate.crimeType}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {inmate.sentence}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500">Admission Date</p>
            <p className="font-medium">{new Date(inmate.admissionDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Expected Release</p>
            <p className={`font-medium ${upcomingRelease ? 'text-yellow-600' : ''}`}>
              {new Date(inmate.expectedReleaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              Emergency: {inmate.emergencyContact.name} ({inmate.emergencyContact.relationship})
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedInmate(inmate);
                  setShowDetails(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  // Edit functionality would be implemented here
                  console.log('Edit inmate:', inmate.id);
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
              {inmate.status === 'active' && (
                <div className="relative group">
                  <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <AlertCircle className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-10 hidden group-hover:block bg-white border rounded-lg shadow-lg p-2 w-48 z-10">
                    <button
                      onClick={() => handleStatusChange(inmate.id, 'released')}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                    >
                      Mark as Released
                    </button>
                    <button
                      onClick={() => handleStatusChange(inmate.id, 'transferred')}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                    >
                      Mark as Transferred
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inmate Management</h1>
            <p className="text-gray-600">Manage inmate records and information</p>
          </div>
          <button
            onClick={() => {
              // Add inmate functionality would be implemented here
              console.log('Add new inmate');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Inmate</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search inmates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="released">Released</option>
            <option value="transferred">Transferred</option>
          </select>

          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Blocks</option>
            {uniqueBlocks.map(block => (
              <option key={block} value={block}>Block {block}</option>
            ))}
          </select>

          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'admissionDate' | 'releaseDate' | 'cellNumber')}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="admissionDate">Sort by Admission</option>
              <option value="releaseDate">Sort by Release</option>
              <option value="cellNumber">Sort by Cell</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredAndSortedInmates.length} of {inmates.length} inmates</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
              Active: {inmates.filter(i => i.status === 'active').length}
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></div>
              Upcoming Releases: {inmates.filter(i => isUpcomingRelease(i.expectedReleaseDate)).length}
            </span>
          </div>
        </div>
      </div>

      {/* Inmates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedInmates.map((inmate) => (
          <InmateCard key={inmate.id} inmate={inmate} />
        ))}
      </div>

      {filteredAndSortedInmates.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inmates found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Details Modal - Would be implemented here */}
      {showDetails && selectedInmate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Inmate Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              {/* Detailed view would be implemented here */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  <p><strong>Name:</strong> {selectedInmate.firstName} {selectedInmate.lastName}</p>
                  <p><strong>Date of Birth:</strong> {new Date(selectedInmate.dateOfBirth).toLocaleDateString()}</p>
                  <p><strong>Age:</strong> {calculateAge(selectedInmate.dateOfBirth)} years</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Incarceration Details</h3>
                  <p><strong>Inmate Number:</strong> {selectedInmate.inmateNumber}</p>
                  <p><strong>Cell:</strong> {selectedInmate.cellNumber}, Block {selectedInmate.block}</p>
                  <p><strong>Crime Type:</strong> {selectedInmate.crimeType}</p>
                  <p><strong>Sentence:</strong> {selectedInmate.sentence}</p>
                  <p><strong>Admission Date:</strong> {new Date(selectedInmate.admissionDate).toLocaleDateString()}</p>
                  <p><strong>Expected Release:</strong> {new Date(selectedInmate.expectedReleaseDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Emergency Contact</h3>
                  <p><strong>Name:</strong> {selectedInmate.emergencyContact.name}</p>
                  <p><strong>Relationship:</strong> {selectedInmate.emergencyContact.relationship}</p>
                  <p><strong>Phone:</strong> {selectedInmate.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};