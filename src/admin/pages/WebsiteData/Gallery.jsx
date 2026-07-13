export const tabs = [
  { key: 'gallery_hero', label: 'Gallery Hero', itemLabel: 'Hero', group: 'Gallery' },
  { key: 'gallery_items', label: 'Gallery Items', itemLabel: 'Item', group: 'Gallery' },
  { key: 'gallery_events_videos', label: 'Events Videos Title', itemLabel: 'Title', group: 'Gallery' },
  { key: 'gallery_highlights', label: 'Highlights', itemLabel: 'Section', group: 'Gallery' },
];

export const defaults = {
  gallery_hero: { title: 'Gallery Album', subtitle: 'Explore our vibrant school community through photos and videos' },
  gallery_items: { title: '', description: '', category: 'photos', type: 'image', image: '', videoUrl: '' },
  gallery_events_videos: { title: "School's Events Videos" },
  gallery_highlights: { title: '', color: 'blue', points: '' },
};

export function renderItem(key, item) {
  switch (key) {
    case 'gallery_hero':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.subtitle}</p>
        </div>
      );
    case 'gallery_items':
      return (
        <div className="flex items-center gap-3">
          {item.image && <img src={item.image} alt={item.title} className="w-12 h-10 rounded object-cover" />}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.category} &middot; {item.type}</p>
          </div>
        </div>
      );
    case 'gallery_events_videos':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
        </div>
      );
    case 'gallery_highlights':
      return (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.color} &middot; {item.points?.split('\n').length || 0} points</p>
        </div>
      );
    default:
      return null;
  }
}
