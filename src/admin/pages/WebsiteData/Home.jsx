import { ICON_OPTIONS, COLOR_OPTIONS } from './common';
import { FiTarget, FiBookOpen } from 'react-icons/fi';

export const tabs = [
  { key: 'hero', label: 'Hero Section', itemLabel: 'Hero', group: 'Home' },
  { key: 'home_stats', label: 'Stats', itemLabel: 'Stat', group: 'Home' },
  { key: 'home_streams', label: 'Academic Streams', itemLabel: 'Stream', group: 'Home' },
  { key: 'core_values', label: 'Core Values', itemLabel: 'Value', group: 'Home' },
  { key: 'features', label: 'Why Choose Us', itemLabel: 'Feature', group: 'Home' },
  { key: 'events', label: 'Events', itemLabel: 'Event', group: 'Home' },
  { key: 'programs', label: 'Programs', itemLabel: 'Program', group: 'Home' },
];

export const defaults = {
  hero: { title: 'Welcome to Dr. Kabiru Gwarzo Academy', subtitle: '& Tahfeez — Strive for Excellence', image: '', images: [] },
  home_stats: { icon: 'users', from: 0, to: 100, label: '', description: '', number: '', suffix: '+' },
  home_streams: { title: '', description: '', icon: 'book' },
  core_values: { title: '', description: '', icon: 'target' },
  features: { title: '', description: '', icon: 'book' },
  events: { title: '', status: '', description: '', color: 'blue' },
  programs: { level: '', grades: '', time: '' },
};

export function renderItem(key, item) {
  switch (key) {
    case 'core_values': {
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
    case 'features': {
      const Icon = ICON_OPTIONS.find(o => o.value === item.icon)?.icon || FiBookOpen;
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
    case 'events': {
      const colorCls = COLOR_OPTIONS.find(o => o.value === item.color)?.cls || 'bg-blue-500';
      return (
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colorCls}`} />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold">{item.status}</span> — {item.description}</p>
          </div>
        </div>
      );
    }
    case 'programs':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.level}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.grades} &middot; {item.time}</p>
        </div>
      );
    default:
      return null;
  }
}
