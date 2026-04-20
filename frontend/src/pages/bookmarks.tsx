import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useBookmarks, BookmarkedProject } from '@/hooks/useBookmarks';
import Link from 'next/link';

export default function Bookmarks() {
    const router = useRouter();
    const { bookmarks, removeBookmark, loaded } = useBookmarks();
    const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title'>('recent');
    const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);

    if (!loaded) {
        return (
            <div className="min-h-screen bg-[#111110] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
            </div>
        );
    }

    const sortProjects = (items: BookmarkedProject[]) => {
        const sorted = [...items];
        switch (sortBy) {
            case 'recent': return sorted.sort((a, b) => b.timestamp - a.timestamp);
            case 'rating': return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            case 'title': return sorted.sort((a, b) => a.title.localeCompare(b.title));
            default: return sorted;
        }
    };

    const displayProjects = sortProjects(bookmarks);

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

    return (
        <div className="min-h-screen bg-[#111110] text-stone-100">
            {/* Hero */}
            <div className="bg-[#1C1C1A] border-b border-stone-800 px-6 py-10">
                <div className="max-w-6xl mx-auto">
                    <p className="text-amber-500 text-xs font-semibold uppercase tracking-widest mb-2">Your Collection</p>
                    <h1 className="text-3xl font-semibold tracking-tight">Bookmarks</h1>
                    <p className="text-stone-500 text-sm mt-1">Projects you saved for later</p>
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

                {/* Sort */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-xs text-stone-600">{displayProjects.length} bookmark{displayProjects.length !== 1 ? 's' : ''}</p>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-[#1C1C1A] border border-stone-800 text-stone-400 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-amber-600 transition-colors">
                        <option value="recent">Recently Added</option>
                        <option value="rating">Highest Rated</option>
                        <option value="title">Title A-Z</option>
                    </select>
                </div>

                {bookmarks.length === 0 ? (
                    <div className="bg-[#1C1C1A] border border-stone-800 rounded-2xl p-16 text-center">
                        <p className="text-stone-500 mb-5">No bookmarks yet</p>
                        <Link href="/global-projects">
                            <button className="bg-amber-500 text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-400 transition-colors">
                                Discover Projects
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                                        onClick={() => removeBookmark(project.id)}
                                        className="shrink-0 ml-2 text-stone-500 hover:text-red-400 transition-colors text-lg"
                                        title="Remove bookmark"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <p className="text-xs text-stone-500 mb-3">by {project.ownerName}</p>

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

                                <div className="flex items-center gap-3 mb-4 text-sm">
                                    {project.averageRating ? (
                                        <>
                                            <span className="font-semibold text-amber-400">{project.averageRating.toFixed(1)}</span>
                                            <span className="text-amber-500">★</span>
                                            <span className="text-xs text-stone-600">({project.totalRatings})</span>
                                        </>
                                    ) : (
                                        <span className="text-stone-600 text-xs">No ratings yet</span>
                                    )}
                                </div>

                                {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                       className="text-xs text-stone-500 hover:text-amber-400 transition-colors block mb-4">
                                        github.com →
                                    </a>
                                )}

                                <div className="flex gap-2 pt-3 border-t border-stone-800/60 mt-auto">
                                    <Link href={`/rate/${project.id}`} className="flex-1">
                                        <button className="w-full bg-stone-800 text-stone-300 px-3 py-2 rounded-xl text-xs font-medium hover:bg-stone-700 transition-colors">
                                            View & Rate
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
                                        {selectedForComparison.includes(project.id) ? '✓' : '→'} Compare
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}