import api from '@/lib/api';

export interface Rating {
    id: number;
    projectId: number;
    userId: number;
    userName: string;
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface ProjectWithRating {
    id: number;
    title: string;
    description?: string;
    usedTechs?: string;
    githubLink?: string;
    ownerId: number;
    ownerName: string;
    createdDate: string;
    lastModifiedDate: string;
    isPublic: boolean;
    averageRating: number;
    totalRatings: number;
    userRating?: number;
    ratings?: Rating[];
}

export interface LeaderboardEntry {
    userId: number;
    userName: string;
    profileImage?: string;
    totalRatings: number;
    averageRating: number;
    projectCount: number;
}

export const ratingService = {
    // Get a single project by ID (no ownership check)
    async getPublicProjectById(id: number): Promise<ProjectWithRating> {
        const response = await api.get<ProjectWithRating>(`/api/projects/public/${id}`);
        return response.data;
    },

    // Backend uses 0-indexed pages — subtract 1 from frontend page (1-indexed)
    async getAllPublicProjects(page: number = 1, limit: number = 12): Promise<{ projects: ProjectWithRating[]; total: number }> {
        const response = await api.get('/api/projects/public', {
            params: { page: page - 1, limit },
        });
        return response.data;
    },

    async searchPublicProjects(query: string, page: number = 1): Promise<{ projects: ProjectWithRating[]; total: number }> {
        const response = await api.get('/api/projects/public/search', {
            params: { q: query, page: page - 1, limit: 12 },
        });
        return response.data;
    },

    async getTopRatedProjects(limit: number = 10): Promise<ProjectWithRating[]> {
        const response = await api.get<ProjectWithRating[]>('/api/projects/public/top-rated', {
            params: { limit },
        });
        return response.data;
    },

    async getProjectRatings(projectId: number): Promise<Rating[]> {
        const response = await api.get<Rating[]>(`/api/ratings/project/${projectId}`);
        return response.data;
    },

    async rateProject(projectId: number, rating: number, comment?: string): Promise<Rating> {
        const response = await api.post<Rating>('/api/ratings', { projectId, rating, comment });
        return response.data;
    },

    async updateRating(ratingId: number, rating: number, comment?: string): Promise<Rating> {
        const response = await api.put<Rating>(`/api/ratings/${ratingId}`, { rating, comment });
        return response.data;
    },

    async deleteRating(ratingId: number): Promise<void> {
        await api.delete(`/api/ratings/${ratingId}`);
    },

    async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
        const response = await api.get<LeaderboardEntry[]>('/api/leaderboard', {
            params: { limit },
        });
        return response.data;
    },
};