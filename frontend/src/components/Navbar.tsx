import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authService } from '../lib/auth';

const navLinks = [
    { href: '/dashboard', label: 'My Projects', icon: '⊞' },
    { href: '/global-projects', label: 'Discover', icon: '✦' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '◈' },
    { href: '/profile', label: 'Profile', icon: '◎' },
];

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const stored = authService.getStoredUser();
        setUser(stored);
    }, [router.pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        authService.logout();
        setMenuOpen(false);
    };

    const isActive = (path: string) => router.pathname === path;

    if (!user) return null;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          transition: all 0.3s ease; font-family: 'DM Sans', sans-serif;
        }
        .nav-root.scrolled {
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          background: rgba(17,17,16,0.96);
          box-shadow: 0 1px 0 rgba(245,158,11,0.08), 0 8px 32px rgba(0,0,0,0.5);
        }
        .nav-root:not(.scrolled) {
          background: rgba(17,17,16,0.82);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between; gap: 32px;
        }
        .nav-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .brand-icon {
          width: 34px; height: 34px;
          background: #f59e0b;
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          font-size: 18px; color: #000;
        }
        .brand-name {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
          color: #f5f5f4; letter-spacing: -0.3px;
        }
        .brand-name span { color: #f59e0b; }
        .nav-links {
          display: flex; align-items: center; gap: 2px; flex: 1; justify-content: center;
        }
        .nav-link {
          display: flex; align-items: center; gap: 7px; padding: 8px 16px;
          border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.4); transition: all 0.2s ease;
          position: relative; white-space: nowrap;
        }
        .nav-link-icon { font-size: 14px; transition: transform 0.2s ease; }
        .nav-link:hover { color: #f5f5f4; background: rgba(255,255,255,0.05); }
        .nav-link:hover .nav-link-icon { transform: scale(1.15); }
        .nav-link.active { color: #f59e0b; background: rgba(245,158,11,0.10); }
        .nav-link.active::after {
          content: ''; position: absolute; bottom: 4px; left: 50%;
          transform: translateX(-50%); width: 20px; height: 2px;
          background: #f59e0b; border-radius: 2px;
        }
        .nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .nav-new-btn {
          display: flex; align-items: center; gap: 6px; padding: 8px 16px;
          background: #f59e0b;
          color: #000; border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          text-decoration: none; transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-new-btn:hover { background: #fbbf24; transform: translateY(-1px); }
        .nav-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(245,158,11,0.15);
          display: flex; align-items: center; justify-content: center;
          color: #f59e0b; font-weight: 700; font-size: 14px; cursor: pointer;
          border: 1px solid rgba(245,158,11,0.25); transition: all 0.2s ease;
          overflow: hidden; font-family: 'Syne', sans-serif; text-decoration: none;
        }
        .nav-avatar:hover { border-color: rgba(245,158,11,0.6); background: rgba(245,158,11,0.22); }
        .nav-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .logout-btn {
          display: flex; align-items: center; gap: 6px; padding: 8px 14px;
          background: rgba(28,28,26,0.8); color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
          font-size: 13px; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s ease;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); color: #f87171; }
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; padding: 4px; background: none; border: none;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: rgba(255,255,255,0.5); border-radius: 2px; transition: all 0.25s ease;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: #f59e0b; }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: #f59e0b; }
        .mobile-menu {
          display: none; position: fixed; top: 64px; left: 0; right: 0;
          background: rgba(17,17,16,0.98); backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(245,158,11,0.10);
          padding: 16px 24px 24px; flex-direction: column; gap: 4px;
          z-index: 999; animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu.open { display: flex; }
        .mobile-link {
          display: flex; align-items: center; gap: 12px; padding: 13px 16px;
          border-radius: 12px; text-decoration: none; font-size: 15px; font-weight: 500;
          color: rgba(255,255,255,0.45); transition: all 0.2s ease;
        }
        .mobile-link:hover { color: #f5f5f4; background: rgba(255,255,255,0.05); }
        .mobile-link.active { color: #f59e0b; background: rgba(245,158,11,0.10); }
        .mobile-link-icon { font-size: 18px; width: 24px; text-align: center; }
        .mobile-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0; }
        .mobile-user { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-bottom: 8px; }
        .mobile-avatar {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #f59e0b; font-weight: 700; font-size: 16px;
          overflow: hidden; flex-shrink: 0; font-family: 'Syne', sans-serif;
        }
        .mobile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .mobile-user-name { font-size: 14px; font-weight: 600; color: #f5f5f4; font-family: 'Syne', sans-serif; }
        .mobile-user-email { font-size: 12px; color: rgba(255,255,255,0.35); }
        .mobile-new-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 16px; background: #f59e0b;
          color: #000; border: none; border-radius: 12px; font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none; font-family: 'DM Sans', sans-serif; margin-top: 4px;
          transition: background 0.2s ease;
        }
        .mobile-new-btn:hover { background: #fbbf24; }
        .mobile-logout {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 16px; background: rgba(28,28,26,0.8); color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif; margin-top: 4px;
          transition: all 0.2s ease;
        }
        .mobile-logout:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); color: #f87171; }
        .nav-spacer { height: 64px; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-new-btn { display: none; }
          .logout-btn { display: none; }
          .nav-avatar { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

            <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
                <div className="nav-inner">
                    <Link href="/dashboard" className="nav-brand">
                        <div className="brand-icon">⬡</div>
                        <span className="brand-name">Project<span>Hub</span></span>
                    </Link>

                    <div className="nav-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link${isActive(link.href) ? ' active' : ''}`}
                            >
                                <span className="nav-link-icon">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="nav-right">
                        <Link href="/projects/new" className="nav-new-btn">
                            + New Project
                        </Link>
                        <Link href="/profile" className="nav-avatar" title={user?.name}>
                            {user?.profileImage
                                ? <img src={user.profileImage} alt={user.name} />
                                : (user?.name?.charAt(0).toUpperCase() || 'U')}
                        </Link>
                        <button className="logout-btn" onClick={handleLogout}>
                            ⏻ Logout
                        </button>
                    </div>

                    <button
                        className={`hamburger${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                <div className="mobile-user">
                    <div className="mobile-avatar">
                        {user?.profileImage
                            ? <img src={user.profileImage} alt={user.name} />
                            : (user?.name?.charAt(0).toUpperCase() || 'U')}
                    </div>
                    <div>
                        <div className="mobile-user-name">{user?.name}</div>
                        <div className="mobile-user-email">{user?.email}</div>
                    </div>
                </div>
                <div className="mobile-divider" />
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`mobile-link${isActive(link.href) ? ' active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <span className="mobile-link-icon">{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
                <div className="mobile-divider" />
                <Link href="/projects/new" className="mobile-new-btn" onClick={() => setMenuOpen(false)}>
                    + New Project
                </Link>
                <button className="mobile-logout" onClick={handleLogout}>
                    ⏻ Logout
                </button>
            </div>

            <div className="nav-spacer" />
        </>
    );
}