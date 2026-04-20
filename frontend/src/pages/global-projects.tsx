import { useEffect, useState } from 'react';
import { ratingService, ProjectWithRating } from '@/lib/rating';
import Link from 'next/link';
import { useBookmarks, BookmarkedProject } from '@/hooks/useBookmarks';

export default function GlobalProjects() {
    const [projects, setProjects] = useState<ProjectWithRating[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState<ProjectWithRating[]>([]);
    const [sortBy, setSortBy] = useState<'rating' | 'recent' | 'popular'>('rating');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);

    useEffect(() => { loadProjects(); }, [page]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await ratingService.getAllPublicProjects(page);
            setProjects(data.projects);
            setTotalPages(Math.ceil(data.total / 12));
            setFilteredProjects(data.projects);
        } catch (error) {
            console.error('Failed to load projects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) { setFilteredProjects(projects); return; }
        try {
            setLoading(true);
            const data = await ratingService.searchPublicProjects(searchQuery);
            setFilteredProjects(data.projects);
            setTotalPages(Math.ceil(data.total / 12));
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    const sortProjects = (items: ProjectWithRating[]) => {
        const sorted = [...items];
        switch (sortBy) {
            case 'rating': return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            case 'recent': return sorted.sort((a, b) => new Date(b.lastModifiedDate).getTime() - new Date(a.lastModifiedDate).getTime());
            case 'popular': return sorted.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0));
            default: return sorted;
        }
    };

    const handleBookmarkToggle = (project: ProjectWithRating) => {
        const bookmarkData: BookmarkedProject = {
            id: project.id,
            title: project.title,
            ownerName: project.ownerName,
            description: project.description,
            averageRating: project.averageRating,
            totalRatings: project.totalRatings,
            usedTechs: project.usedTechs,
            githubLink: project.githubLink,
            timestamp: Date.now(),
        };
        toggleBookmark(bookmarkData);
    };

    const toggleComparison = (projectId: number) => {
        setSelectedForComparison((prev) => {
            if (prev.includes(projectId)) {
                return prev.filter((id) => id !== projectId);
            } else if (prev.length < 3) {
                return [...prev, projectId];
            }
            return prev;
        });
    };

    const displayProjects = sortProjects(filteredProjects);

    return (
        <div className="min-h-screen bg-[#111110] text-stone-100">
            <div className="bg-[#1C1C1A] border-b border-stone-800 px-6 py-10">
                <div className="max-w-6xl mx-auto">
                    <p className="text-amber-500 text-xs font-semibold uppercase tracking-widest mb-2">Community</p>
                    <h1 className="text-3xl font-semibold tracking-tight">Discover Projects</h1>
                    <p className="text-stone-500 text-sm mt-1">Explore and rate projects from the community</p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Comparison banner */}
                {selectedForComparison.length > 0 && (
                    <div className="bg-amber-950/40 border border-amber-800/50 rounded-2xl p-4 mb-6 flex items-center justify-between">
                        <p className="text-sm text-amber-300">
                            {selectedForComparison.length} project{selectedForComparison.length !== 1 ? 's' : ''} selected for comparison
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedForComparison([])}
                                className="px-3 py-1.5 text-xs bg-stone-800 text-stone-300 rounded-lg hover:bg-stone-700 transition-colors"
                            >
                                Clear
                            </button>
                            <Link href={`/compare?projects=${selectedForComparison.join(',')}`}>
                                <button className="px-4 py-1.5 text-xs bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium">
                                    Compare
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Search + sort */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <input
                            type="text"
                            placeholder="Search by title, technology, or author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-[#1C1C1A] border border-stone-800 text-stone-200 placeholder-stone-600 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-600 transition-colors"
                        />
                        <button type="submit"
                                className="bg-amber-500 text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-400 transition-colors">
                            Search
                        </button>
                    </form>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-[#1C1C1A] border border-stone-800 text-stone-400 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-600 transition-colors">
                        <option value="rating">Highest Rated</option>
                        <option value="popular">Most Popular</option>
                        <option value="recent">Recently Updated</option>
                    </select>
                </div>

                <p className="text-xs text-stone-600 mb-5">{displayProjects.length} project{displayProjects.length !== 1 ? 's' : ''}</p>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                ) : displayProjects.length === 0 ? (
                    <div className="bg-[#1C1C1A] border border-stone-800 rounded-2xl p-16 text-center">
                        <p className="text-stone-500 text-sm">No projects found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                            {displayProjects.map((project) => (
                                <div key={project.id}
                                     className={`bg-[#1C1C1A] rounded-2xl border p-5 transition-all flex flex-col ${
                                         selectedForComparison.includes(project.id)
                                             ? 'border-amber-600 bg-amber-950/20'
                                             : 'border-stone-800 hover:border-amber-700/60 hover:bg-[#211f1d]'
                                     }`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-stone-100 leading-snug flex-1 pr-3">{project.title}</h3>
                                        <button
                                            onClick={() => handleBookmarkToggle(project)}
                                            className="shrink-0 ml-2 transition-colors text-lg"
                                            title={isBookmarked(project.id) ? 'Remove bookmark' : 'Bookmark'}
                                        >
                                            {isBookmarked(project.id) ? '❤️' : '♡'}
                                        </button>
                                    </div>

                                    <p className="text-xs text-stone-500 mb-3">{project.ownerName}</p>

                                    {project.description && (
                                        <p className="text-stone-400 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
                                            {project.description}
                                        </p>
                                    )}

                                    {project.usedTechs && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {project.usedTechs.split(',').slice(0, 3).map((tech, idx) => (
                                                <span key={idx} className="text-xs bg-amber-950/40 text-amber-400 border border-amber-800/50 px-2 py-0.5 rounded-lg">
                          {tech.trim()}
                        </span>
                                            ))}
                                        </div>
                                    )}

                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                           className="text-xs text-stone-500 hover:text-amber-400 transition-colors block mb-4">
                                            github.com →
                                        </a>
                                    )}

                                    <div className="flex gap-2 pt-3 border-t border-stone-800/60 mt-auto">
                                        <Link href={`/rate/${project.id}`} className="flex-1">
                                            <button className="w-full bg-stone-800 text-stone-300 px-3 py-2 rounded-xl text-xs font-medium hover:bg-stone-700 transition-colors">
                                                Details
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => toggleComparison(project.id)}
                                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                                selectedForComparison.includes(project.id)
                                                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                                                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                            }`}
                                        >
                                            {selectedForComparison.includes(project.id) ? '✓ Compare' : 'Compare'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                                        className="px-4 py-2 bg-[#1C1C1A] border border-stone-800 rounded-xl text-sm text-stone-500 hover:border-amber-700 hover:text-amber-400 disabled:opacity-30 transition-colors">
                                    ←
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = page > 3 ? page - 2 + i : i + 1;
                                    return pageNum <= totalPages && (
                                        <button key={pageNum} onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                                                    pageNum === page
                                                        ? 'bg-amber-500 text-black'
                                                        : 'bg-[#1C1C1A] border border-stone-800 text-stone-400 hover:border-amber-700 hover:text-amber-400'
                                                }`}>
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                                        className="px-4 py-2 bg-[#1C1C1A] border border-stone-800 rounded-xl text-sm text-stone-500 hover:border-amber-700 hover:text-amber-400 disabled:opacity-30 transition-colors">
                                    →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}