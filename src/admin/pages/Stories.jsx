import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { FiPlus, FiTrash2, FiEdit, FiEye, FiImage, FiBookOpen } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;

const Stories = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [previewStory, setPreviewStory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    type: 'image',
    display_order: 0,
    is_active: true
  });
  const queryClient = useQueryClient();

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const response = await api.get(`/stories/${SCHOOL_ID}`);
      return response.data?.data || response.data || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      if (editingStory) {
        return api.put(`/stories/${SCHOOL_ID}/${editingStory.id}`, formData);
      }
      return api.post(`/stories/${SCHOOL_ID}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stories']);
      toast.success(editingStory ? 'Story updated!' : 'Story created!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to save story');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/stories/${SCHOOL_ID}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stories']);
      toast.success('Story deleted');
    },
    onError: () => toast.error('Failed to delete story')
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, imageUrl: res.data.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (story) => {
    setEditingStory(story);
    setForm({
      title: story.title || '',
      description: story.description || '',
      imageUrl: story.image_url || story.imageUrl || '',
      type: story.type || 'image',
      display_order: story.display_order || 0,
      is_active: story.is_active !== undefined ? story.is_active : true
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingStory(null);
    setForm({ title: '', description: '', imageUrl: '', type: 'image', display_order: 0, is_active: true });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      toast.error('Title and image are required');
      return;
    }
    saveMutation.mutate(form);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stories Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage featured stories for the homepage slider
          </p>
        </div>
        <button
          onClick={openCreate}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded-lg hover:bg-blue-900 dark:hover:bg-yellow-500 font-medium"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Story
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium">Error loading stories</h3>
          <p className="text-red-600 text-sm mt-1">{error.response?.data?.error || 'Failed to load stories'}</p>
        </div>
      )}

      {(!stories || stories.length === 0) ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stories yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first featured story for the homepage slider</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center px-4 py-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded-lg hover:bg-blue-900 dark:hover:bg-yellow-500 font-medium"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add First Story
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {story.display_order || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-16 h-12 object-cover rounded"
                      onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{story.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{story.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      story.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {story.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setPreviewStory(story)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 mr-2"
                      title="Preview"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(story)}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 mr-2"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { if (window.confirm('Delete this story?')) deleteMutation.mutate(story.id); }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-lg bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingStory ? 'Edit Story' : 'Add Story'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">×</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image *</label>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-3" />
                  )}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                    <label className="cursor-pointer mt-2 block">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {uploading ? 'Uploading...' : 'Click to upload image'}
                      </span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {form.imageUrl && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{form.imageUrl}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                  <input type="text" required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-950 dark:focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Story title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-950 dark:focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Story description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                    <input type="number" min="0"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-950 dark:focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={form.display_order}
                      onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-950 dark:focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={form.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                  >Cancel</button>
                  <button type="submit" disabled={saveMutation.isLoading}
                    className="px-6 py-3 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded-lg hover:bg-blue-900 dark:hover:bg-yellow-500 font-medium disabled:opacity-50"
                  >{saveMutation.isLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {previewStory && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full overflow-hidden">
            <img
              src={previewStory.image_url}
              alt={previewStory.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{previewStory.title}</h3>
                <button onClick={() => setPreviewStory(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{previewStory.description}</p>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span>Order: {previewStory.display_order || 0}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  previewStory.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {previewStory.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
