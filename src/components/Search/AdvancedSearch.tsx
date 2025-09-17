'use client';

import React, { useState, useEffect } from 'react';
import { useData, Inmate, Staff, Visitor } from '../../contexts/DataContext';
import { Search, Filter, X, User, Users, Eye } from 'lucide-react';

interface SearchFilters {
  category: 'all' | 'inmates' | 'staff' | 'visitors';
  status?: string;
  block?: string;
  department?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export const AdvancedSearch: React.FC = () => {
  const { searchAll, inmates, staff } = useData();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ category: 'all' });
  const [searchResults, setSearchResults] = useState<{
    inmates: Inmate[];
    staff: Staff[];
    visitors: Visitor[];
  }>({ inmates: [], staff: [], visitors: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Get unique values for filter options
  const uniqueBlocks = [...new Set(inmates.map(i => i.block))].sort();
  const uniqueDepartments = [...new Set(staff.map(s => s.department))].sort();

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
      
      // Simulate search delay for better UX
      const searchTimeout = setTimeout(() => {
        const results = searchAll(query);
        
        // Apply additional filters
        let filteredResults = { ...results };
        
        if (filters.category !== 'all') {
          filteredResults = {
            inmates: filters.category === 'inmates' ? results.inmates : [],
            staff: filters.category === 'staff' ? results.staff : [],
            visitors: filters.category === 'visitors' ? results.visitors : []
          };
        }
        
        // Apply status filter for inmates
        if (filters.status && filteredResults.inmates.length > 0) {
          filteredResults.inmates = filteredResults.inmates.filter(
            inmate => inmate.status === filters.status
          );
        }
        
        // Apply block filter for inmates
        if (filters.block && filteredResults.inmates.length > 0) {
          filteredResults.inmates = filteredResults.inmates.filter(
            inmate => inmate.block === filters.block
          );
        }
        
        // Apply department filter for staff
        if (filters.department && filteredResults.staff.length > 0) {
          filteredResults.staff = filteredResults.staff.filter(
            member => member.department === filters.department
          );
        }
        
        setSearchResults(filteredResults);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults({ inmates: [], staff: [], visitors: [] });
      setIsSearching(false);
    }
  }, [query, filters, searchAll]);

  const clearFilters = () => {
    setFilters({ category: 'all' });
  };

  const totalResults = searchResults.inmates.length + searchResults.staff.length + searchResults.visitors.length;

  const ResultCard: React.FC<{ type: string; item: Inmate | Staff | Visitor }> = ({ type, item }) => {
    switch (type) {
      case 'inmate':
        const inmate = item as Inmate;
        return (
          <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {inmate.firstName} {inmate.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">Inmate #{inmate.inmateNumber}</p>
                  <p className="text-sm text-gray-500">Cell: {inmate.cellNumber} • Block: {inmate.block}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                inmate.status === 'active' ? 'bg-green-100 text-green-800' :
                inmate.status === 'released' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {inmate.status}
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p><strong>Crime:</strong> {inmate.crimeType}</p>
              <p><strong>Sentence:</strong> {inmate.sentence}</p>
              <p><strong>Expected Release:</strong> {new Date(inmate.expectedReleaseDate).toLocaleDateString()}</p>
            </div>
          </div>
        );
      
      case 'staff':
        const staffMember = item as Staff;
        return (
          <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {staffMember.firstName} {staffMember.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">Employee #{staffMember.employeeId}</p>
                  <p className="text-sm text-gray-500">{staffMember.position} • {staffMember.department}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                staffMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {staffMember.status}
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p><strong>Shift:</strong> {staffMember.shift.charAt(0).toUpperCase() + staffMember.shift.slice(1)}</p>
              <p><strong>Hire Date:</strong> {new Date(staffMember.hireDate).toLocaleDateString()}</p>
              <p><strong>Contact:</strong> {staffMember.contactInfo.email}</p>
            </div>
          </div>
        );
      
      case 'visitor':
        const visitor = item as Visitor;
        return (
          <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {visitor.firstName} {visitor.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">Visitor</p>
                  <p className="text-sm text-gray-500">Relationship: {visitor.relationship}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                visitor.status === 'approved' ? 'bg-green-100 text-green-800' :
                visitor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {visitor.status}
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p><strong>Last Visit:</strong> {new Date(visitor.lastVisit).toLocaleDateString()}</p>
              <p><strong>Contact:</strong> {visitor.contactInfo.email}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Search</h1>
          <p className="text-gray-600">Search across inmates, staff, and visitors with advanced filtering</p>
        </div>

        {/* Search Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, number, position, crime type..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value as 'all' | 'inmates' | 'staff' | 'visitors' })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="inmates">Inmates</option>
                    <option value="staff">Staff</option>
                    <option value="visitors">Visitors</option>
                  </select>
                </div>

                {filters.category === 'inmates' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={filters.status || ''}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="released">Released</option>
                        <option value="transferred">Transferred</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Block</label>
                      <select
                        value={filters.block || ''}
                        onChange={(e) => setFilters({ ...filters, block: e.target.value || undefined })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Blocks</option>
                        {uniqueBlocks.map(block => (
                          <option key={block} value={block}>Block {block}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {filters.category === 'staff' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={filters.department || ''}
                      onChange={(e) => setFilters({ ...filters, department: e.target.value || undefined })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Departments</option>
                      {uniqueDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {query && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results {!isSearching && `(${totalResults} found)`}
              </h2>
              {isSearching && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span>Searching...</span>
                </div>
              )}
            </div>

            {!isSearching && totalResults === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            )}

            {!isSearching && (
              <div className="space-y-6">
                {searchResults.inmates.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Inmates ({searchResults.inmates.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.inmates.map((inmate) => (
                        <ResultCard key={inmate.id} type="inmate" item={inmate} />
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.staff.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Staff ({searchResults.staff.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.staff.map((member) => (
                        <ResultCard key={member.id} type="staff" item={member} />
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.visitors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Visitors ({searchResults.visitors.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.visitors.map((visitor) => (
                        <ResultCard key={visitor.id} type="visitor" item={visitor} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};