import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ratingService, ProjectWithRating } from '@/lib/rating';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function Compare() {
    const router = useRouter();
    const { projects: projectIds } = router.query;
    const [projects, setProjects] = useState<ProjectWithRating[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectIds) return;

        const loadProjects = async () => {
            try {
                setLoading(true);
                const ids = (projectIds as string).split(',').map(Number);
                const projectData = await Promise.all(
                    ids.map((id) => ratingService.getPublicProjectById(id))
                );
                setProjects(projectData);
            } catch (error) {
                console.error('Failed to load projects for comparison', error);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [projectIds]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111110] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (projects.length < 2) {
        return (
            <div className="min-h-screen bg-[#111110] text-stone-100">
                <div className="bg-[#1C1C1A] border-b border-stone-800 px-6 py-10">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-semibold tracking-tight">Project Comparison</h1>
                    </div>
                </div>
                <main className="max-w-6xl mx-auto px-6 py-8">
                    <div className="bg-[#1C1C1A] border border-stone-800 rounded-2xl p-16 text-center">
                        <p className="text-stone-500 mb-5">Select at least 2 projects to compare</p>
                        <Link href="/global-projects">
                            <button className="bg-amber-500 text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-400 transition-colors">
                                Back to Discover
                            </button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const metrics = [
        { label: 'Rating', key: 'averageRating', format: (v: any) => v?.toFixed(1) || '—' },
        { label: 'Total Reviews', key: 'totalRatings', format: (v: any) => v || 0 },
        { label: 'Technologies', key: 'usedTechs', format: (v: any) => v ? v.split(',').length : 0 },
        { label: 'GitHub Link', key: 'githubLink', format: (v: any) => v ? '✓' : '✗' },
    ];

    return (
        <div className="min-h-screen bg-[#111110] text-stone-100">
            {/* Hero */}
            <div className="bg-[#1C1C1A] border-b border-stone-800 px-6 py-10">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="text-xs text-stone-500 hover:text-amber-400 mb-4 transition-colors"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-semibold tracking-tight">Project Comparison</h1>
                    <p className="text-stone-500 text-sm mt-1">Side-by-side analysis of {projects.length} projects</p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Projects header */}
                <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${projects.length}, 1fr)` }}>
                    {projects.map((project) => (
                        <div key={project.id} className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-stone-100 mb-0.5">{project.title}</h2>
                                    <p className="text-xs text-stone-500">by {project.ownerName}</p>
                                </div>
                            </div>

                            {project.description && (
                                <p className="text-stone-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                            )}

                            <div className="flex gap-2">
                                <Link href={`/rate/${project.id}`} className="flex-1">
                                    <button className="w-full bg-stone-800 text-stone-300 px-3 py-2 rounded-xl text-xs font-medium hover:bg-stone-700 transition-colors">
                                        View Details
                                    </button>
                                </Link>
                                {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                                        <button className="bg-stone-800 text-stone-300 px-3 py-2 rounded-xl text-xs font-medium hover:bg-stone-700 transition-colors">
                                            GitHub →
                                        </button>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison table */}
                <div className="bg-[#1C1C1A] rounded-2xl border border-stone-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <tbody>
                            {/* Ratings */}
                            <tr className="border-b border-stone-800/60">
                                <td className="px-6 py-4 text-sm font-medium text-stone-400 bg-[#0f0e0d] w-48">Average Rating</td>
                                {projects.map((project) => (
                                    <td key={project.id} className="px-6 py-4 text-center" style={{ width: `${100 / projects.length}%` }}>
                                        <div className="flex items-center justify-center gap-1">
                                                <span className="text-2xl font-semibold text-amber-400">
                                                    {project.averageRating?.toFixed(1) || '—'}
                                                </span>
                                            {project.averageRating && <span className="text-amber-500">★</span>}
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Total Reviews */}
                            <tr className="border-b border-stone-800/60">
                                <td className="px-6 py-4 text-sm font-medium text-stone-400 bg-[#0f0e0d]">Total Reviews</td>
                                {projects.map((project) => (
                                    <td key={project.id} className="px-6 py-4 text-center text-stone-200">
                                        {project.totalRatings || 0}
                                    </td>
                                ))}
                            </tr>

                            {/* Tech Stack */}
                            <tr className="border-b border-stone-800/60">
                                <td className="px-6 py-4 text-sm font-medium text-stone-400 bg-[#0f0e0d]">Technologies</td>
                                {projects.map((project) => (
                                    <td key={project.id} className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5 justify-center">
                                            {project.usedTechs
                                                ? project.usedTechs.split(',').map((tech, idx) => (
                                                    <span key={idx} className="text-xs bg-amber-950/40 text-amber-400 border border-amber-800/50 px-2 py-0.5 rounded-lg">
                                            {tech.trim()}
                                        </span>
                                                ))
                                                : <span className="text-stone-600 text-xs">—</span>
                                            }
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Rating Distribution */}
                            <tr className="border-b border-stone-800/60">
                                <td className="px-6 py-4 text-sm font-medium text-stone-400 bg-[#0f0e0d]">5★ Percentage</td>
                                {projects.map((project) => {
                                    const fiveStarCount = 0; // Would need backend call to get actual distribution
                                    const pct = project.totalRatings > 0 ? Math.round((fiveStarCount / project.totalRatings) * 100) : 0;
                                    return (
                                        <td key={project.id} className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-20 h-2 bg-stone-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-sm text-stone-400 min-w-10">{pct}%</span>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* GitHub Link */}
                            <tr>
                                <td className="px-6 py-4 text-sm font-medium text-stone-400 bg-[#0f0e0d]">Has GitHub</td>
                                {projects.map((project) => (
                                    <td key={project.id} className="px-6 py-4 text-center">
                                        {project.githubLink ? (
                                            <span className="text-amber-400 text-lg">✓</span>
                                        ) : (
                                            <span className="text-stone-600">✗</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed descriptions */}
                <div className="mt-12">
                    <h2 className="text-lg font-semibold mb-6">Full Descriptions</h2>
                    <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${projects.length}, 1fr)` }}>
                        {projects.map((project) => (
                            <div key={project.id} className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-6">
                                <h3 className="font-semibold text-stone-100 mb-3">{project.title}</h3>
                                {project.description ? (
                                    <p className="text-stone-400 text-sm leading-relaxed">{project.description}</p>
                                ) : (
                                    <p className="text-stone-600 text-sm italic">No description provided</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back button */}
                <div className="mt-12 flex justify-center">
                    <Link href="/global-projects">
                        <button className="bg-stone-800 text-stone-300 px-6 py-3 rounded-xl font-medium hover:bg-stone-700 transition-colors">
                            Back to Discover
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
}