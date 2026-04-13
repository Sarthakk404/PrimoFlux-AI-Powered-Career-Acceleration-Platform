import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, User, Sparkles } from 'lucide-react';
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
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <FileText className="w-8 h-8 text-purple-400 group-hover:text-pink-400 transition-colors" />
            <Sparkles className="w-4 h-4 text-pink-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">PrimoFlux</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`relative px-3 py-1 text-sm font-medium transition ${location.pathname === link.path ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    />
                  )}
                  {link.label}
                </Link>
              ))}
              
              <div className="h-6 w-px bg-slate-700 mx-2"></div>
              
              <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">{user.username}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">Sign In</Link>
              <Link
                to="/register"
                className="relative group px-6 py-2 rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:scale-105 transition-transform"></div>
                <span className="relative text-sm font-medium text-white">Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}