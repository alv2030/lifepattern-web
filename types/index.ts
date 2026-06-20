export type CheckIn = {
  id: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  sleepHours: number;
  activities: string[];
  people: string[];
  note: string;
};

export type Insight = {
  id: string;
  type: "stress" | "energy" | "sleep" | "best-day" | "hidden";
  title: string;
  summary: string;
  evidence: string[];
  confidence: "Early signal" | "Possible pattern" | "Strong pattern";
  reflection: string;
};
