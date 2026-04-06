import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/lib/auth';
import { projectService, ProjectRequest } from '@/lib/project';

export default function NewProject() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectRequest>({
    title: '', description: '', usedTechs: '', filePath: '', githubLink: '', documents: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) router.push('/login');
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await projectService.createProject(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-[#111110] border border-stone-800 text-stone-200 placeholder-stone-600 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-600 transition-colors";

  return (
      <div className="min-h-screen bg-[#111110] text-stone-100">
        <div className="bg-[#1C1C1A] border-b border-stone-800 px-6 py-6">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => router.push('/dashboard')}
                    className="text-xs text-stone-500 hover:text-amber-400 mb-4 block transition-colors">
              ← Dashboard
            </button>
            <h1 className="text-2xl font-semibold tracking-tight">New Project</h1>
            <p className="text-stone-500 text-sm mt-1">Add a project to your portfolio</p>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-6 py-8">
          {error && (
              <div className="bg-red-950/40 border border-red-800/50 text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm">
                {error}
              </div>
          )}

          <div className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-widest mb-1.5">
                  Title <span className="text-amber-500">*</span>
                </label>
                <input type="text" value={formData.title} required
                       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                       className={inputCls} placeholder="My awesome project" />
              </div>

              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-widest mb-1.5">Description</label>
                <textarea value={formData.description} rows={4}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className={`${inputCls} resize-none`} placeholder="What does this project do?" />
              </div>

              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-widest mb-1.5">Technologies</label>
                <input type="text" value={formData.usedTechs}
                       onChange={(e) => setFormData({ ...formData, usedTechs: e.target.value })}
                       className={inputCls} placeholder="React, Node.js, PostgreSQL" />
              </div>

              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-widest mb-1.5">File / Drive Path</label>
                <input type="text" value={formData.filePath}
                       onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                       className={inputCls} placeholder="/documents/project or Google Drive URL" />
              </div>

              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-widest mb-1.5">GitHub Link</label>
                <input type="url" value={formData.githubLink}
                       onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                       className={inputCls} placeholder="https://github.com/username/repo" />
              </div>

              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-widest mb-1.5">Documents (URLs, comma-separated)</label>
                <textarea value={formData.documents} rows={3}
                          onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                          className={`${inputCls} resize-none`} placeholder="https://doc1.com, https://doc2.com" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                        className="flex-1 bg-amber-500 text-black py-2.5 rounded-xl text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors">
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
                <button type="button" onClick={() => router.push('/dashboard')}
                        className="flex-1 bg-stone-800 border border-stone-700 text-stone-400 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
  );
}