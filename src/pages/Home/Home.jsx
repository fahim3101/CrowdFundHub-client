import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from './Hero';
import TopFunded from './TopFunded';
import HowItWorks from './HowItWorks';
import ExploreByCategory from './ExploreByCategory';
import Testimonials from './Testimonials';
import ImpactInNumbers from './ImpactInNumbers';
import Reveal from '../../components/Reveal';

const Home = () => {
  return (
    <div>
      <Hero />
      <Reveal><TopFunded /></Reveal>
      <Reveal><HowItWorks /></Reveal>
      <Reveal><ExploreByCategory /></Reveal>
      <Testimonials />
      <Reveal><ImpactInNumbers /></Reveal>

      <Reveal>
        <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">Have a project worth funding?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/65">
            Register as a creator, launch your campaign, and start collecting contributions once it's approved.
          </p>
          <Link
            to="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-pine px-7 py-3 text-sm font-semibold text-paper transition hover:bg-pine-dark"
          >
            Start a Campaign <ArrowRight size={16} />
          </Link>
        </section>
      </Reveal>
    </div>
  );
};

export default Home;
