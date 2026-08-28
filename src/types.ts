import { Timestamp } from 'firebase/firestore';

export type MilestoneType = 'BIRTHDAY' | 'ANNIVERSARY';

export interface Employee {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  dob: string; // ISO date string YYYY-MM-DD
  joinedDate: string; // ISO date string YYYY-MM-DD
  status: 'active' | 'inactive';
  metadata?: Record<string, any>;
  createdAt: Timestamp;
}

export interface AlertSettings {
  userId: string;
  smtp?: {
    host: string;
    port: number;
    user: string;
    enabled: boolean;
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
