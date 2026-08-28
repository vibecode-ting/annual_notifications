import { Timestamp } from 'firebase/firestore';

export type MilestoneType = 'BIRTHDAY' | 'ANNIVERSARY';
export type UserRole = 'user' | 'pro' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
}

export interface Employee {
  id?: string;
  userId: string;
  employeeId: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  dob: string; // ISO date string YYYY-MM-DD
  joinedDate: string; // ISO date string YYYY-MM-DD
  status: 'active' | 'inactive';
  metadata?: Record<string, any>; // Used for custom fields / pro versions
  createdAt: Timestamp;
}

export interface AlertSettings {
  userId: string;
  smtp?: {
    host: string;
    port: number;
    user: string;
    enabled: boolean;
    sendToEmployee?: boolean;
  };
  teams?: {
    webhookUrl: string;
    enabled: boolean;
  };
  telegram?: {
    botToken: string;
    chatId: string;
    enabled: boolean;
  };
  webhook?: {
    url: string;
    enabled: boolean;
  };
  templates: {
    type?: 'normal' | 'card';
    logoUrl?: string;
    detailsText?: string;
    birthday: string;
    anniversary: string;
  };
}

export interface NotificationLog {
  id?: string;
  userId: string;
  employeeId: string;
  milestoneType: MilestoneType;
  channel: 'email' | 'teams' | 'telegram' | 'webhook';
  status: 'success' | 'failure';
  error?: string;
  timestamp: Timestamp;
}
