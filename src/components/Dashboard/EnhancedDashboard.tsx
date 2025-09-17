'use client';

import React from 'react';
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
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  Package
} from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F'];

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="flex flex-col items-end">
        <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const EnhancedDashboard: React.FC = () => {
  const { getDashboardStats, getAdvancedAnalytics } = useData();
  const stats = getDashboardStats();
  const analytics = getAdvancedAnalytics();

  // Prepare chart data
  const blockData = Object.entries(stats.capacityByBlock).map(([block, count]) => ({
    block,
    count,
    capacity: Math.max(count + 2, 10), // Mock capacity data
    utilization: Math.round((count / Math.max(count + 2, 10)) * 100)
  }));

  const crimeData = Object.entries(analytics.crimeStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([crime, count]) => ({
      crime: crime.length > 15 ? crime.substring(0, 15) + '...' : crime,
      count
    }));

  const ageData = Object.entries(analytics.ageGroups).map(([age, count]) => ({
    age,
    count
  }));

  const incidentSeverityData = Object.entries(analytics.incidentStats.bySeverity).map(([severity, count]) => ({
    severity: severity.charAt(0).toUpperCase() + severity.slice(1),
    count
  }));

  const medicalData = Object.entries(analytics.medicalStats.byType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count
  }));

  const staffData = Object.entries(analytics.staffStats.byDepartment).map(([dept, count]) => ({
    department: dept,
    count
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prison Management Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of prison operations and analytics</p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Inmates"
          value={stats.totalInmates}
          icon={<Users className="h-6 w-6" style={{ color: '#8884d8' }} />}
          color="#8884d8"
          description="Currently incarcerated"
        />
        <StatCard
          title="Active Staff"
          value={stats.totalStaff}
          icon={<Shield className="h-6 w-6" style={{ color: '#82ca9d' }} />}
          color="#82ca9d"
          description="On duty personnel"
        />
        <StatCard
          title="Critical Incidents"
          value={stats.criticalIncidents}
          icon={<AlertTriangle className="h-6 w-6" style={{ color: '#ff7300' }} />}
          color="#ff7300"
          description="Requiring immediate attention"
        />
        <StatCard
          title="Upcoming Releases"
          value={stats.upcomingReleases}
          icon={<Calendar className="h-6 w-6" style={{ color: '#ffc658' }} />}
          color="#ffc658"
          description="Within 30 days"
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pending Visitors"
          value={stats.pendingVisitors}
          icon={<Eye className="h-6 w-6" style={{ color: '#0088fe' }} />}
          color="#0088fe"
          description="Awaiting approval"
        />
        <StatCard
          title="Active Visitors"
          value={stats.activeVisitors}
          icon={<Users className="h-6 w-6" style={{ color: '#00C49F' }} />}
          color="#00C49F"
          description="Approved for visits"
        />
        <StatCard
          title="Medical Appointments"
          value={stats.pendingMedicalAppointments}
          icon={<Activity className="h-6 w-6" style={{ color: '#ff7300' }} />}
          color="#ff7300"
          description="Scheduled ahead"
        />
        <StatCard
          title="Available Resources"
          value={`${stats.availableResources}/${stats.totalResources}`}
          icon={<Package className="h-6 w-6" style={{ color: '#8884d8' }} />}
          color="#8884d8"
          description="Resource availability"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Block Capacity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Capacity Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={blockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="block" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  name === 'count' ? 'Current Inmates' : 'Capacity'
                ]}
              />
              <Bar dataKey="count" fill="#8884d8" name="count" />
              <Bar dataKey="capacity" fill="#82ca9d" name="capacity" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crime Types */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crime Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crimeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="crime" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Age Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [value, props.payload.age]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Severity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Severity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={incidentSeverityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#ff7300"
                dataKey="count"
              >
                {incidentSeverityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [value, props.payload.severity]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Medical Records */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={medicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={staffData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Incidents List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Incidents</h3>
          <div className="space-y-3">
            {stats.recentIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{incident.type.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-sm text-gray-600">{incident.location} • {incident.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {incident.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};