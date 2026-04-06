import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ratingService, ProjectWithRating, Rating } from '@/lib/rating';
import { authService, User } from '@/lib/auth';

export default function RateProject() {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState<ProjectWithRating | null>(null);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [userRating, setUserRating] = useState<Rating | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hovered, setHovered] = useState(0);

    useEffect(() => { if (id) loadData(); }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const user = authService.getStoredUser();
            setCurrentUser(user);
            const projectData = await ratingService.getPublicProjectById(Number(id));
            setProject(projectData);
            const ratingsData = await ratingService.getProjectRatings(Number(id));
            setRatings(ratingsData);
            const existing = ratingsData.find((r) => r.userId === user?.id);
            if (existing) { setUserRating(existing); setRating(existing.rating); setComment(existing.comment || ''); setIsEditing(true); }
        } catch (error) { console.error('Failed to load data', error); }
        finally { setLoading(false); }
    };

    const handleSubmitRating = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) { router.push('/login'); return; }
        try {
            setSubmitting(true);
            if (isEditing && userRating) await ratingService.updateRating(userRating.id, rating, comment);
            else await ratingService.rateProject(Number(id), rating, comment);
            loadData();
        } catch { alert('Failed to submit rating'); }
        finally { setSubmitting(false); }
    };

    const handleDeleteRating = async () => {
        if (!userRating || !confirm('Delete this rating?')) return;
        try {
            await ratingService.deleteRating(userRating.id);
            setUserRating(null); setRating(5); setComment(''); setIsEditing(false);
            loadData();
        } catch { console.error('Failed to delete rating'); }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
        </div>
    );

    if (!project) return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
            <p className="text-stone-400">Project not found</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-800">
            <div className="bg-white border-b border-stone-100 px-6 py-6">
                <div className="max-w-5xl mx-auto">
                    <button onClick={() => router.back()} className="text-xs text-stone-400 hover:text-amber-600 mb-4 block transition-colors">
                        ← Back
                    </button>
                    <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
                    <p className="text-stone-400 text-sm mt-1">by {project.ownerName}</p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid md:grid-cols-3 gap-6">

                    {/* Left */}
                    <div className="md:col-span-2 space-y-4">
                        {/* Project info */}
                        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                            {project.description && <p className="text-stone-500 text-sm leading-relaxed mb-4">{project.description}</p>}
                            {project.usedTechs && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.usedTechs.split(',').map((tech, idx) => (
                                        <span key={idx} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-lg">{tech.trim()}</span>
                                    ))}
                                </div>
                            )}
                            {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                   className="text-xs text-stone-400 hover:text-amber-600 transition-colors">
                                    View on GitHub →
                                </a>
                            )}
                        </div>

                        {/* Rate form */}
                        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-5">
                                {isEditing ? 'Your Rating' : 'Rate This Project'}
                            </h2>
                            <form onSubmit={handleSubmitRating}>
                                <div className="mb-5">
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHovered(star)}
                                                    onMouseLeave={() => setHovered(0)}
                                                    className={`text-3xl transition-colors ${star <= (hovered || rating) ? 'text-amber-400' : 'text-stone-200'}`}>
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-stone-400">{rating} of 5 stars</p>
                                </div>

                                <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                                          placeholder="Share your thoughts (optional)..."
                                          rows={4}
                                          className="w-full bg-[#FAF8F5] border border-stone-150 text-stone-700 placeholder-stone-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-300 resize-none mb-2 transition-colors"
                                />
                                <p className="text-xs text-stone-300 mb-4">{comment.length}/500</p>

                                <div className="flex gap-2">
                                    <button type="submit" disabled={submitting}
                                            className="bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">
                                        {submitting ? 'Submitting...' : isEditing ? 'Update' : 'Submit Rating'}
                                    </button>
                                    {isEditing && (
                                        <button type="button" onClick={handleDeleteRating}
                                                className="bg-stone-50 text-red-400 border border-stone-100 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-50 hover:text-red-500 transition-colors">
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-5">
                                Reviews ({ratings.length})
                            </h2>
                            {ratings.length === 0 ? (
                                <p className="text-stone-300 text-sm italic">No reviews yet. Be the first!</p>
                            ) : (
                                <div className="space-y-4">
                                    {ratings.map((r) => (
                                        <div key={r.id} className="border-b border-stone-50 pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium text-stone-700">{r.userName}</p>
                                                <span className="text-xs text-stone-300">{new Date(r.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-sm mb-1">
                                                <span className="text-amber-400">{'★'.repeat(r.rating)}</span>
                                                <span className="text-stone-200">{'★'.repeat(5 - r.rating)}</span>
                                            </div>
                                            {r.comment && <p className="text-stone-500 text-sm leading-relaxed">{r.comment}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div>
                        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-6">
                            <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Summary</p>
                            <div className="text-center mb-6 pb-6 border-b border-stone-50">
                                <p className="text-5xl font-semibold text-amber-500 mb-1">
                                    {project.averageRating?.toFixed(1) || '—'}
                                </p>
                                <div className="text-lg mb-1">
                                    <span className="text-amber-400">{'★'.repeat(Math.round(project.averageRating || 0))}</span>
                                    <span className="text-stone-200">{'★'.repeat(5 - Math.round(project.averageRating || 0))}</span>
                                </div>
                                <p className="text-xs text-stone-400">{project.totalRatings} rating{project.totalRatings !== 1 ? 's' : ''}</p>
                            </div>

                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = ratings.filter((r) => r.rating === star).length;
                                    const pct = project.totalRatings > 0 ? (count / project.totalRatings) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-2 text-xs">
                                            <span className="text-stone-400 w-4">{star}</span>
                                            <div className="flex-1 bg-stone-100 rounded-full h-1.5">
                                                <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-stone-300 w-4 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}