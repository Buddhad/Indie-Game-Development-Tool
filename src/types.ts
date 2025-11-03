export interface Project {
  id: string;
  name: string;
  concept: string;
  setting: string;
  theme: string;
  perspective: string;
  gameplayFocus: string;
  uniqueHook: string;
  engine: string;
  targetPlatform: string;
  status: 'concept' | 'pre-production' | 'production' | 'polish' | 'release';
  createdAt: string;
  updatedAt: string;
}

export interface StoryElement {
  id: string;
  projectId: string;
  type: 'story_outline' | 'character' | 'backstory' | 'twist' | 'lore';
  title: string;
  content: string;
  orderIndex: number;
  createdAt: string;
}

export interface GameSystem {
  id: string;
  projectId: string;
  category: 'player' | 'ai' | 'puzzle' | 'inventory' | 'save' | 'ui' | 'other';
  name: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: 'design' | 'code' | 'art' | 'audio' | 'testing' | 'documentation';
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Asset {
  id: string;
  projectId: string;
  name: string;
  type: '3d_model' | 'texture' | 'sound' | 'music' | 'animation' | 'sprite' | 'other';
  status: 'needed' | 'in_progress' | 'completed';
  filePath: string;
  notes: string;
  createdAt: string;
}

export interface HorrorElement {
  id: string;
  projectId: string;
  type: 'jumpscare' | 'atmosphere' | 'psychological' | 'environmental' | 'audio';
  name: string;
  description: string;
  trigger: string;
  implemented: boolean;
  createdAt: string;
}

export interface Level {
  id: string;
  projectId: string;
  name: string;
  description: string;
  orderIndex: number;
  status: 'concept' | 'blockout' | 'detailed' | 'polished';
  notes: string;
  createdAt: string;
}

export interface MarketingActivity {
  id: string;
  projectId: string;
  activityType: 'social_post' | 'devlog' | 'trailer' | 'streamer_contact' | 'press_release';
  title: string;
  description: string;
  scheduledDate?: string;
  completed: boolean;
  createdAt: string;
}
