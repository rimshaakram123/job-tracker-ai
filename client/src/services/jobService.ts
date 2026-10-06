import { api } from './api';
import type { Job, JobAnalytics, InterviewsResponse } from '../types';

export const jobService = {
  getAll: async (): Promise<Job[]> => {
    const { data } = await api.get('/jobs');
    return data;
  },

  create: async (job: Partial<Job>): Promise<Job> => {
    const { data } = await api.post('/jobs', job);
    return data;
  },

  update: async (id: string, job: Partial<Job>): Promise<Job> => {
    const { data } = await api.put(`/jobs/${id}`, job);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  getAnalytics: async (): Promise<JobAnalytics> => {
    const { data } = await api.get('/jobs/analytics');
    return data;
  },

  getInterviews: async (): Promise<InterviewsResponse> => {
    const { data } = await api.get('/jobs/interviews');
    return data;
  },
};