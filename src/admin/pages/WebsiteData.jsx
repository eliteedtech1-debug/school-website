import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiArrowUp, FiArrowDown, FiUpload,
  FiTarget, FiHeart, FiStar, FiBookOpen, FiUsers, FiAward, FiZap
} from 'react-icons/fi';
import { FaGraduationCap, FaPray, FaHandsHelping } from 'react-icons/fa';

const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;
const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;

const ICON_OPTIONS = [
  { value: 'target', label: 'Target', icon: FiTarget },
  { value: 'heart', label: 'Heart', icon: FiHeart },
  { value: 'star', label: 'Star', icon: FiStar },
  { value: 'book', label: 'Book', icon: FiBookOpen },
  { value: 'users', label: 'Users', icon: FiUsers },
  { value: 'award', label: 'Award', icon: FiAward },
  { value: 'zap', label: 'Zap', icon: FiZap },
  { value: 'graduation', label: 'Graduation', icon: FaGraduationCap },
  { value: 'pray', label: 'Pray', icon: FaPray },
  { value: 'hands-helping', label: 'Hands Helping', icon: FaHandsHelping },
];

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', cls: 'bg-blue-500' },
  { value: 'green', label: 'Green', cls: 'bg-green-500' },
  { value: 'purple', label: 'Purple', cls: 'bg-purple-500' },
  { value: 'yellow', label: 'Yellow', cls: 'bg-yellow-500' },
  { value: 'red', label: 'Red', cls: 'bg-red-500' },
];

const TABS = [
  { key: 'hero', label: 'Hero Section', itemLabel: 'Hero', group: 'Home' },
  { key: 'core_values', label: 'Core Values', itemLabel: 'Value', group: 'Home' },
  { key: 'features', label: 'Why Choose Us', itemLabel: 'Feature', group: 'Home' },
  { key: 'events', label: 'Events', itemLabel: 'Event', group: 'Home' },
  { key: 'programs', label: 'Programs', itemLabel: 'Program', group: 'Home' },
  { key: 'about_hero', label: 'About Hero', itemLabel: 'Hero', group: 'About' },
  { key: 'about_key_points', label: 'Key Points', itemLabel: 'Point', group: 'About' },
  { key: 'about_floating_stats', label: 'Floating Stats', itemLabel: 'Stat', group: 'About' },
  { key: 'about_stats', label: 'Stats (Numbers)', itemLabel: 'Stat', group: 'About' },
  { key: 'about_staff', label: 'Staff', itemLabel: 'Staff', group: 'About' },
  { key: 'about_programs', label: 'Program Cards', itemLabel: 'Program', group: 'About' },
  { key: 'about_programs_banner', label: 'Banner Text', itemLabel: 'Banner', group: 'About' },
  { key: 'vision', label: 'Vision', itemLabel: 'Vision Entry', group: 'About' },
  { key: 'mission', label: 'Mission', itemLabel: 'Mission Entry', group: 'About' },
  { key: 'vision_values', label: 'Vision Values', itemLabel: 'Value', group: 'About' },
  { key: 'gallery_hero', label: 'Gallery Hero', itemLabel: 'Hero', group: 'Gallery' },
  { key: 'gallery_items', label: 'Gallery Items', itemLabel: 'Item', group: 'Gallery' },
  { key: 'gallery_events_videos', label: 'Events Videos Title', itemLabel: 'Title', group: 'Gallery' },
  { key: 'gallery_highlights', label: 'Highlights', itemLabel: 'Section', group: 'Gallery' },
];

