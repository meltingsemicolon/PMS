// Enhanced Components Index
export { EnhancedDashboard } from './Dashboard/EnhancedDashboard';
export { AdvancedSearch } from './Search/AdvancedSearch';
export { DataManagement } from './Data/DataManagement';
export { EnhancedInmateManagement } from './Inmates/EnhancedInmateManagement';
export { ComprehensiveAnalytics } from './Analytics/ComprehensiveAnalytics';
export { EnhancedNavigation } from './Navigation/EnhancedNavigation';
export { EnhancedLayout } from './Layout/EnhancedLayout';

// Re-export enhanced data context
export { DataProvider, useData } from '../contexts/DataContext';
export type { 
  Inmate, 
  Staff, 
  Visitor, 
  MedicalRecord, 
  SecurityIncident, 
  Resource 
} from '../contexts/DataContext';