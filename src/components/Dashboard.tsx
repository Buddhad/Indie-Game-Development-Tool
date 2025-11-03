import { useState, useEffect } from 'react';
import { store } from '../store';
import type { Project } from '../types';
import { ProjectSelector } from './ProjectSelector';
import { ConceptVision } from './ConceptVision';
import { StoryGDD } from './StoryGDD';
import { TaskManager } from './TaskManager';
import { AssetTracker } from './AssetTracker';
import { HorrorChecklist } from './HorrorChecklist';
import { MarketingPlanner } from './MarketingPlanner';
import { SystemsTracker } from './SystemsTracker';
import { LevelDesigner } from './LevelDesigner';
import {
  Skull,
  BookOpen,
  CheckSquare,
  Image,
  Zap,
  Megaphone,
  Settings,
  Map,
} from 'lucide-react';

type Tab =
  | 'concept'
  | 'story'
  | 'tasks'
  | 'assets'
  | 'horror'
  | 'marketing'
  | 'systems'
  | 'levels';

export function Dashboard() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('concept');
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const project = store.getCurrentProject();
    setCurrentProject(project);
  }, []);

  const handleProjectChange = (project: Project | null) => {
    setCurrentProject(project);
    forceUpdate({});
  };

  const tabs = [
    { id: 'concept' as Tab, label: 'Concept & Vision', icon: Skull },
    { id: 'story' as Tab, label: 'Story & GDD', icon: BookOpen },
    { id: 'systems' as Tab, label: 'Game Systems', icon: Settings },
    { id: 'levels' as Tab, label: 'Levels', icon: Map },
    { id: 'tasks' as Tab, label: 'Tasks', icon: CheckSquare },
    { id: 'assets' as Tab, label: 'Assets', icon: Image },
    { id: 'horror' as Tab, label: 'Horror Design', icon: Zap },
    { id: 'marketing' as Tab, label: 'Marketing', icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skull className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold">Horror Game Dev Tool</h1>
            </div>
            <ProjectSelector
              currentProject={currentProject}
              onProjectChange={handleProjectChange}
            />
          </div>
        </div>
      </header>

      {!currentProject ? (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Skull className="w-24 h-24 text-gray-700 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Welcome to Horror Game Dev Tool</h2>
          <p className="text-gray-400 text-lg mb-8">
            Create a new project or select an existing one to start building your indie horror
            game
          </p>
        </div>
      ) : (
        <>
          <nav className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-500 bg-gray-800'
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-8">
            {activeTab === 'concept' && <ConceptVision project={currentProject} />}
            {activeTab === 'story' && <StoryGDD projectId={currentProject.id} />}
            {activeTab === 'systems' && <SystemsTracker projectId={currentProject.id} />}
            {activeTab === 'levels' && <LevelDesigner projectId={currentProject.id} />}
            {activeTab === 'tasks' && <TaskManager projectId={currentProject.id} />}
            {activeTab === 'assets' && <AssetTracker projectId={currentProject.id} />}
            {activeTab === 'horror' && <HorrorChecklist projectId={currentProject.id} />}
            {activeTab === 'marketing' && <MarketingPlanner projectId={currentProject.id} />}
          </main>
        </>
      )}
    </div>
  );
}