function defaultValue(key) {
  if (key === 'hero') return { title: 'Welcome to Dr. Kabiru Gwarzo Academy', subtitle: '& Tahfeez — Strive for Excellence', image: '' };
  if (key === 'core_values') return { title: '', description: '', icon: 'target' };
  if (key === 'features') return { title: '', description: '', icon: 'book' };
  if (key === 'events') return { title: '', status: '', description: '', color: 'blue' };
  if (key === 'programs') return { level: '', grades: '', time: '' };
  if (key === 'about_hero') return { title: 'Welcome to', subtitle: 'Our Academic Community', tagline: '' };
  if (key === 'about_key_points') return { text: '' };
  if (key === 'about_floating_stats') return { number: '', label: '' };
  if (key === 'about_stats') return { icon: 'users', from: 0, to: 100, label: '', description: '' };
  if (key === 'about_staff') return { name: '', position: '', image: '' };
  if (key === 'about_programs') return { title: '', icon: '', items: '', description: '' };
  if (key === 'about_programs_banner') return { text: 'Complete curriculum with modern teaching methodologies' };
  if (key === 'vision') return { title: 'Our Vision', description: '', points: '', quote: '' };
  if (key === 'mission') return { title: 'Our Mission', description: '', points: '', quote: '' };
  if (key === 'vision_values') return { title: '', description: '', icon: 'star' };
  if (key === 'gallery_hero') return { title: 'Gallery Album', subtitle: 'Explore our vibrant school community through photos and videos' };
  if (key === 'gallery_items') return { title: '', description: '', category: 'photos', type: 'image', image: '', videoUrl: '' };
  if (key === 'gallery_events_videos') return { title: "School's Events Videos" };
  if (key === 'gallery_highlights') return { title: '', color: 'blue', points: '' };
  return {};
}

