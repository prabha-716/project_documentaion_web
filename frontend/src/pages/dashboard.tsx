import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authService, User } from '@/lib/auth';
import { projectService, Project } from '@/lib/project';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) { router.push('/login'); return; }
    setUser(authService.getStoredUser());
    loadProjects();
  }, [router]);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Delete this project?')) {
      try {
        await projectService.deleteProject(id);
        loadProjects();
      } catch {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#111110] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#111110] text-stone-100">
        <main className="max-w-6xl mx-auto px-6 py-10">

          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-stone-500 text-sm mb-1">Welcome back,</p>
              <h1 className="text-2xl font-semibold tracking-tight">{user?.name}</h1>
            </div>
            <button
                onClick={() => router.push('/projects/new')}
                className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-400 transition-colors"
            >
              <span>+</span> New Project
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Projects', value: projects.length },
              { label: 'Updated This Month', value: projects.filter(p => new Date(p.lastModifiedDate).getMonth() === new Date().getMonth()).length },
              { label: 'With GitHub', value: projects.filter(p => p.githubLink).length },
            ].map(({ label, value }) => (
                <div key={label} className="bg-[#1C1C1A] rounded-2xl border border-stone-800 px-5 py-4">
                  <p className="text-stone-500 text-xs mb-1">{label}</p>
                  <p className="text-2xl font-semibold text-stone-100">{value}</p>
                </div>
            ))}
          </div>

          {projects.length === 0 ? (
              <div className="bg-[#1C1C1A] border border-stone-800 rounded-2xl p-16 text-center">
                <p className="text-stone-500 mb-5 text-sm">No projects yet</p>
                <button
                    onClick={() => router.push('/projects/new')}
                    className="bg-amber-500 text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-400 transition-colors"
                >
                  Create your first project
                </button>
              </div>
          ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-5 hover:border-amber-700/60 hover:bg-[#211f1d] transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-stone-100 leading-snug">{project.title}</h3>
                        <span className="text-xs text-stone-600 shrink-0 ml-2 mt-0.5">
                    {new Date(project.lastModifiedDate).toLocaleDateString()}
                  </span>
                      </div>

                      {project.description && (
                          <p className="text-stone-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                      )}

                      {project.usedTechs && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {project.usedTechs.split(',').slice(0, 3).map((tech, i) => (
                                <span key={i} className="text-xs bg-amber-950/40 text-amber-400 border border-amber-800/50 px-2 py-0.5 rounded-lg">
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

                      <div className="flex gap-2 pt-3 border-t border-stone-800/60">
                        <button onClick={() => router.push(`/projects/${project.id}`)}
                                className="flex-1 bg-stone-800 text-stone-300 px-3 py-2 rounded-xl text-xs font-medium hover:bg-stone-700 hover:text-amber-400 transition-colors">
                          View
                        </button>
                        <button onClick={() => router.push(`/projects/edit/${project.id}`)}
                                className="flex-1 bg-stone-800 text-stone-300 px-3 py-2 rounded-xl text-xs font-medium hover:bg-stone-700 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProject(project.id)}
                                className="bg-stone-800 text-red-500/70 px-3 py-2 rounded-xl text-xs font-medium hover:bg-red-950/40 hover:text-red-400 transition-colors">
                          Delete
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