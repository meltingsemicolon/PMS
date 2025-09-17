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
  reportedById?: string;
  reportedByBadge?: string;
  involvedInmates: string[];
  involvedInmatesNames: string[];
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
    "id": "1",
    "inmateNumber": "INM001",
    "firstName": "Khadga",
    "lastName": "Prasad Sharma Oli",
    "dateOfBirth": "1952-02-22",
    "admissionDate": "2025-09-10",
    "expectedReleaseDate": "2100-09-10",
    "cellNumber": "A-101",
    "block": "A",
    "status": "active",
    "crimeType": "Policy Corruption",
    "sentence": "75 years",
    "emergencyContact": {
      "name": "Radhika Shakya",
      "relationship": "Wife",
      "phone": "+977-9841234567"
    }
  },
  {
    "id": "2",
    "inmateNumber": "INM002",
    "firstName": "Sher",
    "lastName": "Bahadur Deuba",
    "dateOfBirth": "1946-06-13",
    "admissionDate": "2025-09-10",
    "expectedReleaseDate": "2099-09-10",
    "cellNumber": "A-102",
    "block": "A",
    "status": "active",
    "crimeType": "Misuse of Funds",
    "sentence": "53 years",
    "emergencyContact": {
      "name": "Arzu Rana Deuba",
      "relationship": "Wife",
      "phone": "+977-9842345678"
    }
  },
  {
    "id": "3",
    "inmateNumber": "INM003",
    "firstName": "Madhav",
    "lastName": "Kumar Nepal",
    "dateOfBirth": "1953-05-31",
    "admissionDate": "2025-06-05",
    "expectedReleaseDate": "2099-06-05",
    "cellNumber": "A-103",
    "block": "A",
    "status": "active",
    "crimeType": "Land Scams",
    "sentence": "46 years",
    "emergencyContact": {
      "name": "Mata Khanal",
      "relationship": "Wife",
      "phone": "+977-9843456789"
    }
  },
  {
    "id": "4",
    "inmateNumber": "INM004",
    "firstName": "Pushpa",
    "lastName": "Kamal Dahal",
    "dateOfBirth": "1955-06-11",
    "admissionDate": "2025-08-15",
    "expectedReleaseDate": "2100-08-15",
    "cellNumber": "A-104",
    "block": "A",
    "status": "active",
    "crimeType": "Embezzlement",
    "sentence": "70 years",
    "emergencyContact": {
      "name": "Sita Dahal",
      "relationship": "Wife",
      "phone": "+977-9844567890"
    }
  },
  {
    "id": "5",
    "inmateNumber": "INM005",
    "firstName": "Baburam",
    "lastName": "Bhattarai",
    "dateOfBirth": "1954-06-26",
    "admissionDate": "2023-07-15",
    "expectedReleaseDate": "2099-07-15",
    "cellNumber": "B-205",
    "block": "B",
    "status": "active",
    "crimeType": "Land Scams",
    "sentence": "2 years",
    "emergencyContact": {
      "name": "Hisila Yami",
      "relationship": "Wife",
      "phone": "+977-9805678901"
    }
  },
  {
    "id": "6",
    "inmateNumber": "INM006",
    "firstName": "Arzu",
    "lastName": "Rana Deuba",
    "dateOfBirth": "1973-01-15",
    "admissionDate": "2025-09-10",
    "expectedReleaseDate": "2100-09-10",
    "cellNumber": "B-206",
    "block": "B",
    "status": "active",
    "crimeType": "Refugee Scam",
    "sentence": "27 years",
    "emergencyContact": {
      "name": "Sher Bahadur Deuba",
      "relationship": "Husband",
      "phone": "+977-9846789012"
    }
  },
  {
    "id": "7",
    "inmateNumber": "INM007",
    "firstName": "Krishna",
    "lastName": "Bahadur Mahara",
    "dateOfBirth": "1958-03-12",
    "admissionDate": "2024-11-01",
    "expectedReleaseDate": "2099-11-01",
    "cellNumber": "B-207",
    "block": "B",
    "status": "active",
    "crimeType": "Bribery",
    "sentence": "41 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9847890123"
    }
  },
  {
    "id": "8",
    "inmateNumber": "INM008",
    "firstName": "Gokul",
    "lastName": "Baskota",
    "dateOfBirth": "1962-09-05",
    "admissionDate": "2024-03-15",
    "expectedReleaseDate": "2099-03-15",
    "cellNumber": "B-208",
    "block": "B",
    "status": "active",
    "crimeType": "Bribery Tape",
    "sentence": "37 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Relative",
      "phone": "+977-9848901234"
    }
  },
  {
    "id": "9",
    "inmateNumber": "INM009",
    "firstName": "Khum",
    "lastName": "Bahadur Khadka",
    "dateOfBirth": "1943-04-18",
    "admissionDate": "2023-01-20",
    "expectedReleaseDate": "2098-01-20",
    "cellNumber": "C-301",
    "block": "C",
    "status": "active",
    "crimeType": "Corruption",
    "sentence": "55 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9849012345"
    }
  },
  {
    "id": "10",
    "inmateNumber": "INM010",
    "firstName": "Jeevan",
    "lastName": "Bahadur Shahi",
    "dateOfBirth": "1955-11-30",
    "admissionDate": "2024-04-08",
    "expectedReleaseDate": "2099-04-08",
    "cellNumber": "C-302",
    "block": "C",
    "status": "active",
    "crimeType": "Wide-Body Scam",
    "sentence": "45 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Spouse",
      "phone": "+977-9850123456"
    }
  },
  {
    "id": "11",
    "inmateNumber": "INM011",
    "firstName": "Tek",
    "lastName": "Bahadur Gurung",
    "dateOfBirth": "1960-02-14",
    "admissionDate": "2023-02-28",
    "expectedReleaseDate": "2098-02-28",
    "cellNumber": "C-303",
    "block": "C",
    "status": "active",
    "crimeType": "Land Renting Fraud",
    "sentence": "35 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Brother",
      "phone": "+977-9851234567"
    }
  },
  {
    "id": "12",
    "inmateNumber": "INM012",
    "firstName": "Bhim",
    "lastName": "Rawal",
    "dateOfBirth": "1951-01-19",
    "admissionDate": "2024-12-15",
    "expectedReleaseDate": "2099-12-15",
    "cellNumber": "C-304",
    "block": "C",
    "status": "active",
    "crimeType": "Infrastructure Graft",
    "sentence": "48 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9852345678"
    }
  },
  {
    "id": "13",
    "inmateNumber": "INM013",
    "firstName": "Ishwor",
    "lastName": "Pokhrel",
    "dateOfBirth": "1952-05-08",
    "admissionDate": "2025-01-10",
    "expectedReleaseDate": "2099-01-10",
    "cellNumber": "C-305",
    "block": "C",
    "status": "active",
    "crimeType": "Policy Bribery",
    "sentence": "47 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9853456789"
    }
  },
  {
    "id": "14",
    "inmateNumber": "INM014",
    "firstName": "Narayan",
    "lastName": "Kaji Shrestha",
    "dateOfBirth": "1967-09-16",
    "admissionDate": "2025-06-20",
    "expectedReleaseDate": "2099-06-20",
    "cellNumber": "D-401",
    "block": "D",
    "status": "active",
    "crimeType": "Maoist Funds",
    "sentence": "32 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Brother",
      "phone": "+977-9854567890"
    }
  },
  {
    "id": "15",
    "inmateNumber": "INM015",
    "firstName": "Janardan",
    "lastName": "Sharma",
    "dateOfBirth": "1959-10-22",
    "admissionDate": "2025-02-14",
    "expectedReleaseDate": "2099-02-14",
    "cellNumber": "D-402",
    "block": "D",
    "status": "active",
    "crimeType": "Energy Scam",
    "sentence": "40 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Daughter",
      "phone": "+977-9855678901"
    }
  },
  {
    "id": "16",
    "inmateNumber": "INM016",
    "firstName": "Barsha",
    "lastName": "Man Pun",
    "dateOfBirth": "1982-04-11",
    "admissionDate": "2025-09-05",
    "expectedReleaseDate": "2100-09-05",
    "cellNumber": "D-403",
    "block": "D",
    "status": "active",
    "crimeType": "Youth Corruption",
    "sentence": "18 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Husband",
      "phone": "+977-9856789012"
    }
  },
  {
    "id": "17",
    "inmateNumber": "INM017",
    "firstName": "Gagan",
    "lastName": "Thapa",
    "dateOfBirth": "1976-07-18",
    "admissionDate": "2025-07-10",
    "expectedReleaseDate": "2100-07-10",
    "cellNumber": "D-404",
    "block": "D",
    "status": "active",
    "crimeType": "Congress Graft",
    "sentence": "24 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9857890123"
    }
  },
  {
    "id": "18",
    "inmateNumber": "INM018",
    "firstName": "Rabi",
    "lastName": "Lamichhane",
    "dateOfBirth": "1983-12-29",
    "admissionDate": "2025-08-05",
    "expectedReleaseDate": "2100-08-05",
    "cellNumber": "E-501",
    "block": "E",
    "status": "active",
    "crimeType": "Nepo Influence",
    "sentence": "17 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9858901234"
    }
  },
  {
    "id": "19",
    "inmateNumber": "INM019",
    "firstName": "Renu",
    "lastName": "Yadav",
    "dateOfBirth": "1967-02-16",
    "admissionDate": "2025-01-25",
    "expectedReleaseDate": "2099-01-25",
    "cellNumber": "E-502",
    "block": "E",
    "status": "active",
    "crimeType": "Madhesi Corruption",
    "sentence": "33 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Sister",
      "phone": "+977-9859012345"
    }
  },
  {
    "id": "20",
    "inmateNumber": "INM020",
    "firstName": "Upendra",
    "lastName": "Yadav",
    "dateOfBirth": "1965-03-09",
    "admissionDate": "2024-11-20",
    "expectedReleaseDate": "2099-11-20",
    "cellNumber": "E-503",
    "block": "E",
    "status": "active",
    "crimeType": "Political Funds",
    "sentence": "35 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9860123456"
    }
  },
  {
    "id": "21",
    "inmateNumber": "INM021",
    "firstName": "Matrika",
    "lastName": "Yadav",
    "dateOfBirth": "1972-07-04",
    "admissionDate": "2025-05-15",
    "expectedReleaseDate": "2099-05-15",
    "cellNumber": "E-504",
    "block": "E",
    "status": "active",
    "crimeType": "Infrastructure",
    "sentence": "28 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Husband",
      "phone": "+977-9861234567"
    }
  },
  {
    "id": "22",
    "inmateNumber": "INM022",
    "firstName": "Bijay",
    "lastName": "Kumar Gachhadar",
    "dateOfBirth": "1954-12-01",
    "admissionDate": "2024-08-10",
    "expectedReleaseDate": "2099-08-10",
    "cellNumber": "F-601",
    "block": "F",
    "status": "active",
    "crimeType": "Tharu Scam",
    "sentence": "44 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Daughter",
      "phone": "+977-9862345678"
    }
  },
  {
    "id": "23",
    "inmateNumber": "INM023",
    "firstName": "Mahantha",
    "lastName": "Thakur",
    "dateOfBirth": "1946-11-28",
    "admissionDate": "2025-03-05",
    "expectedReleaseDate": "2098-03-05",
    "cellNumber": "F-602",
    "block": "F",
    "status": "active",
    "crimeType": "Madhes Alliance",
    "sentence": "52 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9863456789"
    }
  },
  {
    "id": "24",
    "inmateNumber": "INM024",
    "firstName": "Rajendra",
    "lastName": "Mahato",
    "dateOfBirth": "1957-05-19",
    "admissionDate": "2025-04-20",
    "expectedReleaseDate": "2099-04-20",
    "cellNumber": "F-603",
    "block": "F",
    "status": "active",
    "crimeType": "Ethnic Funds",
    "sentence": "42 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9864567890"
    }
  },
  {
    "id": "25",
    "inmateNumber": "INM025",
    "firstName": "Sujata",
    "lastName": "Koirala",
    "dateOfBirth": "1954-02-24",
    "admissionDate": "2025-01-15",
    "expectedReleaseDate": "2099-01-15",
    "cellNumber": "F-604",
    "block": "F",
    "status": "active",
    "crimeType": "Foreign Aid Misuse",
    "sentence": "46 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Husband",
      "phone": "+977-9865678901"
    }
  },
  {
    "id": "26",
    "inmateNumber": "INM026",
    "firstName": "Ram",
    "lastName": "Chandra Poudel",
    "dateOfBirth": "1944-10-14",
    "admissionDate": "2025-02-10",
    "expectedReleaseDate": "2098-02-10",
    "cellNumber": "G-701",
    "block": "G",
    "status": "active",
    "crimeType": "Congress Corruption",
    "sentence": "54 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9866789012"
    }
  },
  {
    "id": "27",
    "inmateNumber": "INM027",
    "firstName": "Jhala",
    "lastName": "Nath Khanal",
    "dateOfBirth": "1950-05-20",
    "admissionDate": "2024-09-15",
    "expectedReleaseDate": "2099-09-15",
    "cellNumber": "G-702",
    "block": "G",
    "status": "active",
    "crimeType": "Policy Graft",
    "sentence": "49 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9867890123"
    }
  },
  {
    "id": "28",
    "inmateNumber": "INM028",
    "firstName": "Pradip",
    "lastName": "Giri",
    "dateOfBirth": "1947-06-23",
    "admissionDate": "2024-10-10",
    "expectedReleaseDate": "2098-10-10",
    "cellNumber": "G-703",
    "block": "G",
    "status": "active",
    "crimeType": "Nepotism",
    "sentence": "51 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Brother",
      "phone": "+977-9868901234"
    }
  },
  {
    "id": "29",
    "inmateNumber": "INM029",
    "firstName": "Giriraj",
    "lastName": "Mani Pokharel",
    "dateOfBirth": "1957-09-10",
    "admissionDate": "2025-03-20",
    "expectedReleaseDate": "2099-03-20",
    "cellNumber": "G-704",
    "block": "G",
    "status": "active",
    "crimeType": "Education Scam",
    "sentence": "42 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9869012345"
    }
  },
  {
    "id": "30",
    "inmateNumber": "INM030",
    "firstName": "Bimalendra",
    "lastName": "Nidhi",
    "dateOfBirth": "1960-09-28",
    "admissionDate": "2025-04-05",
    "expectedReleaseDate": "2099-04-05",
    "cellNumber": "H-801",
    "block": "H",
    "status": "active",
    "crimeType": "Madhesi Funds",
    "sentence": "39 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9870123456"
    }
  },
  {
    "id": "31",
    "inmateNumber": "INM031",
    "firstName": "Prakash",
    "lastName": "Man Singh",
    "dateOfBirth": "1956-04-01",
    "admissionDate": "2025-05-10",
    "expectedReleaseDate": "2099-05-10",
    "cellNumber": "H-802",
    "block": "H",
    "status": "active",
    "crimeType": "Congress Nepotism",
    "sentence": "43 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9871234567"
    }
  },
  {
    "id": "32",
    "inmateNumber": "INM032",
    "firstName": "Chitra",
    "lastName": "Bahadur KC",
    "dateOfBirth": "1943-11-15",
    "admissionDate": "2024-07-20",
    "expectedReleaseDate": "2098-07-20",
    "cellNumber": "H-803",
    "block": "H",
    "status": "active",
    "crimeType": "Maoist Corruption",
    "sentence": "55 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Daughter",
      "phone": "+977-9872345678"
    }
  },
  {
    "id": "33",
    "inmateNumber": "INM033",
    "firstName": "Amresh",
    "lastName": "Kumar Singh",
    "dateOfBirth": "1968-08-12",
    "admissionDate": "2025-06-15",
    "expectedReleaseDate": "2099-06-15",
    "cellNumber": "H-804",
    "block": "H",
    "status": "active",
    "crimeType": "Regional Graft",
    "sentence": "31 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Brother",
      "phone": "+977-9873456789"
    }
  },
  {
    "id": "34",
    "inmateNumber": "INM034",
    "firstName": "Hridayesh",
    "lastName": "Tripathi",
    "dateOfBirth": "1960-12-05",
    "admissionDate": "2024-12-01",
    "expectedReleaseDate": "2099-12-01",
    "cellNumber": "I-901",
    "block": "I",
    "status": "active",
    "crimeType": "Madhesi Alliance",
    "sentence": "39 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9874567890"
    }
  },
  {
    "id": "35",
    "inmateNumber": "INM035",
    "firstName": "Narayan",
    "lastName": "Shrestha",
    "dateOfBirth": "1962-03-18",
    "admissionDate": "2025-01-20",
    "expectedReleaseDate": "2099-01-20",
    "cellNumber": "I-902",
    "block": "I",
    "status": "active",
    "crimeType": "Infrastructure Scam",
    "sentence": "37 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9875678901"
    }
  },
  {
    "id": "36",
    "inmateNumber": "INM036",
    "firstName": "Dev",
    "lastName": "Prasad Gurung",
    "dateOfBirth": "1955-07-09",
    "admissionDate": "2024-11-10",
    "expectedReleaseDate": "2099-11-10",
    "cellNumber": "I-903",
    "block": "I",
    "status": "active",
    "crimeType": "Maoist Funds",
    "sentence": "44 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9876789012"
    }
  },
  {
    "id": "37",
    "inmateNumber": "INM037",
    "firstName": "Shakti",
    "lastName": "Bahadur Basnet",
    "dateOfBirth": "1971-04-22",
    "admissionDate": "2025-02-25",
    "expectedReleaseDate": "2099-02-25",
    "cellNumber": "I-904",
    "block": "I",
    "status": "active",
    "crimeType": "Energy Graft",
    "sentence": "28 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Brother",
      "phone": "+977-9877890123"
    }
  },
  {
    "id": "38",
    "inmateNumber": "INM038",
    "firstName": "Ram",
    "lastName": "Sahal Yadav",
    "dateOfBirth": "1965-10-30",
    "admissionDate": "2025-03-15",
    "expectedReleaseDate": "2099-03-15",
    "cellNumber": "J-1001",
    "block": "J",
    "status": "active",
    "crimeType": "Madhesi Funds",
    "sentence": "34 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9878901234"
    }
  },
  {
    "id": "39",
    "inmateNumber": "INM039",
    "firstName": "Ananda",
    "lastName": "Prasad Dhungana",
    "dateOfBirth": "1959-01-17",
    "admissionDate": "2024-10-20",
    "expectedReleaseDate": "2099-10-20",
    "cellNumber": "J-1002",
    "block": "J",
    "status": "active",
    "crimeType": "Congress Corruption",
    "sentence": "40 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9879012345"
    }
  },
  {
    "id": "40",
    "inmateNumber": "INM040",
    "firstName": "Narad",
    "lastName": "Muni Rana",
    "dateOfBirth": "1963-06-12",
    "admissionDate": "2025-04-10",
    "expectedReleaseDate": "2099-04-10",
    "cellNumber": "J-1003",
    "block": "J",
    "status": "active",
    "crimeType": "Local Governance Scam",
    "sentence": "36 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9880123456"
    }
  },
  {
    "id": "41",
    "inmateNumber": "INM041",
    "firstName": "Lila",
    "lastName": "Nath Shrestha",
    "dateOfBirth": "1960-08-05",
    "admissionDate": "2025-05-05",
    "expectedReleaseDate": "2099-05-05",
    "cellNumber": "J-1004",
    "block": "J",
    "status": "active",
    "crimeType": "Land Fraud",
    "sentence": "39 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Brother",
      "phone": "+977-9881234567"
    }
  },
  {
    "id": "42",
    "inmateNumber": "INM042",
    "firstName": "Top",
    "lastName": "Bahadur Rayamajhi",
    "dateOfBirth": "1961-11-25",
    "admissionDate": "2024-09-10",
    "expectedReleaseDate": "2099-09-10",
    "cellNumber": "K-1101",
    "block": "K",
    "status": "active",
    "crimeType": "Refugee Scam",
    "sentence": "38 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9882345678"
    }
  },
  {
    "id": "43",
    "inmateNumber": "INM043",
    "firstName": "Balkrishna",
    "lastName": "Khand",
    "dateOfBirth": "1966-03-14",
    "admissionDate": "2024-08-15",
    "expectedReleaseDate": "2099-08-15",
    "cellNumber": "K-1102",
    "block": "K",
    "status": "active",
    "crimeType": "Bhutanese Refugee",
    "sentence": "33 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9883456789"
    }
  },
  {
    "id": "44",
    "inmateNumber": "INM044",
    "firstName": "Pradeep",
    "lastName": "Yadav",
    "dateOfBirth": "1975-05-20",
    "admissionDate": "2025-06-10",
    "expectedReleaseDate": "2099-06-10",
    "cellNumber": "K-1103",
    "block": "K",
    "status": "active",
    "crimeType": "Madhesi Corruption",
    "sentence": "24 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9884567890"
    }
  },
  {
    "id": "45",
    "inmateNumber": "INM045",
    "firstName": "Yagya",
    "lastName": "Raj Sunuwar",
    "dateOfBirth": "1960-01-14",
    "admissionDate": "2025-04-15",
    "expectedReleaseDate": "2099-04-15",
    "cellNumber": "K-1104",
    "block": "K",
    "status": "active",
    "crimeType": "Airport Misappropriation",
    "sentence": "39 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9885678901"
    }
  },
  {
    "id": "46",
    "inmateNumber": "INM046",
    "firstName": "Krishna",
    "lastName": "Sitaula",
    "dateOfBirth": "1947-09-27",
    "admissionDate": "2024-10-05",
    "expectedReleaseDate": "2099-10-05",
    "cellNumber": "L-1201",
    "block": "L",
    "status": "active",
    "crimeType": "Bhutanese Refugee",
    "sentence": "52 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9886789012"
    }
  },
  {
    "id": "47",
    "inmateNumber": "INM047",
    "firstName": "Ram",
    "lastName": "Bir Manandhar",
    "dateOfBirth": "1958-12-10",
    "admissionDate": "2025-02-20",
    "expectedReleaseDate": "2099-02-20",
    "cellNumber": "L-1202",
    "block": "L",
    "status": "active",
    "crimeType": "Local Governance",
    "sentence": "41 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Brother",
      "phone": "+977-9887890123"
    }
  },
  {
    "id": "48",
    "inmateNumber": "INM048",
    "firstName": "Sharat",
    "lastName": "Singh Bhandari",
    "dateOfBirth": "1955-07-15",
    "admissionDate": "2025-01-10",
    "expectedReleaseDate": "2099-01-10",
    "cellNumber": "L-1203",
    "block": "L",
    "status": "active",
    "crimeType": "Madhesi Funds",
    "sentence": "44 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9888901234"
    }
  },
  {
    "id": "49",
    "inmateNumber": "INM049",
    "firstName": "Anil",
    "lastName": "Kumar Jha",
    "dateOfBirth": "1967-04-22",
    "admissionDate": "2025-03-25",
    "expectedReleaseDate": "2099-03-25",
    "cellNumber": "L-1204",
    "block": "L",
    "status": "active",
    "crimeType": "Regional Corruption",
    "sentence": "32 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Son",
      "phone": "+977-9889012345"
    }
  },
  {
    "id": "50",
    "inmateNumber": "INM050",
    "firstName": "Ram",
    "lastName": "Prasad Mahato",
    "dateOfBirth": "1963-09-18",
    "admissionDate": "2025-05-20",
    "expectedReleaseDate": "2099-05-20",
    "cellNumber": "M-1301",
    "block": "M",
    "status": "active",
    "crimeType": "Ethnic Funds",
    "sentence": "36 years",
    "emergencyContact": {
      "name": "Family Member",
      "relationship": "Wife",
      "phone": "+977-9890123456"
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
    description: 'Altercation in cafeteria between two inmates over food',
    location: 'Cafeteria',
    date: '2024-01-10',
    time: '14:30',
    severity: 'medium',
    status: 'resolved',
    reportedBy: 'Officer Sarah Wilson',
    reportedById: '1',
    reportedByBadge: 'OFF-001',
    involvedInmates: ['1', '2'],
    involvedInmatesNames: ['John Smith', 'Michael Johnson']
  },
  {
    id: '2',
    type: 'escape_attempt',
    description: 'Prisoner attempted to climb perimeter fence during exercise period',
    location: 'Recreation Yard',
    date: '2024-01-20',
    time: '15:45',
    severity: 'critical',
    status: 'investigating',
    reportedBy: 'Officer Mike Davis',
    reportedById: '2',
    reportedByBadge: 'OFF-002',
    involvedInmates: ['3'],
    involvedInmatesNames: ['Robert Brown']
  },
  {
    id: '3',
    type: 'contraband',
    description: 'Cell phone discovered hidden in mattress during routine inspection',
    location: 'Cell Block B-205',
    date: '2024-01-25',
    time: '09:15',
    severity: 'high',
    status: 'resolved',
    reportedBy: 'Officer Lisa Martinez',
    reportedById: '3',
    reportedByBadge: 'OFF-003',
    involvedInmates: ['4'],
    involvedInmatesNames: ['William Davis']
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