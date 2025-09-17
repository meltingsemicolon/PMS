'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/DataContext';
import { useState } from 'react';
import { FileText, Download, BarChart3, Users, AlertTriangle, Heart } from 'lucide-react';

export default function ReportsPage() {
  const { inmates, visitors, securityIncidents } = useData();
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0]
  });

  const reportTypes = [
    {
      id: 'inmate_population',
      title: 'Inmate Population Report',
      description: 'Current inmate population statistics and demographics',
      icon: Users,
      category: 'Population'
    },
    {
      id: 'security_incidents',
      title: 'Security Incidents Report',
      description: 'Security incidents analysis and trends',
      icon: AlertTriangle,
      category: 'Security'
    },
    {
      id: 'visitor_statistics',
      title: 'Visitor Statistics Report',
      description: 'Visitor registration and visitation patterns',
      icon: Users,
      category: 'Visitors'
    },
    {
      id: 'medical_overview',
      title: 'Medical Overview Report',
      description: 'Health services and medical record summary',
      icon: Heart,
      category: 'Medical'
    },
    {
      id: 'daily_operations',
      title: 'Daily Operations Report',
      description: 'Comprehensive daily facility operations summary',
      icon: BarChart3,
      category: 'Operations'
    }
  ];

  const generateInmateReport = () => {
    const totalInmates = inmates.length;
    const activeInmates = inmates.filter(i => i.status === 'active').length;
    const releasedInmates = inmates.filter(i => i.status === 'released').length;
    const transferredInmates = inmates.filter(i => i.status === 'transferred').length;

    // Cell block distribution
    const cellBlocks = inmates.reduce((acc, inmate) => {
      const block = inmate.block || 'Unassigned';
      acc[block] = (acc[block] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Crime type distribution (instead of security level)
    const crimeTypes = inmates.reduce((acc, inmate) => {
      acc[inmate.crimeType] = (acc[inmate.crimeType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: {
        totalInmates,
        activeInmates,
        releasedInmates,
        transferredInmates,
        occupancyRate: ((activeInmates / 500) * 100).toFixed(1) // Assuming 500 capacity
      },
      cellBlocks,
      crimeTypes,
      generatedAt: new Date().toISOString()
    };
  };

  const generateSecurityReport = () => {
    const filteredIncidents = securityIncidents.filter(incident => {
      const incidentDate = new Date(incident.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return incidentDate >= startDate && incidentDate <= endDate;
    });

    const totalIncidents = filteredIncidents.length;
    const openIncidents = filteredIncidents.filter(i => i.status === 'open').length;
    const resolvedIncidents = filteredIncidents.filter(i => i.status === 'resolved').length;

    // Incident types
    const incidentTypes = filteredIncidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Severity distribution
    const severityLevels = filteredIncidents.reduce((acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: {
        totalIncidents,
        openIncidents,
        resolvedIncidents,
        criticalIncidents: filteredIncidents.filter(i => i.severity === 'critical').length
      },
      incidentTypes,
      severityLevels,
      dateRange,
      generatedAt: new Date().toISOString()
    };
  };

  const generateVisitorReport = () => {
    const filteredVisitors = visitors.filter(visitor => {
      const visitDate = new Date(visitor.lastVisit);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return visitDate >= startDate && visitDate <= endDate;
    });

    const totalVisitors = filteredVisitors.length;
    const approvedVisitors = filteredVisitors.filter(v => v.status === 'approved').length;
    const pendingVisitors = filteredVisitors.filter(v => v.status === 'pending').length;
    const deniedVisitors = filteredVisitors.filter(v => v.status === 'denied').length;

    // Visitor types
    const visitorTypes = filteredVisitors.reduce((acc, visitor) => {
      acc[visitor.relationship] = (acc[visitor.relationship] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: {
        totalVisitors,
        approvedVisitors,
        pendingVisitors,
        deniedVisitors
      },
      visitorTypes,
      dateRange,
      generatedAt: new Date().toISOString()
    };
  };

  const generateReport = () => {
    let reportData;
    
    switch (selectedReport) {
      case 'inmate_population':
        reportData = generateInmateReport();
        break;
      case 'security_incidents':
        reportData = generateSecurityReport();
        break;
      case 'visitor_statistics':
        reportData = generateVisitorReport();
        break;
      default:
        return null;
    }

    return reportData;
  };

  const downloadReport = (format: 'json' | 'csv') => {
    const reportData = generateReport();
    if (!reportData) return;

    const reportType = reportTypes.find(r => r.id === selectedReport);
    const filename = `${selectedReport}_${new Date().toISOString().split('T')[0]}.${format}`;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Simple CSV generation for summary data
      let csvContent = `${reportType?.title}\nGenerated: ${new Date().toLocaleString()}\n\n`;
      
      if (reportData.summary) {
        csvContent += 'Summary\n';
        Object.entries(reportData.summary).forEach(([key, value]) => {
          csvContent += `${key},${value}\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const reportData = generateReport();

  return (
    <ProtectedRoute permission="reports">
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="mt-1 text-sm text-gray-500">
                Generate comprehensive reports and analyze facility data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Selection */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Select Report</h3>
                </div>
                <div className="p-6 space-y-4">
                  {reportTypes.map((report) => {
                    const Icon = report.icon;
                    return (
                      <div
                        key={report.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedReport === report.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedReport(report.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`h-6 w-6 mt-1 ${
                            selectedReport === report.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {report.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {report.description}
                            </p>
                            <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {report.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedReport ? reportTypes.find(r => r.id === selectedReport)?.title : 'Report Preview'}
                  </h3>
                  {selectedReport && reportData && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadReport('json')}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        JSON
                      </button>
                      <button
                        onClick={() => downloadReport('csv')}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {!selectedReport ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Report</h3>
                      <p className="text-gray-500">
                        Choose a report type from the sidebar to generate and preview your report.
                      </p>
                    </div>
                  ) : reportData ? (
                    <div className="space-y-6">
                      {/* Summary Section */}
                      {reportData.summary && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Summary</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(reportData.summary).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  {typeof value === 'string' && value.includes('%') ? value : value}
                                </div>
                                <div className="text-sm text-gray-500 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Data Sections */}
                      {Object.entries(reportData).map(([key, value]) => {
                        if (key === 'summary' || key === 'generatedAt' || key === 'dateRange') return null;
                        
                        return (
                          <div key={key}>
                            <h4 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(value as Record<string, number>).map(([k, v]) => (
                                  <div key={k} className="text-center">
                                    <div className="text-xl font-semibold text-gray-900">{v}</div>
                                    <div className="text-sm text-gray-500 capitalize">
                                      {k.replace(/_/g, ' ')}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Generation Info */}
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-500">
                          Generated on {new Date(reportData.generatedAt).toLocaleString()}
                          {'dateRange' in reportData && reportData.dateRange && (
                            <span> • Date range: {new Date(reportData.dateRange.start).toLocaleDateString()} - {new Date(reportData.dateRange.end).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-500">No data available for the selected report.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}