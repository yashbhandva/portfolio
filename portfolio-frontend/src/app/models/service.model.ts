export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  duration: string;
  features: string[];
  isActive: boolean;
  rating: number;
  totalProjects: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicService {
  id: number;
  name: string;
  category: string;
  description: string;
  startingPrice: number;
  deliveryDays: string;
  features: string[];
  rating: number;
  totalProjects: number;
  imageUrl?: string;
}

export interface ServiceRequest {
  name: string;
  category?: string;
  description?: string;
  startingPrice?: number;
  deliveryDays?: number;
  features?: string;
  active: boolean;
  displayOrder: number;
}

export interface ServiceResponse {
  id: number;
  name: string;
  category: string;
  description: string;
  startingPrice: number;
  deliveryDays: number;
  features: string;
  active: boolean;
  displayOrder: number;
}