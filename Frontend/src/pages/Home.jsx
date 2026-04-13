import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, Sparkles, Briefcase, Target, PenTool, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
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
      title: 'Smart PDF Parser',
      description: 'Upload your resume in PDF or DOCX format and instantly extract deep contextual data with zero formatting loss.',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: Target,
      title: 'Skills Gap Analyzer',
      description: 'Run targeted comparisons against real job descriptions to identify missing skills and structural gaps.',
      color: 'from-rose-500 to-orange-400'
    },
    {
      icon: Sparkles,
      title: 'AI Deep Analysis',
      description: 'Get ATS-compatibility scored analysis featuring localized strengths, weaknesses, and line-by-line enhancements.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: PenTool,
      title: 'Cover Letter Architect',
      description: 'Generate hyper-personalized, context-aware cover letters tuned precisely for specific roles.',
      color: 'from-emerald-500 to-teal-400'
    },
  ];

  return (
    <div className="relative min-h-screen" ref={containerRef}>
      {/* Hero Section */}
      <motion.div 
        style={{ y: heroY, opacity }}
        className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center text-center z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Next-Gen Career Intelligence</span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-8"
        >
          Elevate Your <br />
          <span className="text-gradient">Professional Trajectory</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 font-light leading-relaxed"
        >
          PrimoFlux maps your raw potential into an ATS-optimized asset. Get profound AI-powered resume analysis, discover hidden skill gaps, and land interviews faster.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/register"
            className="group relative px-8 py-4 rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2 text-white font-medium">
              Start Free Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-md text-white font-medium hover:bg-slate-800/80 transition-colors"
          >
            How it Works
          </a>
        </motion.div>
      </motion.div>

      {/* Interactive Feature Grid */}
      <div id="features" className="relative z-20 bg-[#020617] pt-20 pb-32 px-4 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Unfair Advantage <br/>Included</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our specialized neural engine parses, analyzes, and rebuilds your profile to match exact market demands.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl blur-xl -z-10 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="glass-card p-10 h-full rounded-3xl border border-slate-800 relative overflow-hidden transition-all duration-300 group-hover:border-purple-500/50 group-hover:-translate-y-2">
                  <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg shadow-black/50`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}