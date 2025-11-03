import { useState, useEffect } from 'react';
import { store } from '../store';
import type { StoryElement } from '../types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Props {
  projectId: string;
}

export function StoryGDD({ projectId }: Props) {
  const [elements, setElements] = useState<StoryElement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'story_outline' as StoryElement['type'],
    title: '',
    content: '',
  });

  useEffect(() => {
    loadElements();
  }, [projectId]);

  const loadElements = () => {
    const data = store.getProjectData('storyElements', projectId);
    setElements(data.sort((a, b) => a.orderIndex - b.orderIndex));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingId) {
      store.updateItem('storyElements', editingId, formData);
    } else {
      store.addItem('storyElements', {
        projectId,
        ...formData,
        orderIndex: elements.length,
      });
    }

    loadElements();
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this element?')) {
      store.deleteItem('storyElements', id);
      loadElements();
    }
  };

  const handleEdit = (element: StoryElement) => {
    setEditingId(element.id);
    setFormData({
      type: element.type,
      title: element.title,
      content: element.content,
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ type: 'story_outline', title: '', content: '' });
  };

  const getTypeColor = (type: StoryElement['type']) => {
    const colors = {
      story_outline: 'bg-blue-900 text-blue-200',
      character: 'bg-purple-900 text-purple-200',
      backstory: 'bg-green-900 text-green-200',
      twist: 'bg-red-900 text-red-200',
      lore: 'bg-yellow-900 text-yellow-200',
    };
    return colors[type];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Story & Game Design Document</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Element
        </button>
      </div>

      {elements.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No story elements yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:text-red-400"
          >
            Add your first story element
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {elements.map((element) => (
            <div
              key={element.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded ${getTypeColor(
                      element.type
                    )}`}
                  >
                    {element.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-lg font-bold">{element.title}</h3>
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
              <p className="text-gray-300 whitespace-pre-wrap">{element.content}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit' : 'Add'} Story Element
              </h2>
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
                    setFormData({ ...formData, type: e.target.value as StoryElement['type'] })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                >
                  <option value="story_outline">Story Outline</option>
                  <option value="character">Character</option>
                  <option value="backstory">Backstory</option>
                  <option value="twist">Twist</option>
                  <option value="lore">Lore</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  placeholder="Element title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Write your story content here..."
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
                disabled={!formData.title.trim()}
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
