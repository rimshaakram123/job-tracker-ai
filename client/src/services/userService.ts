import { api } from './api';
import type { User } from '../types';

export interface FullProfile extends User {
  education?: string;
  experience?: string;
  skills?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export const userService = {
  getProfile: async (): Promise<FullProfile> => {
    const { data } = await api.get('/users/profile');
    return data;
  },
  updateProfile: async (profile: Partial<FullProfile>): Promise<FullProfile> => {
    const { data } = await api.put('/users/profile', profile);
    return data;
  },
};