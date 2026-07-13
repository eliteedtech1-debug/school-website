export const tabs = [
  { key: 'contact_info', label: 'Info Cards', itemLabel: 'Card', group: 'Contact' },
  { key: 'contact_form', label: 'Form Text', itemLabel: 'Text', group: 'Contact' },
];

export const defaults = {
  contact_info: { type: '', title: '', text: '' },
  contact_form: { text: '' },
};

export function renderItem(key, item) {
  switch (key) {
    case 'contact_info':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.type} — {item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.text}</p>
        </div>
      );
    case 'contact_form':
      return (
        <div>
          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{item.text}</p>
        </div>
      );
    default:
      return null;
  }
}
