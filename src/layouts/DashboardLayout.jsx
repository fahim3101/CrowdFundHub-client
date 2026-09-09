import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Home, Compass, HandCoins, Wallet, Receipt, PlusCircle, Layers, Landmark,
  Users, Flag, Menu, X, Coins, UserRound,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import NotificationBell from '../components/NotificationBell';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

const navByRole = {
  supporter: [
    { to: '/dashboard/supporter-home', label: 'Home', icon: Home },
    { to: '/dashboard/explore-campaigns', label: 'Explore Campaigns', icon: Compass },
    { to: '/dashboard/my-contributions', label: 'My Contributions', icon: HandCoins },
    { to: '/dashboard/purchase-credit', label: 'Purchase Credit', icon: Wallet },
    { to: '/dashboard/payment-history', label: 'Payment History', icon: Receipt },
    { to: '/dashboard/profile', label: 'My Profile', icon: UserRound },
  ],
  creator: [
    { to: '/dashboard/creator-home', label: 'Home', icon: Home },
    { to: '/dashboard/add-campaign', label: 'Add New Campaign', icon: PlusCircle },
    { to: '/dashboard/my-campaigns', label: 'My Campaigns', icon: Layers },
    { to: '/dashboard/withdrawals', label: 'Withdrawals', icon: Landmark },
    { to: '/dashboard/payment-history', label: 'Payment History', icon: Receipt },
    { to: '/dashboard/profile', label: 'My Profile', icon: UserRound },
  ],
  admin: [
    { to: '/dashboard/admin-home', label: 'Home', icon: Home },
    { to: '/dashboard/manage-users', label: 'Manage Users', icon: Users },
    { to: '/dashboard/manage-campaigns', label: 'Manage Campaigns', icon: Layers },
    { to: '/dashboard/withdrawal-requests', label: 'Withdrawal Requests', icon: Landmark },
    { to: '/dashboard/reports', label: 'Reports', icon: Flag },
    { to: '/dashboard/profile', label: 'My Profile', icon: UserRound },
  ],
};

const DashboardLayout = () => {
  const { user, role, credits, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (!role)
    return (
      <div className="py-24 text-center">
        <p className="text-ink/60">Could not load your dashboard role. Your session may have expired.</p>
        <Link to="/login" className="mt-4 inline-block rounded-full bg-pine px-6 py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark">
          Back to login
        </Link>
      </div>
    );

  const items = navByRole[role] || [];

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-mist bg-white transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-mist px-5 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pine font-display text-lg font-semibold text-paper">C</span>
            <span className="font-display text-lg font-semibold text-ink">CrowdFundHub</span>
          </Link>
          <button className="md:hidden focus-ring rounded-lg p-1" aria-label="Close menu" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>

        <div className="border-b border-mist px-5 py-4">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || user.email || 'User'}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="h-11 w-11 rounded-full border-2 border-pine/20 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-pine/20 bg-mist text-lg font-semibold text-pine">
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.displayName || user?.email?.split('@')[0] || 'User'}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide text-pine">{role}</p>
            </div>
          </div>
          <div className="figures mt-3 flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-pine-dark w-fit">
            <Coins size={14} /> {credits ?? 0} credits
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Dashboard">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-pine text-paper' : 'text-ink/70 hover:bg-mist'
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-ink/30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col md:ml-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-mist bg-paper/90 px-5 py-4 backdrop-blur">
          <button className="md:hidden focus-ring rounded-lg p-1" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={22} /></button>
          <p className="hidden font-display text-lg font-semibold text-ink md:block">Dashboard</p>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
