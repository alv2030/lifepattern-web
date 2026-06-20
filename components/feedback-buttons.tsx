"use client";

const FEEDBACK = ["Accurate", "Somewhat", "Not accurate"] as const;

export function FeedbackButtons({ insightId }: { insightId: string }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {FEEDBACK.map((label) => (
        <button
          key={label}
          type="button"
          className="btn-secondary"
          onClick={() => console.log("Feedback:", { insightId, rating: label })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
