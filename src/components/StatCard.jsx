const StatCard = ({ icon: Icon, label, value, tone = 'pine' }) => {
  const tones = {
    pine: 'bg-pine/10 text-pine',
    gold: 'bg-gold/15 text-gold-dark',
    brick: 'bg-brick/10 text-brick',
  };

  return (
    <div className="rounded-2xl border border-mist bg-white p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={19} />
      </div>
      <p className="figures mt-4 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink/55">{label}</p>
    </div>
  );
};

export default StatCard;
