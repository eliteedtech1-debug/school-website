export const tabs = [
  { key: 'apply_hero', label: 'Apply Hero', itemLabel: 'Hero', group: 'Admission' },
  { key: 'apply_requirements', label: 'Requirements', itemLabel: 'Requirement', group: 'Admission' },
  { key: 'apply_steps', label: 'Steps', itemLabel: 'Step', group: 'Admission' },
];

export const defaults = {
  apply_hero: { title: 'Apply Now', subtitle: 'Begin your journey to excellence' },
  apply_requirements: { title: '', description: '' },
  apply_steps: { step: 1, title: '', description: '' },
};

export function renderItem(key, item) {
  switch (key) {
    case 'apply_hero':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.subtitle}</p>
        </div>
      );
    case 'apply_requirements':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
        </div>
      );
    case 'apply_steps':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Step {item.step}: {item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
        </div>
      );
    default:
      return null;
  }
}
