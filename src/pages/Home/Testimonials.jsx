import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Farhana Akter',
    role: 'Backed 6 campaigns',
    quote: 'I watched a solar water pump campaign go from 20% to fully funded in three weeks. Getting the update posts from the creator made it feel real.',
    photo: 'https://i.pravatar.cc/150?img=47',
  },
  {
    name: 'Rakibul Hasan',
    role: 'Creator, Community category',
    quote: 'The withdrawal flow was straightforward once my campaign passed 200 credits raised. Payment history kept everything easy to track for my own records.',
    photo: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Sanjida Islam',
    role: 'Backed 14 campaigns',
    quote: 'Buying credits took under a minute, and I like that every contribution shows a clear pending or approved status instead of just a payment receipt.',
    photo: 'https://i.pravatar.cc/150?img=32',
  },
  {
    name: 'Tanvir Ahmed',
    role: 'Creator, Technology category',
    quote: 'Notifications told me the moment a supporter pledged, so approving contributions never felt like a backlog.',
    photo: 'https://i.pravatar.cc/150?img=8',
  },
];

const Testimonials = () => {
  return (
    <section className="bg-mist/60 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="From the community"
          title="What supporters and creators say"
          align="center"
        />

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 } }}
          className="mt-12 pb-12"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="flex h-full flex-col rounded-2xl border border-mist bg-white p-7">
                <Quote className="text-gold" size={26} />
                <p className="mt-4 flex-1 text-ink/75">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-mist pt-5">
                  <img src={t.photo} alt={t.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink/50">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
