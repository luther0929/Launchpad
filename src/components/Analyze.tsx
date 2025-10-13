import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AIAssistant from "./AIAssistant";

interface Metric { label: string; value: number; }

const Analyze: React.FC = () => {
  const navigate = useNavigate();

  const flagged = new Set<number>([5, 6, 10, 11, 16, 17]);

  const metrics: Metric[] = [
    { label: "ATS Match Score (%)", value: 62 },
    { label: "Keyword Match Rate (%)", value: 55 },
    { label: "Missing Keywords", value: 12 },
    { label: "Section Parsing Accuracy (%)", value: 70 },
    { label: "Experience Density", value: 63 },
    { label: "Education Alignment Score", value: 71 },
    { label: "Skill Coverage", value: 60 },
    { label: "Tone & Clarity Score", value: 58 },
  ];

  const [animated, setAnimated] = useState(metrics.map(() => 0));

  useEffect(() => {
    const duration = 3000;
    const start = performance.now();
    const from = metrics.map(() => 0);
    const to = metrics.map((m) => m.value);
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(from.map((v, i) => Math.round(v + (to[i] - v) * eased)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    localStorage.setItem("beforeMetrics", JSON.stringify(metrics));
    localStorage.setItem("analyzeDone", "true");
  }, []);

  const color = (v: number) => (v < 50 ? "#ff6b9d" : v < 75 ? "#ffd93d" : "#6bcf7f");
  const overall = Math.round(animated[0] || 0);

  const resumeLines = useMemo(() => (localStorage.getItem("dummyResume") || "").split("\n"), []);
  const jobLines = useMemo(() => (localStorage.getItem("dummyJobPost") || "").split("\n"), []);

  const aiImpression = useMemo(() => {
    const lows = [];
    if (metrics[1].value < 65) lows.push("keyword match");
    if (metrics[6].value < 65) lows.push("skill coverage");
    if (metrics[7].value < 65) lows.push("tone & clarity");
    const tail = lows.length
      ? `Lower scores in ${lows.join(", ")} are holding you back.`
      : `Overall balance is solid with room to push higher.`;
    return `Overall impression: strong foundation; a few targeted edits could push ATS into the 90s. ${tail}`;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
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
          Resume Analysis Dashboard
        </h1>

        {/* Gauge */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="relative w-52 h-52">
            <svg className="w-full h-full" style={{ filter: "drop-shadow(0 0 20px rgba(102,126,234,0.4))" }}>
              <defs>
                <linearGradient id="gaugeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color(overall)} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={color(overall)} stopOpacity="1" />
                </linearGradient>
              </defs>
              <circle cx="104" cy="104" r="80" stroke="rgba(255,255,255,0.1)" strokeWidth="16" fill="none" />
              <circle
                cx="104" cy="104" r="80" stroke="url(#gaugeGlow)" strokeWidth="16" fill="none"
                strokeDasharray={`${(overall / 100) * 2.5 * Math.PI * 80}, ${2.5 * Math.PI * 80}`}
                strokeLinecap="round" transform="rotate(-90 104 104)"
                style={{ transition: "stroke-dasharray 0.3s ease, stroke 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2
                className="text-5xl font-bold"
                style={{
                  color: color(overall),
                  textShadow: `0 0 20px ${color(overall)}80`,
                }}
              >
                {overall}%
              </h2>
              <p className="text-xs text-gray-300 mt-2 font-medium">ATS Match Score</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 relative z-10">
          {metrics.map((m, i) => (
            <div
              key={m.label}
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
                e.currentTarget.style.boxShadow = `0 8px 25px ${color(animated[i])}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(102,126,234,0.2)";
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${color(animated[i])}10 0%, transparent 100%)`,
                }}
              />
              <h3 className="text-xs font-semibold text-gray-200 mb-3 relative z-10">{m.label}</h3>
              <p
                className="text-3xl font-bold relative z-10"
                style={{
                  color: color(animated[i]),
                  textShadow: `0 0 15px ${color(animated[i])}60`,
                }}
              >
                {Math.round(animated[i])}
              </p>
            </div>
          ))}
        </div>

        {/* AI Assistant */}
        <div className="mb-8 relative z-10">
          <AIAssistant message={aiImpression} />
        </div>

        {/* Resume & Job */}
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
              Resume
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
              {resumeLines.map((line, idx) => (
                <p
                  key={idx}
                  className="text-gray-100"
                  style={{
                    backgroundColor: flagged.has(idx) ? "rgba(255,107,157,0.2)" : "transparent",
                    borderRadius: 6,
                    padding: "2px 6px",
                    marginBottom: 2,
                    border: flagged.has(idx) ? "1px solid rgba(255,107,157,0.3)" : "none",
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
              Job Posting
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
              {jobLines.map((line, idx) => (
                <p key={idx} className="text-gray-100" style={{ marginBottom: 2 }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 relative z-10">
          <button
            onClick={() => navigate("/optimize")}
            className="px-8 py-3 text-sm font-bold rounded-xl relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
            }}
          >
            <span className="relative z-10">Optimize Resume →</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analyze;