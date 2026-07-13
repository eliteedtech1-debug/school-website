import { FiExternalLink } from 'react-icons/fi';

export const tabs = [
  { key: 'footer_links', label: 'Quick Links', itemLabel: 'Link', group: 'Footer' },
];

export const defaults = {
  footer_links: { label: '', url: '' },
};

export function renderItem(key, item) {
  switch (key) {
    case 'footer_links':
      return (
        <div className="flex items-center gap-3">
          <FiExternalLink className="w-4 h-4 text-gray-400" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{item.label} ({item.url})</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}
