import { api } from './api';

export interface ResumeAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skills: string[];
  missingSkills: string[];
}

export interface Resume {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  aiAnalysis: ResumeAnalysis;
  createdAt: string;
}

export interface MatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export const aiService = {
  chat: async (message: string): Promise<string> => {
    const { data } = await api.post('/ai/chat', { message });
    return data.reply;
  },

  uploadResume: async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append('resume', file);
    const { data } = await api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getResume: async (): Promise<Resume | null> => {
    const { data } = await api.get('/resumes');
    return data;
  },

  deleteResume: async (): Promise<void> => {
    await api.delete('/resumes');
  },

  matchJob: async (jobId: string): Promise<MatchResult> => {
    const { data } = await api.post(`/ai/match/${jobId}`);
    return data;
  },
};