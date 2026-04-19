import api from './api';

export interface User {
    id: number;
    email: string;
    name: string;
    profileImage?: string;
    provider: string;
    createdAt: string;
    isPublic: boolean;
    bio?: string;
}

export interface UserProfile {
    user: User;
    stats: {
        projectCount: number;
        totalRatings: number;
        averageRating: number;
    };
}

const isBrowser = () => typeof window !== 'undefined';

export const userService = {
    async getUserProfile(userId: number): Promise<UserProfile> {
        const response = await api.get<UserProfile>(`/api/users/${userId}/profile`);
        return response.data;
    },

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await api.put<User>('/api/users/profile', data);
        if (isBrowser()) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    async toggleProjectVisibility(isPublic: boolean): Promise<User> {
        const response = await api.patch<User>('/api/users/profile/visibility', { isPublic });
        if (isBrowser()) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    async updateBio(bio: string): Promise<User> {
        const response = await api.put<User>('/api/users/profile', { bio });
        if (isBrowser()) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },
};