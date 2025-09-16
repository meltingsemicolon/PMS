'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Data interfaces
export interface Inmate {
  id: string;
  inmateNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  admissionDate: string;
  expectedReleaseDate: string;
  cellNumber: string;
  block: string;
  status: 'active' | 'released' | 'transferred';
  crimeType: string;
  sentence: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  hireDate: string;
  shift: 'day' | 'night' | 'rotating';
  status: 'active' | 'inactive';
  contactInfo: {
    email: string;
    phone: string;
  };
}

export interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  lastVisit: string;
  inmateId: string;
  status: 'approved' | 'pending' | 'denied';
}

export interface MedicalRecord {
  id: string;
  inmateId: string;
  date: string;
  type: 'checkup' | 'treatment' | 'emergency' | 'medication';
  description: string;
  doctor: string;
  medications: string[];
  nextAppointment?: string;
}

export interface SecurityIncident {
  id: string;
  type: 'fight' | 'contraband' | 'escape_attempt' | 'other';
  description: string;
  location: string;
  date: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  reportedBy: string;
  involvedInmates: string[];
}

export interface Resource {
  id: string;
  name: string;
  category: 'equipment' | 'supplies' | 'food' | 'medical' | 'security';
  quantity: number;
  unit: string;
  location: string;
  status: 'available' | 'in_use' | 'maintenance' | 'depleted';
  lastUpdated: string;
}

// Data context interface
interface DataContextType {
  // Data
  inmates: Inmate[];
  staff: Staff[];
  visitors: Visitor[];
  medicalRecords: MedicalRecord[];
  securityIncidents: SecurityIncident[];
  resources: Resource[];
  
  // CRUD operations
  addInmate: (inmate: Omit<Inmate, 'id'>) => void;
  updateInmate: (id: string, inmate: Partial<Inmate>) => void;
  deleteInmate: (id: string) => void;
  
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  
  addVisitor: (visitor: Omit<Visitor, 'id'>) => void;
  updateVisitor: (id: string, visitor: Partial<Visitor>) => void;
  deleteVisitor: (id: string) => void;
  
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  updateMedicalRecord: (id: string, record: Partial<MedicalRecord>) => void;
  deleteMedicalRecord: (id: string) => void;
  
  addSecurityIncident: (incident: Omit<SecurityIncident, 'id'>) => void;
  updateSecurityIncident: (id: string, incident: Partial<SecurityIncident>) => void;
  deleteSecurityIncident: (id: string) => void;
  
  addResource: (resource: Omit<Resource, 'id'>) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  
  // Filters and search
  searchInmates: (query: string) => Inmate[];
  filterInmates: (status?: string, block?: string) => Inmate[];
  
  // Dashboard statistics
  getDashboardStats: () => {
    totalInmates: number;
    totalStaff: number;
    pendingVisitors: number;
    criticalIncidents: number;
    upcomingReleases: number;
    recentIncidents: SecurityIncident[];
  };
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Mock data
const mockInmates: Inmate[] = [
  {
    id: '1',
    inmateNumber: 'INM001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-03-15',
    admissionDate: '2023-01-15',
    expectedReleaseDate: '2025-06-15',
    cellNumber: 'A-101',
    block: 'A',
    status: 'active',
    crimeType: 'Theft',
    sentence: '2 years',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Sister',
      phone: '+1234567890'
    }
  },
  {
    id: '2',
    inmateNumber: 'INM002',
    firstName: 'Mike',
    lastName: 'Smith',
    dateOfBirth: '1990-07-22',
    admissionDate: '2023-06-10',
    expectedReleaseDate: '2026-12-10',
    cellNumber: 'B-205',
    block: 'B',
    status: 'active',
    crimeType: 'Assault',
    sentence: '3.5 years',
    emergencyContact: {
      name: 'Sarah Smith',
      relationship: 'Mother',
      phone: '+1987654321'
    }
  },
  {
    id: '3',
    inmateNumber: 'INM003',
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1982-11-08',
    admissionDate: '2022-09-20',
    expectedReleaseDate: '2025-03-20',
    cellNumber: 'C-312',
    block: 'C',
    status: 'active',
    crimeType: 'Drug Possession',
    sentence: '2.5 years',
    emergencyContact: {
      name: 'Lisa Johnson',
      relationship: 'Wife',
      phone: '+1122334455'
    }
  }
];

const mockStaff: Staff[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Wilson',
    position: 'Security Officer',
    department: 'Security',
    hireDate: '2020-03-15',
    shift: 'day',
    status: 'active',
    contactInfo: {
      email: 'sarah.wilson@prison.gov',
      phone: '+1234567890'
    }
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'David',
    lastName: 'Brown',
    position: 'Medical Officer',
    department: 'Medical',
    hireDate: '2019-08-22',
    shift: 'day',
    status: 'active',
    contactInfo: {
      email: 'david.brown@prison.gov',
      phone: '+1987654321'
    }
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Lisa',
    lastName: 'Davis',
    position: 'Warden',
    department: 'Administration',
    hireDate: '2018-01-10',
    shift: 'day',
    status: 'active',
    contactInfo: {
      email: 'lisa.davis@prison.gov',
      phone: '+1122334455'
    }
  }
];

const mockVisitors: Visitor[] = [
  {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    relationship: 'Sister',
    contactInfo: {
      email: 'jane.doe@email.com',
      phone: '+1234567890'
    },
    lastVisit: '2024-01-15',
    inmateId: '1',
    status: 'approved'
  }
];

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    inmateId: '1',
    date: '2024-01-15',
    type: 'checkup',
    description: 'Routine health checkup',
    doctor: 'Dr. Brown',
    medications: ['Vitamin D'],
    nextAppointment: '2024-04-15'
  }
];

