export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  price: number;
  year: number;
  mileage: number;
  image: string;
  features: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'dealer' | 'garage' | 'parts';
  profileImage?: string;
  joinDate: string;
}

export interface ProfileCard {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string, role: string) => void;
  logout: () => void;
}