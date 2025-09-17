'use client';

import React from 'react';
import { EnhancedDashboard } from '../components/Dashboard/EnhancedDashboard';
import { EnhancedNavigation } from '../components/Navigation/EnhancedNavigation';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EnhancedNavigation />
      <main className="flex-1 overflow-hidden">
        <EnhancedDashboard />
      </main>
    </div>
  );
}
