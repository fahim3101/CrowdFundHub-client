import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';

const NotificationBell = () => {
  const { user, role, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // Wait until auth is fully loaded and role is available
  useEffect(() => {
    if (!user?.email || loading || !role) return;
    axiosSecure.get(`/notifications/${user.email}`).then((res) => setNotifications(res.data));
  }, [user, role, loading, axiosSecure]);

  // clicking anywhere on the page hides the popup, per the spec
  useEffect(() => {
    const handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="focus-ring relative rounded-full p-2 text-ink/70 hover:bg-mist"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brick" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-mist bg-white shadow-xl">
          <p className="border-b border-mist px-4 py-3 text-sm font-semibold text-ink">Notifications</p>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-ink/50">Nothing here yet</p>
            )}
            {notifications.map((n) => (
              <Link
                key={n._id}
                to={n.actionRoute}
                onClick={() => setOpen(false)}
                className="block border-b border-mist px-4 py-3 text-sm text-ink/80 last:border-0 hover:bg-paper"
              >
                {n.message}
                <span className="mt-1 block font-mono text-[11px] text-ink/40">
                  {new Date(n.time).toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
