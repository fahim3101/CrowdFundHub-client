import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const LIMIT = 5;

const MyContributions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [contributions, setContributions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    axiosSecure
      .get(`/contributions/supporter/${user.email}?page=${page}&limit=${LIMIT}`)
      .then((res) => {
        setContributions(res.data.contributions);
        setTotal(res.data.total);
      })
      .catch(() => {
        setContributions([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [user, axiosSecure, page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">My Contributions</h1>
      <p className="mt-1 text-sm text-ink/55">Every pledge you've made, and where it stands.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white">
        {loading ? (
          <LoadingSpinner full={false} />
        ) : contributions.length === 0 ? (
          <EmptyState
            title="You haven't contributed to any campaign yet"
            body="Explore campaigns to find one worth backing."
            action={
              <Link to="/dashboard/explore-campaigns" className="rounded-full bg-pine px-5 py-2 text-sm font-semibold text-paper hover:bg-pine-dark">
                Explore campaigns
              </Link>
            }
          />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-mist bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3">Creator</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={c._id} className="border-b border-mist last:border-0">
                  <td className="px-5 py-3">{c.campaign_title}</td>
                  <td className="px-5 py-3 text-ink/60">{c.creator_name}</td>
                  <td className="figures px-5 py-3">{c.contribution_amount}</td>
                  <td className="px-5 py-3 text-ink/50">{new Date(c.current_date).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Contributions pages" className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
            className="focus-ring rounded-full border border-mist p-2 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={page === i ? 'page' : undefined}
              className={`focus-ring h-8 w-8 rounded-full text-sm font-medium ${
                page === i ? 'bg-pine text-paper' : 'text-ink/60 hover:bg-mist'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            aria-label="Next page"
            className="focus-ring rounded-full border border-mist p-2 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default MyContributions;
