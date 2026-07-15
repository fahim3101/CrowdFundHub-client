import { Search, HandCoins, TrendingUp } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discover a campaign',
    body: 'Browse live campaigns by category, or search for a cause you already care about.',
  },
  {
    number: '02',
    icon: HandCoins,
    title: 'Pledge your credits',
    body: 'Contribute any amount above the minimum. The creator reviews and approves your pledge.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Watch it grow',
    body: 'Track the campaign\u2019s progress bar, get update notifications, and see your contribution counted the moment it\u2019s approved.',
  },
];

const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading eyebrow="The process" title="How it works" align="center" />

      <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {steps.map(({ number, icon: Icon, title, body }, i) => (
          <div key={number} className="relative pl-2">
            <span className="font-mono text-5xl font-semibold text-mist">{number}</span>
            <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-pine text-paper">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-ink/65">{body}</p>
            {i < steps.length - 1 && (
              <div className="progress-rule mt-6 hidden sm:block">
                <span style={{ width: '100%' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
