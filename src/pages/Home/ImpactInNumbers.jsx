import SectionHeading from '../../components/SectionHeading';

const stats = [
  { value: '1,204', label: 'Campaigns funded' },
  { value: '38,600', label: 'Credits contributed' },
  { value: '9,150', label: 'Supporters onboard' },
  { value: '$4,930', label: 'Paid out to creators' },
];

const ImpactInNumbers = () => {
  return (
    <section className="bg-ink py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Platform impact" title="The numbers so far" align="center" invert />

        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="figures text-3xl font-semibold text-gold sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-paper/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactInNumbers;
