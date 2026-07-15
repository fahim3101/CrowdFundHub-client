import { Link } from 'react-router-dom';
import { Github, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-mist bg-ink text-paper/80">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold font-display text-lg font-semibold text-ink">
                C
              </span>
              <span className="font-display text-lg font-semibold text-paper">CrowdFundHub</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-paper/50">
              A place for creators to launch what matters, and supporters to back it — one credit at a time.
            </p>
          </div>

          <div className="flex gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-paper/15 p-2.5 transition hover:border-gold hover:text-gold">
              <Linkedin size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-paper/15 p-2.5 transition hover:border-gold hover:text-gold">
              <Facebook size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-paper/15 p-2.5 transition hover:border-gold hover:text-gold">
              <Github size={18} />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-paper/10 pt-6 text-center font-mono text-xs text-paper/40">
          © {new Date().getFullYear()} CrowdFundHub. Built as a MERN stack assessment project.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
