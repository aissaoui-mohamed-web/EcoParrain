export enum LeadStatus {
  NEW = 'Nouveau',
  CONTACTED = 'Contact établi',
  MEETING = 'Rendez-vous planifié',
  QUOTE = 'Devis envoyé',
  SIGNED = 'Signé',
  INSTALLED = 'Installé',
  PAID = 'Commission payée'
}

export enum ProductType {
  SOLAR = 'Panneaux solaires',
  HEAT_PUMP = 'Pompe à chaleur',
  ISOLATION = 'Isolation thermique',
  WATER_HEATER = 'Chauffe-eau solaire'
}

export type UserRole = 'PARTNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface Lead {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  phone: string;
  email: string;
  products: ProductType[]; // Changed from single product to array
  status: LeadStatus;
  dateAdded: string;
  estimatedCommission: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  leadId: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'STATUS_CHANGE' | 'INFO';
}

export interface CommissionRate {
  product: ProductType;
  min: number;
  max: number;
}

export const COMMISSION_RATES: CommissionRate[] = [
  { product: ProductType.SOLAR, min: 500, max: 1200 },
  { product: ProductType.HEAT_PUMP, min: 300, max: 800 },
  { product: ProductType.ISOLATION, min: 400, max: 600 },
  { product: ProductType.WATER_HEATER, min: 200, max: 350 },
];