export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateContactStatus {
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
}