import { useState } from 'react';
import { store } from '../store';
import type { Project } from '../types';
import { Plus, FolderOpen, Download, Upload, Trash2 } from 'lucide-react';

interface Props {
  currentProject: Project | null;
  onProjectChange: (project: Project | null) => void;
}

export function ProjectSelector({ currentProject, onProjectChange }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = () => {
    if (!projectName.trim()) return;

    const newProject = store.addProject({
      name: projectName,
      concept: '',
      setting: '',
      theme: '',
      perspective: '',
      gameplayFocus: '',
      uniqueHook: '',
      engine: '',
      targetPlatform: '',
      status: 'concept',
    });

    onProjectChange(newProject);
    setProjectName('');
    setShowModal(false);
  };

  const handleSelectProject = (project: Project) => {
    store.setCurrentProject(project.id);
    onProjectChange(project);
    setShowProjects(false);
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      store.deleteProject(projectId);
      onProjectChange(store.getCurrentProject());
    }
  };

  const handleExport = () => {
    const data = store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `horror-game-dev-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (store.importData(content)) {
            alert('Data imported successfully!');
            onProjectChange(store.getCurrentProject());
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
        title="Export all data"
      >
        <Download className="w-5 h-5" />
      </button>
      <button
        onClick={handleImport}
        className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
        title="Import data"
      >
        <Upload className="w-5 h-5" />
      </button>
      <button
        onClick={() => setShowProjects(!showProjects)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
      >
        <FolderOpen className="w-4 h-4" />
        {currentProject ? currentProject.name : 'Select Project'}
      </button>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Project
      </button>

      {showProjects && (
        <div className="absolute top-16 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-80 max-h-96 overflow-y-auto z-50">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-3">Your Projects</h3>
            <div className="space-y-2">
              {store.data.projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  className="flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-400">{project.status}</div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {store.data.projects.length === 0 && (
                <p className="text-gray-400 text-center py-4">No projects yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              placeholder="Enter project name"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setProjectName('');
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
