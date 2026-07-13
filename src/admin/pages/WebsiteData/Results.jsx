export const tabs = [
  { key: 'exam_config', label: 'Exam Config', itemLabel: 'Config', group: 'Results' },
  { key: 'exam_results_hero', label: 'Results Hero', itemLabel: 'Hero', group: 'Results' },
];

export const defaults = {
  exam_config: { motto: 'Excellence in Education' },
  exam_results_hero: { title: 'Results Checker', subtitle: 'Enter your admission number to check your results' },
};

export function renderItem(key, item) {
  switch (key) {
    case 'exam_config':
      return (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">Motto: {item.motto}</p>
        </div>
      );
    case 'exam_results_hero':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.subtitle}</p>
        </div>
      );
    default:
      return null;
  }
}
