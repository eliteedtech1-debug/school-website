import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiEye, FiEyeOff,
  FiArrowUp, FiArrowDown, FiUpload, FiImage
} from 'react-icons/fi';

const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;

/* ── tiny helpers ── */
const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;

function SectionForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [key, setKey] = useState(initial?.section_key ?? '');
  return (
    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <input
        className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="Section title (e.g. About Us)"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="Section key (e.g. about) — auto-generated if blank"
        value={key}
        onChange={e => setKey(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
      />
      <div className="flex gap-2">
        <button onClick={() => onSave({ title, section_key: key })}
          className="px-4 py-2 bg-blue-950 text-white rounded text-sm flex items-center gap-1">
          <FiSave /> Save
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded text-sm flex items-center gap-1">
          <FiX /> Cancel
        </button>
      </div>
    </div>
  );
}

function ParagraphEditor({ paragraphs, onChange }) {
  const add = () => onChange([...paragraphs, { id: uid(), text: '', order: paragraphs.length }]);
  const remove = id => onChange(paragraphs.filter(p => p.id !== id));
  const update = (id, text) => onChange(paragraphs.map(p => p.id === id ? { ...p, text } : p));
  const displayText = (t) => typeof t === 'string' ? t : (t ? JSON.stringify(t, null, 2) : '');

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Paragraphs</label>
      {paragraphs.map((p, i) => (
        <div key={p.id} className="flex gap-2 items-start">
          <span className="text-xs text-gray-400 pt-2 w-5">{i + 1}</span>
          <textarea
            className="flex-1 border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 resize-none"
            rows={3}
            value={displayText(p.text)}
            onChange={e => update(p.id, e.target.value)}
            placeholder="Paragraph text..."
          />
          <button onClick={() => remove(p.id)} className="mt-2 text-red-500 hover:text-red-700">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1 text-sm text-blue-950 dark:text-yellow-400 hover:underline">
        <FiPlus /> Add Paragraph
      </button>
    </div>
  );
}

function MediaEditor({ media, onChange }) {
  const [uploading, setUploading] = useState(false);

  const add = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange([...media, {
        id: uid(),
        url: data.url,
        thumbnail_url: data.thumbnail_url || data.url,
        type: 'image',
        caption: '',
        order: media.length,
      }]);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = id => onChange(media.filter(m => m.id !== id));
  const updateCaption = (id, caption) => onChange(media.map(m => m.id === id ? { ...m, caption } : m));

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Media</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {media.map(m => (
          <div key={m.id} className="relative group border rounded-lg overflow-hidden dark:border-gray-600">
            <img src={m.thumbnail_url || m.url} alt={m.caption} className="w-full h-28 object-cover" />
            <input
              className="w-full border-t px-2 py-1 text-xs dark:bg-gray-800 dark:text-white dark:border-gray-600"
              placeholder="Caption..."
              value={m.caption}
              onChange={e => updateCaption(m.id, e.target.value)}
            />
            <button
              onClick={() => remove(m.id)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <FiX className="w-3 h-3" />
            </button>
          </div>
        ))}

        <label className={`flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-950 dark:border-gray-600 dark:hover:border-yellow-400 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? <span className="text-xs text-gray-400">Uploading...</span> : (
            <>
              <FiUpload className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Add Image</span>
            </>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={add} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

function SectionEditor({ section, onClose }) {
  const qc = useQueryClient();
  const [paragraphs, setParagraphs] = useState(
    typeof section.paragraphs === 'string' ? JSON.parse(section.paragraphs) : (section.paragraphs || [])
  );
  const [media, setMedia] = useState(
    typeof section.media === 'string' ? JSON.parse(section.media) : (section.media || [])
  );

  const save = useMutation({
    mutationFn: () => api.put(`/website-sections/${SCHOOL_ID}/${section.id}`, { paragraphs, media }),
    onSuccess: () => { qc.invalidateQueries(['sections']); toast.success('Saved'); onClose(); },
    onError: () => toast.error('Save failed'),
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white">{section.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX className="w-5 h-5" /></button>
        </div>

        <ParagraphEditor paragraphs={paragraphs} onChange={setParagraphs} />
        <MediaEditor media={media} onChange={setMedia} />

        <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-white">Cancel</button>
          <button
            onClick={() => save.mutate()}
            disabled={save.isLoading}
            className="px-5 py-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded text-sm font-semibold flex items-center gap-1">
            <FiSave /> {save.isLoading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Content() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null); // section object

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: () => api.get(`/website-sections/${SCHOOL_ID}`).then(r => r.data.data),
  });

  const createSection = useMutation({
    mutationFn: (body) => api.post(`/website-sections/${SCHOOL_ID}`, body),
    onSuccess: () => { qc.invalidateQueries(['sections']); setAdding(false); toast.success('Section created'); },
    onError: () => toast.error('Failed to create'),
  });

  const toggleVisible = useMutation({
    mutationFn: ({ id, is_visible }) => api.put(`/website-sections/${SCHOOL_ID}/${id}`, { is_visible }),
    onSuccess: () => qc.invalidateQueries(['sections']),
  });

  const deleteSection = useMutation({
    mutationFn: (id) => api.delete(`/website-sections/${SCHOOL_ID}/${id}`),
    onSuccess: () => { qc.invalidateQueries(['sections']); toast.success('Deleted'); },
    onError: () => toast.error('Delete failed'),
  });

  const moveSection = useMutation({
    mutationFn: (items) => api.put(`/website-sections/${SCHOOL_ID}/reorder`, items),
    onSuccess: () => qc.invalidateQueries(['sections']),
  });

  const move = (idx, dir) => {
    const next = [...sections];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    moveSection.mutate(next.map((s, i) => ({ id: s.id, order_index: i })));
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading sections…</div>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {editing && <SectionEditor section={editing} onClose={() => setEditing(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website Content</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Each section appears on your public website. Drag to reorder, click Edit to update content.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
          Preview Site ↗
        </a>
      </div>

      <div className="space-y-3 mb-6">
        {sections.map((s, i) => (
          <div key={s.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
            {/* Order buttons */}
            <div className="flex flex-col gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-20">
                <FiArrowUp className="w-4 h-4" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-20">
                <FiArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Section info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">{s.title}</p>
              <p className="text-xs text-gray-400 font-mono">{s.section_key}</p>
              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                <span>{(typeof s.paragraphs === 'string' ? JSON.parse(s.paragraphs) : s.paragraphs || []).length} paragraph(s)</span>
                <span>{(typeof s.media === 'string' ? JSON.parse(s.media) : s.media || []).length} image(s)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisible.mutate({ id: s.id, is_visible: s.is_visible ? 0 : 1 })}
                title={s.is_visible ? 'Hide section' : 'Show section'}
                className={`p-2 rounded-lg ${s.is_visible ? 'text-green-600 bg-green-50 dark:bg-green-900/30' : 'text-gray-400 bg-gray-100 dark:bg-gray-700'}`}>
                {s.is_visible ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setEditing(s)}
                className="p-2 text-blue-950 dark:text-yellow-400 bg-blue-50 dark:bg-yellow-400/10 rounded-lg hover:bg-blue-100 dark:hover:bg-yellow-400/20">
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { if (confirm('Delete this section?')) deleteSection.mutate(s.id); }}
                className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FiImage className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No sections yet. Add your first one below.</p>
          </div>
        )}
      </div>

      {/* Add section */}
      {adding ? (
        <SectionForm
          onSave={(body) => createSection.mutate(body)}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          <FiPlus /> Add Section
        </button>
      )}
    </div>
  );
}
