import { useState, useEffect } from 'react';
import { store } from '../store';
import type { Asset } from '../types';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Props {
  projectId: string;
}

export function AssetTracker({ projectId }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<Asset['type'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Asset['status'] | 'all'>('all');
  const [formData, setFormData] = useState({
    name: '',
    type: '3d_model' as Asset['type'],
    status: 'needed' as Asset['status'],
    filePath: '',
    notes: '',
  });

  useEffect(() => {
    loadAssets();
  }, [projectId]);

  const loadAssets = () => {
    const data = store.getProjectData('assets', projectId);
    setAssets(data);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      store.updateItem('assets', editingId, formData);
    } else {
      store.addItem('assets', { projectId, ...formData });
    }

    loadAssets();
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      store.deleteItem('assets', id);
      loadAssets();
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingId(asset.id);
    setFormData({
      name: asset.name,
      type: asset.type,
      status: asset.status,
      filePath: asset.filePath,
      notes: asset.notes,
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      type: '3d_model',
      status: 'needed',
      filePath: '',
      notes: '',
    });
  };

  const getStatusColor = (status: Asset['status']) => {
    const colors = {
      needed: 'bg-red-900 text-red-200',
      in_progress: 'bg-yellow-900 text-yellow-200',
      completed: 'bg-green-900 text-green-200',
    };
    return colors[status];
  };

  const getTypeColor = (type: Asset['type']) => {
    const colors = {
      '3d_model': 'bg-blue-900 text-blue-200',
      texture: 'bg-purple-900 text-purple-200',
      sound: 'bg-green-900 text-green-200',
      music: 'bg-teal-900 text-teal-200',
      animation: 'bg-orange-900 text-orange-200',
      sprite: 'bg-pink-900 text-pink-200',
      other: 'bg-gray-700 text-gray-300',
    };
    return colors[type];
  };

  const filteredAssets = assets.filter((asset) => {
    if (filterType !== 'all' && asset.type !== filterType) return false;
    if (filterStatus !== 'all' && asset.status !== filterStatus) return false;
    return true;
  });

  const groupedAssets = filteredAssets.reduce((acc, asset) => {
    if (!acc[asset.type]) acc[asset.type] = [];
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  const stats = {
    total: assets.length,
    needed: assets.filter((a) => a.status === 'needed').length,
    inProgress: assets.filter((a) => a.status === 'in_progress').length,
    completed: assets.filter((a) => a.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Asset Tracker</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Assets</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">{stats.needed}</div>
          <div className="text-sm text-gray-400">Needed</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
      </div>

      <div className="flex gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as Asset['type'] | 'all')}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
        >
          <option value="all">All Types</option>
          <option value="3d_model">3D Models</option>
          <option value="texture">Textures</option>
          <option value="sound">Sounds</option>
          <option value="music">Music</option>
          <option value="animation">Animations</option>
          <option value="sprite">Sprites</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Asset['status'] | 'all')}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
        >
          <option value="all">All Status</option>
          <option value="needed">Needed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No assets found</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:text-red-400"
          >
            Add your first asset
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAssets).map(([type, typeAssets]) => (
            <div key={type}>
              <h3 className="text-lg font-bold mb-3 capitalize flex items-center gap-2">
                <span className={`px-3 py-1 text-xs font-medium rounded ${getTypeColor(type as Asset['type'])}`}>
                  {type.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-400">({typeAssets.length})</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {typeAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{asset.name}</h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                              asset.status
                            )}`}
                          >
                            {asset.status.replace('_', ' ')}
                          </span>
                        </div>
                        {asset.filePath && (
                          <div className="text-xs text-gray-400 mb-1 font-mono break-all">
                            {asset.filePath}
                          </div>
                        )}
                        {asset.notes && (
                          <p className="text-sm text-gray-400 mt-2">{asset.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(asset)}
                          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
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
              <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Asset</h2>
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
                  Asset Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  placeholder="e.g., Monster Model, Door Creak Sound"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as Asset['type'] })
                    }
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  >
                    <option value="3d_model">3D Model</option>
                    <option value="texture">Texture</option>
                    <option value="sound">Sound</option>
                    <option value="music">Music</option>
                    <option value="animation">Animation</option>
                    <option value="sprite">Sprite</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as Asset['status'] })
                    }
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  >
                    <option value="needed">Needed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  File Path
                </label>
                <input
                  type="text"
                  value={formData.filePath}
                  onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500"
                  placeholder="Assets/Models/monster.fbx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Additional notes about this asset..."
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
