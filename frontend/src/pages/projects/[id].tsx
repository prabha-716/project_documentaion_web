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
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (id) {
      loadProject();
    }
  }, [id, router]);

  const loadProject = async () => {
    try {
      const data = await projectService.getProjectById(Number(id));
      setProject(data);
    } catch (err) {
      console.error('Failed to load project', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Project Details</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
            <p className="text-sm text-gray-500">
              Created by {project.ownerName} on {new Date(project.createdDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Last modified: {new Date(project.lastModifiedDate).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            {project.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
              </div>
            )}

            {project.usedTechs && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.usedTechs.split(',').map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.filePath && (
              <div>
                <h3 className="text-lg font-semibold mb-2">File Path</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{project.filePath}</p>
              </div>
            )}

            {project.githubLink && (
              <div>
                <h3 className="text-lg font-semibold mb-2">GitHub Repository</h3>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {project.githubLink} →
                </a>
              </div>
            )}

            {project.documents && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Documents</h3>
                <div className="space-y-2">
                  {project.documents.split(',').map((doc, index) => (
                    <div key={index}>
                      <a
                        href={doc.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Document {index + 1} →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => router.push(`/projects/edit/${project.id}`)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Edit Project
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
