import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authService, User } from '@/lib/auth';
import { userService, UserProfile } from '@/lib/user';

export default function Profile() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bio, setBio] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [toast, setToast] = useState('');

    useEffect(() => {
        const user = authService.getStoredUser();
        if (!user) { router.push('/login'); return; }
        setCurrentUser(user);
        loadProfile(user.id);
    }, []);

    const loadProfile = async (userId: number) => {
        try {
            setLoading(true);
            const data = await userService.getUserProfile(userId);
            setProfile(data);
            setBio(data.user.bio || '');
            setIsPublic(data.user.isPublic);
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            await userService.updateProfile({ bio });
            showToast('Bio updated');
            if (currentUser) loadProfile(currentUser.id);
        } catch { alert('Failed to save'); }
        finally { setSaving(false); setEditing(false); }
    };

    const handleToggleVisibility = async () => {
        try {
            setSaving(true);
            await userService.toggleProjectVisibility(!isPublic);
            setIsPublic(!isPublic);
            showToast(!isPublic ? 'Profile is now public' : 'Profile is now private');
        } catch { alert('Failed to update'); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#111110] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
        </div>
    );

    if (!profile || !currentUser) return (
        <div className="min-h-screen bg-[#111110] flex items-center justify-center">
            <p className="text-stone-500">Profile not found</p>
        </div>
    );

    const { user, stats } = profile;

    return (
        <div className="min-h-screen bg-[#111110] text-stone-100">
            {toast && (
                <div className="fixed top-5 right-5 bg-[#1C1C1A] border border-stone-700 text-stone-200 text-sm px-4 py-3 rounded-2xl z-50">
                    {toast}
                </div>
            )}

            <main className="max-w-5xl mx-auto px-6 py-10">
                <div className="grid md:grid-cols-3 gap-6">

                    {/* Left card */}
                    <div className="space-y-4">
                        <div className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-6">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-2xl object-cover mb-4" />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-amber-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                                </div>
                            )}

                            <h2 className="text-lg font-semibold mb-0.5 text-stone-100">{user.name}</h2>
                            <p className="text-stone-500 text-sm mb-4">{user.email}</p>

                            {user.bio && <p className="text-stone-400 text-sm leading-relaxed mb-4">{user.bio}</p>}

                            <div className="text-xs text-stone-600 space-y-1 pb-4 mb-4 border-b border-stone-800/60">
                                <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                <p className="capitalize">via {user.provider}</p>
                            </div>

                            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${
                                isPublic
                                    ? 'bg-amber-950/40 text-amber-400 border border-amber-800/50'
                                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                            }`}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isPublic ? '#f59e0b' : '#57534e' }} />
                                {isPublic ? 'Public' : 'Private'}
              </span>
                        </div>

                        <button onClick={() => router.push('/leaderboard')}
                                className="w-full bg-[#1C1C1A] border border-stone-800 text-stone-400 px-4 py-2.5 rounded-2xl text-sm font-medium hover:border-amber-700/60 hover:text-amber-400 transition-colors">
                            Leaderboard
                        </button>
                        <button onClick={() => router.push('/global-projects')}
                                className="w-full bg-[#1C1C1A] border border-stone-800 text-stone-400 px-4 py-2.5 rounded-2xl text-sm font-medium hover:border-amber-700/60 hover:text-amber-400 transition-colors">
                            Discover Projects
                        </button>
                    </div>

                    {/* Right column */}
                    <div className="md:col-span-2 space-y-4">

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Projects', value: stats.projectCount, highlight: false },
                                { label: 'Ratings', value: stats.totalRatings, highlight: false },
                                { label: 'Avg Rating', value: stats.averageRating ? `${stats.averageRating.toFixed(1)} ★` : '—', highlight: true },
                            ].map(({ label, value, highlight }) => (
                                <div key={label} className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-4 text-center">
                                    <p className="text-stone-500 text-xs mb-2">{label}</p>
                                    <p className={`text-2xl font-semibold ${highlight ? 'text-amber-400' : 'text-stone-100'}`}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Privacy */}
                        <div className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-6">
                            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-4">Privacy</h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-200 mb-0.5">Public profile</p>
                                    <p className="text-xs text-stone-500">
                                        {isPublic ? 'Visible on global page and leaderboard' : 'Only visible to you'}
                                    </p>
                                </div>
                                <button onClick={handleToggleVisibility} disabled={saving}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                                            isPublic
                                                ? 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'
                                                : 'bg-amber-950/40 text-amber-400 border border-amber-800/50 hover:bg-amber-950/60'
                                        }`}>
                                    {saving ? '...' : isPublic ? 'Make Private' : 'Make Public'}
                                </button>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Bio</h2>
                                <button onClick={() => setEditing(!editing)}
                                        className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors">
                                    {editing ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            {editing ? (
                                <>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 500))}
                            placeholder="Tell us about yourself..."
                            rows={5}
                            className="w-full bg-[#111110] border border-stone-800 text-stone-200 placeholder-stone-600 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-600 resize-none mb-2 transition-colors"
                  />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-stone-600">{bio.length}/500</span>
                                        <button onClick={handleSaveProfile} disabled={saving}
                                                className="bg-amber-500 text-black px-5 py-2 rounded-xl text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors">
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className={`text-sm leading-relaxed ${bio ? 'text-stone-300' : 'text-stone-600 italic'}`}>
                                    {bio || 'No bio yet. Click Edit to add one.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}