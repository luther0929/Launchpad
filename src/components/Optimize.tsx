import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AIAssistant from "./AIAssistant";

type Metric = { label: string; value: number };
type ImpactMap = { [metricIndex: number]: number };
type Decision = "none" | "accepted" | "ignored";

interface Recommendation {
  id: string;
  lineIndex: number;
  title: string;
  description: string;
  beforeText: string;
  afterText?: string;
  decision: Decision;
  impacts: ImpactMap;
}

const GAUGE_R = 80;
const GAUGE_C = 2 * Math.PI * GAUGE_R;

const Optimize: React.FC = () => {
  const navigate = useNavigate();

  const beforeMetrics: Metric[] = useMemo(
    () => JSON.parse(localStorage.getItem("beforeMetrics") || "[]") as Metric[],
    []
  );

  const initial: Metric[] =
    beforeMetrics.length > 0
      ? beforeMetrics
      : [
          { label: "ATS Match Score (%)", value: 62 },
          { label: "Keyword Match Rate (%)", value: 55 },
          { label: "Missing Keywords", value: 12 },
          { label: "Section Parsing Accuracy (%)", value: 70 },
          { label: "Experience Density", value: 63 },
          { label: "Education Alignment Score", value: 71 },
          { label: "Skill Coverage", value: 60 },
          { label: "Tone & Clarity Score", value: 58 },
        ];

  const [metrics, setMetrics] = useState<Metric[]>(initial);
  const [animated, setAnimated] = useState<number[]>(initial.map((m) => m.value));

  const [aiThinking, setAiThinking] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiKey, setAiKey] = useState(0);

  const baseResume = useMemo(
    () => [
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
    ],
    []
  );

  const [recs, setRecs] = useState<Recommendation[]>([
    {
      id: "rec1",
      lineIndex: 10,
      title: "Strengthen impact of API work",
      description: "Quantify outcome to boost credibility and keyword density.",
      beforeText: "• Built APIs with Go Fiber & PostgreSQL",
      afterText: "• Developed and optimized REST APIs improving throughput by 25%",
      decision: "none",
      impacts: { 0: 8, 1: 9, 6: 7, 4: 5 },
    },
    {
      id: "rec2",
      lineIndex: 11,
      title: "Quantify KnowBe4 integration",
      description: "Call out user scale to make results scannable.",
      beforeText: "• Integrated KnowBe4 + ZenGuide dashboards for GRC metrics",
      afterText: "• Integrated KnowBe4 dashboards tracking 1,200+ users in ZenGuide",
      decision: "none",
      impacts: { 0: 7, 1: 8, 4: 6, 3: 5 },
    },
    {
      id: "rec3",
      lineIndex: 16,
      title: "Clarify UX improvement",
      description: "Add measurable outcome for a stronger tone.",
      beforeText: "• Improved UI responsiveness via TailwindCSS",
      afterText: "• Enhanced UX responsiveness by ~25% via TailwindCSS",
      decision: "none",
      impacts: { 0: 7, 7: 9, 4: 5, 6: 6 },
    },
    {
      id: "rec4",
      lineIndex: 6,
      title: "Quantify SaaS impact",
      description: "Results-first phrasing improves clarity & keyword signal.",
      beforeText: "Hands-on experience building SaaS systems using Go, React, and Docker.",
      afterText: "Hands-on experience building SaaS systems reducing deployment time by ~30%.",
      decision: "none",
      impacts: { 0: 8, 7: 7, 6: 6, 1: 5 },
    },
    {
      id: "rec5",
      lineIndex: 5,
      title: "Sharpen summary with outcome",
      description: "Make achievements explicit in the opening summary.",
      beforeText:
        "Driven IT graduate with strong foundations in software engineering and cybersecurity.",
      afterText:
        "Results-driven IT graduate; improved security workflows and reduced manual tasks by 20–30%.",
      decision: "none",
      impacts: { 0: 7, 7: 8, 1: 6, 4: 5 },
    },
    {
      id: "rec6",
      lineIndex: 17,
      title: "Remove redundancy",
      description: "Avoid generic filler; improves parsing & clarity.",
      beforeText: "• Collaborated using Git, Agile sprints, and code reviews",
      afterText: "",
      decision: "none",
      impacts: { 0: 6, 3: 7, 7: 6, 2: 12 },
    },
  ]);

  const currentResume = useMemo(() => {
    const arr = [...baseResume];
    recs.forEach((r) => {
      if (r.decision === "accepted") arr[r.lineIndex] = r.afterText ?? "";
      else arr[r.lineIndex] = r.beforeText;
    });
    return arr;
  }, [baseResume, recs]);

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

  const animateTo = (next: Metric[]) => {
    const from = animated.slice();
    const to = next.map((m) => m.value);
    const start = performance.now();
    const dur = 3000;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(from.map((v, i) => v + (to[i] - v) * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    setMetrics(next);
    requestAnimationFrame(step);
  };

  const applyImpacts = (base: Metric[], impacts: ImpactMap, sign: 1 | -1) => {
    const next = base.map((m) => ({ ...m }));
    for (const [idxStr, delta] of Object.entries(impacts)) {
      const idx = Number(idxStr);
      const adj = delta * sign;
      if (next[idx].label.includes("Missing"))
        next[idx].value = Math.max(0, next[idx].value - adj);
      else next[idx].value = Math.min(100, Math.max(0, next[idx].value + adj));
    }
    return next;
  };

  const aiComments: Record<string, { accept: string; ignore: string }> = {
    rec1: {
      accept: "Great move – quantified API impact boosts keywords and ATS confidence.",
      ignore: "Skipping the API result leaves measurable outcomes untapped.",
    },
    rec2: {
      accept: "Scale added – concrete numbers make your achievements stand out.",
      ignore: "Without scale, the KnowBe4 work remains generic in scans.",
    },
    rec3: {
      accept: "Love it – measurable UX improvement sharpens tone & clarity.",
      ignore: "Vague UX phrasing weakens clarity and recruiter signal.",
    },
    rec4: {
      accept: "Deployment-time reduction signals real, ops-level impact.",
      ignore: "Without results, the SaaS line feels descriptive, not persuasive.",
    },
    rec5: {
      accept: "Stronger opening – your impact is now obvious from the first lines.",
      ignore: "The summary stays safe; you miss a quick credibility lift.",
    },
    rec6: {
      accept: "Redundancy removed – parsing improves and fluff is gone.",
      ignore: "Generic filler remains; parsing and clarity could be tighter.",
    },
  };

  const onDecision = (recId: string, decision: Decision) => {
    setRecs((prev) => {
      const rec = prev.find((r) => r.id === recId);
      if (!rec) return prev;
      if (rec.decision === decision) return prev;

      let nextMetrics = metrics.map((m) => ({ ...m }));
      if (rec.decision === "accepted") nextMetrics = applyImpacts(nextMetrics, rec.impacts, -1);
      if (rec.decision === "ignored") nextMetrics = applyImpacts(nextMetrics, rec.impacts, +1);

      if (decision === "accepted") nextMetrics = applyImpacts(nextMetrics, rec.impacts, +1);
      if (decision === "ignored") nextMetrics = applyImpacts(nextMetrics, rec.impacts, -1);

      // Check if all recommendations are accepted
      const allAccepted = prev.every((r) => (r.id === recId ? decision === "accepted" : r.decision === "accepted"));
      
      if (allAccepted) {
        // Boost all metrics to green range (85-98)
        nextMetrics = nextMetrics.map((m, i) => {
          if (m.label.includes("Missing")) {
            return { ...m, value: 0 }; // Missing keywords should be 0
          } else if (i === 0) {
            return { ...m, value: Math.floor(Math.random() * (98 - 95 + 1)) + 95 }; // ATS: 95-98
          } else {
            return { ...m, value: Math.floor(Math.random() * (96 - 88 + 1)) + 88 }; // Others: 88-96
          }
        });
      }

      animateTo(nextMetrics);

      setAiThinking(true);
      const msg =
        aiComments[rec.id as keyof typeof aiComments]?.[
          decision === "accepted" ? "accept" : "ignore"
        ] || (decision === "accepted" ? "Applied improvement." : "Ignored recommendation.");
      setTimeout(() => {
        setAiThinking(false);
        setAiText(msg);
        setAiKey((k) => k + 1);
      }, 800);

      return prev.map((r) => (r.id === recId ? { ...r, decision } : r));
    });
  };

  useEffect(() => {
    localStorage.setItem("afterMetrics", JSON.stringify(metrics));
    localStorage.setItem("finalResume", JSON.stringify(currentResume));

    const acceptedRecs = recs.map((r) => ({
      id: r.id,
      lineIndex: r.lineIndex,
      beforeText: r.beforeText,
      afterText: r.decision === "accepted" ? (r.afterText ?? "") : r.beforeText,
      accepted: r.decision === "accepted",
    }));
    localStorage.setItem("acceptedRecs", JSON.stringify(acceptedRecs));
    localStorage.setItem("optimizeDone", "true");
  }, [metrics, currentResume, recs]);

  const overall = Math.round(animated[0] || 0);
  const highlight = (idx: number) => {
    const rec = recs.find((r) => r.lineIndex === idx);
    if (!rec) return "transparent";
    if (rec.decision === "accepted") return "rgba(107,207,127,0.2)";
    if (rec.decision === "ignored" || rec.decision === "none") return "rgba(255,107,157,0.15)";
    return "transparent";
  };

  const highlightBorder = (idx: number) => {
    const rec = recs.find((r) => r.lineIndex === idx);
    if (!rec) return "none";
    if (rec.decision === "accepted") return "1px solid rgba(107,207,127,0.4)";
    if (rec.decision === "ignored" || rec.decision === "none") return "1px solid rgba(255,107,157,0.3)";
    return "none";
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
          Optimize Your Resume
        </h1>

        {/* ATS Gauge */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="relative w-52 h-52">
            <svg className="w-full h-full" style={{ filter: "drop-shadow(0 0 20px rgba(102,126,234,0.4))" }}>
              <defs>
                <linearGradient id="gaugeGlowOpt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={getColor(overall, metrics[0]?.label)} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={getColor(overall, metrics[0]?.label)} stopOpacity="1" />
                </linearGradient>
              </defs>
              <circle cx="104" cy="104" r={GAUGE_R} stroke="rgba(255,255,255,0.1)" strokeWidth="16" fill="none" />
              <circle
                cx="104" cy="104" r={GAUGE_R}
                stroke="url(#gaugeGlowOpt)" strokeWidth="16" fill="none"
                strokeDasharray={`${(overall / 100) * GAUGE_C} ${GAUGE_C}`}
                strokeLinecap="round" transform="rotate(-90 104 104)"
                style={{ transition: "stroke-dasharray 0.3s ease, stroke 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2
                className="text-5xl font-bold"
                style={{
                  color: getColor(overall, metrics[0]?.label),
                  textShadow: `0 0 20px ${getColor(overall, metrics[0]?.label)}80`,
                }}
              >
                {overall}%
              </h2>
              <p className="text-xs text-gray-300 mt-2 font-medium">ATS Match Score</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4 relative z-10">
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
                e.currentTarget.style.boxShadow = `0 8px 25px ${getColor(Math.round(animated[i]), m.label)}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(102,126,234,0.2)";
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${getColor(Math.round(animated[i]), m.label)}10 0%, transparent 100%)`,
                }}
              />
              <h3 className="text-xs font-semibold text-gray-200 mb-3 relative z-10">{m.label}</h3>
              <p
                className="text-3xl font-bold relative z-10"
                style={{
                  color: getColor(Math.round(animated[i]), m.label),
                  textShadow: `0 0 15px ${getColor(Math.round(animated[i]), m.label)}60`,
                }}
              >
                {Math.round(animated[i])}
              </p>
            </div>
          ))}
        </div>

        {/* AI Assistant */}
        <div className="mb-8 relative z-10">
          <AIAssistant message={aiText} thinking={aiThinking} keySeed={aiKey} />
        </div>

        {/* Resume + Recs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Resume */}
          <div>
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Resume (Live Updates)
            </h2>
            <div
              className="h-[500px] rounded-2xl p-4 text-sm overflow-auto leading-relaxed"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 15px rgba(102,126,234,0.15)",
              }}
            >
              {currentResume.map((line, idx) => (
                <p
                  key={idx}
                  className="text-gray-100"
                  style={{
                    backgroundColor: highlight(idx),
                    border: highlightBorder(idx),
                    borderRadius: 6,
                    padding: "4px 8px",
                    marginBottom: 4,
                    transition: "all 0.2s ease",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Recommendations
            </h2>
            <div
              className="h-[500px] rounded-2xl p-4 text-sm overflow-auto"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 15px rgba(102,126,234,0.15)",
              }}
            >
              {recs.map((r) => {
                const acceptDisabled = r.decision === "accepted";
                const ignoreDisabled = r.decision === "ignored";
                return (
                  <div
                    key={r.id}
                    className="p-4 mb-4 rounded-xl relative overflow-hidden"
                    style={{
                      background:
                        r.decision === "accepted"
                          ? "linear-gradient(135deg, rgba(107,207,127,0.2) 0%, rgba(107,207,127,0.1) 100%)"
                          : r.decision === "ignored"
                          ? "linear-gradient(135deg, rgba(255,107,157,0.2) 0%, rgba(255,107,157,0.1) 100%)"
                          : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border:
                        r.decision === "accepted"
                          ? "2px solid rgba(107,207,127,0.4)"
                          : r.decision === "ignored"
                          ? "2px solid rgba(255,107,157,0.4)"
                          : "2px solid rgba(255,255,255,0.2)",
                      boxShadow:
                        r.decision === "accepted"
                          ? "0 4px 15px rgba(107,207,127,0.3)"
                          : r.decision === "ignored"
                          ? "0 4px 15px rgba(255,107,157,0.3)"
                          : "0 4px 15px rgba(102,126,234,0.15)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <p className="font-bold text-white mb-2">{r.title}</p>
                    <p className="text-xs text-gray-300 mb-3">{r.description}</p>
                    <div
                      className="rounded-lg p-3 text-xs mb-3"
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="text-gray-300 mb-1">
                        <span className="font-semibold text-white">Line {r.lineIndex + 1}</span>
                      </div>
                      <div className="text-gray-300 mb-1">
                        <span className="italic text-gray-400">Before:</span> <span className="text-white">{r.beforeText || "–"}</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="italic text-gray-400">After:</span>{" "}
                        <span className="text-white">{r.afterText === "" ? "(remove line)" : r.afterText || "–"}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => onDecision(r.id, "accepted")}
                        disabled={acceptDisabled}
                        className="px-4 py-2 text-xs font-bold rounded-lg transition-all relative overflow-hidden group"
                        style={{
                          background: acceptDisabled
                            ? "linear-gradient(135deg, #6bcf7f 0%, #5ab56d 100%)"
                            : "linear-gradient(135deg, #6bcf7f 0%, #5ab56d 100%)",
                          color: "white",
                          border: "2px solid rgba(255,255,255,0.3)",
                          opacity: acceptDisabled ? 0.7 : 1,
                          cursor: acceptDisabled ? "not-allowed" : "pointer",
                          boxShadow: acceptDisabled ? "none" : "0 4px 15px rgba(107,207,127,0.4)",
                        }}
                      >
                        <span className="relative z-10">✅ Accept</span>
                      </button>
                      <button
                        onClick={() => onDecision(r.id, "ignored")}
                        disabled={ignoreDisabled}
                        className="px-4 py-2 text-xs font-bold rounded-lg transition-all relative overflow-hidden group"
                        style={{
                          background: ignoreDisabled
                            ? "linear-gradient(135deg, #ff6b9d 0%, #ee5a8a 100%)"
                            : "linear-gradient(135deg, #ff6b9d 0%, #ee5a8a 100%)",
                          color: "white",
                          border: "2px solid rgba(255,255,255,0.3)",
                          opacity: ignoreDisabled ? 0.7 : 1,
                          cursor: ignoreDisabled ? "not-allowed" : "pointer",
                          boxShadow: ignoreDisabled ? "none" : "0 4px 15px rgba(255,107,157,0.4)",
                        }}
                      >
                        <span className="relative z-10">🚫 Ignore</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center mt-10 relative z-10">
          <button
            onClick={() => navigate("/download")}
            className="px-8 py-3 text-sm font-bold rounded-xl relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
            }}
          >
            <span className="relative z-10">Finalize & Download Resume →</span>
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

export default Optimize;