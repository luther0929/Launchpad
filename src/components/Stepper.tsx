import React from "react";
import { useNavigate } from "react-router-dom";

interface StepperProps {
  steps: string[];
  activeIndex: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, activeIndex }) => {
  const navigate = useNavigate();

  const flags = {
    upload: localStorage.getItem("uploadDone") === "true",
    analyze: localStorage.getItem("analyzeDone") === "true",
    optimize: localStorage.getItem("optimizeDone") === "true",
  };

  const maxAllowedIndex = (() => {
    if (!flags.upload) return 0;
    if (!flags.analyze) return 1;
    if (!flags.optimize) return 2;
    return 3;
  })();

  const handleClick = (step: string, index: number) => {
    if (index > maxAllowedIndex) return;
    const to = `/${step.toLowerCase() === "upload" ? "" : step.toLowerCase()}`;
    navigate(to);
  };

  return (
    <div
      className="flex justify-center items-center space-x-4 text-sm font-medium"
      style={{ color: "#ffffff" }}
    >
      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        const disabled = i > maxAllowedIndex;

        return (
          <div
            key={step}
            className="flex items-center select-none"
            onClick={() => handleClick(step, i)}
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
              transition: "all 0.3s ease",
            }}
            aria-disabled={disabled}
            title={disabled ? "Complete previous steps to continue" : step}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full mr-2 relative overflow-hidden"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : isDone
                  ? "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)"
                  : "rgba(255,255,255,0.1)",
                color: isActive || isDone ? "white" : "#8892b0",
                boxShadow: isActive
                  ? "0 0 20px rgba(102,126,234,0.6), 0 4px 15px rgba(118,75,162,0.4)"
                  : isDone
                  ? "0 0 15px rgba(118,75,162,0.5)"
                  : "none",
                border: isActive || isDone ? "2px solid rgba(255,255,255,0.3)" : "2px solid rgba(255,255,255,0.1)",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              {isActive && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                    backgroundSize: "200% 200%",
                    animation: "shimmer 2s infinite",
                  }}
                />
              )}
              <span className="relative z-10">{i + 1}</span>
            </div>
            <span
              className="font-semibold"
              style={{
                color: isActive ? "#ffffff" : isDone ? "#e2e8f0" : "#8892b0",
                textShadow: isActive ? "0 2px 10px rgba(102,126,234,0.5)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div
                className="w-12 h-1 mx-4 rounded-full relative overflow-hidden"
                style={{
                  background: i < activeIndex
                    ? "linear-gradient(90deg, #764ba2 0%, #f093fb 100%)"
                    : "rgba(255,255,255,0.1)",
                  boxShadow: i < activeIndex ? "0 0 10px rgba(118,75,162,0.5)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {i < activeIndex && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;