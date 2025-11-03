import { useState, useEffect } from 'react';
import { store } from '../store';
import type { HorrorElement } from '../types';
import { Plus, Edit2, Trash2, Save, X, Check } from 'lucide-react';

interface Props {
  projectId: string;
}

export function HorrorChecklist({ projectId }: Props) {
  const [elements, setElements] = useState<HorrorElement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<HorrorElement['type'] | 'all'>('all');
  const [formData, setFormData] = useState({
    type: 'atmosphere' as HorrorElement['type'],
    name: '',
    description: '',
    trigger: '',
  });

  useEffect(() => {
    loadElements();
  }, [projectId]);

  const loadElements = () => {
    const data = store.getProjectData('horrorElements', projectId);
    setElements(data);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      store.updateItem('horrorElements', editingId, formData);
    } else {
      store.addItem('horrorElements', {
        projectId,
        ...formData,
        implemented: false,
      });
    }

    loadElements();
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this horror element?')) {
      store.deleteItem('horrorElements', id);
      loadElements();
    }
  };

  const handleEdit = (element: HorrorElement) => {
    setEditingId(element.id);
    setFormData({
      type: element.type,
      name: element.name,
      description: element.description,
      trigger: element.trigger,
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      type: 'atmosphere',
      name: '',
      description: '',
      trigger: '',
    });
  };

  const toggleImplemented = (element: HorrorElement) => {
    store.updateItem('horrorElements', element.id, {
      implemented: !element.implemented,
    });
    loadElements();
  };

  const getTypeColor = (type: HorrorElement['type']) => {
    const colors = {
      jumpscare: 'bg-red-900 text-red-200',
      atmosphere: 'bg-blue-900 text-blue-200',
      psychological: 'bg-purple-900 text-purple-200',
      environmental: 'bg-green-900 text-green-200',
      audio: 'bg-yellow-900 text-yellow-200',
    };
    return colors[type];
  };

  const filteredElements = elements.filter((element) => {
    if (filterType !== 'all' && element.type !== filterType) return false;
    return true;
  });

  const groupedElements = filteredElements.reduce((acc, element) => {
    if (!acc[element.type]) acc[element.type] = [];
    acc[element.type].push(element);
    return acc;
  }, {} as Record<string, HorrorElement[]>);

  const stats = {
    total: elements.length,
    implemented: elements.filter((e) => e.implemented).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Horror Design Elements</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Element
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Elements</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.implemented}</div>
          <div className="text-sm text-gray-400">Implemented</div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">Horror Design Principles</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
          <div>• Fear the unknown - Don't show monster too soon</div>
          <div>• Anticipation over action - Wait is scarier</div>
          <div>• Subtle movement - Slight shifts, shadows</div>
          <div>• Unreliable senses - Lights flicker, sounds deceive</div>
          <div>• Environmental loops - Rooms repeat, reality bends</div>
          <div>• Limited control - Slow walking, flickering light</div>
          <div>• Sound triggers - Footsteps, knocking, breathing</div>
          <div>• Safe zones - Balance tension with relief</div>
        </div>
      </div>

      <div className="flex gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as HorrorElement['type'] | 'all')}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
        >
          <option value="all">All Types</option>
          <option value="jumpscare">Jumpscares</option>
          <option value="atmosphere">Atmosphere</option>
          <option value="psychological">Psychological</option>
          <option value="environmental">Environmental</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {filteredElements.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No horror elements yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:text-red-400"
          >
            Add your first horror element
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedElements).map(([type, typeElements]) => (
            <div key={type}>
              <h3 className="text-lg font-bold mb-3 capitalize flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded ${getTypeColor(
                    type as HorrorElement['type']
                  )}`}
                >
                  {type}
                </span>
                <span className="text-sm text-gray-400">({typeElements.length})</span>
              </h3>
              <div className="space-y-3">
                {typeElements.map((element) => (
                  <div
                    key={element.id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleImplemented(element)}
                        className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          element.implemented
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {element.implemented && <Check className="w-4 h-4" />}
                      </button>

                      <div className="flex-1">
                        <h4
                          className={`text-lg font-bold mb-2 ${
                            element.implemented ? 'text-gray-500 line-through' : ''
                          }`}
                        >
                          {element.name}
                        </h4>
                        {element.description && (
                          <p className="text-sm text-gray-400 mb-2">{element.description}</p>
                        )}
                        {element.trigger && (
                          <div className="bg-gray-800 border border-gray-700 rounded p-2">
                            <span className="text-xs text-gray-500 font-medium">Trigger: </span>
                            <span className="text-sm text-gray-300">{element.trigger}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(element)}
                          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(element.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
              <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Horror Element</h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as HorrorElement['type'],
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                >
                  <option value="jumpscare">Jumpscare</option>
                  <option value="atmosphere">Atmosphere</option>
                  <option value="psychological">Psychological</option>
                  <option value="environmental">Environmental</option>
                  <option value="audio">Audio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  placeholder="e.g., Shadow Movement, Distant Scream"
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
                  placeholder="Describe the horror element and its effect..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Trigger / Implementation
                </label>
                <textarea
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 resize-none"
                  placeholder="When/how does this activate? e.g., Player enters hallway, Random chance every 30s"
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
