import { useState, useEffect } from 'react';
import { store } from '../store';
import type { MarketingActivity } from '../types';
import { Plus, Edit2, Trash2, Save, X, Check, Calendar } from 'lucide-react';

interface Props {
  projectId: string;
}

export function MarketingPlanner({ projectId }: Props) {
  const [activities, setActivities] = useState<MarketingActivity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<MarketingActivity['activityType'] | 'all'>('all');
  const [formData, setFormData] = useState({
    activityType: 'devlog' as MarketingActivity['activityType'],
    title: '',
    description: '',
    scheduledDate: '',
  });

  useEffect(() => {
    loadActivities();
  }, [projectId]);

  const loadActivities = () => {
    const data = store.getProjectData('marketingActivities', projectId);
    setActivities(
      data.sort((a, b) => {
        if (!a.scheduledDate) return 1;
        if (!b.scheduledDate) return -1;
        return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      })
    );
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    const activityData = {
      ...formData,
      scheduledDate: formData.scheduledDate || undefined,
    };

    if (editingId) {
      store.updateItem('marketingActivities', editingId, activityData);
    } else {
      store.addItem('marketingActivities', {
        projectId,
        ...activityData,
        completed: false,
      });
    }

    loadActivities();
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      store.deleteItem('marketingActivities', id);
      loadActivities();
    }
  };

  const handleEdit = (activity: MarketingActivity) => {
    setEditingId(activity.id);
    setFormData({
      activityType: activity.activityType,
      title: activity.title,
      description: activity.description,
      scheduledDate: activity.scheduledDate || '',
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      activityType: 'devlog',
      title: '',
      description: '',
      scheduledDate: '',
    });
  };

  const toggleCompleted = (activity: MarketingActivity) => {
    store.updateItem('marketingActivities', activity.id, {
      completed: !activity.completed,
    });
    loadActivities();
  };

  const getTypeColor = (type: MarketingActivity['activityType']) => {
    const colors = {
      social_post: 'bg-blue-900 text-blue-200',
      devlog: 'bg-purple-900 text-purple-200',
      trailer: 'bg-red-900 text-red-200',
      streamer_contact: 'bg-green-900 text-green-200',
      press_release: 'bg-yellow-900 text-yellow-200',
    };
    return colors[type];
  };

  const filteredActivities = activities.filter((activity) => {
    if (filterType !== 'all' && activity.activityType !== filterType) return false;
    return true;
  });

  const stats = {
    total: activities.length,
    completed: activities.filter((a) => a.completed).length,
    upcoming: activities.filter(
      (a) =>
        !a.completed &&
        a.scheduledDate &&
        new Date(a.scheduledDate) > new Date()
    ).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Marketing & Release Planning</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Activities</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.upcoming}</div>
          <div className="text-sm text-gray-400">Upcoming</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">Marketing Checklist</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
          <div>• Create Steam or Itch.io page early</div>
          <div>• Post regular devlogs and teasers</div>
          <div>• Make a mysterious trailer</div>
          <div>• Use X/Twitter, Reddit, YouTube</div>
          <div>• Contact horror streamers and YouTubers</div>
          <div>• Join indie horror communities</div>
          <div>• Share behind-the-scenes content</div>
          <div>• Build suspense outside the game</div>
        </div>
      </div>

      <div className="flex gap-4">
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as MarketingActivity['activityType'] | 'all')
          }
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
        >
          <option value="all">All Types</option>
          <option value="social_post">Social Posts</option>
          <option value="devlog">Devlogs</option>
          <option value="trailer">Trailers</option>
          <option value="streamer_contact">Streamer Contacts</option>
          <option value="press_release">Press Releases</option>
        </select>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No marketing activities yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:text-red-400"
          >
            Add your first marketing activity
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleCompleted(activity)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    activity.completed
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {activity.completed && <Check className="w-4 h-4" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3
                      className={`text-lg font-bold ${
                        activity.completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {activity.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(
                        activity.activityType
                      )}`}
                    >
                      {activity.activityType.replace('_', ' ')}
                    </span>
                    {activity.scheduledDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.scheduledDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-sm text-gray-400">{activity.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
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
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit' : 'Add'} Marketing Activity
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
                  value={formData.activityType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activityType: e.target.value as MarketingActivity['activityType'],
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                >
                  <option value="social_post">Social Post</option>
                  <option value="devlog">Devlog</option>
                  <option value="trailer">Trailer</option>
                  <option value="streamer_contact">Streamer Contact</option>
                  <option value="press_release">Press Release</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  placeholder="e.g., First Gameplay Teaser, Reddit AMA"
                />
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
                  placeholder="Activity details, content ideas, contacts..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
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
