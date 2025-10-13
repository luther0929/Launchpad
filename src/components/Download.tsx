import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AIAssistant from "./AIAssistant";

type Metric = { label: string; value: number };
type Recommendation = {
  id: string;
  lineIndex: number;
  beforeText: string;
  afterText?: string;
  accepted: boolean;
};

const GAUGE_R = 80;
const GAUGE_C = 2 * Math.PI * GAUGE_R;

const Download: React.FC = () => {
  const navigate = useNavigate();

  const [finalResume, setFinalResume] = useState<string[]>([]);
  const [beforeMetrics, setBeforeMetrics] = useState<Metric[]>([]);
  const [afterMetrics, setAfterMetrics] = useState<Metric[]>([]);
  const [acceptedRecs, setAcceptedRecs] = useState<Recommendation[]>([]);
  const [animated, setAnimated] = useState<number[]>([]);
  const [animatedScore, setAnimatedScore] = useState(0);
  const animatedOnce = useRef(false);

  const [aiMsg, setAiMsg] = useState("Here's your improved resume summary!");
  const [aiKey, setAiKey] = useState(0);

  useEffect(() => {
    const resume = JSON.parse(localStorage.getItem("finalResume") || "[]");
    const before = JSON.parse(localStorage.getItem("beforeMetrics") || "[]");
    const after = JSON.parse(localStorage.getItem("afterMetrics") || "[]");
    const recs = JSON.parse(localStorage.getItem("acceptedRecs") || "[]");
    setFinalResume(resume);
    setBeforeMetrics(before);
    setAfterMetrics(after);
    setAcceptedRecs(recs);
    setAnimated(Array(after.length).fill(0));

    if (!animatedOnce.current) {
      animatedOnce.current = true;
      const startScore = before[0]?.value ?? 60;
      const endScore = after[0]?.value ?? 97;
      const start = performance.now();

      const tickScore = (t: number) => {
        const p = Math.min(1, (t - start) / 3000);
        const eased = 1 - Math.pow(1 - p, 3);
        setAnimatedScore(Math.round(startScore + (endScore - startScore) * eased));
        if (p < 1) requestAnimationFrame(tickScore);
      };
      requestAnimationFrame(tickScore);

      const tickMetrics = (t: number) => {
        const p = Math.min(1, (t - start) / 3000);
        const eased = 1 - Math.pow(1 - p, 3);
        setAnimated(after.map((m: Metric, i: number) => Math.round((before[i]?.value ?? 0) + ((m.value - (before[i]?.value ?? 0)) * eased))));
        if (p < 1) requestAnimationFrame(tickMetrics);
      };
      requestAnimationFrame(tickMetrics);

      setTimeout(() => {
        setAiMsg("Excellent optimization! Strong ATS gains, clearer outcomes, and tighter phrasing. Compare the results below and download your optimized resume.");
        setAiKey((k) => k + 1);
      }, 3200);
    }
  }, []);

  const baseBefore = useMemo(() => [
    "JOHN DOE",
    "Full-Stack Developer | Cloud & Security Enthusiast",
    "Brisbane, QLD | john.doe@example.com | linkedin.com/in/johndoe",
    "",
    "SUMMARY",
    "Driven IT graduate with strong foundations in software engineering and cybersecurity.",
    "Hands-on experience building SaaS systems using Go, React, and Docker.",
    "",
    "EXPERIENCE",
    "RightSec – Secure Development Intern | 2024 – Present",
    "• Built APIs with Go Fiber & PostgreSQL",
    "• Integrated KnowBe4 + ZenGuide dashboards for GRC metrics",
    "• Automated compliance workflows reducing manual effort by 60%",
    "",
    "App Factory – Developer | 2023 – Present",
    "• Developed mobile apps using React Native & Expo",
    "• Improved UI responsiveness via TailwindCSS",
    "• Collaborated using Git, Agile sprints, and code reviews",
    "",
    "EDUCATION",
    "Bachelor of Information Technology (Software Development)",
    "Griffith University | GPA: 6.5 (Distinction)",
    "",
    "SKILLS",
    "Go | React | PostgreSQL | Docker | Tailwind | REST APIs | Agile | OWASP",
  ], []);

  const beforeHighlight = (idx: number) => {
    const rec = acceptedRecs.find((r) => r.lineIndex === idx && r.accepted);
    if (!rec) return "transparent";
    if (rec.afterText === "") return "rgba(255,107,157,0.2)";
    if ((rec.afterText || "") !== rec.beforeText) return "rgba(255,211,61,0.2)";
    return "transparent";
  };

  const beforeBorder = (idx: number) => {
    const rec = acceptedRecs.find((r) => r.lineIndex === idx && r.accepted);
    if (!rec) return "none";
    if (rec.afterText === "") return "1px solid rgba(255,107,157,0.4)";
    if ((rec.afterText || "") !== rec.beforeText) return "1px solid rgba(255,211,61,0.4)";
    return "none";
  };

  const afterHighlight = (idx: number) => {
    const rec = acceptedRecs.find((r) => r.lineIndex === idx && r.accepted);
    if (!rec) return "transparent";
    if (rec.afterText === "") return "transparent";
    return "rgba(107,207,127,0.2)";
  };

  const afterBorder = (idx: number) => {
    const rec = acceptedRecs.find((r) => r.lineIndex === idx && r.accepted);
    if (!rec) return "none";
    if (rec.afterText === "") return "none";
    return "1px solid rgba(107,207,127,0.4)";
  };

  const getColor = (val: number, label?: string) => {
    if (label && label.includes("Missing")) {
      if (val < 5) return "#6bcf7f";
      if (val < 10) return "#ffd93d";
      return "#ff6b9d";
    }
    if (val < 50) return "#ff6b9d";
    if (val < 75) return "#ffd93d";
    return "#6bcf7f";
  };

  const handleDownload = () => {
    const blob = new Blob([finalResume.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Optimized_Resume.txt";
    a.click();
  };

  return (
    <div className="page-container">
      <div
        className="rounded-3xl p-8 w-full relative overflow-hidden"
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
          className="text-4xl font-bold text-center mb-8 relative z-10"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 30px rgba(102,126,234,0.3)",
          }}
        >
          Final Report & Download
        </h1>

        {/* Gauge */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="relative w-52 h-52">
            <svg className="w-full h-full" style={{ filter: "drop-shadow(0 0 20px rgba(102,126,234,0.4))" }}>
              <defs>
                <linearGradient id="gaugeGlowDownload" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={getColor(animatedScore)} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={getColor(animatedScore)} stopOpacity="1" />
                </linearGradient>
              </defs>
              <circle cx="104" cy="104" r={GAUGE_R} stroke="rgba(255,255,255,0.1)" strokeWidth="16" fill="none" />
              <circle
                cx="104" cy="104" r={GAUGE_R}
                stroke="url(#gaugeGlowDownload)" strokeWidth="16" fill="none"
                strokeDasharray={`${(animatedScore / 100) * GAUGE_C} ${GAUGE_C}`}
                strokeLinecap="round" transform="rotate(-90 104 104)"
                style={{ transition: "stroke-dasharray 0.3s ease, stroke 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2
                className="text-5xl font-bold"
                style={{
                  color: getColor(animatedScore),
                  textShadow: `0 0 20px ${getColor(animatedScore)}80`,
                }}
              >
                {animatedScore}%
              </h2>
              <p className="text-xs text-gray-300 mt-2 font-medium">ATS Match Score (After)</p>
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="mb-6 relative z-10">
          <AIAssistant message={aiMsg} keySeed={aiKey} />
        </div>

        {/* Metrics: Before vs After */}
        <h2
          className="text-2xl font-bold mb-4 text-center relative z-10"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Metrics Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
          {afterMetrics.map((a: Metric, i: number) => {
            const b = beforeMetrics[i] || { value: 0, label: a.label };
            const now = animated[i] || a.value;
            const delta = Math.round(a.value - (b.value || 0));
            return (
              <div
                key={`${a.label}-${i}`}
                className="rounded-2xl p-5 text-center relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 4px 15px rgba(102,126,234,0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 8px 25px ${getColor(now, a.label)}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(102,126,234,0.2)";
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${getColor(now, a.label)}10 0%, transparent 100%)`,
                  }}
                />
                <h3 className="text-xs font-semibold text-gray-200 mb-3 relative z-10">{a.label}</h3>
                <div
                  className="text-3xl font-bold relative z-10"
                  style={{
                    color: getColor(now, a.label),
                    textShadow: `0 0 15px ${getColor(now, a.label)}60`,
                  }}
                >
                  {Math.round(now)}
                </div>
                <div
                  className="text-xs mt-2 font-semibold relative z-10"
                  style={{
                    color: delta > 0 ? "#6bcf7f" : delta < 0 ? "#ff6b9d" : "#8892b0",
                    textShadow: delta !== 0 ? `0 0 10px ${delta > 0 ? "#6bcf7f" : "#ff6b9d"}60` : "none",
                  }}
                >
                  {a.label.includes("Missing")
                    ? delta < 0
                      ? `▼ ${Math.abs(delta)} (better)`
                      : delta > 0
                      ? `▲ +${delta} (worse)`
                      : "–"
                    : delta > 0
                    ? `▲ +${delta}`
                    : delta < 0
                    ? `▼ ${Math.abs(delta)}`
                    : "–"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Before / After resumes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div>
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Before Resume
            </h2>
            <div
              className="h-[480px] rounded-2xl p-4 text-sm overflow-auto leading-relaxed"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 15px rgba(102,126,234,0.15)",
              }}
            >
              {baseBefore.map((line, idx) => (
                <p
                  key={idx}
                  className="text-gray-100"
                  style={{
                    backgroundColor: beforeHighlight(idx),
                    border: beforeBorder(idx),
                    borderRadius: 6,
                    padding: "4px 8px",
                    marginBottom: 4,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Optimized Resume
            </h2>
            <div
              className="h-[480px] rounded-2xl p-4 text-sm overflow-auto leading-relaxed"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 15px rgba(102,126,234,0.15)",
              }}
            >
              {finalResume.map((line, idx) => (
                <p
                  key={idx}
                  className="text-gray-100"
                  style={{
                    backgroundColor: afterHighlight(idx),
                    border: afterBorder(idx),
                    borderRadius: 6,
                    padding: "4px 8px",
                    marginBottom: 4,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-6 mt-10 relative z-10">
          <button
            onClick={handleDownload}
            className="px-8 py-3 text-sm font-bold rounded-xl relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Optimized Resume
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
              }}
            />
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 text-sm font-bold rounded-xl relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #6bcf7f 0%, #5ab56d 100%)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 15px rgba(107,207,127,0.4)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start New Optimization
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, #5ab56d 0%, #4a9d5c 100%)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Download;