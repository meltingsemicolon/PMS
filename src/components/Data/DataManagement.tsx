'use client';

import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Download, Upload, FileText, Users, Shield, Eye, Activity, AlertTriangle, Package } from 'lucide-react';

interface ExportOptions {
  inmates: boolean;
  staff: boolean;
  visitors: boolean;
  medicalRecords: boolean;
  securityIncidents: boolean;
  resources: boolean;
  includeInactive: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export const DataManagement: React.FC = () => {
  const {
    inmates,
    staff,
    visitors,
    medicalRecords,
    securityIncidents,
    resources,
    getDashboardStats,
    getAdvancedAnalytics
  } = useData();

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    inmates: true,
    staff: true,
    visitors: true,
    medicalRecords: true,
    securityIncidents: true,
    resources: true,
    includeInactive: false
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const stats = getDashboardStats();
  const analytics = getAdvancedAnalytics();

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      const exportData: Record<string, unknown> = {};

      if (exportOptions.inmates) {
        exportData.inmates = exportOptions.includeInactive 
          ? inmates 
          : inmates.filter(i => i.status === 'active');
      }

      if (exportOptions.staff) {
        exportData.staff = exportOptions.includeInactive 
          ? staff 
          : staff.filter(s => s.status === 'active');
      }

      if (exportOptions.visitors) {
        exportData.visitors = visitors;
      }

      if (exportOptions.medicalRecords) {
        exportData.medicalRecords = medicalRecords;
      }

      if (exportOptions.securityIncidents) {
        exportData.securityIncidents = securityIncidents;
      }

      if (exportOptions.resources) {
        exportData.resources = resources;
      }

      // Add metadata
      exportData.metadata = {
        exportDate: new Date().toISOString(),
        totalRecords: Object.values(exportData).reduce((sum: number, arr: unknown) => 
          Array.isArray(arr) ? sum + arr.length : sum, 0
        ),
        exportedBy: 'System Admin', // In a real app, this would be the current user
        version: '1.0'
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `prison_data_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Generate comprehensive report with analytics
      const reportContent = `
PRISON MANAGEMENT SYSTEM - COMPREHENSIVE REPORT
Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

EXECUTIVE SUMMARY
================
• Total Active Inmates: ${stats.totalInmates}
• Active Staff Members: ${stats.totalStaff}
• Pending Visitor Applications: ${stats.pendingVisitors}
• Critical Security Incidents: ${stats.criticalIncidents}
• Upcoming Releases (30 days): ${stats.upcomingReleases}

FACILITY CAPACITY
================
${Object.entries(analytics.blockStats).map(([block, count]) => 
  `Block ${block}: ${count} inmates`
).join('\n')}

CRIME TYPE DISTRIBUTION
======================
${Object.entries(analytics.crimeStats)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .map(([crime, count]) => `${crime}: ${count} cases`)
  .join('\n')}

AGE DEMOGRAPHICS
===============
${Object.entries(analytics.ageGroups).map(([age, count]) => 
  `${age} years: ${count} inmates`
).join('\n')}

SECURITY INCIDENTS ANALYSIS
===========================
By Severity:
${Object.entries(analytics.incidentStats.bySeverity).map(([severity, count]) => 
  `${severity.toUpperCase()}: ${count} incidents`
).join('\n')}

By Type:
${Object.entries(analytics.incidentStats.byType).map(([type, count]) => 
  `${type.replace('_', ' ').toUpperCase()}: ${count} incidents`
).join('\n')}

MEDICAL ACTIVITY
===============
${Object.entries(analytics.medicalStats.byType).map(([type, count]) => 
  `${type.charAt(0).toUpperCase() + type.slice(1)}: ${count} records`
).join('\n')}

STAFF DISTRIBUTION
==================
By Department:
${Object.entries(analytics.staffStats.byDepartment).map(([dept, count]) => 
  `${dept}: ${count} staff members`
).join('\n')}

By Shift:
${Object.entries(analytics.staffStats.byShift).map(([shift, count]) => 
  `${shift.charAt(0).toUpperCase() + shift.slice(1)}: ${count} staff members`
).join('\n')}

RECENT SECURITY INCIDENTS
=========================
${stats.recentIncidents.slice(0, 5).map(incident => 
  `• ${incident.date} - ${incident.type.replace('_', ' ').toUpperCase()} at ${incident.location} (${incident.severity.toUpperCase()})`
).join('\n')}

---
This report was generated automatically by the Prison Management System.
For questions or clarifications, contact the system administrator.
      `;

      // Download as text file
      const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(reportContent);
      const exportFileDefaultName = `prison_report_${new Date().toISOString().split('T')[0]}.txt`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const dataCategories = [
    { key: 'inmates', label: 'Inmates', icon: Users, count: inmates.length, color: 'blue' },
    { key: 'staff', label: 'Staff', icon: Shield, count: staff.length, color: 'green' },
    { key: 'visitors', label: 'Visitors', icon: Eye, count: visitors.length, color: 'purple' },
    { key: 'medicalRecords', label: 'Medical Records', icon: Activity, count: medicalRecords.length, color: 'red' },
    { key: 'securityIncidents', label: 'Security Incidents', icon: AlertTriangle, count: securityIncidents.length, color: 'orange' },
    { key: 'resources', label: 'Resources', icon: Package, count: resources.length, color: 'indigo' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
          <p className="text-gray-600">Export data, generate reports, and manage system information</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-3xl font-bold text-gray-900">
                  {inmates.length + staff.length + visitors.length + medicalRecords.length + securityIncidents.length + resources.length}
                </p>
              </div>
              <FileText className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Inmates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalInmates}</p>
              </div>
              <Users className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-3xl font-bold text-gray-900">{stats.criticalIncidents}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Data Export Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Export</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {dataCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.key} className="flex items-center space-x-3 p-4 border rounded-lg">
                  <input
                    type="checkbox"
                    id={category.key}
                    checked={exportOptions[category.key as keyof ExportOptions] as boolean}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      [category.key]: e.target.checked
                    })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className={`p-2 rounded-full bg-${category.color}-100`}>
                    <IconComponent className={`h-5 w-5 text-${category.color}-600`} />
                  </div>
                  <div>
                    <label htmlFor={category.key} className="font-medium text-gray-900 cursor-pointer">
                      {category.label}
                    </label>
                    <p className="text-sm text-gray-500">{category.count} records</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includeInactive}
                onChange={(e) => setExportOptions({
                  ...exportOptions,
                  includeInactive: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include inactive records</span>
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleExportData}
              disabled={isExporting || !Object.values(exportOptions).some(v => v === true)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Export Selected Data</span>
                </>
              )}
            </button>

            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Generate Full Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Import Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Import</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Import Data</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop a JSON file here, or click to select a file
            </p>
            <input
              type="file"
              accept=".json"
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log('File selected:', file.name);
                  // In a real app, you would implement file processing here
                  alert('File import functionality would be implemented here');
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </label>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p><strong>Supported formats:</strong> JSON</p>
            <p><strong>Max file size:</strong> 10MB</p>
            <p><strong>Note:</strong> Imported data will be validated before processing</p>
          </div>
        </div>
      </div>
    </div>
  );
};