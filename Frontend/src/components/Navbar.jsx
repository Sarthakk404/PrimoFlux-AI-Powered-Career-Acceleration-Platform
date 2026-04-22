import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #C5A059, #D4AF37)',
                boxShadow: '0 4px 15px rgba(197, 160, 89, 0.2)'
              }}
            >
              <Crown className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ 
            fontFamily: "'Outfit', sans-serif",
            color: '#1C1C1C'
          }}>
            Primo<span className="text-gradient">Flux</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="relative px-4 py-1.5 text-sm font-medium transition-all duration-300"
                  style={{
                    color: location.pathname === link.path ? '#C5A059' : '#4A4A4A',
                  }}
                  onMouseEnter={e => { if (location.pathname !== link.path) e.currentTarget.style.color = '#1C1C1C'; }}
                  onMouseLeave={e => { if (location.pathname !== link.path) e.currentTarget.style.color = '#4A4A4A'; }}
                >
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ background: 'rgba(197, 160, 89, 0.08)' }}
                    />
                  )}
                  {link.label}
                </Link>
              ))}
              
              <div className="h-5 w-px mx-2" style={{ background: 'rgba(197, 160, 89, 0.15)' }}></div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ 
                  background: 'rgba(197, 160, 89, 0.06)',
                  border: '1px solid rgba(197, 160, 89, 0.15)'
                }}
              >
                <User className="w-4 h-4" style={{ color: '#C5A059' }} />
                <span className="text-sm font-medium" style={{ color: '#1C1C1C' }}>{user.username}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 transition-colors duration-300 p-2 rounded-lg"
                style={{ color: '#82807C' }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#C44D4D';
                  e.currentTarget.style.background = 'rgba(196, 77, 77, 0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#82807C';
                  e.currentTarget.style.background = 'transparent';
                }}
                title="Logout"
                id="logout-button"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium transition-colors duration-300"
                style={{ color: '#4A4A4A' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C5A059'}
                onMouseLeave={e => e.currentTarget.style.color = '#4A4A4A'}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-gold px-6 py-2.5 rounded-full text-sm"
                id="navbar-get-started"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}