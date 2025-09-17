'use client';

import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  ComposedChart,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Activity,
  Shield,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F', '#ffbb28', '#ff8042'];

export const ComprehensiveAnalytics: React.FC = () => {
  const { getAdvancedAnalytics, getDashboardStats, inmates, staff, securityIncidents } = useData();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  const analytics = getAdvancedAnalytics();
  const stats = getDashboardStats();

  // Prepare trend data (mock data - in real app this would come from historical data)
  const getTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month) => ({
      month,
      inmates: Math.floor(Math.random() * 50) + stats.totalInmates - 25,
      incidents: Math.floor(Math.random() * 10) + 5,
      medical: Math.floor(Math.random() * 20) + 10,
      releases: Math.floor(Math.random() * 8) + 2
    }));
  };

  const trendData = getTrendData();

  // Prepare comprehensive statistics
  const comprehensiveStats = [
    {
      title: 'Population Metrics',
      data: [
        { label: 'Total Inmates', value: inmates.length, change: '+5%', icon: Users, color: 'blue' },
        { label: 'Active Staff', value: staff.filter(s => s.status === 'active').length, change: '+2%', icon: Shield, color: 'green' },
        { label: 'Capacity Utilization', value: `${Math.round((stats.totalInmates / 500) * 100)}%`, change: '+3%', icon: TrendingUp, color: 'orange' },
        { label: 'Monthly Turnover', value: '12', change: '-8%', icon: RefreshCw, color: 'purple' }
      ]
    },
    {
      title: 'Security & Safety',
      data: [
        { label: 'Critical Incidents', value: stats.criticalIncidents, change: '-15%', icon: AlertTriangle, color: 'red' },
        { label: 'Total Incidents (30d)', value: securityIncidents.length, change: '+3%', icon: Eye, color: 'yellow' },
        { label: 'Avg Resolution Time', value: '4.2 hrs', change: '-20%', icon: Activity, color: 'indigo' },
        { label: 'Safety Score', value: '94%', change: '+2%', icon: Shield, color: 'green' }
      ]
    }
  ];

  // Crime severity matrix
  const crimeTypeData = Object.entries(analytics.crimeStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([crime, count], index) => ({
      crime: crime.length > 20 ? crime.substring(0, 20) + '...' : crime,
      count,
      severity: Math.floor(Math.random() * 3) + 1, // Mock severity (1-3)
      color: COLORS[index % COLORS.length]
    }));

  // Block analysis with capacity and utilization
  const blockAnalysisData = Object.entries(analytics.blockStats).map(([block, count]) => ({
    block: `Block ${block}`,
    current: count,
    capacity: Math.max(count + Math.floor(Math.random() * 10), 15),
    utilization: Math.round((count / Math.max(count + Math.floor(Math.random() * 10), 15)) * 100),
    incidents: Math.floor(Math.random() * 5) + 1
  }));

  // Age and sentence correlation
  const ageDistributionData = Object.entries(analytics.ageGroups).map(([age, count]) => ({
    ageGroup: age,
    count,
    avgSentence: Math.floor(Math.random() * 15) + 5, // Mock average sentence years
    percentage: Math.round((count / inmates.length) * 100)
  }));

  // Medical trends
  const medicalTrendsData = Object.entries(analytics.medicalStats.byType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    urgency: type === 'emergency' ? 'High' : type === 'treatment' ? 'Medium' : 'Low',
    cost: Math.floor(Math.random() * 1000) + 200 // Mock cost
  }));

  // Staff efficiency metrics
  const staffMetricsData = Object.entries(analytics.staffStats.byDepartment).map(([dept, count]) => ({
    department: dept,
    staff: count,
    workload: Math.floor(Math.random() * 40) + 60, // Mock workload percentage
    satisfaction: Math.floor(Math.random() * 30) + 70, // Mock satisfaction score
    overtime: Math.floor(Math.random() * 20) + 5 // Mock overtime hours
  }));

  const MetricCard: React.FC<{ 
    title: string; 
    value: string | number; 
    change: string; 
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; 
    color: string 
  }> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex flex-col items-end">
          <Icon className="h-8 w-8" style={{ color }} />
          <span className={`text-sm font-medium mt-2 ${
            change.startsWith('+') ? 'text-green-600' : change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
          }`}>
            {change}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive Analytics</h1>
            <p className="text-gray-600">Advanced insights and trends for prison management</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedTimeFrame}
              onChange={(e) => setSelectedTimeFrame(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {comprehensiveStats.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.data.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.label}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Trend Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Trend Analysis</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="inmates" fill="#8884d8" fillOpacity={0.6} />
            <Line yAxisId="right" type="monotone" dataKey="incidents" stroke="#ff7300" strokeWidth={3} />
            <Bar yAxisId="left" dataKey="medical" fill="#82ca9d" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Crime Analysis & Block Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crime Type Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={crimeTypeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="crime" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Capacity Analysis</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={blockAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="block" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="#8884d8" name="Current Inmates" />
              <Bar dataKey="capacity" fill="#82ca9d" opacity={0.6} name="Capacity" />
              <Line dataKey="incidents" stroke="#ff7300" strokeWidth={2} name="Incidents" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics & Medical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution & Sentence Correlation</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={ageDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Count" />
              <Line yAxisId="right" dataKey="avgSentence" stroke="#ff7300" strokeWidth={2} name="Avg Sentence (years)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Activity Analysis</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={medicalTrendsData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                label={({ type, percentage }) => `${type}`}
              >
                {medicalTrendsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, 'Cases']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Performance & Resource Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={staffMetricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="staff" fill="#8884d8" name="Staff Count" />
              <Line dataKey="workload" stroke="#ff7300" strokeWidth={2} name="Workload %" />
              <Line dataKey="satisfaction" stroke="#82ca9d" strokeWidth={2} name="Satisfaction %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Efficiency</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Average Processing Time</span>
              <span className="text-lg font-bold text-blue-600">3.2 hours</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Incident Resolution Rate</span>
              <span className="text-lg font-bold text-green-600">94.5%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Resource Utilization</span>
              <span className="text-lg font-bold text-orange-600">87.3%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Monthly Cost per Inmate</span>
              <span className="text-lg font-bold text-purple-600">$2,450</span>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Predictive Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Capacity Planning</h4>
            <p className="text-sm text-blue-700">
              Based on current trends, Block A will reach 95% capacity within 2 months. 
              Consider capacity redistribution or expansion planning.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Staff Optimization</h4>
            <p className="text-sm text-yellow-700">
              Security department showing 15% overtime increase. 
              Recommend hiring 2 additional officers or shift redistribution.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Cost Efficiency</h4>
            <p className="text-sm text-green-700">
              Medical costs decreased by 12% this quarter through preventive care programs. 
              Continue expansion of wellness initiatives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};