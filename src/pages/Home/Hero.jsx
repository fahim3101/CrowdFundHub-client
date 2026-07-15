import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    eyebrow: '1,204 campaigns funded so far',
    title: 'Back what your community is building.',
    body: 'Discover campaigns from real creators — technology, art, community projects, and health causes — and support them with platform credits.',
    image: 'https://picsum.photos/seed/hero-community/1600/900',
  },
  {
    eyebrow: 'For creators',
    title: 'Turn an idea into a funded campaign.',
    body: 'Set a goal, tell your story, and let supporters pledge credits toward the reward tiers you design.',
    image: 'https://picsum.photos/seed/hero-creator/1600/900',
  },
  {
    eyebrow: 'Transparent, credit by credit',
    title: 'Every contribution is tracked, start to finish.',
    body: 'Follow a pledge from pending to approved, watch a goal fill up in real time, and see exactly where support comes from.',
    image: 'https://picsum.photos/seed/hero-ledger/1600/900',
  },
];

const Hero = () => {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="hero-swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative flex min-h-[560px] items-center overflow-hidden bg-ink sm:min-h-[620px]">
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
              <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:px-8">
                <p className="animate-hero-in font-mono text-xs uppercase tracking-[0.25em] text-gold">{slide.eyebrow}</p>
                <h1 className="animate-hero-in mt-4 text-4xl font-semibold leading-tight text-paper sm:text-6xl">
                  {slide.title}
                </h1>
                <p className="animate-hero-in-delay mx-auto mt-5 max-w-xl text-base text-paper/70 sm:text-lg">{slide.body}</p>
                <div className="animate-hero-in-delay mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/explore-campaigns"
                    className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light"
                  >
                    Explore Campaigns <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full border border-paper/30 px-6 py-3 text-sm font-semibold text-paper transition hover:border-gold hover:text-gold"
                  >
                    Start a Campaign
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
