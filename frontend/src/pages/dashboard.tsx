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
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = authService.getStoredUser();
    setUser(storedUser);
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

  const handleLogout = () => {
    authService.logout();
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        loadProjects();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Project Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Projects</h2>
          <button
            onClick={() => router.push('/projects/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No projects yet</p>
            <button
              onClick={() => router.push('/projects/new')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                
                {project.usedTechs && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Technologies:</p>
                    <p className="text-sm text-blue-600">{project.usedTechs}</p>
                  </div>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block mb-3"
                  >
                    View on GitHub →
                  </a>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/projects/edit/${project.id}`)}
                    className="flex-1 bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Updated: {new Date(project.lastModifiedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
