const EmptyState = ({ title, body }) => (
  <div className="rounded-2xl border border-dashed border-mist bg-white/60 px-6 py-14 text-center">
    <p className="font-medium text-ink/70">{title}</p>
    {body && <p className="mt-1 text-sm text-ink/45">{body}</p>}
  </div>
);

export default EmptyState;
