import { ICON_OPTIONS } from './common';
import { FiTarget } from 'react-icons/fi';

export const tabs = [
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
];

export const defaults = {
  about_hero: { title: 'Welcome to', subtitle: 'Our Academic Community', tagline: '' },
  about_key_points: { text: '' },
  about_floating_stats: { number: '', label: '' },
  about_stats: { icon: 'users', from: 0, to: 100, label: '', description: '' },
  about_staff: { name: '', position: '', image: '' },
  about_programs: { title: '', icon: '', items: '', description: '' },
  about_programs_banner: { text: 'Complete curriculum with modern teaching methodologies' },
  vision: { title: 'Our Vision', description: '', points: '', quote: '' },
  mission: { title: 'Our Mission', description: '', points: '', quote: '' },
  vision_values: { title: '', description: '', icon: 'star' },
};

export function renderItem(key, item) {
  switch (key) {
    case 'about_hero':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title || 'Welcome to'} — <span className="text-yellow-500">{item.subtitle}</span></p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.tagline}</p>
        </div>
      );
    case 'about_key_points':
      return (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">{item.text}</p>
        </div>
      );
    case 'about_floating_stats':
      return (
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-blue-950 dark:text-yellow-400">{item.number}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
        </div>
      );
    case 'about_stats': {
      const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || FiTarget;
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 flex items-center justify-center rounded-full">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{item.from}–{item.to} {item.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
          </div>
        </div>
      );
    }
    case 'about_staff':
      return (
        <div className="flex items-center gap-3">
          {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.position}</p>
          </div>
        </div>
      );
    case 'about_programs':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.icon} {item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description} — Items: {item.items}</p>
        </div>
      );
    case 'about_programs_banner':
      return (
        <div>
          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{item.text}</p>
        </div>
      );
    case 'vision':
    case 'mission':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
        </div>
      );
    case 'vision_values': {
      const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || FiTarget;
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 flex items-center justify-center rounded-full">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}
