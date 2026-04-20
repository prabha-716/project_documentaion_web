import { useState, useEffect } from 'react';

export interface BookmarkedProject {
    id: number;
    title: string;
    ownerName: string;
    description?: string;
    averageRating?: number;
    totalRatings?: number;
    usedTechs?: string;
    githubLink?: string;
    timestamp: number;
}

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<BookmarkedProject[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('projectBookmarks');
        if (stored) {
            try {
                setBookmarks(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to load bookmarks', e);
            }
        }
        setLoaded(true);
    }, []);

    // Save to localStorage whenever bookmarks change
    useEffect(() => {
        if (loaded) {
            localStorage.setItem('projectBookmarks', JSON.stringify(bookmarks));
        }
    }, [bookmarks, loaded]);

    const addBookmark = (project: BookmarkedProject) => {
        setBookmarks((prev) => {
            const exists = prev.some((b) => b.id === project.id);
            if (exists) return prev;
            return [...prev, { ...project, timestamp: Date.now() }];
        });
    };

    const removeBookmark = (projectId: number) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== projectId));
    };

    const isBookmarked = (projectId: number) => {
        return bookmarks.some((b) => b.id === projectId);
    };

    const toggleBookmark = (project: BookmarkedProject) => {
        if (isBookmarked(project.id)) {
            removeBookmark(project.id);
        } else {
            addBookmark(project);
        }
    };

    return { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark, loaded };
}