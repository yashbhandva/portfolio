export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  imageUrl: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  startDate: Date;
  endDate?: Date;
  client?: string;
  teamMembers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  projectUrl?: string;
  featured: boolean;
  technologies: string[];
}

export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  clientName: string;
  projectDate: string;
  featured: boolean;
  displayOrder: number;
  projectImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest {
  title: string;
  description?: string;
  category?: string;
  technologies?: string;
  projectUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  clientName?: string;
  projectDate?: string;
  featured: boolean;
  displayOrder: number;
  projectImages?: string[];
}