import { useState } from 'react';
import { store } from '../store';
import type { Project } from '../types';
import { Save } from 'lucide-react';

interface Props {
  project: Project;
}

export function ConceptVision({ project }: Props) {
  const [formData, setFormData] = useState({
    name: project.name,
    concept: project.concept,
    setting: project.setting,
    theme: project.theme,
    perspective: project.perspective,
    gameplayFocus: project.gameplayFocus,
    uniqueHook: project.uniqueHook,
    engine: project.engine,
    targetPlatform: project.targetPlatform,
    status: project.status,
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    store.updateProject(project.id, formData);
    alert('Project updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Concept & Vision</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
              placeholder="My Horror Game"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Main Concept
            </label>
            <textarea
              value={formData.concept}
              onChange={(e) => handleChange('concept', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 resize-none"
              placeholder="What's the horror about? (Psychological, supernatural, survival, etc.)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Setting</label>
            <input
              type="text"
              value={formData.setting}
              onChange={(e) => handleChange('setting', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
              placeholder="Abandoned building, forest, lab, apartment, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Theme & Tone
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
              placeholder="Hopelessness, isolation, paranoia, trauma, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Player Perspective
            </label>
            <select
              value={formData.perspective}
              onChange={(e) => handleChange('perspective', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
            >
              <option value="">Select perspective</option>
              <option value="first-person">First Person</option>
              <option value="third-person">Third Person</option>
              <option value="2d-side">2D Side-Scrolling</option>
              <option value="2d-top">2D Top-Down</option>
              <option value="isometric">Isometric</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Gameplay Focus
            </label>
            <input
              type="text"
              value={formData.gameplayFocus}
              onChange={(e) => handleChange('gameplayFocus', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
              placeholder="Exploration, escape, puzzle-solving, stealth, survival"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Unique Hook
            </label>
            <textarea
              value={formData.uniqueHook}
              onChange={(e) => handleChange('uniqueHook', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 resize-none"
              placeholder="What makes your horror different from others?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Game Engine
            </label>
            <select
              value={formData.engine}
              onChange={(e) => handleChange('engine', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
            >
              <option value="">Select engine</option>
              <option value="unity">Unity</option>
              <option value="unreal">Unreal Engine 5</option>
              <option value="godot">Godot</option>
              <option value="rpgmaker">RPG Maker</option>
              <option value="renpy">Ren'Py</option>
              <option value="gamemaker">GameMaker</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Target Platform
            </label>
            <input
              type="text"
              value={formData.targetPlatform}
              onChange={(e) => handleChange('targetPlatform', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
              placeholder="PC, Console, Mobile, VR"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Development Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                handleChange('status', e.target.value as Project['status'])
              }
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
            >
              <option value="concept">Concept</option>
              <option value="pre-production">Pre-Production</option>
              <option value="production">Production</option>
              <option value="polish">Polish</option>
              <option value="release">Release</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">Quick Tips</h3>
        <ul className="space-y-2 text-gray-400">
          <li>• Define a clear core concept that can be explained in one sentence</li>
          <li>• Choose a unique hook that differentiates your game from others</li>
          <li>• Consider how your setting and theme work together to create atmosphere</li>
          <li>• Match your perspective to your gameplay goals</li>
          <li>• Keep scope realistic for indie development</li>
        </ul>
      </div>
    </div>
  );
}
