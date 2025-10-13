import React, { useEffect, useRef, useState } from "react";

interface AIAssistantProps {
  message: string;
  thinking?: boolean;
  typingSpeedMs?: number;
  keySeed?: string | number;
  header?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  message,
  thinking = false,
  typingSpeedMs = 28,
  keySeed = "",
  header = "AI Assistant",
}) => {
  const [typed, setTyped] = useState("");
  const msgRef = useRef(message);

  useEffect(() => {
    msgRef.current = message;
    setTyped("");
    if (thinking) return;
    let i = 0;
    const id = setInterval(() => {
      setTyped(msgRef.current.slice(0, i + 1));
      i++;
      if (i >= msgRef.current.length) clearInterval(id);
    }, typingSpeedMs);
    return () => clearInterval(id);
  }, [message, typingSpeedMs, thinking, keySeed]);

  return (
    <div
      className="rounded-2xl p-5 shadow-lg relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        border: "2px solid rgba(255,255,255,0.3)",
        boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3), 0 0 30px rgba(118, 75, 162, 0.2)",
        minHeight: "84px",
      }}
    >
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />
      
      {/* Floating orbs for depth */}
      <div
        className="absolute w-20 h-20 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
          top: "-10px",
          right: "20px",
          animation: "float 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-16 h-16 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
          bottom: "-8px",
          left: "30px",
          animation: "float 5s ease-in-out infinite reverse",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center mb-3">
          <div
            className="w-6 h-6 rounded-lg mr-3 relative"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)",
              boxShadow: "0 4px 12px rgba(255,255,255,0.5), inset 0 2px 4px rgba(102,126,234,0.3)",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: "linear-gradient(135deg, transparent 0%, rgba(102,126,234,0.3) 100%)",
                animation: "glow 2s ease-in-out infinite",
              }}
            />
          </div>
          <div
            className="text-sm font-bold tracking-wide"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              letterSpacing: "0.5px",
            }}
          >
            {header}
          </div>
        </div>
        <div
          className="text-sm leading-relaxed"
          style={{
            color: "#ffffff",
            textShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          {thinking ? (
            <span className="inline-flex items-center">
              <span className="flex gap-1 mr-2">
                <span
                  className="inline-block w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: "#ffffff",
                    boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                    animationDelay: "0s",
                  }}
                />
                <span
                  className="inline-block w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: "#ffffff",
                    boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                    animationDelay: "0.15s",
                  }}
                />
                <span
                  className="inline-block w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: "#ffffff",
                    boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                    animationDelay: "0.3s",
                  }}
                />
              </span>
              thinking…
            </span>
          ) : (
            <span style={{ fontStyle: "italic", whiteSpace: "pre-wrap" }}>{typed}</span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;