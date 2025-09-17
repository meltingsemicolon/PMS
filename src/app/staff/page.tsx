'use client';

import React from 'react';
import { EnhancedNavigation } from '../../components/Navigation/EnhancedNavigation';

export default function StaffPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EnhancedNavigation />
      <main className="flex-1 overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Staff Management</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Staff management functionality will be implemented here.
              For now, you can see the enhanced navigation and overall system structure.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}