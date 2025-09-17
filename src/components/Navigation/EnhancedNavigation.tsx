'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Shield,
  Eye,
  Activity,
  AlertTriangle,
  Package,
  Search,
  BarChart3,
  Database,
  Settings,
  ChevronDown,
  ChevronRight,
  Bell,
  User
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

export const EnhancedNavigation: React.FC = () => {
  const pathname = usePathname();
  const { getDashboardStats } = useData();
  const stats = getDashboardStats();
  const [expandedSections, setExpandedSections] = useState<string[]>(['management']);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
    },
    {
      name: 'Enhanced Dashboard',
      href: '/',
      icon: BarChart3,
      badge: stats.criticalIncidents > 0 ? stats.criticalIncidents : undefined,
    },
    {
      name: 'Management',
      href: '#',
      icon: Users,
      children: [
        {
          name: 'Inmates',
          href: '/inmates',
          icon: Users,
          badge: stats.upcomingReleases,
        },
        {
          name: 'Enhanced Inmates',
          href: '/inmates',
          icon: Users,
          badge: stats.totalInmates,
        },
        {
          name: 'Staff',
          href: '/staff',
          icon: Shield,
          badge: stats.totalStaff,
        },
        {
          name: 'Visitors',
          href: '/visitors',
          icon: Eye,
          badge: stats.pendingVisitors,
        },
      ],
    },
    {
      name: 'Operations',
      href: '#',
      icon: Activity,
      children: [
        {
          name: 'Medical Records',
          href: '/medical',
          icon: Activity,
          badge: stats.pendingMedicalAppointments,
        },
        {
          name: 'Security Incidents',
          href: '/security',
          icon: AlertTriangle,
          badge: stats.criticalIncidents,
        },
        {
          name: 'Resources',
          href: '/resources',
          icon: Package,
          badge: stats.totalResources - stats.availableResources,
        },
      ],
    },
    {
      name: 'Analytics',
      href: '#',
      icon: BarChart3,
      children: [
        {
          name: 'Basic Reports',
          href: '/reports',
          icon: BarChart3,
        },
        {
          name: 'Advanced Analytics',
          href: '/analytics',
          icon: BarChart3,
        },
        {
          name: 'Data Management',
          href: '/data',
          icon: Database,
        },
      ],
    },
    {
      name: 'Search',
      href: '/search',
      icon: Search,
    },
    {
      name: 'Demo',
      href: '/demo',
      icon: Eye,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const NavItemComponent: React.FC<{ item: NavItem; level?: number }> = ({ item, level = 0 }) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedSections.includes(item.name.toLowerCase());
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div className="mb-1">
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            level === 0 ? 'text-sm font-medium' : 'text-sm'
          } ${
            isActive
              ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${0.75 + level * 1}rem` }}
          onClick={() => hasChildren ? toggleSection(item.name.toLowerCase()) : null}
        >
          {hasChildren ? (
            <>
              <div className="flex items-center flex-1">
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </>
          ) : (
            <Link href={item.href} className="flex items-center flex-1">
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavItemComponent key={child.name} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-blue-600 rounded-lg p-2">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">Prison MS</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">{stats.totalInmates}</div>
            <div className="text-xs text-gray-500">Active Inmates</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">{stats.totalStaff}</div>
            <div className="text-xs text-gray-500">Staff Members</div>
          </div>
        </div>
        {stats.criticalIncidents > 0 && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                {stats.criticalIncidents} Critical Incident{stats.criticalIncidents !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavItemComponent key={item.name} item={item} />
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="bg-gray-300 rounded-full p-2">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">System Administrator</p>
          </div>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};