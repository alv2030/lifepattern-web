import type { CheckIn, Insight } from "@/types";

export const sampleCheckIns: CheckIn[] = [
  { id: "1", date: "2026-06-10", mood: 6, energy: 4, stress: 8, sleepHours: 5.8, activities: ["Meetings", "Work"], people: ["Manager"], note: "Back-to-back meetings drained me." },
  { id: "2", date: "2026-06-11", mood: 8, energy: 8, stress: 3, sleepHours: 7.5, activities: ["Gym", "Deep work"], people: ["Friend"], note: "Gym and focused work made the day feel clear." },
  { id: "3", date: "2026-06-12", mood: 7, energy: 7, stress: 4, sleepHours: 7.2, activities: ["Outdoor walk", "Family"], people: ["Family"], note: "Dinner with family helped me recover." },
  { id: "4", date: "2026-06-13", mood: 5, energy: 3, stress: 7, sleepHours: 6.1, activities: ["Email", "Work"], people: ["Client"], note: "Too many emails and context switching." },
  { id: "5", date: "2026-06-14", mood: 9, energy: 8, stress: 2, sleepHours: 8.0, activities: ["Gym", "Friends"], people: ["Friend"], note: "A low pressure day with people I like." }
];

export const sampleInsights: Insight[] = [
  {
    id: "stress-meetings",
    type: "stress",
    title: "Meetings may be your biggest stress trigger",
    summary: "Meetings appeared in most of your highest-stress check-ins this week.",
    evidence: ["Average stress with meetings: 8.0", "Average stress without meetings: 3.8", "Stress lift: +4.2"],
    confidence: "Strong pattern",
    reflection: "Which meetings create value, and which ones create friction?"
  },
  {
    id: "energy-gym",
    type: "energy",
    title: "Exercise appears to restore your energy",
    summary: "Gym appeared in your highest-energy days and was linked with lower stress scores.",
    evidence: ["Average energy with gym: 8.0", "Average energy without gym: 4.7", "Energy lift: +3.3"],
    confidence: "Possible pattern",
    reflection: "What is the smallest version of exercise you can keep on busy days?"
  },
  {
    id: "sleep-mood",
    type: "sleep",
    title: "Sleep below 6.5 hours is linked to lower mood",
    summary: "Your mood was lower on days after shorter sleep windows.",
    evidence: ["Mood after 7+ hours sleep: 8.0", "Mood after <6.5 hours sleep: 5.5"],
    confidence: "Possible pattern",
    reflection: "What usually causes your short sleep nights?"
  }
];
