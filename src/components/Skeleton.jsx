export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={{ minHeight: '1em' }}
    />
  );
}

export function CardSkeleton({ count = 3, cols = 3 }) {
  const gridCols = cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return (
    <div className={`grid ${gridCols} gap-8`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 text-center">
          <Skeleton className="w-20 h-20 mx-auto rounded-full mb-6" />
          <Skeleton className="h-5 w-3/4 mx-auto mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function StatSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="text-center">
          <Skeleton className="w-16 h-16 mx-auto rounded-full mb-4" />
          <Skeleton className="h-8 w-20 mx-auto mb-2" />
          <Skeleton className="h-4 w-16 mx-auto mb-1" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
}
