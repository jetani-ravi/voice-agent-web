import React from "react";

const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
      <span className="dot bg-gray-600"></span>
      <span className="dot bg-gray-600"></span>
      <span className="dot bg-gray-600"></span>
      <style>{`
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );

  export default TypingIndicator;