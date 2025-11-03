import type {
  Project,
  StoryElement,
  GameSystem,
  Task,
  Asset,
  HorrorElement,
  Level,
  MarketingActivity,
} from './types';

const STORAGE_KEY = 'horror_game_dev_data';

interface StoreData {
  projects: Project[];
  storyElements: StoryElement[];
  gameSystems: GameSystem[];
  tasks: Task[];
  assets: Asset[];
  horrorElements: HorrorElement[];
  levels: Level[];
  marketingActivities: MarketingActivity[];
  currentProjectId: string | null;
}

const getInitialData = (): StoreData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  return {
    projects: [],
    storyElements: [],
    gameSystems: [],
    tasks: [],
    assets: [],
    horrorElements: [],
    levels: [],
    marketingActivities: [],
    currentProjectId: null,
  };
};

const saveData = (data: StoreData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const store = {
  data: getInitialData(),

  save() {
    saveData(this.data);
  },

  setCurrentProject(id: string | null) {
    this.data.currentProjectId = id;
    this.save();
  },

  getCurrentProject(): Project | null {
    if (!this.data.currentProjectId) return null;
    return this.data.projects.find(p => p.id === this.data.currentProjectId) || null;
  },

  addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.projects.push(newProject);
    this.data.currentProjectId = newProject.id;
    this.save();
    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>) {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.projects[index] = {
        ...this.data.projects[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.save();
    }
  },

  deleteProject(id: string) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.data.storyElements = this.data.storyElements.filter(s => s.projectId !== id);
    this.data.gameSystems = this.data.gameSystems.filter(g => g.projectId !== id);
    this.data.tasks = this.data.tasks.filter(t => t.projectId !== id);
    this.data.assets = this.data.assets.filter(a => a.projectId !== id);
    this.data.horrorElements = this.data.horrorElements.filter(h => h.projectId !== id);
    this.data.levels = this.data.levels.filter(l => l.projectId !== id);
    this.data.marketingActivities = this.data.marketingActivities.filter(m => m.projectId !== id);
    if (this.data.currentProjectId === id) {
      this.data.currentProjectId = this.data.projects[0]?.id || null;
    }
    this.save();
  },

  getProjectData<T extends keyof Omit<StoreData, 'projects' | 'currentProjectId'>>(
    key: T,
    projectId: string
  ): StoreData[T] {
    return this.data[key].filter((item: any) => item.projectId === projectId) as StoreData[T];
  },

  addItem<T extends keyof Omit<StoreData, 'projects' | 'currentProjectId'>>(
    key: T,
    item: Omit<StoreData[T][number], 'id' | 'createdAt'>
  ) {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as StoreData[T][number];
    this.data[key].push(newItem);
    this.save();
    return newItem;
  },

  updateItem<T extends keyof Omit<StoreData, 'projects' | 'currentProjectId'>>(
    key: T,
    id: string,
    updates: Partial<StoreData[T][number]>
  ) {
    const index = this.data[key].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      this.data[key][index] = { ...this.data[key][index], ...updates };
      this.save();
    }
  },

  deleteItem<T extends keyof Omit<StoreData, 'projects' | 'currentProjectId'>>(
    key: T,
    id: string
  ) {
    this.data[key] = this.data[key].filter((item: any) => item.id !== id) as StoreData[T];
    this.save();
  },

  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  },

  importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      this.data = imported;
      this.save();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },
};