const mockSecurityIncidents: SecurityIncident[] = [
  {
    id: '1',
    type: 'fight',
    description: 'Altercation in cafeteria',
    location: 'Cafeteria',
    date: '2024-01-10',
    time: '14:30',
    severity: 'medium',
    status: 'resolved',
    reportedBy: 'Officer Wilson',
    involvedInmates: ['1', '2']
  }
];

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Security Cameras',
    category: 'security',
    quantity: 45,
    unit: 'units',
    location: 'Various',
    status: 'available',
    lastUpdated: '2024-01-15'
  }
];

// Data provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [inmates, setInmates] = useState<Inmate[]>(mockInmates);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>(mockSecurityIncidents);
  const [resources, setResources] = useState<Resource[]>(mockResources);

  // Inmate CRUD operations
  const addInmate = (inmate: Omit<Inmate, 'id'>) => {
    const newInmate = { ...inmate, id: generateId() };
    setInmates(prev => [...prev, newInmate]);
  };

  const updateInmate = (id: string, updatedInmate: Partial<Inmate>) => {
    setInmates(prev => prev.map(inmate => 
      inmate.id === id ? { ...inmate, ...updatedInmate } : inmate
    ));
  };

  const deleteInmate = (id: string) => {
    setInmates(prev => prev.filter(inmate => inmate.id !== id));
  };

  // Staff CRUD operations
  const addStaff = (staffMember: Omit<Staff, 'id'>) => {
    const newStaff = { ...staffMember, id: generateId() };
    setStaff(prev => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updatedStaff: Partial<Staff>) => {
    setStaff(prev => prev.map(staff => 
      staff.id === id ? { ...staff, ...updatedStaff } : staff
    ));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(staff => staff.id !== id));
  };

  // Visitor CRUD operations
  const addVisitor = (visitor: Omit<Visitor, 'id'>) => {
    const newVisitor = { ...visitor, id: generateId() };
    setVisitors(prev => [...prev, newVisitor]);
  };

  const updateVisitor = (id: string, updatedVisitor: Partial<Visitor>) => {
    setVisitors(prev => prev.map(visitor => 
      visitor.id === id ? { ...visitor, ...updatedVisitor } : visitor
    ));
  };

  const deleteVisitor = (id: string) => {
    setVisitors(prev => prev.filter(visitor => visitor.id !== id));
  };

  // Medical record CRUD operations
  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord = { ...record, id: generateId() };
    setMedicalRecords(prev => [...prev, newRecord]);
  };

  const updateMedicalRecord = (id: string, updatedRecord: Partial<MedicalRecord>) => {
    setMedicalRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updatedRecord } : record
    ));
  };

  const deleteMedicalRecord = (id: string) => {
    setMedicalRecords(prev => prev.filter(record => record.id !== id));
  };

  // Security incident CRUD operations
  const addSecurityIncident = (incident: Omit<SecurityIncident, 'id'>) => {
    const newIncident = { ...incident, id: generateId() };
    setSecurityIncidents(prev => [...prev, newIncident]);
  };

  const updateSecurityIncident = (id: string, updatedIncident: Partial<SecurityIncident>) => {
    setSecurityIncidents(prev => prev.map(incident => 
      incident.id === id ? { ...incident, ...updatedIncident } : incident
    ));
  };

  const deleteSecurityIncident = (id: string) => {
    setSecurityIncidents(prev => prev.filter(incident => incident.id !== id));
  };

  // Resource CRUD operations
  const addResource = (resource: Omit<Resource, 'id'>) => {
    const newResource = { ...resource, id: generateId() };
    setResources(prev => [...prev, newResource]);
  };

  const updateResource = (id: string, updatedResource: Partial<Resource>) => {
    setResources(prev => prev.map(resource => 
      resource.id === id ? { ...resource, ...updatedResource } : resource
    ));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  // Search and filter functions
  const searchInmates = (query: string): Inmate[] => {
    return inmates.filter(inmate => 
      `${inmate.firstName} ${inmate.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      inmate.inmateNumber.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterInmates = (status?: string, block?: string): Inmate[] => {
    return inmates.filter(inmate => {
      if (status && inmate.status !== status) return false;
      if (block && inmate.block !== block) return false;
      return true;
    });
  };

  // Dashboard statistics
  const getDashboardStats = () => {
    const criticalIncidents = securityIncidents.filter(incident => 
      incident.severity === 'critical' && incident.status === 'open'
    ).length;

    const upcomingReleases = inmates.filter(inmate => {
      const releaseDate = new Date(inmate.expectedReleaseDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return releaseDate <= thirtyDaysFromNow && inmate.status === 'active';
    }).length;

    const recentIncidents = securityIncidents
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalInmates: inmates.filter(i => i.status === 'active').length,
      totalStaff: staff.filter(s => s.status === 'active').length,
      pendingVisitors: visitors.filter(v => v.status === 'pending').length,
      criticalIncidents,
      upcomingReleases,
      recentIncidents
    };
  };

  const value: DataContextType = {
    inmates,
    staff,
    visitors,
    medicalRecords,
    securityIncidents,
    resources,
    addInmate,
    updateInmate,
    deleteInmate,
    addStaff,
    updateStaff,
    deleteStaff,
    addVisitor,
    updateVisitor,
    deleteVisitor,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    addSecurityIncident,
    updateSecurityIncident,
    deleteSecurityIncident,
    addResource,
    updateResource,
    deleteResource,
    searchInmates,
    filterInmates,
    getDashboardStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// Hook to use data context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}