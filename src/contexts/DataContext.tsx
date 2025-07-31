import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Issue {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: 'Electrical' | 'Plumbing' | 'Civil';
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
  image?: string;
  location: string;
  assignedTo?: string;
  assignedTechnicianName?: string;
  createdAt: Date;
  updatedAt: Date;
  aiConfidence?: number;
  coordinates?: { lat: number; lng: number };
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  skills: string[];
  available: boolean;
  assignedIssues: string[];
  completedIssues: number;
  rating: number;
  coordinates?: { lat: number; lng: number };
}

interface DataContextType {
  issues: Issue[];
  technicians: Technician[];
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  assignIssue: (issueId: string, technicianId: string) => void;
  updateTechnicianAvailability: (technicianId: string, available: boolean) => void;
  getIssuesByUser: (userId: string) => Issue[];
  getIssuesByTechnician: (technicianId: string) => Issue[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock AI classification service
const classifyIssue = (description: string, imageUrl?: string): { category: Issue['category'], severity: Issue['severity'], confidence: number } => {
  const text = description.toLowerCase();
  
  let category: Issue['category'] = 'Civil';
  let severity: Issue['severity'] = 'Medium';
  let confidence = 0.85;

  // Simple keyword-based classification
  if (text.includes('electric') || text.includes('power') || text.includes('light') || text.includes('socket')) {
    category = 'Electrical';
    confidence = 0.92;
  } else if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drain') || text.includes('toilet')) {
    category = 'Plumbing';
    confidence = 0.89;
  } else if (text.includes('door') || text.includes('window') || text.includes('wall') || text.includes('paint') || text.includes('crack')) {
    category = 'Civil';
    confidence = 0.87;
  }

  // Severity detection
  if (text.includes('urgent') || text.includes('emergency') || text.includes('flooding') || text.includes('sparking')) {
    severity = 'High';
  } else if (text.includes('minor') || text.includes('small') || text.includes('cosmetic')) {
    severity = 'Low';
  }

  return { category, severity, confidence };
};

// Mock technicians data
const initialTechnicians: Technician[] = [
  {
    id: '2',
    name: 'Mike Technician',
    email: 'technician@demo.com',
    skills: ['Plumbing', 'Electrical'],
    available: true,
    assignedIssues: [],
    completedIssues: 15,
    rating: 4.8,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 't2',
    name: 'Alex Rodriguez',
    email: 'alex@demo.com',
    skills: ['Electrical', 'Civil'],
    available: true,
    assignedIssues: [],
    completedIssues: 23,
    rating: 4.9,
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: 't3',
    name: 'Sarah Johnson',
    email: 'sarah@demo.com',
    skills: ['Plumbing', 'Civil'],
    available: false,
    assignedIssues: [],
    completedIssues: 31,
    rating: 4.7,
    coordinates: { lat: 40.7505, lng: -73.9934 }
  }
];

// Sample issues for demo
const initialIssues: Issue[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Resident',
    title: 'Kitchen Sink Leaking',
    description: 'Water dripping from kitchen sink pipe underneath',
    category: 'Plumbing',
    severity: 'Medium',
    status: 'Open',
    location: 'Block A, Apt 301',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    aiConfidence: 0.89,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Resident',
    title: 'Light Flickering',
    description: 'Living room light keeps flickering on and off',
    category: 'Electrical',
    severity: 'Low',
    status: 'Assigned',
    location: 'Block A, Apt 301',
    assignedTo: '2',
    assignedTechnicianName: 'Mike Technician',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    aiConfidence: 0.92,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);

  const addIssue = (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const aiResult = classifyIssue(issueData.description);
    
    const newIssue: Issue = {
      ...issueData,
      id: Date.now().toString(),
      category: aiResult.category,
      severity: aiResult.severity,
      aiConfidence: aiResult.confidence,
      createdAt: new Date(),
      updatedAt: new Date(),
      coordinates: { lat: 40.7128 + Math.random() * 0.1, lng: -74.0060 + Math.random() * 0.1 }
    };

    setIssues(prev => [newIssue, ...prev]);

    // Auto-assign to available technician with matching skills
    const availableTechs = technicians.filter(t => 
      t.available && t.skills.includes(newIssue.category)
    );
    
    if (availableTechs.length > 0) {
      const assignedTech = availableTechs[0];
      setTimeout(() => {
        assignIssue(newIssue.id, assignedTech.id);
      }, 1000);
    }
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id 
        ? { ...issue, ...updates, updatedAt: new Date() }
        : issue
    ));
  };

  const assignIssue = (issueId: string, technicianId: string) => {
    const technician = technicians.find(t => t.id === technicianId);
    if (technician) {
      updateIssue(issueId, {
        status: 'Assigned',
        assignedTo: technicianId,
        assignedTechnicianName: technician.name
      });

      setTechnicians(prev => prev.map(tech =>
        tech.id === technicianId
          ? { ...tech, assignedIssues: [...tech.assignedIssues, issueId] }
          : tech
      ));
    }
  };

  const updateTechnicianAvailability = (technicianId: string, available: boolean) => {
    setTechnicians(prev => prev.map(tech =>
      tech.id === technicianId ? { ...tech, available } : tech
    ));
  };

  const getIssuesByUser = (userId: string) => {
    return issues.filter(issue => issue.userId === userId);
  };

  const getIssuesByTechnician = (technicianId: string) => {
    return issues.filter(issue => issue.assignedTo === technicianId);
  };

  return (
    <DataContext.Provider value={{
      issues,
      technicians,
      addIssue,
      updateIssue,
      assignIssue,
      updateTechnicianAvailability,
      getIssuesByUser,
      getIssuesByTechnician
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}