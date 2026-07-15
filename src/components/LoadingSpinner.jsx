const LoadingSpinner = ({ full = true }) => {
  return (
    <div className={full ? 'flex min-h-[60vh] items-center justify-center' : 'flex items-center justify-center py-10'}>
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-mist border-t-pine" />
        <p className="font-mono text-xs uppercase tracking-widest text-pine/70">Loading</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
