import { Link } from 'react-router-dom';
import { Cpu, Palette, Users, HeartPulse, Sprout, BookOpen } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';

const categories = [
  { name: 'Technology', icon: Cpu, image: 'https://picsum.photos/seed/cat-tech/500/500' },
  { name: 'Art', icon: Palette, image: 'https://picsum.photos/seed/cat-art/500/500' },
  { name: 'Community', icon: Users, image: 'https://picsum.photos/seed/cat-community/500/500' },
  { name: 'Health', icon: HeartPulse, image: 'https://picsum.photos/seed/cat-health/500/500' },
  { name: 'Environment', icon: Sprout, image: 'https://picsum.photos/seed/cat-env/500/500' },
  { name: 'Education', icon: BookOpen, image: 'https://picsum.photos/seed/cat-edu/500/500' },
];

const ExploreByCategory = () => {
  return (
    <section className="bg-mist/60 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Find your cause" title="Explore by category" />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, icon: Icon, image }) => (
            <Link
              key={name}
              to={`/explore-campaigns?category=${name}`}
              aria-label={`Explore ${name} campaigns`}
              className="focus-ring group relative overflow-hidden rounded-2xl"
            >
              <img
                src={image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="h-32 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
                <Icon size={16} className="text-gold" />
                <span className="text-sm font-medium text-paper">{name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreByCategory;
