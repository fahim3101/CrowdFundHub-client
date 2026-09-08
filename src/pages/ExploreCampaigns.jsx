import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';
import CampaignCard from '../components/CampaignCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SectionHeading from '../components/SectionHeading';

const categories = ['all', 'Technology', 'Art', 'Community', 'Health', 'Environment', 'Education'];

const ExploreCampaigns = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || '';

  // Debounce typing so we don't DDoS the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category !== 'all') params.set('category', category);
    if (sort) params.set('sort', sort);

    axios
      .get(`${import.meta.env.VITE_API_URL}/campaigns?${params.toString()}`)
      .then((res) => setCampaigns(res.data))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, sort]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <SectionHeading eyebrow="Live right now" title="Explore campaigns" />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by title…"
            className="focus-ring w-full rounded-full border border-mist bg-white py-2.5 pl-10 pr-4 text-sm outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setSearchParams((p) => { p.set('category', e.target.value); return p; })}
          className="focus-ring rounded-full border border-mist bg-white px-4 py-2.5 text-sm outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSearchParams((p) => { p.set('sort', e.target.value); return p; })}
          className="focus-ring rounded-full border border-mist bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option value="">Sort by</option>
          <option value="deadline">Deadline: soonest</option>
          <option value="goal-asc">Funding goal: low to high</option>
          <option value="goal-desc">Funding goal: high to low</option>
        </select>
      </div>

      <div className="mt-10">
        {loading ? (
          <LoadingSpinner full={false} />
        ) : campaigns.length === 0 ? (
          <p className="py-16 text-center text-ink/50">No campaigns match your search yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCampaigns;
