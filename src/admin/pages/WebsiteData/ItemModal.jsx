import { useState, useCallback } from 'react';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiX, FiSave, FiUpload } from 'react-icons/fi';
import { ICON_OPTIONS, COLOR_OPTIONS } from './common';
import CropModal from '../../components/CropModal';

export default function ItemModal({ sectionKey, tabLabel, initialValue, onSave, onCancel }) {
  const [form, setForm] = useState(initialValue);
  const [uploading, setUploading] = useState(false);
  // Crop modal state
  const [cropModal, setCropModal] = useState({ open: false, file: null, callback: null, isMultiple: false });
  // Queue for multi-file uploads
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [processingMultiple, setProcessingMultiple] = useState(false);

  // ── Upload the actual file to server ──
  const doUpload = async (file, isMultiple = false) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data?.url || res.data?.data?.url || '';
    } catch {
      toast.error(`Upload failed: ${file.name}`);
      return '';
    }
  };

  // ── Open crop modal for a single file ──
  const openCropModal = (file, onCropped) => {
    setCropModal({ open: true, file, callback: onCropped, isMultiple: false });
  };

  // ── Handle crop complete for single upload ──
  const handleCropComplete = async (croppedFile) => {
    setUploading(true);
    setCropModal(p => ({ ...p, open: false }));
    const url = await doUpload(croppedFile);
    if (url) setForm(p => ({ ...p, image: url }));
    setUploading(false);
  };

  // ── Skip crop for single upload ──
  const handleSkipCrop = async () => {
    const file = cropModal.file;
    setUploading(true);
    setCropModal(p => ({ ...p, open: false }));
    const url = await doUpload(file);
    if (url) setForm(p => ({ ...p, image: url }));
    setUploading(false);
  };

  // ── Handle single file selection (opens crop modal) ──
  const uploadMedia = (file) => {
    openCropModal(file);
  };

  // ── Handle multiple file selection for hero carousel ──
  const uploadHeroImages = (files) => {
    const fileArray = Array.from(files);
    setUploadQueue(fileArray);
    setUploadResults([]);
    setProcessingMultiple(true);
    // Show crop modal for the first file
    setCropModal({ open: true, file: fileArray[0], callback: null, isMultiple: true });
  };

  // ── Handle crop/skip for multi-file hero uploads ──
  const processNextInQueue = useCallback((currentIndex, results) => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= uploadQueue.length) {
      // All done - save results
      if (results.length > 0) {
        setForm(p => ({
          ...p,
          images: [...(p.images || []), ...results],
        }));
      }
      setProcessingMultiple(false);
      setUploadQueue([]);
      setUploadResults([]);
      return;
    }
    // Show crop modal for next file
    setCropModal({ open: true, file: uploadQueue[nextIdx], callback: null, isMultiple: true });
  }, [uploadQueue]);

  const handleHeroCropComplete = async (croppedFile) => {
    setCropModal(p => ({ ...p, open: false }));
    setUploading(true);
    const url = await doUpload(croppedFile);
    setUploading(false);
    if (url) {
      const newResults = [...uploadResults, url];
      setUploadResults(newResults);
      const currentIdx = uploadQueue.indexOf(cropModal.file);
      if (currentIdx >= 0) processNextInQueue(currentIdx, newResults);
    }
  };

  const handleHeroSkipCrop = async () => {
    const file = cropModal.file;
    setCropModal(p => ({ ...p, open: false }));
    setUploading(true);
    const url = await doUpload(file);
    setUploading(false);
    if (url) {
      const newResults = [...uploadResults, url];
      setUploadResults(newResults);
      const currentIdx = uploadQueue.indexOf(file);
      if (currentIdx >= 0) processNextInQueue(currentIdx, newResults);
    }
  };

  const removeHeroImage = (idx) => {
    setForm(p => ({
      ...p,
      images: (p.images || []).filter((_, i) => i !== idx),
    }));
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
            {initialValue?.title ? 'Edit' : 'Add'} {tabLabel}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carousel Images (upload multiple for slideshow)</label>
                
                {/* Image list */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {(form.images && form.images.length > 0 ? form.images : (form.image ? [form.image] : [])).map((url, idx) => (
                    <div key={idx} className="relative group" style={{ width: 100, height: 70 }}>
                      <img src={url} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
                      <button
                        type="button"
                        onClick={() => removeHeroImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center rounded-b-lg">{idx + 1}</span>
                    </div>
                  ))}
                  {(!form.images || form.images.length === 0) && !form.image && (
                    <div className="w-full p-4 text-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm">
                      No images yet. Upload or paste URLs below.
                    </div>
                  )}
                </div>

                {/* Upload multiple */}
                <div className="flex gap-2 mb-2">
                  <input
                    className="flex-1 border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={form.imageUrlInput || ''}
                    onChange={e => update('imageUrlInput', e.target.value)}
                    placeholder="Paste image URL and press Add"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = (form.imageUrlInput || '').trim();
                      if (!url) return;
                      setForm(p => ({
                        ...p,
                        images: [...(p.images || []), url],
                        imageUrlInput: '',
                      }));
                    }}
                    className="px-3 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-600 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500"
                  >Add</button>
                </div>

                <div className="flex gap-2">
                  <label className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm cursor-pointer ${uploading ? 'bg-gray-400' : 'bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950'} font-semibold`}>
                    <FiUpload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Multiple'}
                    <input type="file" className="hidden" accept="image/*" multiple disabled={uploading} onChange={e => { if (e.target.files && e.target.files.length > 0) uploadHeroImages(e.target.files); }} />
                  </label>
                </div>
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

          {sectionKey === 'home_stats' && (
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
                  <input type="number" className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.to} onChange={e => update('to', Number(e.target.value))} placeholder="100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.label} onChange={e => update('label', e.target.value)} placeholder="Students" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suffix</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.suffix} onChange={e => update('suffix', e.target.value)} placeholder="+" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Enrolled across all programs" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number (alternative to from/to)</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.number} onChange={e => update('number', e.target.value)} placeholder="15+" />
              </div>
            </>
          )}

          {sectionKey === 'home_streams' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Science" />
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

          {sectionKey === 'pricing_hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Tuition and Fees" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                <textarea rows={2} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.subtitle} onChange={e => update('subtitle', e.target.value)} placeholder="Subtitle..." />
              </div>
            </>
          )}

          {sectionKey === 'pricing_tiers' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.grade} onChange={e => update('grade', e.target.value)} placeholder="SS 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Type</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.program_type} onChange={e => update('program_type', e.target.value)} placeholder="Science" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.status} onChange={e => update('status', e.target.value)}>
                  <option value="In Take">In Take</option>
                  <option value="Not In Take">Not In Take</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Boys Fee</label>
                  <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.boys_fee} onChange={e => update('boys_fee', e.target.value)} placeholder="₦50,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Girls Fee</label>
                  <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.girls_fee} onChange={e => update('girls_fee', e.target.value)} placeholder="₦45,000" />
                </div>
              </div>
            </>
          )}

          {sectionKey === 'pricing_payment_plans' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Full Payment" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Description..." />
              </div>
            </>
          )}

          {sectionKey === 'apply_hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Apply Now" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                <textarea rows={2} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.subtitle} onChange={e => update('subtitle', e.target.value)} placeholder="Begin your journey to excellence" />
              </div>
            </>
          )}

          {sectionKey === 'apply_requirements' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Admission Requirements" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Requirements description..." />
              </div>
            </>
          )}

          {sectionKey === 'apply_steps' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Step Number</label>
                <input type="number" min="1" className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.step} onChange={e => update('step', Number(e.target.value))} placeholder="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Step Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Complete Application Form" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Step description..." />
              </div>
            </>
          )}

          {sectionKey === 'exam_config' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Motto</label>
              <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.motto} onChange={e => update('motto', e.target.value)} placeholder="Excellence in Education" />
            </div>
          )}

          {sectionKey === 'exam_results_hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Results Checker" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                <textarea rows={2} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.subtitle} onChange={e => update('subtitle', e.target.value)} placeholder="Enter your admission number to check your results" />
              </div>
            </>
          )}

          {sectionKey === 'contact_info' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.type} onChange={e => update('type', e.target.value)}>
                  <option value="">Select type</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="address">Address</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Phone Number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text / Value</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.text} onChange={e => update('text', e.target.value)} placeholder="+234 800 000 0000" />
              </div>
            </>
          )}

          {sectionKey === 'contact_form' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Form Heading / Text</label>
              <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.text} onChange={e => update('text', e.target.value)} placeholder="Send us a message" />
            </div>
          )}

          {sectionKey === 'footer_links' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.label} onChange={e => update('label', e.target.value)} placeholder="About Us" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
                <input className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" value={form.url} onChange={e => update('url', e.target.value)} placeholder="/about" />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t dark:border-gray-700">
          <button onClick={onCancel} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-white">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded text-sm font-semibold flex items-center gap-1">
            <FiSave /> {initialValue?.title ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {/* Crop Modal */}
      <CropModal
        open={cropModal.open}
        file={cropModal.file}
        aspectRatio={null}
        onCrop={cropModal.isMultiple ? handleHeroCropComplete : handleCropComplete}
        onSkip={cropModal.isMultiple ? handleHeroSkipCrop : handleSkipCrop}
        onCancel={() => {
          setCropModal(p => ({ ...p, open: false }));
          if (processingMultiple) {
            setProcessingMultiple(false);
            setUploadQueue([]);
            setUploadResults([]);
          }
        }}
      />
    </div>
  );
}
