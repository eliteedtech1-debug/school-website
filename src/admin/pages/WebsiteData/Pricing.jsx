export const tabs = [
  { key: 'pricing_hero', label: 'Pricing Hero', itemLabel: 'Hero', group: 'Pricing' },
  { key: 'pricing_tiers', label: 'Fee Tiers', itemLabel: 'Tier', group: 'Pricing' },
  { key: 'pricing_payment_plans', label: 'Payment Plans', itemLabel: 'Plan', group: 'Pricing' },
];

export const defaults = {
  pricing_hero: { title: 'Tuition and Fees', subtitle: '' },
  pricing_tiers: { grade: '', program_type: '', status: 'In Take', boys_fee: '', girls_fee: '' },
  pricing_payment_plans: { title: '', description: '' },
};

export function renderItem(key, item) {
  switch (key) {
    case 'pricing_hero':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.subtitle}</p>
        </div>
      );
    case 'pricing_tiers':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.grade} — {item.program_type}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.status} &middot; Boys: {item.boys_fee} &middot; Girls: {item.girls_fee}</p>
        </div>
      );
    case 'pricing_payment_plans':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
        </div>
      );
    default:
      return null;
  }
}