function ItemModal({ sectionKey, editing, onSave, onCancel }) {
  const [form, setForm] = useState(editing || defaultValue(sectionKey));
  const [uploading, setUploading] = useState(false);
  const uploadMedia = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    try {
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = res.data?.url || res.data?.data?.url || '';
      if (url) setForm(p => ({ ...p, image: url }));
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (sectionKey === 'hero' && (!form.title || !form.subtitle)) return toast.error('Title and subtitle required');
    if (sectionKey === 'events' && (!form.title || !form.status)) return toast.error('Title and status required');
    if (sectionKey === 'core_values' && (!form.title || !form.description)) return toast.error('Title and description required');
    if (sectionKey === 'features' && (!form.title || !form.description)) return toast.error('Title and description required');
    if (sectionKey === 'programs' && (!form.level || !form.time)) return toast.error('Level and time required');
    if (sectionKey === 'about_staff' && (!form.name || !form.position)) return toast.error('Name and position required');
    if (sectionKey === 'about_stats' && (!form.label)) return toast.error('Label required');
    if (sectionKey === 'vision' && (!form.title || !form.description)) return toast.error('Title and description required');
    if (sectionKey === 'mission' && (!form.title || !form.description)) return toast.error('Title and description required');
    if (sectionKey === 'gallery_items' && !form.image) return toast.error('Image URL required');
    if (sectionKey === 'gallery_highlights' && !form.title) return toast.error('Title required');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold dark:text-white">
            {editing ? 'Edit' : 'Add'} {TABS.find(t => t.key === sectionKey)?.itemLabel}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><FiX className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          {sectionKey === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Welcome to Dr. Kabiru Gwarzo Academy" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.subtitle} onChange={e => update('subtitle', e.target.value)} placeholder="& Tahfeez — Strive for Excellence" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image</label>
                <div className="flex gap-2">
                  <input className="flex-1 border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.image} onChange={e => update('image', e.target.value)} placeholder="/school.png or https://..." />
                  <label className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm cursor-pointer ${uploading ? 'bg-gray-400' : 'bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950'} font-semibold`}>
                    <FiUpload className="w-4 h-4" />
                    {uploading ? '...' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={e => { if (e.target.files[0]) uploadMedia(e.target.files[0]); }} />
                  </label>
                </div>
                {form.image && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">preview</p>
                    <img src={form.image} alt="preview" className="w-full h-32 rounded-lg object-cover" />
                  </div>
                )}
              </div>
            </>
          )}

          {sectionKey === 'core_values' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Excellence" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.value} type="button" onClick={() => update('icon', opt.value)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border ${form.icon === opt.value ? 'bg-blue-950 text-white border-blue-950 dark:bg-yellow-400 dark:text-blue-950 dark:border-yellow-400' : 'border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <Icon className="w-4 h-4" /> {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {sectionKey === 'features' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Quality Education" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.value} type="button" onClick={() => update('icon', opt.value)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border ${form.icon === opt.value ? 'bg-blue-950 text-white border-blue-950 dark:bg-yellow-400 dark:text-blue-950 dark:border-yellow-400' : 'border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <Icon className="w-4 h-4" /> {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {sectionKey === 'events' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="2025/2026 Session e-Application Form" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Label</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.status} onChange={e => update('status', e.target.value)} placeholder="NOW ON SALE!" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => update('color', opt.value)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white border ${form.color === opt.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''} ${opt.cls}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {sectionKey === 'programs' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.level} onChange={e => update('level', e.target.value)} placeholder="Senior Secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grades</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.grades} onChange={e => update('grades', e.target.value)} placeholder="SS 1-3 (Science, Arts, Commercial)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.time} onChange={e => update('time', e.target.value)} placeholder="Mon-Thu: 7:30am-1:15pm, Fri: 7:30am-12:00pm" />
              </div>
            </>
          )}

          {sectionKey === 'about_hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Welcome to" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle (yellow text)</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.subtitle} onChange={e => update('subtitle', e.target.value)} placeholder="Our Academic Community" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tagline</label>
                <textarea rows={2} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.tagline} onChange={e => update('tagline', e.target.value)} placeholder="Building knowledge, discipline, and excellence..." />
              </div>
            </>
          )}

          {sectionKey === 'about_key_points' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Point Text</label>
              <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.text} onChange={e => update('text', e.target.value)} placeholder="Quality Education with Moral Values" />
            </div>
          )}

          {sectionKey === 'about_floating_stats' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.number} onChange={e => update('number', e.target.value)} placeholder="15+" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.label} onChange={e => update('label', e.target.value)} placeholder="Years of Excellence" />
              </div>
            </>
          )}

          {sectionKey === 'about_stats' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.value} type="button" onClick={() => update('icon', opt.value)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border ${form.icon === opt.value ? 'bg-blue-950 text-white border-blue-950 dark:bg-yellow-400 dark:text-blue-950 dark:border-yellow-400' : 'border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <Icon className="w-4 h-4" /> {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
                  <input type="number" className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.from} onChange={e => update('from', Number(e.target.value))} placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                  <input type="number" className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.to} onChange={e => update('to', Number(e.target.value))} placeholder="500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.label} onChange={e => update('label', e.target.value)} placeholder="Students" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Enrolled across all programs" />
              </div>
            </>
          )}

          {sectionKey === 'about_staff' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Adamu Muhammad Alkali" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.position} onChange={e => update('position', e.target.value)} placeholder="Principal" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                <div className="flex gap-2">
                  <input className="flex-1 border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.image} onChange={e => update('image', e.target.value)} placeholder="https://files.eliteedu.tech/..." />
                  <label className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm cursor-pointer ${uploading ? 'bg-gray-400' : 'bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950'} font-semibold`}>
                    <FiUpload className="w-4 h-4" />
                    {uploading ? '...' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={e => { if (e.target.files[0]) uploadMedia(e.target.files[0]); }} />
                  </label>
                </div>
                {form.image && <img src={form.image} alt="preview" className="w-16 h-16 rounded-lg object-cover mt-2" />}
              </div>
            </>
          )}

          {sectionKey === 'about_programs' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Early Years" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (emoji)</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.icon} onChange={e => update('icon', e.target.value)} placeholder="👶" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Items (comma separated)</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.items} onChange={e => update('items', e.target.value)} placeholder="Pre-Nursery 1-2, Primary 1-5, JSS 1-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Foundation building for young learners" />
              </div>
            </>
          )}

          {sectionKey === 'about_programs_banner' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banner Text</label>
              <textarea rows={2} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.text} onChange={e => update('text', e.target.value)} placeholder="Complete curriculum with modern teaching methodologies" />
            </div>
          )}

          {sectionKey === 'vision' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Our Vision" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="To be the leading educational institution..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points (one per line)</label>
                <textarea rows={4} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.points} onChange={e => update('points', e.target.value)} placeholder="Holistic development of students&#10;Academic excellence with moral values&#10;Innovation in education" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quote</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.quote} onChange={e => update('quote', e.target.value)} placeholder="Shaping minds that will shape tomorrow" />
              </div>
            </>
          )}

          {sectionKey === 'mission' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Our Mission" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="To provide quality education..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points (one per line)</label>
                <textarea rows={4} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.points} onChange={e => update('points', e.target.value)} placeholder="Quality education for all&#10;Moral and ethical development&#10;Modern teaching methods" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quote</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.quote} onChange={e => update('quote', e.target.value)} placeholder="Educating today for a better tomorrow" />
              </div>
            </>
          )}

          {sectionKey === 'vision_values' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Excellence" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Striving for the highest standards..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.value} type="button" onClick={() => update('icon', opt.value)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border ${form.icon === opt.value ? 'bg-blue-950 text-white border-blue-950 dark:bg-yellow-400 dark:text-blue-950 dark:border-yellow-400' : 'border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <Icon className="w-4 h-4" /> {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {sectionKey === 'gallery_hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Gallery Album" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                <textarea rows={2} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.subtitle} onChange={e => update('subtitle', e.target.value)} placeholder="Explore our vibrant school community..." />
              </div>
            </>
          )}

          {sectionKey === 'gallery_items' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Students in the Classroom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Active learning environment" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.category} onChange={e => update('category', e.target.value)}>
                    <option value="photos">Photos</option>
                    <option value="videos">Videos</option>
                    <option value="events">Events</option>
                    <option value="facilities">Facilities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.type} onChange={e => update('type', e.target.value)}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input className="flex-1 border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.image} onChange={e => update('image', e.target.value)} placeholder="https://files.eliteedu.tech/..." />
                  <label className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm cursor-pointer ${uploading ? 'bg-gray-400' : 'bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950'} font-semibold`}>
                    <FiUpload className="w-4 h-4" />
                    {uploading ? '...' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={e => { if (e.target.files[0]) uploadMedia(e.target.files[0]); }} />
                  </label>
                </div>
                {form.image && <img src={form.image} alt="preview" className="w-20 h-14 rounded object-cover mt-2" />}
              </div>
              {form.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL (YouTube embed)</label>
                  <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.videoUrl} onChange={e => update('videoUrl', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                </div>
              )}
            </>
          )}

          {sectionKey === 'gallery_events_videos' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Title</label>
              <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="School's Events Videos" />
            </div>
          )}

          {sectionKey === 'gallery_highlights' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Modern Facilities" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.filter(c => c.value === 'blue' || c.value === 'red').map(opt => (
                    <button key={opt.value} type="button" onClick={() => update('color', opt.value)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white border ${form.color === opt.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''} ${opt.cls}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points (one per line)</label>
                <textarea rows={4} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.points} onChange={e => update('points', e.target.value)} placeholder="Well-equipped classrooms with modern teaching aids&#10;Science laboratories for practical learning&#10;Computer lab with internet connectivity" />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t dark:border-gray-700">
          <button onClick={onCancel} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-white">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded text-sm font-semibold flex items-center gap-1">
            <FiSave /> {editing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WebsiteData() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('core_values');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: () => api.get(`/website-sections/${SCHOOL_ID}`).then(r => r.data.data),
  });

  const section = sections.find(s => s.section_key === activeTab);

  const getItems = () => {
    if (!section) return [];
    const paragraphs = typeof section.paragraphs === 'string' ? JSON.parse(section.paragraphs) : (section.paragraphs || []);
    return paragraphs.map(p => {
      try { return { ...JSON.parse(p.text), _paraId: p.id }; }
      catch { return null; }
    }).filter(Boolean);
  };

  const saveMutation = useMutation({
    mutationFn: async (newParagraphs) => {
      return api.put(`/website-sections/${SCHOOL_ID}/${section.id}`, { paragraphs: newParagraphs });
    },
    onSuccess: () => {
      qc.invalidateQueries(['sections']);
      toast.success('Saved');
    },
    onError: () => toast.error('Save failed'),
  });

  const serializeItem = (c) => {
    const allowed = ['title','description','icon','status','color','level','grades','time','text','number','label','from','to','name','position','image','items','subtitle','tagline','points','quote'];
    const obj = {};
    allowed.forEach(k => { if (c[k] !== undefined) obj[k] = c[k]; });
    return JSON.stringify(obj);
  };

  const handleAdd = (item) => {
    const current = getItems();
    const newParagraphs = [
      ...current.map(c => ({ id: c._paraId, text: serializeItem(c) })),
      { id: uid(), text: JSON.stringify(item) },
    ];
    saveMutation.mutate(newParagraphs);
    setShowModal(false);
  };

  const handleEdit = (item) => {
    const current = getItems();
    const newParagraphs = current.map((c, i) => ({
      id: c._paraId,
      text: i === editingIdx ? JSON.stringify(item) : serializeItem(c),
    }));
    saveMutation.mutate(newParagraphs);
    setShowModal(false);
    setEditingItem(null);
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    const current = getItems();
    const newParagraphs = current.filter((_, i) => i !== idx).map(c => ({
      id: c._paraId,
      text: serializeItem(c),
    }));
    saveMutation.mutate(newParagraphs);
  };

  const handleMove = (idx, dir) => {
    const current = getItems();
    const swap = idx + dir;
    if (swap < 0 || swap >= current.length) return;
    [current[idx], current[swap]] = [current[swap], current[idx]];
    const newParagraphs = current.map(c => ({
      id: c._paraId,
      text: serializeItem(c),
    }));
    saveMutation.mutate(newParagraphs);
  };

  const openEdit = (item, idx) => {
    setEditingItem(item);
    setEditingIdx(idx);
    setShowModal(true);
  };

  const items = getItems();
  const tab = TABS.find(t => t.key === activeTab);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website Data</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage structured content sections</p>
        </div>
        {section && (
          <button onClick={() => { setEditingItem(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded-lg font-semibold hover:opacity-90">
            <FiPlus /> Add {tab?.itemLabel}
          </button>
        )}
      </div>

      {!section && !isLoading && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            No <strong>{activeTab}</strong> section found. Go to <a href="/admin/content" className="underline font-semibold">Content</a> and create a section with key <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{activeTab}</code> first.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b dark:border-gray-700">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-blue-950 dark:border-yellow-400 text-blue-950 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="text-center py-12 text-gray-400">Loading...</div>}

      {!isLoading && items.length === 0 && section && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-400 mb-4">No {tab?.itemLabel?.toLowerCase()}s yet</p>
          <button onClick={() => { setEditingItem(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded-lg font-semibold">
            <FiPlus /> Add {tab?.itemLabel}
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item._paraId || idx}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">

              <div className="flex flex-col gap-1">
                <button onClick={() => handleMove(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-20"><FiArrowUp className="w-4 h-4" /></button>
                <button onClick={() => handleMove(idx, 1)} disabled={idx === items.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-20"><FiArrowDown className="w-4 h-4" /></button>
              </div>

              <div className="flex-1 min-w-0">
                {activeTab === 'core_values' && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 flex items-center justify-center rounded-full">
                      {(() => { const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || FiTarget; return <Icon className="w-5 h-5" />; })()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'features' && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 flex items-center justify-center rounded-full">
                      {(() => { const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || FiBookOpen; return <Icon className="w-5 h-5" />; })()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'events' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${COLOR_OPTIONS.find(o => o.value === item.color)?.cls || 'bg-blue-500'}`} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold">{item.status}</span> — {item.description}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'programs' && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.level}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.grades} &middot; {item.time}</p>
                  </div>
                )}
                {activeTab === 'about_hero' && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.title || 'Welcome to'} — <span className="text-yellow-500">{item.subtitle}</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.tagline}</p>
                  </div>
                )}
                {activeTab === 'about_key_points' && (
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{item.text}</p>
                  </div>
                )}
                {activeTab === 'about_floating_stats' && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-950 dark:text-yellow-400">{item.number}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                  </div>
                )}
                {activeTab === 'about_stats' && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 flex items-center justify-center rounded-full">
                      {(() => { const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || FiTarget; return <Icon className="w-5 h-5" />; })()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.label} ({item.to})</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'about_staff' && (
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.position}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'about_programs' && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.icon} {item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description} — Items: {item.items}</p>
                  </div>
                )}
                {activeTab === 'about_programs_banner' && (
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{item.text}</p>
                  </div>
                )}
                {(activeTab === 'vision' || activeTab === 'mission') && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                  </div>
                )}
                {activeTab === 'vision_values' && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 flex items-center justify-center rounded-full">
                      {(() => { const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || FiTarget; return <Icon className="w-5 h-5" />; })()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'gallery_hero' && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.subtitle}</p>
                  </div>
                )}
                {activeTab === 'gallery_items' && (
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.title} className="w-12 h-10 rounded object-cover" />}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.category} &middot; {item.type}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'gallery_events_videos' && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                  </div>
                )}
                {activeTab === 'gallery_highlights' && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.color} &middot; {item.points?.split('\n').length || 0} points</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(item, idx)} className="p-2 text-blue-950 dark:text-yellow-400 hover:bg-blue-50 dark:hover:bg-yellow-400/10 rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm('Delete this item?')) handleDelete(idx); }} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ItemModal
          sectionKey={activeTab}
          editing={editingItem}
          onSave={editingItem ? handleEdit : handleAdd}
          onCancel={() => { setShowModal(false); setEditingItem(null); setEditingIdx(null); }}
        />
      )}
    </div>
  );
}
