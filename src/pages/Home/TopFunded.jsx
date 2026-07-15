import { useEffect, useState } from 'react';
import axios from 'axios';
import SectionHeading from '../../components/SectionHeading';
import CampaignCard from '../../components/CampaignCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const TopFunded = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/campaigns/top-funded`)
      .then((res) => setCampaigns(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && campaigns.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Leading the board"
        title="Top funded campaigns"
        subtitle="The six campaigns that have raised the most credits from supporters right now."
      />
      {loading ? (
        <LoadingSpinner full={false} />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c._id} campaign={c} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopFunded;
