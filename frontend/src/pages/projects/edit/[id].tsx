import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/lib/auth';
import { projectService, Project } from '@/lib/project';

export default function ViewProject() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) { router.push('/login'); return; }
    if (id) loadProject();
  }, [id, router]);

  const loadProject = async () => {
    try {
      const data = await projectService.getProjectById(Number(id));
      setProject(data);
    } catch { console.error('Failed to load project'); }
    finally { setLoading(false); }
  };

  if (loading) return (
      <div className="min-h-screen bg-[#111110] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
      </div>
  );

  if (!project) return (
      <div className="min-h-screen bg-[#111110] flex items-center justify-center text-center">
        <div>
          <p className="text-stone-500 mb-4">Project not found</p>
          <button onClick={() => router.push('/dashboard')}
                  className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-400 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-[#111110] text-stone-100">
        <div className="bg-[#1C1C1A] border-b border-stone-800 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => router.push('/dashboard')}
                    className="text-xs text-stone-500 hover:text-amber-400 mb-4 block transition-colors">
              ← Dashboard
            </button>
            <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
            <p className="text-stone-500 text-sm mt-1">
              by {project.ownerName} · Created {new Date(project.createdDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-[#1C1C1A] rounded-2xl border border-stone-800 p-6 space-y-6">

            {project.description && (
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">{project.description}</p>
                </div>
            )}

            {project.usedTechs && (
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.usedTechs.split(',').map((tech, i) => (
                        <span key={i} className="text-xs bg-amber-950/40 text-amber-400 border border-amber-800/50 px-2.5 py-1 rounded-lg">
                    {tech.trim()}
                  </span>
                    ))}
                  </div>
                </div>
            )}

            {project.filePath && (
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">File Path</p>
                  <p className="text-sm text-stone-400 font-mono bg-[#111110] border border-stone-800 px-3 py-2 rounded-xl">{project.filePath}</p>
                </div>
            )}

            {project.githubLink && (
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">GitHub</p>
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                    {project.githubLink} →
                  </a>
                </div>
            )}

            {project.documents && (
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Documents</p>
                  <div className="space-y-1">
                    {project.documents.split(',').map((doc, i) => (
                        <a key={i} href={doc.trim()} target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-amber-400 hover:text-amber-300 transition-colors">
                          Document {i + 1} →
                        </a>
                    ))}
                  </div>
                </div>
            )}

            <p className="text-xs text-stone-600 pt-2 border-t border-stone-800/60">
              Last modified {new Date(project.lastModifiedDate).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => router.push(`/projects/edit/${project.id}`)}
                    className="bg-amber-500 text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-400 transition-colors">
              Edit Project
            </button>
            <button onClick={() => router.push('/dashboard')}
                    className="bg-[#1C1C1A] border border-stone-800 text-stone-400 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-stone-700 hover:text-stone-200 transition-colors">
              Dashboard
            </button>
          </div>
        </main>
      </div>
  );
}