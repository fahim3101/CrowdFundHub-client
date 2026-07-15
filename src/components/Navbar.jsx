import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Github, Coins } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import NotificationBell from './NotificationBell';
import toast from 'react-hot-toast';

const GITHUB_CLIENT_REPO = 'https://github.com/your-username/crowdfundhub-client';

const Navbar = () => {
  const { user, credits, logOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logOut()
      .then(() => toast.success('Logged out'))
      .catch(() => toast.error('Something went wrong'));
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-pine ${isActive ? 'text-pine' : 'text-ink/70'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pine font-display text-lg font-semibold text-paper">
            C
          </span>
          <span className="font-display text-lg font-semibold text-ink">CrowdFundHub</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {!user && <NavLink to="/explore-campaigns" className={linkClass}>Explore Campaigns</NavLink>}
          {user && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="figures flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-pine-dark">
                <Coins size={15} /> {credits}
              </span>
              <NotificationBell />
              <div className="group relative">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-9 w-9 cursor-pointer rounded-full border-2 border-pine/30 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-pine/30 bg-mist text-sm font-semibold text-pine">
                    {user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-mist bg-white p-2 opacity-0 shadow-xl transition-all duration-200 invisible group-hover:visible group-hover:opacity-100">
                  <p className="truncate px-2 py-1 text-xs text-ink/50">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-brick hover:bg-mist"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className={linkClass({ isActive: false })}>Login</Link>
              <Link
                to="/register"
                className="rounded-full bg-pine px-4 py-2 text-sm font-medium text-paper transition hover:bg-pine-dark"
              >
                Register
              </Link>
            </div>
          )}

          <a
            href={GITHUB_CLIENT_REPO}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-sm text-ink/70 transition hover:border-pine hover:text-pine"
          >
            <Github size={15} /> Join as Developer
          </a>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-mist bg-paper px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {!user && <NavLink to="/explore-campaigns" className={linkClass} onClick={() => setOpen(false)}>Explore Campaigns</NavLink>}
            {user && <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>}
            {user ? (
              <>
                <span className="figures text-sm font-semibold text-pine-dark">Credits: {credits}</span>
                <button onClick={handleLogout} className="text-left text-sm text-brick">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className={linkClass({ isActive: false })}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className={linkClass({ isActive: false })}>Register</Link>
              </>
            )}
            <a href={GITHUB_CLIENT_REPO} target="_blank" rel="noreferrer" className="text-sm text-ink/70">
              Join as Developer
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
