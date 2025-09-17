'use client';

import React from 'react';
import { ComprehensiveAnalytics } from '../../components/Analytics/ComprehensiveAnalytics';
import { EnhancedNavigation } from '../../components/Navigation/EnhancedNavigation';

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EnhancedNavigation />
      <main className="flex-1 overflow-hidden">
        <ComprehensiveAnalytics />
      </main>
    </div>
  );
}