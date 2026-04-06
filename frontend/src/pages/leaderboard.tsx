import { useEffect, useState } from 'react';
import { ratingService, LeaderboardEntry, ProjectWithRating } from '@/lib/rating';
import Link from 'next/link';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [topProjects, setTopProjects] = useState<ProjectWithRating[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'projects'>('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLeaderboard(); }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const [lb, tp] = await Promise.all([
        ratingService.getLeaderboard(20),
        ratingService.getTopRatedProjects(20),
      ]);
      setLeaderboard(lb);
      setTopProjects(tp);
    } catch (error) {
      console.error('Failed to load leaderboard', error);
    } finally {
      setLoading(false);
    }
  };

  const rankStyle = (i: number) => {
    if (i === 0) return { badge: '1st', cls: 'bg-amber-500/20 text-amber-400 border border-amber-700/50' };
    if (i === 1) return { badge: '2nd', cls: 'bg-stone-700/60 text-stone-300 border border-stone-600' };
    if (i === 2) return { badge: '3rd', cls: 'bg-orange-950/50 text-orange-400 border border-orange-800/50' };
    return { badge: `#${i + 1}`, cls: 'bg-stone-800 text-stone-500 border border-stone-700' };
  };

  return (
      <div className="min-h-screen bg-[#111110] text-stone-100">
        {/* Hero */}
        <div className="bg-[#1C1C1A] border-b border-stone-800 px-6 py-10">
          <div className="max-w-5xl mx-auto">
            <p className="text-amber-500 text-xs font-semibold uppercase tracking-widest mb-2">Community</p>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-100">Leaderboard</h1>
            <p className="text-stone-500 text-sm mt-1">Top-rated creators and projects</p>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#1C1C1A] border border-stone-800 rounded-2xl p-1 w-fit mb-8">
            {(['users', 'projects'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                            activeTab === tab
                                ? 'bg-amber-500 text-black'
                                : 'text-stone-500 hover:text-stone-300'
                        }`}>
                  {tab === 'users' ? 'Creators' : 'Projects'}
                </button>
            ))}
          </div>

          {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
              </div>
          ) : activeTab === 'users' ? (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const { badge, cls } = rankStyle(index);
                  return (
                      <div key={entry.userId}
                           className={`bg-[#1C1C1A] rounded-2xl border px-5 py-4 flex items-center gap-4 hover:border-amber-700/60 transition-all ${index < 3 ? 'border-stone-700/80' : 'border-stone-800'}`}>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls} w-12 text-center shrink-0`}>
                    {badge}
                  </span>

                        {entry.profileImage ? (
                            <img src={entry.profileImage} alt={entry.userName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-amber-400">{entry.userName.charAt(0).toUpperCase()}</span>
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-100 truncate">{entry.userName}</p>
                          <p className="text-xs text-stone-500">
                            {entry.projectCount} project{entry.projectCount !== 1 ? 's' : ''} · {entry.totalRatings} rating{entry.totalRatings !== 1 ? 's' : ''}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xl font-semibold text-amber-400">{entry.averageRating.toFixed(1)}</span>
                          <span className="text-amber-500 ml-0.5 text-sm">★</span>
                        </div>
                      </div>
                  );
                })}
              </div>
          ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {topProjects.map((project, index) => {
                  const { badge, cls } = rankStyle(index);
                  return (
                      <div key={project.id}
                           className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-5 hover:border-amber-700/60 hover:bg-[#211f1d] transition-all flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls} mb-2 inline-block`}>{badge}</span>
                            <h3 className="font-semibold text-stone-100 leading-snug truncate">{project.title}</h3>
                            <p className="text-xs text-stone-500 mt-0.5">by {project.ownerName}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xl font-semibold text-amber-400">{project.averageRating?.toFixed(1) || '—'}</span>
                            <span className="text-amber-500 ml-0.5 text-sm">★</span>
                            <p className="text-xs text-stone-600">({project.totalRatings})</p>
                          </div>
                        </div>

                        {project.description && (
                            <p className="text-stone-400 text-sm mb-3 line-clamp-2 leading-relaxed">{project.description}</p>
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

                        <div className="flex gap-2 mt-auto pt-3 border-t border-stone-800/60">
                          <Link href={`/rate/${project.id}`} className="flex-1">
                            <button className="w-full bg-amber-500 text-black px-3 py-2 rounded-xl text-xs font-medium hover:bg-amber-400 transition-colors">
                              View & Rate
                            </button>
                          </Link>
                          {project.githubLink && (
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <button className="w-full bg-stone-800 text-stone-400 px-3 py-2 rounded-xl text-xs font-medium hover:bg-stone-700 transition-colors">
                                  GitHub →
                                </button>
                              </a>
                          )}
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </main>
      </div>
  );
}