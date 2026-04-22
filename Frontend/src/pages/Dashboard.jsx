import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, analysisAPI, jobsAPI } from '../services/api';
import { 
  Upload, Sparkles, Briefcase, Target, PenTool, 
  CheckCircle, AlertTriangle, ChevronRight, Loader2,
  FileText, Copy, Check, Crown, ExternalLink, Globe
} from 'lucide-react';

// Platform logos/data for job cards
const PLATFORM_CONFIG = {
  linkedin: { name: 'LinkedIn', className: 'platform-linkedin', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
  indeed: { name: 'Indeed', className: 'platform-indeed', searchUrl: 'https://www.indeed.com/jobs?q=' },
  glassdoor: { name: 'Glassdoor', className: 'platform-glassdoor', searchUrl: 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword=' },
  naukri: { name: 'Naukri', className: 'platform-naukri', searchUrl: 'https://www.naukri.com/jobapi/v3/search?searchType=adv&keyword=' },
  internshala: { name: 'Internshala', className: 'platform-internshala', searchUrl: 'https://internshala.com/jobs/keywords-' },
  wellfound: { name: 'Wellfound', className: 'platform-wellfound', searchUrl: 'https://wellfound.com/jobs?query=' },
  remoteok: { name: 'RemoteOK', className: 'platform-remote', searchUrl: 'https://remoteok.com/remote-dev+' },
};

function getPlatformFromUrl(url) {
  if (!url) return null;
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('indeed.com')) return 'indeed';
  if (url.includes('glassdoor.com')) return 'glassdoor';
  if (url.includes('naukri.com')) return 'naukri';
  if (url.includes('internshala.com')) return 'internshala';
  if (url.includes('wellfound.com') || url.includes('angel.co')) return 'wellfound';
  if (url.includes('remoteok.com')) return 'remoteok';
  return null;
}

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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ErrorBanner = ({ message }) => (
    message ? (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl text-sm mb-6 flex items-center gap-2 font-medium"
        style={{
          background: 'rgba(181, 77, 77, 0.08)',
          border: '1px solid rgba(181, 77, 77, 0.15)',
          color: 'var(--error)'
        }}
      >
        <AlertTriangle className="w-4 h-4 shrink-0" />
        {message}
      </motion.div>
    ) : null
  );

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'analyze', label: 'Analysis', icon: Sparkles },
    { id: 'skills', label: 'Skills Gap', icon: Target },
    { id: 'jobs', label: 'Find Jobs', icon: Briefcase },
    { id: 'cover', label: 'Cover Letter', icon: PenTool },
  ];

  const getScoreColor = (score) => {
    if (score >= 75) return 'var(--success)';
    if (score >= 50) return 'var(--accent-primary)';
    return 'var(--error)';
  };

  return (
    <div className="flex-1 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-1 px-5 mb-4 rounded-full"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)'
            }}
          >
            <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Hello, <span style={{ color: 'var(--accent-primary)' }}>{user?.username}</span>
            </span>
          </motion.div>
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
            Your Dashboard
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 justify-center px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl whitespace-nowrap transition-all duration-300 font-semibold interactive-tab ${activeTab !== tab.id ? 'glass-card' : ''}`}
              style={{
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-primary)',
                background: activeTab === tab.id ? 'transparent' : 'var(--bg-card)',
                border: activeTab === tab.id ? '1px solid transparent' : '1px solid var(--border-light)',
              }}
              id={`tab-${tab.id}`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl z-0"
                  style={{
                    background: 'var(--gradient-primary)',
                    boxShadow: '0 6px 16px rgba(166, 138, 86, 0.25)'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* UPLOAD TAB */}
            {activeTab === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-8 max-w-3xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Initialize Your Profile</h2>
                  <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Upload your latest resume. Our engine handles the rest.</p>
                </div>
                
                <ErrorBanner message={error} />
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="glow-effect border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer interactive-card"
                  style={{
                    borderColor: 'var(--border-medium)',
                    background: 'var(--bg-surface)'
                  }}
                  id="upload-dropzone"
                >
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 mb-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                      <p className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--accent-secondary)' }}>
                        Uploading & Parsing...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{
                          background: 'rgba(166, 138, 86, 0.08)',
                          border: '1px solid rgba(166, 138, 86, 0.15)',
                        }}
                      >
                        <Upload className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
                      </motion.div>
                      <p className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Drag & Drop or <span style={{ color: 'var(--accent-primary)' }}>Click to Browse</span>
                      </p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Supports PDF and DOCX formats</p>
                      {resumeFile && (
                        <div className="mt-6 px-4 py-2 rounded-full inline-flex items-center gap-2"
                          style={{
                            border: '1px solid rgba(58, 125, 85, 0.25)',
                            background: 'rgba(58, 125, 85, 0.05)'
                          }}
                        >
                          <FileText className="w-4 h-4" style={{ color: 'var(--success)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>{resumeFile.name}</span>
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
                  id="file-input"
                />
              </motion.div>
            )}

            {/* ANALYZE TAB */}
            {activeTab === 'analyze' && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto space-y-6"
              >
                {!extractedText ? (
                  <div className="glass-card p-12 text-center">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Resume Found</h3>
                    <p className="mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>Please upload a resume first to begin analysis.</p>
                    <button 
                      onClick={() => setActiveTab('upload')} 
                      className="btn-outline-gold px-6 py-2.5 rounded-full transition-colors"
                      id="goto-upload"
                    >
                      Go to Upload
                    </button>
                  </div>
                ) : !analysis ? (
                  <div className="glass-card p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                      style={{ 
                        background: 'var(--gradient-primary)',
                        boxShadow: 'var(--shadow-elevated)'
                      }}
                    >
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                      Ready for Deep Scan
                    </h2>
                    <p className="mb-8 max-w-lg mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Our AI will calculate your ATS compatibility, extract core competencies, and identify critical improvement vectors.
                    </p>
                    <button
                      onClick={analyzeResume}
                      disabled={loading}
                      className="btn-gold glow-effect relative px-10 py-4 rounded-full font-bold flex items-center gap-2 mx-auto disabled:opacity-50"
                      id="analyze-button"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin relative z-10" /> : <Sparkles className="w-6 h-6 relative z-10" />}
                      <span>{loading ? 'Analyzing Profile...' : 'Initiate Analysis'}</span>
                    </button>
                    <ErrorBanner message={analyzeError} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Score Card */}
                    <div className="glass-card p-8 lg:col-span-1 flex flex-col items-center justify-center text-center">
                      <div className="relative w-40 h-40 mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="80" cy="80" r="70" stroke="var(--border-light)" strokeWidth="10" fill="none" />
                          <motion.circle
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * analysis.score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="80" cy="80" r="70"
                            stroke={getScoreColor(analysis.score)}
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={440}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-bold" style={{ color: getScoreColor(analysis.score) }}>
                            {analysis.score}
                          </span>
                          <span className="text-xs uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>Score</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>ATS Profile</h3>
                      <span className="tag-gold mb-4">
                        Compatibility: {analysis.ats_compatibility}
                      </span>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {analysis.overall_summary}
                      </p>
                    </div>

                    {/* Details Cards */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div className="glass-card p-6" style={{ borderTop: '4px solid var(--success)' }}>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} /> Core Strengths
                          </h3>
                          <ul className="space-y-3">
                            {analysis.strengths.map((s, i) => (
                              <li key={i} className="text-sm">
                                <span className="font-bold block mb-0.5" style={{ color: 'var(--success)' }}>{s.area}</span>
                                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{s.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Weaknesses */}
                        <div className="glass-card p-6" style={{ borderTop: '4px solid var(--error)' }}>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} /> Areas to Improve
                          </h3>
                          <ul className="space-y-3">
                            {analysis.weaknesses.map((w, i) => (
                              <li key={i} className="text-sm">
                                <span className="font-bold block mb-0.5" style={{ color: 'var(--error)' }}>{w.area}</span>
                                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{w.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {analysis.line_improvements.length > 0 && (
                        <div className="glass-card p-6" style={{ borderLeft: '5px solid var(--accent-primary)' }}>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} /> Granular Enhancements
                          </h3>
                          <div className="space-y-4">
                            {analysis.line_improvements.slice(0, 5).map((l, i) => (
                              <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>
                                <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Current</p>
                                <p className="text-sm mb-3 font-medium line-through" style={{ color: 'var(--text-muted)', textDecorationColor: 'var(--error)' }}>{l.line}</p>
                                <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--accent-primary)' }}>Suggested</p>
                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{l.suggestion}</p>
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

            {/* SKILLS GAP TAB */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto glass-card p-8"
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                  Market Alignment Scanner
                </h2>

                {!extractedText && (
                  <div className="p-6 rounded-xl text-center mb-6 interactive-card hover:bg-neutral-50" style={{ border: '1px solid var(--border-light)' }}>
                    <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Please upload a resume first.</p>
                    <button onClick={() => setActiveTab('upload')} className="btn-outline-gold px-5 py-2 rounded-full mt-3 text-sm">
                      Go to Upload
                    </button>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Target Job Description</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="input-luxury resize-none h-40"
                      placeholder="Paste the target job description here..."
                      id="skills-job-desc"
                    />
                  </div>

                  <ErrorBanner message={skillsError} />

                  {!skillsGap ? (
                    <button
                      onClick={analyzeSkillsGap}
                      disabled={loading || !jobDescription || !extractedText}
                      className="btn-gold glow-effect w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      id="skills-analyze-button"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <Target className="w-5 h-5 relative z-10" />}
                      <span>Compute Alignment Delta</span>
                    </button>
                  ) : (
                    <div className="space-y-6 pt-4">
                      {/* Gap percentage */}
                      <div className="text-center p-6 rounded-xl" style={{ border: '1px solid var(--border-light)', background: 'var(--bg-surface)' }}>
                        <div className="text-4xl font-bold text-gradient">
                          {100 - (skillsGap.gap_percentage || 0)}%
                        </div>
                        <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Match Rate</div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl glass-card interactive-card" style={{ border: '1px solid rgba(58, 125, 85, 0.2)' }}>
                          <h3 className="font-bold mb-4" style={{ color: 'var(--success)' }}>Verified Match</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillsGap.matched_skills.map(s => (
                              <span key={s} className="tag-success">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl glass-card interactive-card" style={{ border: '1px solid rgba(181, 77, 77, 0.2)' }}>
                          <h3 className="font-bold mb-4" style={{ color: 'var(--error)' }}>Critical Gaps</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillsGap.missing_skills.map(s => (
                              <span key={s} className="tag-error">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {skillsGap.recommendations?.length > 0 && (
                        <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>
                          <h3 className="font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>Recommendations</h3>
                          <ul className="space-y-2">
                            {skillsGap.recommendations.map((r, i) => (
                              <li key={i} className="text-sm font-medium flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={() => setSkillsGap(null)}
                        className="btn-outline-gold w-full py-3 rounded-xl text-sm"
                      >
                        Run New Analysis
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* JOBS TAB */}
            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto glass-card p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                    Curated Opportunities
                  </h2>
                  <button 
                    onClick={discoverJobs} 
                    disabled={loading || !extractedText}
                    className="btn-gold px-6 py-2.5 rounded-full font-bold flex items-center gap-2 text-sm disabled:opacity-50"
                    id="discover-jobs-button"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin relative z-10" /> : <Briefcase className="w-4 h-4 relative z-10"/>}
                    <span>Discover</span>
                  </button>
                </div>

                <ErrorBanner message={jobsError} />

                {!extractedText && (
                  <div className="p-6 rounded-xl text-center mb-6 interactive-card hover:bg-neutral-50" style={{ border: '1px solid var(--border-light)' }}>
                    <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Please upload a resume first to discover matches.</p>
                    <button onClick={() => setActiveTab('upload')} className="btn-outline-gold px-5 py-2 rounded-full mt-3 text-sm">
                      Go to Upload
                    </button>
                  </div>
                )}
                
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job, idx) => {
                      const platform = getPlatformFromUrl(job.url);
                      const platformConfig = platform ? PLATFORM_CONFIG[platform] : null;
                      
                      return (
                        <motion.div 
                          key={job.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="glass-card p-6 rounded-2xl group cursor-pointer relative overflow-hidden interactive-card"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                                {platformConfig && (
                                  <span className={`platform-badge ${platformConfig.className}`}>
                                    <Globe className="w-3 h-3" />
                                    {platformConfig.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{job.company} • {job.location}</p>
                            </div>
                            <a href={job.url} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300"
                              style={{ 
                                color: 'var(--accent-primary)',
                                border: '1px solid var(--border-light)',
                                background: 'transparent'
                              }}
                              onClick={e => e.stopPropagation()}
                            >
                              Apply <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <p className="text-sm line-clamp-2 mb-4 font-medium" style={{ color: 'var(--text-secondary)' }}>{job.description}</p>
                          
                          {/* Quick-apply to other platforms */}
                          <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)', lineHeight: '28px' }}>Also search on:</span>
                            {Object.entries(PLATFORM_CONFIG)
                              .filter(([key]) => key !== platform)
                              .slice(0, 5)
                              .map(([key, config]) => (
                                <a
                                  key={key}
                                  href={`${config.searchUrl}${encodeURIComponent(job.title)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`platform-badge ${config.className} transition-all duration-300 hover:scale-105`}
                                  onClick={e => e.stopPropagation()}
                                >
                                  {config.name}
                                </a>
                              ))
                            }
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Quick search links section */}
                    <div className="mt-6 p-6 rounded-2xl interactive-card" style={{ border: '1px solid var(--border-light)', background: 'var(--bg-surface)' }}>
                      <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                        <Globe className="w-4 h-4" />
                        Browse All Platforms
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                          <a
                            key={key}
                            href={`${config.searchUrl}${encodeURIComponent('software engineer')}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`platform-badge ${config.className} transition-all duration-300 hover:scale-110`}
                            style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            {config.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : extractedText ? (
                  <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                    <Briefcase className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--border-medium)' }} />
                    <p className="font-medium">Click "Discover" to find algorithmic job matches based on your resume.</p>
                  </div>
                ) : null}
              </motion.div>
            )}

            {/* COVER LETTER TAB */}
            {activeTab === 'cover' && (
              <motion.div
                key="cover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto glass-card p-8"
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                  Cover Letter Generation
                </h2>

                {!extractedText && (
                  <div className="p-6 rounded-xl text-center mb-6 interactive-card hover:bg-neutral-50" style={{ border: '1px solid var(--border-light)' }}>
                    <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Please upload a resume first.</p>
                    <button onClick={() => setActiveTab('upload')} className="btn-outline-gold px-5 py-2 rounded-full mt-3 text-sm">
                      Go to Upload
                    </button>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="Job Title" 
                    value={jobTitle} 
                    onChange={e => setJobTitle(e.target.value)} 
                    className="input-luxury"
                    id="cover-job-title"
                  />
                  <input 
                    type="text" 
                    placeholder="Company Name" 
                    value={companyName} 
                    onChange={e => setCompanyName(e.target.value)} 
                    className="input-luxury"
                    id="cover-company-name"
                  />
                </div>
                <textarea 
                  value={jobDescription} 
                  onChange={e => setJobDescription(e.target.value)} 
                  placeholder="Job Description" 
                  className="input-luxury resize-none h-32 mb-6"
                  id="cover-job-desc"
                />

                <ErrorBanner message={coverError} />
                
                <button 
                  onClick={generateCoverLetter} 
                  disabled={loading || !jobTitle || !extractedText || !companyName || !jobDescription}
                  className="btn-gold glow-effect w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  id="generate-cover-letter"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <PenTool className="w-5 h-5 relative z-10"/>}
                  <span>Synthesize Letter</span>
                </button>

                {coverLetter && (
                  <div className="mt-8 p-6 rounded-2xl relative" style={{ border: '1px solid var(--border-light)', background: 'var(--bg-surface)' }}>
                    <button 
                      className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all"
                      style={{ 
                        color: copied ? 'var(--success)' : 'var(--accent-primary)',
                        border: `1px solid ${copied ? 'var(--border-medium)' : 'var(--border-light)'}`,
                        background: 'var(--bg-card)'
                      }}
                      onClick={() => handleCopy(coverLetter)}
                      id="copy-cover-letter"
                    >
                      {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed font-medium pt-2" style={{ color: 'var(--text-primary)' }}>
                      {coverLetter}
                    </pre>
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