import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, Sparkles, Target, PenTool, ArrowRight, Crown, Shield, Gem, ChevronRight, Star } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: FileText,
      title: 'Intelligent Resume Parser',
      description: 'Upload PDF or DOCX resumes and extract deep contextual data with precision — zero formatting loss guaranteed.',
      gradient: 'linear-gradient(135deg, #C5A059, #D4AF37)',
      glow: 'rgba(197, 160, 89, 0.15)',
    },
    {
      icon: Target,
      title: 'Skills Gap Intelligence',
      description: 'Run surgical comparisons against real job descriptions. Identify missing skills, structural gaps, and alignment scores.',
      gradient: 'linear-gradient(135deg, #2D8A56, #41A86E)',
      glow: 'rgba(45, 138, 86, 0.15)',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Deep Analysis',
      description: 'Receive ATS-compatibility scoring with granular strengths, weaknesses, and line-by-line enhancement recommendations.',
      gradient: 'linear-gradient(135deg, #D4AF37, #E2B974)',
      glow: 'rgba(212, 175, 55, 0.15)',
    },
    {
      icon: PenTool,
      title: 'Cover Letter Architect',
      description: 'Generate hyper-personalized, context-aware cover letters precisely tuned for each specific role and company.',
      gradient: 'linear-gradient(135deg, #B89045, #C5A059)',
      glow: 'rgba(184, 144, 69, 0.15)',
    },
  ];

  const stats = [
    { value: '97%', label: 'ATS Pass Rate', icon: Shield },
    { value: '3x', label: 'More Interviews', icon: Star },
    { value: '10K+', label: 'Resumes Analyzed', icon: Crown },
  ];

  return (
    <div className="relative min-h-screen" ref={containerRef}>
      {/* Grid lines background */}
      <div className="grid-lines" style={{ opacity: 0.8 }} />

      {/* Hero Section */}
      <motion.div 
        style={{ y: heroY, opacity }}
        className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center text-center z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-10 bg-white"
          style={{
            border: '1px solid rgba(197, 160, 89, 0.25)',
            boxShadow: '0 4px 15px rgba(197, 160, 89, 0.1)',
          }}
        >
          <Crown className="w-4 h-4 ml-1" style={{ color: '#C5A059' }} />
          <span className="text-sm font-medium tracking-wide mr-1" style={{ color: '#1C1C1C' }}>
            Next-Generation Career Intelligence
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8"
          style={{ fontFamily: "'Outfit', sans-serif", color: '#1C1C1C', lineHeight: 1.05 }}
        >
          Elevate Your <br />
          <span className="shimmer-gold">Professional Trajectory</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mb-14 font-medium leading-relaxed"
          style={{ color: '#4A4A4A' }}
        >
          PrimoFlux transforms your raw potential into an ATS-optimized asset. Get profound AI-powered resume analysis, discover hidden skill gaps, and accelerate your career growth.
        </motion.p>
        
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/register"
            className="btn-gold group px-10 py-4 rounded-full text-base flex items-center gap-2"
            id="hero-cta-primary"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>
          <a
            href="#features"
            className="btn-outline-gold px-10 py-4 rounded-full text-base bg-white"
            id="hero-cta-secondary"
          >
            How it Works
          </a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-20 flex gap-8 md:gap-16 items-center"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="text-center group cursor-default"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <stat.icon className="w-5 h-5" style={{ color: '#C5A059' }} />
                <div className="text-3xl md:text-4xl font-bold text-gradient" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {stat.value}
                </div>
              </div>
              <div className="text-sm font-medium" style={{ color: '#82807C' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Interactive Feature Grid */}
      <div id="features" className="relative z-20 pt-20 pb-32 px-4" style={{ borderTop: '1px solid rgba(197, 160, 89, 0.15)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1C1C1C', fontFamily: "'Outfit', sans-serif" }}>
                An Unfair Advantage,<br/>
                <span className="text-gradient">Included</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto font-medium" style={{ color: '#4A4A4A' }}>
                Our specialized AI engine parses, analyzes, and rebuilds your professional profile to match exact market demands.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="glass-card p-10 h-full relative overflow-hidden">
                  {/* Hover glow bg */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${feature.glow}, transparent 70%)` }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl mb-8 flex items-center justify-center"
                      style={{ 
                        background: feature.gradient,
                        boxShadow: `0 8px 24px ${feature.glow}`
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#1C1C1C' }}>{feature.title}</h3>
                    <p className="leading-relaxed font-medium" style={{ color: '#4A4A4A' }}>{feature.description}</p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
                      style={{ color: '#C5A059' }}
                    >
                      Learn more <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: feature.gradient }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-20 pb-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="glass-card p-12 md:p-16 relative overflow-hidden bg-white"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative orbs */}
            <div className="absolute top-0 right-0 w-64 h-64" 
              style={{ background: 'radial-gradient(circle, rgba(197, 160, 89, 0.08), transparent 70%)' }} 
            />
            <div className="absolute bottom-0 left-0 w-64 h-64" 
              style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05), transparent 70%)' }} 
            />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C5A059, #D4AF37)',
                  boxShadow: '0 8px 24px rgba(197, 160, 89, 0.25)'
                }}
              >
                <Gem className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1C1C1C', fontFamily: "'Outfit', sans-serif" }}>
                Ready to Transform Your Career?
              </h2>
              <p className="mb-8 font-medium" style={{ color: '#4A4A4A' }}>
                Join thousands of professionals who've accelerated their career trajectory with PrimoFlux.
              </p>
              <Link
                to="/register"
                className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-full text-base"
                id="footer-cta"
              >
                <span>Get Started — It's Free</span> <ArrowRight className="w-5 h-5 relative z-10" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}