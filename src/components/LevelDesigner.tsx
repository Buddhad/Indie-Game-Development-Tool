import { useState, useEffect } from 'react';
import { store } from '../store';
import type { Level } from '../types';
import { Plus, Edit2, Trash2, Save, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  projectId: string;
}

export function LevelDesigner({ projectId }: Props) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'concept' as Level['status'],
    notes: '',
  });

  useEffect(() => {
    loadLevels();
  }, [projectId]);

  const loadLevels = () => {
    const data = store.getProjectData('levels', projectId);
    setLevels(data.sort((a, b) => a.orderIndex - b.orderIndex));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      store.updateItem('levels', editingId, formData);
    } else {
      store.addItem('levels', {
        projectId,
        ...formData,
        orderIndex: levels.length,
      });
    }

    loadLevels();
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this level?')) {
      store.deleteItem('levels', id);
      loadLevels();
    }
  };

  const handleEdit = (level: Level) => {
    setEditingId(level.id);
    setFormData({
      name: level.name,
      description: level.description,
      status: level.status,
      notes: level.notes,
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', description: '', status: 'concept', notes: '' });
  };

  const moveLevel = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= levels.length) return;

    const newLevels = [...levels];
    [newLevels[index], newLevels[newIndex]] = [newLevels[newIndex], newLevels[index]];

    newLevels.forEach((level, i) => {
      store.updateItem('levels', level.id, { orderIndex: i });
    });

    loadLevels();
  };

  const getStatusColor = (status: Level['status']) => {
    const colors = {
      concept: 'bg-gray-700 text-gray-300',
      blockout: 'bg-yellow-900 text-yellow-200',
      detailed: 'bg-blue-900 text-blue-200',
      polished: 'bg-green-900 text-green-200',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Level Design</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Level
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">Level Design Tips</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Build narrow hallways and claustrophobic spaces for tension</li>
          <li>• Use lighting to guide players subconsciously</li>
          <li>• Hide secrets or notes for story hints and exploration rewards</li>
          <li>• Include safe zones for temporary relief and pacing</li>
          <li>• Environmental storytelling through props and details</li>
        </ul>
      </div>

      {levels.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No levels yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:text-red-400"
          >
            Add your first level
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {levels.map((level, index) => (
            <div
              key={level.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveLevel(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveLevel(index, 'down')}
                      disabled={index === levels.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-500 font-mono text-sm">#{index + 1}</span>
                      <h3 className="text-lg font-bold">{level.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                          level.status
                        )}`}
                      >
                        {level.status}
                      </span>
                    </div>
                    {level.description && (
                      <p className="text-sm text-gray-400 mb-2">{level.description}</p>
                    )}
                    {level.notes && (
                      <div className="bg-gray-800 border border-gray-700 rounded p-3 mt-2">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{level.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(level)}
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(level.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Level</h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Level Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  placeholder="e.g., The Abandoned Hospital"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Brief overview of the level..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as Level['status'] })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                >
                  <option value="concept">Concept</option>
                  <option value="blockout">Blockout</option>
                  <option value="detailed">Detailed</option>
                  <option value="polished">Polished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Design Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Layout ideas, key moments, puzzles, scares, objectives..."
                />
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
