const CampaignSkeleton = () => (
  <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-mist bg-white" aria-hidden="true">
    <div className="h-44 bg-mist" />
    <div className="flex flex-1 flex-col gap-3 p-5">
      <div className="h-5 w-3/4 rounded bg-mist" />
      <div className="h-4 w-1/2 rounded bg-mist" />
      <div className="mt-2 h-[6px] w-full rounded-full bg-mist" />
      <div className="flex justify-between">
        <div className="h-4 w-24 rounded bg-mist" />
        <div className="h-4 w-16 rounded bg-mist" />
      </div>
    </div>
  </div>
);

export default CampaignSkeleton;
