'use client';

import React from 'react';
import { AdvancedSearch } from '../../components/Search/AdvancedSearch';
import { EnhancedNavigation } from '../../components/Navigation/EnhancedNavigation';

export default function SearchPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EnhancedNavigation />
      <main className="flex-1 overflow-hidden">
        <AdvancedSearch />
      </main>
    </div>
  );
}