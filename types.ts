
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
  WATER_HEATER = 'Chauffe-eau solaire',
  EV_CHARGER = 'Borne de recharge'
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string; // Simulated token
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  product: ProductType;
  status: LeadStatus;
  dateAdded: string;
  estimatedCommission: number;
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
  { product: ProductType.EV_CHARGER, min: 100, max: 200 },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
