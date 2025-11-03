import { useState, useEffect } from 'react';
import { store } from '../store';
import type { GameSystem } from '../types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Props {
  projectId: string;
}

export function SystemsTracker({ projectId }: Props) {
  const [systems, setSystems] = useState<GameSystem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'player' as GameSystem['category'],
    name: '',
    description: '',
    status: 'planned' as GameSystem['status'],
    priority: 'medium' as GameSystem['priority'],
  });

  useEffect(() => {
    loadSystems();
  }, [projectId]);

  const loadSystems = () => {
    const data = store.getProjectData('gameSystems', projectId);
    setSystems(data);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      store.updateItem('gameSystems', editingId, formData);
    } else {
      store.addItem('gameSystems', { projectId, ...formData });
    }

    loadSystems();
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this system?')) {
      store.deleteItem('gameSystems', id);
      loadSystems();
    }
  };

  const handleEdit = (system: GameSystem) => {
    setEditingId(system.id);
    setFormData({
      category: system.category,
      name: system.name,
      description: system.description,
      status: system.status,
      priority: system.priority,
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      category: 'player',
      name: '',
      description: '',
      status: 'planned',
      priority: 'medium',
    });
  };

  const getStatusColor = (status: GameSystem['status']) => {
    const colors = {
      planned: 'bg-gray-700 text-gray-300',
      in_progress: 'bg-blue-900 text-blue-200',
      completed: 'bg-green-900 text-green-200',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: GameSystem['priority']) => {
    const colors = {
      low: 'text-gray-400',
      medium: 'text-blue-400',
      high: 'text-yellow-400',
      critical: 'text-red-400',
    };
    return colors[priority];
  };

  const groupedSystems = systems.reduce((acc, system) => {
    if (!acc[system.category]) acc[system.category] = [];
    acc[system.category].push(system);
    return acc;
  }, {} as Record<string, GameSystem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Game Systems</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add System
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">Core Systems to Consider</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
          <div>• Player Controller (movement, interactions)</div>
          <div>• Inventory System</div>
          <div>• AI System (enemy behavior, pathfinding)</div>
          <div>• Puzzle System</div>
          <div>• Save/Load System</div>
          <div>• UI System</div>
          <div>• Audio Manager</div>
          <div>• Objective/Quest System</div>
        </div>
      </div>

      {systems.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No game systems yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:text-red-400"
          >
            Add your first system
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSystems).map(([category, categorySystems]) => (
            <div key={category}>
              <h3 className="text-lg font-bold mb-3 capitalize">
                {category.replace('_', ' ')} Systems
              </h3>
              <div className="grid gap-3">
                {categorySystems.map((system) => (
                  <div
                    key={system.id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <h4 className="font-bold">{system.name}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                            system.status
                          )}`}
                        >
                          {system.status.replace('_', ' ')}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(system.priority)}`}>
                          {system.priority}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(system)}
                          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(system.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {system.description && (
                      <p className="text-sm text-gray-400">{system.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} System</h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as GameSystem['category'],
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  >
                    <option value="player">Player</option>
                    <option value="ai">AI</option>
                    <option value="puzzle">Puzzle</option>
                    <option value="inventory">Inventory</option>
                    <option value="save">Save</option>
                    <option value="ui">UI</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                    placeholder="e.g., Player Movement Controller"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Describe what this system does..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as GameSystem['status'],
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as GameSystem['priority'],
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
