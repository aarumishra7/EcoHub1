export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: string;
  location: string;
  postedBy: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  gstVerified?: boolean;
}

export interface Agreement {
  id: string;
  partyA: string;
  partyB: string;
  material: string;
  status: 'pending' | 'signed' | 'rejected';
  date: string;
}