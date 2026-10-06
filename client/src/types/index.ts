export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export type JobStatus =
  | 'Applied'
  | 'Interview'
  | 'Technical Interview'
  | 'Offer'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface PrepChecklistItem {
  task: string;
  done: boolean;
}

export interface Job {
  _id: string;
  userId: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  status: JobStatus;
  applicationDate?: string;
  notes?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewType?: string;
  interviewNotes?: string;
  prepChecklist?: PrepChecklistItem[];

  matchScore?: number | null;
  matchingSkills?: string[];
  missingSkills?: string[];
  recommendation?: string;

  createdAt: string;
  updatedAt: string;
}

export interface JobAnalytics {
  total: number;
  Applied: number;
  Interview: number;
  'Technical Interview': number;
  Offer: number;
  Accepted: number;
  Rejected: number;
  Withdrawn: number;
}

export interface InterviewsResponse {
  upcoming: Job[];
  past: Job[];
}

export interface MatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendation: string;
}