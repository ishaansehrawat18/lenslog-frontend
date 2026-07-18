export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />;
}

export function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-black" />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

export default Loader;