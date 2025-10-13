import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AIAssistant from "./AIAssistant";

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [jobUploaded, setJobUploaded] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [jobUploading, setJobUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [aiThinking, setAiThinking] = useState(false);
  const [aiMsg, setAiMsg] = useState(
    "Hello there! To begin, upload your resume and the job posting. I'll analyze them together and guide you step-by-step."
  );
  const [aiKey, setAiKey] = useState(0);

  useEffect(() => {
    localStorage.removeItem("analyzeDone");
    localStorage.removeItem("optimizeDone");
  }, []);

  const dummyResume = useMemo(() => `
JOHN DOE
Full-Stack Developer | Cloud & Security Enthusiast
Brisbane, QLD | john.doe@example.com | linkedin.com/in/johndoe

SUMMARY
Driven IT graduate with strong foundations in software engineering and cybersecurity.
Hands-on experience building SaaS systems using Go, React, and Docker.

EXPERIENCE
BrightTech – Secure Development Intern | 2024 – Present
- Built APIs with Go Fiber & PostgreSQL
- Integrated Split4 + BenGuide dashboards for LRT metrics
- Automated compliance workflows reducing manual effort by 60%

App Factory – Developer | 2023 – Present
- Developed mobile apps using React Native & Expo
- Improved UI responsiveness via TailwindCSS
- Collaborated using Git, Agile sprints, and code reviews

EDUCATION
Bachelor of Information Technology (Software Development)
Griffith University | GPA: 6.5 (Distinction)

SKILLS
Go | React | PostgreSQL | Docker | Tailwind | REST APIs | Agile | OWASP
`, []);

  const dummyJob = useMemo(() => `
ENTRY LEVEL SOFTWARE DEVELOPER
Company: CloudTech Solutions | Brisbane, QLD | Hybrid

We're seeking an entry-level developer passionate about web technologies.

Responsibilities:
- Build RESTful APIs with Go or Node.js
- Develop React-based web UIs
- Work with PostgreSQL & Docker
- Follow secure coding practices (OWASP)

Requirements:
- Bachelor's degree in IT or related field
- Knowledge of React, Go/Node.js, SQL
- Strong collaboration & problem-solving skills
`, []);

  const simulateUpload = (type: "resume" | "job") => {
    if (type === "resume") {
      setResumeUploading(true);
      setTimeout(() => {
        setResumeUploading(false);
        setResumeUploaded(true);
        localStorage.setItem("dummyResume", dummyResume);
        setAiThinking(true);
        setTimeout(() => {
          setAiThinking(false);
          setAiMsg("Nice! Resume loaded. Now add the job posting so I can align your content to it.");
          setAiKey((k) => k + 1);
        }, 800);
      }, 1200);
    } else {
      setJobUploading(true);
      setTimeout(() => {
        setJobUploading(false);
        setJobUploaded(true);
        localStorage.setItem("dummyJobPost", dummyJob);
        setAiThinking(true);
        setTimeout(() => {
          setAiThinking(false);
          setAiMsg("Perfect – both files are ready. Hit Submit and I'll start the analysis.");
          setAiKey((k) => k + 1);
        }, 800);
      }, 1200);
    }
  };

  const handleSubmit = () => {
    if (!resumeUploaded || !jobUploaded) {
      alert("Please upload both Resume and Job Posting first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("uploadDone", "true");
      navigate("/analyze");
    }, 700);
  };

  const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div
      className="rounded-3xl p-6 flex flex-col relative overflow-hidden"
      style={{
        minHeight: 560,
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(10px)",
        border: "2px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 32px rgba(102,126,234,0.2)",
      }}
    >
      <div
        className="absolute w-32 h-32 rounded-full opacity-10 blur-2xl"
        style={{
          background: "radial-gradient(circle, #667eea 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <h2
        className="text-xl font-bold mb-4 text-center relative z-10"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h2>
      <div
        className="flex-1 overflow-auto rounded-2xl relative z-10"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div
        className="rounded-3xl p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(102,126,234,0.3), 0 0 60px rgba(118,75,162,0.2)",
        }}
      >
        {/* Background orbs */}
        <div
          className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #667eea 0%, transparent 70%)",
            top: "-20%",
            right: "-10%",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-56 h-56 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #f093fb 0%, transparent 70%)",
            bottom: "-15%",
            left: "-8%",
            animation: "float 6s ease-in-out infinite reverse",
          }}
        />

        <h1
          className="text-4xl font-bold text-center mb-6 relative z-10"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 30px rgba(102,126,234,0.3)",
          }}
        >
          Upload Resume & Job Posting
        </h1>

        {/* AI Assistant */}
        <div className="mb-8 relative z-10">
          <AIAssistant message={aiMsg} thinking={aiThinking} keySeed={aiKey} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <Card title="Resume">
            {resumeUploading ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div
                  className="w-12 h-12 rounded-full mb-4"
                  style={{
                    border: "4px solid rgba(102,126,234,0.2)",
                    borderTopColor: "#667eea",
                    animation: "spin 0.8s linear infinite",
                    boxShadow: "0 0 20px rgba(102,126,234,0.5)",
                  }}
                />
                <div className="text-sm text-gray-200 font-medium animate-pulse">Uploading resume…</div>
              </div>
            ) : !resumeUploaded ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div
                  className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
                  }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300 mb-5 font-medium">Upload your resume to begin.</p>
                <button
                  onClick={() => simulateUpload("resume")}
                  className="px-6 py-3 text-sm font-bold rounded-xl relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                  }}
                >
                  <span className="relative z-10">Upload Resume</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
                    }}
                  />
                </button>
              </div>
            ) : (
              <pre className="p-4 text-xs whitespace-pre-wrap text-gray-200 leading-relaxed">{dummyResume}</pre>
            )}
          </Card>

          <Card title="Job Posting">
            {jobUploading ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div
                  className="w-12 h-12 rounded-full mb-4"
                  style={{
                    border: "4px solid rgba(118,75,162,0.2)",
                    borderTopColor: "#764ba2",
                    animation: "spin 0.8s linear infinite",
                    boxShadow: "0 0 20px rgba(118,75,162,0.5)",
                  }}
                />
                <div className="text-sm text-gray-200 font-medium animate-pulse">Uploading job posting…</div>
              </div>
            ) : !jobUploaded ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div
                  className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
                    boxShadow: "0 8px 25px rgba(118,75,162,0.4)",
                  }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300 mb-5 font-medium">Upload the job posting to match against.</p>
                <button
                  onClick={() => simulateUpload("job")}
                  className="px-6 py-3 text-sm font-bold rounded-xl relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 4px 15px rgba(118,75,162,0.4)",
                  }}
                >
                  <span className="relative z-10">Upload Job Posting</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, #f093fb 0%, #667eea 100%)",
                    }}
                  />
                </button>
              </div>
            ) : (
              <pre className="p-4 text-xs whitespace-pre-wrap text-gray-200 leading-relaxed">{dummyJob}</pre>
            )}
          </Card>
        </div>

        <div className="text-center mt-8 relative z-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 text-sm font-bold rounded-xl relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: loading ? "none" : "0 4px 15px rgba(102,126,234,0.4)",
            }}
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                  Analyzing…
                </span>
              ) : (
                "Submit & Analyze →"
              )}
            </span>
            {!loading && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
                }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;