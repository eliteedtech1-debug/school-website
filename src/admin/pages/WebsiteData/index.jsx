import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import ItemModal from './ItemModal';

import { tabs as homeTabs, defaults as homeDefaults, renderItem as homeRender } from './Home';
import { tabs as aboutTabs, defaults as aboutDefaults, renderItem as aboutRender } from './About';
import { tabs as galleryTabs, defaults as galleryDefaults, renderItem as galleryRender } from './Gallery';
import { tabs as pricingTabs, defaults as pricingDefaults, renderItem as pricingRender } from './Pricing';
import { tabs as admissionTabs, defaults as admissionDefaults, renderItem as admissionRender } from './Admission';
import { tabs as resultsTabs, defaults as resultsDefaults, renderItem as resultsRender } from './Results';
import { tabs as contactTabs, defaults as contactDefaults, renderItem as contactRender } from './Contact';
import { tabs as footerTabs, defaults as footerDefaults, renderItem as footerRender } from './Footer';

const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;
const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;

const TABS = [
  ...homeTabs,
  ...aboutTabs,
  ...galleryTabs,
  ...pricingTabs,
  ...admissionTabs,
  ...resultsTabs,
  ...contactTabs,
  ...footerTabs,
];

const DEFAULTS = {
  ...homeDefaults,
  ...aboutDefaults,
  ...galleryDefaults,
  ...pricingDefaults,
  ...admissionDefaults,
  ...resultsDefaults,
  ...contactDefaults,
  ...footerDefaults,
};

function defaultValue(key) {
  return DEFAULTS[key] || {};
}

function renderItem(key, item) {
  return (
    homeRender(key, item) ||
    aboutRender(key, item) ||
    galleryRender(key, item) ||
    pricingRender(key, item) ||
    admissionRender(key, item) ||
    resultsRender(key, item) ||
    contactRender(key, item) ||
    footerRender(key, item) || (
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">{item.title || item.label || 'Item'}</p>
      </div>
    )
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
    queryFn: () => api.get(`/website-sections?school_id=${encodeURIComponent(SCHOOL_ID)}`).then(r => r.data.data),
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
      return api.put(`/website-sections/${section.id}?school_id=${encodeURIComponent(SCHOOL_ID)}`, { paragraphs: newParagraphs });
    },
    onSuccess: () => {
      qc.invalidateQueries(['sections']);
      toast.success('Saved');
    },
    onError: () => toast.error('Save failed'),
  });

  const serializeItem = (c) => {
    const allowed = ['title','description','icon','status','color','level','grades','time','text','number','label','from','to','name','position','image','images','items','subtitle','tagline','points','quote','suffix','step','program_type','boys_fee','girls_fee','type','category','videoUrl','motto','url'];
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

      <div className="flex gap-1 mb-6 border-b dark:border-gray-700 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.key ? 'border-blue-950 dark:border-yellow-400 text-blue-950 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}>
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
                {renderItem(activeTab, item)}
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
          tabLabel={tab?.itemLabel}
          initialValue={editingItem || defaultValue(activeTab)}
          onSave={editingItem ? handleEdit : handleAdd}
          onCancel={() => { setShowModal(false); setEditingItem(null); setEditingIdx(null); }}
        />
      )}
    </div>
  );
}
