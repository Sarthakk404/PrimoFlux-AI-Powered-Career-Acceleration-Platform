import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Crown, Loader2, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, username, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="glass-card bg-white w-full max-w-md p-10 relative overflow-hidden"
        style={{ background: '#FFFFFF' }}
      >
        {/* Decorative glow corners */}
        <div className="absolute top-0 left-0 w-40 h-40"
          style={{ background: 'radial-gradient(circle at top left, rgba(197, 160, 89, 0.12), transparent 70%)' }}
        />
        <div className="absolute bottom-0 right-0 w-40 h-40"
          style={{ background: 'radial-gradient(circle at bottom right, rgba(212, 175, 55, 0.1), transparent 70%)' }}
        />

        <div className="flex justify-center mb-8 relative z-10">
          <motion.div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            whileHover={{ rotate: -10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{ 
              background: 'linear-gradient(135deg, #D4AF37, #C5A059)',
              boxShadow: '0 8px 24px rgba(197, 160, 89, 0.25)'
            }}
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 relative z-10" style={{ color: '#1C1C1C', fontFamily: "'Outfit', sans-serif" }}>
          Create Account
        </h2>
        <p className="text-center mb-8 relative z-10 font-medium" style={{ color: '#82807C' }}>
          Join PrimoFlux and accelerate your career
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl text-sm mb-6 text-center relative z-10 font-medium"
            style={{
              background: 'rgba(196, 77, 77, 0.08)',
              border: '1px solid rgba(196, 77, 77, 0.2)',
              color: '#C44D4D'
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10" id="register-form">
          <div className="relative group">
            <User className="absolute left-4 top-3.5 w-5 h-5 transition-colors" 
              style={{ color: '#82807C' }} 
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-luxury"
              placeholder="Username"
              required
              id="register-username"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 transition-colors" 
              style={{ color: '#82807C' }} 
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-luxury"
              placeholder="Email Address"
              required
              id="register-email"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 transition-colors" 
              style={{ color: '#82807C' }} 
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-luxury"
              placeholder="Password"
              required
              id="register-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3.5 rounded-xl text-base flex justify-center items-center gap-2 disabled:opacity-60"
            id="register-submit"
          >
            <span>{loading ? '' : 'Create Account'}</span>
            {loading && <Loader2 className="w-5 h-5 animate-spin relative z-10" />}
          </button>
        </form>

        <p className="text-center mt-8 text-sm relative z-10 font-medium" style={{ color: '#82807C' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold transition-colors"
            style={{ color: '#C5A059' }}
            onMouseEnter={e => e.currentTarget.style.color = '#B89045'}
            onMouseLeave={e => e.currentTarget.style.color = '#C5A059'}
          >
            Sign In here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}