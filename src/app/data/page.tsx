'use client';

import React from 'react';
import { DataManagement } from '../../components/Data/DataManagement';
import { EnhancedNavigation } from '../../components/Navigation/EnhancedNavigation';

export default function DataManagementPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EnhancedNavigation />
      <main className="flex-1 overflow-hidden">
        <DataManagement />
      </main>
    </div>
  );
}