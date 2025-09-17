'use client';

import React from 'react';
import { EnhancedNavigation } from '../Navigation/EnhancedNavigation';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

export const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EnhancedNavigation />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};