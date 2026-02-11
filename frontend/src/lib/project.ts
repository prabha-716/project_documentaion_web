import api from './api';

export interface Project {
  id: number;
  title: string;
  description?: string;
  usedTechs?: string;
  filePath?: string;
  githubLink?: string;
  documents?: string;
  ownerId: number;
  ownerName: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface ProjectRequest {
  title: string;
  description?: string;
  usedTechs?: string;
  filePath?: string;
  githubLink?: string;
  documents?: string;
}

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/api/projects');
    return response.data;
  },

  async getProjectById(id: number): Promise<Project> {
    const response = await api.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  async createProject(data: ProjectRequest): Promise<Project> {
    const response = await api.post<Project>('/api/projects', data);
    return response.data;
  },

  async updateProject(id: number, data: ProjectRequest): Promise<Project> {
    const response = await api.put<Project>(`/api/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/api/projects/${id}`);
  },
};
