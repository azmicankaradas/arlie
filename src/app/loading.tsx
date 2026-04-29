export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-arlie-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo pulse */}
        <div className="w-12 h-12 rounded-full bg-arlie-light animate-pulse" />

        {/* Shimmer bars */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-32 h-1.5 bg-arlie-light rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-arlie-beige rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
        </div>

        <p className="font-sans text-xs uppercase tracking-[0.3em] text-arlie-charcoal/20">
          Yükleniyor
        </p>
      </div>
    </div>
  );
}
