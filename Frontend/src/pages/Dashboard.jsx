import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, analysisAPI, jobsAPI } from '../services/api';
import { 
  Upload, Sparkles, Briefcase, Target, PenTool, 
  CheckCircle, XCircle, AlertTriangle, ChevronRight, Loader2,
  FileText
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [skillsGap, setSkillsGap] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [analyzeError, setAnalyzeError] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [jobsError, setJobsError] = useState('');
  const [coverError, setCoverError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setLoading(true);
    setError('');
    
    try {
      const res = await resumeAPI.upload(file);
      setExtractedText(res.data.extracted_text);
      setAnalysis(null);
      setSkillsGap(null);
      setCoverLetter('');
      setActiveTab('analyze');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Upload failed';
      setError(msg);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!extractedText) return;
    setLoading(true);
    setAnalyzeError('');
    try {
      const res = await analysisAPI.analyzeResume(extractedText);
      setAnalysis(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Analysis failed';
      setAnalyzeError(msg);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSkillsGap = async () => {
    if (!extractedText || !jobDescription) return;
    setLoading(true);
    setSkillsError('');
    try {
      const res = await analysisAPI.skillsGap(extractedText, jobDescription);
      setSkillsGap(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Skills gap analysis failed';
      setSkillsError(msg);
    } finally {
      setLoading(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!extractedText || !jobTitle || !companyName || !jobDescription) return;
    setLoading(true);
    setCoverError('');
    try {
      const res = await analysisAPI.coverLetter({
        resume_text: extractedText,
        job_title: jobTitle,
        company_name: companyName,
        job_description: jobDescription,
      });
      setCoverLetter(res.data.cover_letter);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Cover letter generation failed';
      setCoverError(msg);
    } finally {
      setLoading(false);
    }
  };

  const discoverJobs = async () => {
    if (!extractedText) return;
    setLoading(true);
    setJobsError('');
    try {
      const res = await jobsAPI.mockJobs('software engineer');
      setJobs(res.data.jobs);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Job discovery failed';
      setJobsError(msg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'analyze', label: 'Analysis', icon: Sparkles },
    { id: 'skills', label: 'Skills Gap', icon: Target },
    { id: 'jobs', label: 'Find Jobs', icon: Briefcase },
    { id: 'cover', label: 'Cover Letter', icon: PenTool },
  ];

  return (
    <div className="flex-1 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-1 px-4 mb-4 rounded-full border border-slate-700/50 bg-slate-800/50 backdrop-blur-md"
          >
            <span className="text-slate-300 font-medium">Hello, <span className="text-purple-400">{user?.username}</span></span>
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Your Dashboard</h1>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-colors duration-300 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-3xl p-8 max-w-3xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Initialize Your Profile</h2>
                  <p className="text-slate-400">Upload your latest resume. Our engine handles the rest.</p>
                </div>
                
                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm flex justify-center">
                    {error}
                  </div>
                )}
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="glow-effect border-2 border-dashed border-slate-700 rounded-2xl p-16 text-center cursor-pointer hover:border-purple-500/50 transition-colors bg-slate-900/50"
                >
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 text-pink-500 mb-4 animate-spin" />
                      <p className="text-purple-300 font-medium tracking-widest uppercase text-sm">Uploading and Parsing...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-700/50 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <Upload className="w-8 h-8 text-slate-300 group-hover:text-white transition-colors relative z-10" />
                      </div>
                      <p className="text-xl font-medium text-white mb-2">Drag & Drop or <span className="text-purple-400">Click to Browse</span></p>
                      <p className="text-slate-500 text-sm">Supports PDF and DOCX formats</p>
                      {resumeFile && (
                        <div className="mt-6 px-4 py-2 bg-slate-800 rounded-full inline-flex items-center gap-2 border border-slate-700">
                           <FileText className="w-4 h-4 text-emerald-400" />
                           <span className="text-slate-300 text-sm">{resumeFile.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </motion.div>
            )}

            {activeTab === 'analyze' && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto space-y-6"
              >
                {!extractedText ? (
                  <div className="glass-card rounded-3xl p-12 text-center">
                     <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                     <h3 className="text-xl text-white font-medium mb-2">No Context Found</h3>
                     <p className="text-slate-400 mb-6">Please upload a resume first to begin analysis.</p>
                     <button onClick={() => setActiveTab('upload')} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full border border-slate-700 transition-colors">Go to Upload</button>
                  </div>
                ) : !analysis ? (
                  <div className="glass-card rounded-3xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready for Deep Scan</h2>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">Our AI will calculate your ATS compatibility, extract core competencies, and identify critical improvement vectors.</p>
                    <button
                      onClick={analyzeResume}
                      disabled={loading}
                      className="glow-effect relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                      {loading ? 'Analyzing Profile...' : 'Initiate Analysis'}
                    </button>
                    {analyzeError && <p className="text-rose-400 mt-4">{analyzeError}</p>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Score Card */}
                    <div className="glass-card rounded-3xl p-6 lg:col-span-1 flex flex-col items-center justify-center text-center">
                       <div className="relative w-40 h-40 mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                          <motion.circle
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * analysis.score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="80" cy="80" r="70"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={440}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-bold text-white">{analysis.score}</span>
                          <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Score</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">ATS Profile</h3>
                      <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 mb-4">
                        Compatibility: {analysis.ats_compatibility}
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{analysis.overall_summary}</p>
                    </div>

                    {/* Details Cards */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="glass-card rounded-3xl p-6 border-t-2 border-t-emerald-500/50">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" /> Core Strengths
                          </h3>
                          <ul className="space-y-3">
                            {analysis.strengths.map((s, i) => (
                              <li key={i} className="text-sm">
                                <span className="font-semibold text-emerald-300 block mb-0.5">{s.area}</span>
                                <span className="text-slate-400">{s.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="glass-card rounded-3xl p-6 border-t-2 border-t-rose-500/50">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-400" /> Areas to Improve
                          </h3>
                          <ul className="space-y-3">
                            {analysis.weaknesses.map((w, i) => (
                              <li key={i} className="text-sm">
                                <span className="font-semibold text-rose-300 block mb-0.5">{w.area}</span>
                                <span className="text-slate-400">{w.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {analysis.line_improvements.length > 0 && (
                        <div className="glass-card rounded-3xl p-6 border-l-4 border-l-indigo-500/50">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-400" /> Granular Enhancements
                          </h3>
                          <div className="space-y-4">
                            {analysis.line_improvements.slice(0, 3).map((l, i) => (
                              <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current</p>
                                <p className="text-sm text-slate-300 mb-3 line-through decoration-rose-500/50">{l.line}</p>
                                <p className="text-xs text-indigo-400 uppercase tracking-wider mb-1">Suggested</p>
                                <p className="text-sm text-white font-medium">{l.suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Other tabs follow similar structure... (Skills Gap, Jobs, Cover Letter) */}
            {/* For brevity of rewrite and highlighting UI changes, we use a placeholder or basic implement for others */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto glass-card rounded-3xl p-8"
              >
                  <h2 className="text-2xl font-bold text-white mb-6">Market Alignment Scanner</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Target Job Description</label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 text-white hover:border-purple-500/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none resize-none h-40"
                        placeholder="Paste the target job description here..."
                      />
                    </div>
                    {!skillsGap ? (
                      <button
                        onClick={analyzeSkillsGap}
                        disabled={loading || !jobDescription}
                        className="glow-effect w-full py-4 rounded-2xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
                        Compute Alignment Delta
                      </button>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/50">
                        <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                           <h3 className="text-emerald-400 font-bold mb-4">Verified Match</h3>
                           <div className="flex flex-wrap gap-2">
                             {skillsGap.matched_skills.map(s => <span key={s} className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300 text-sm border border-emerald-500/30">{s}</span>)}
                           </div>
                        </div>
                        <div className="p-6 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                           <h3 className="text-rose-400 font-bold mb-4">Critical Gaps</h3>
                           <div className="flex flex-wrap gap-2">
                             {skillsGap.missing_skills.map(s => <span key={s} className="px-3 py-1 bg-rose-500/20 rounded-full text-rose-300 text-sm border border-rose-500/30">{s}</span>)}
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
              </motion.div>
            )}

            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto glass-card rounded-3xl p-8"
              >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Curated Opportunities</h2>
                    <button onClick={discoverJobs} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-medium transition flex items-center gap-2">
                       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4"/>} Refresh
                    </button>
                  </div>
                  
                  {jobs.length > 0 ? (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div key={job.id} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-colors group">
                           <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{job.title}</h3>
                              <a href={job.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-pink-400 hover:text-pink-300 flex items-center gap-1">Apply <ChevronRight className="w-4 h-4" /></a>
                           </div>
                           <p className="text-slate-400 text-sm mb-3">{job.company} • {job.location}</p>
                           <p className="text-slate-500 text-sm line-clamp-2">{job.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-500">Scan your resume to discover algorithmic job matches.</div>
                  )}
              </motion.div>
            )}

            {activeTab === 'cover' && (
               <motion.div
                key="cover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto glass-card rounded-3xl p-8"
              >
                 <h2 className="text-2xl font-bold text-white mb-6">Cover Letter Generation</h2>
                 <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <input type="text" placeholder="Job Title" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                    <input type="text" placeholder="Company Name" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                 </div>
                 <textarea value={jobDescription} onChange={e=>setJobDescription(e.target.value)} placeholder="Job Description" className="w-full h-32 mb-6 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none"></textarea>
                 
                 <button onClick={generateCoverLetter} disabled={loading || !jobTitle} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5"/>} Synthesize Letter
                 </button>

                 {coverLetter && (
                    <div className="mt-8 p-6 bg-slate-900/80 border border-slate-700 rounded-2xl relative">
                       <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => navigator.clipboard.writeText(coverLetter)}>Copy</button>
                       <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm">{coverLetter}</pre>
                    </div>
                 )}
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}