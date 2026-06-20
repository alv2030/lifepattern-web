import type { CheckIn, Insight } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function fmt(n: number): string {
  return n.toFixed(1);
}

function conf(n: number, delta: number): Insight["confidence"] {
  if (n >= 14 && delta >= 2) return "Strong pattern";
  if (n >= 8 || delta >= 1.5) return "Possible pattern";
  return "Early signal";
}

type Metric = "mood" | "energy" | "stress";

function allTags(c: CheckIn) {
  return [...c.activities, ...c.people];
}

function tagEffect(checkIns: CheckIn[], tag: string, metric: Metric) {
  const with_ = checkIns.filter((c) => allTags(c).includes(tag));
  const without = checkIns.filter((c) => !allTags(c).includes(tag));
  if (with_.length < 2 || !without.length) return null;
  const withAvg = avg(with_.map((c) => c[metric]));
  const withoutAvg = avg(without.map((c) => c[metric]));
  return { withAvg, withoutAvg, count: with_.length, delta: withAvg - withoutAvg };
}

function personEffect(checkIns: CheckIn[], person: string, metric: Metric) {
  const with_ = checkIns.filter((c) => c.people.includes(person));
  const without = checkIns.filter((c) => !c.people.includes(person));
  if (with_.length < 2 || !without.length) return null;
  const withAvg = avg(with_.map((c) => c[metric]));
  const withoutAvg = avg(without.map((c) => c[metric]));
  return { withAvg, withoutAvg, count: with_.length, delta: withAvg - withoutAvg };
}

function activityEffect(checkIns: CheckIn[], activity: string, metric: Metric) {
  const with_ = checkIns.filter((c) => c.activities.includes(activity));
  const without = checkIns.filter((c) => !c.activities.includes(activity));
  if (with_.length < 2 || !without.length) return null;
  const withAvg = avg(with_.map((c) => c[metric]));
  const withoutAvg = avg(without.map((c) => c[metric]));
  return { withAvg, withoutAvg, count: with_.length, delta: withAvg - withoutAvg };
}

function trendDelta(checkIns: CheckIn[], metric: Metric): number {
  if (checkIns.length < 6) return 0;
  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const half = Math.floor(sorted.length / 2);
  return avg(sorted.slice(half).map((c) => c[metric])) - avg(sorted.slice(0, half).map((c) => c[metric]));
}

function uniqueTags(checkIns: CheckIn[]) {
  return Array.from(new Set(checkIns.flatMap(allTags)));
}

function uniquePeople(checkIns: CheckIn[]) {
  return Array.from(new Set(checkIns.flatMap((c) => c.people)));
}

// ─── Sleep rules (1–10) ──────────────────────────────────────────────────────

function sleepMoodBoost(ci: CheckIn[]): Insight | null {
  const good = ci.filter((c) => c.sleepHours >= 7);
  const low = ci.filter((c) => c.sleepHours < 6.5);
  if (!good.length || !low.length) return null;
  const delta = avg(good.map((c) => c.mood)) - avg(low.map((c) => c.mood));
  if (delta < 1) return null;
  return {
    id: "sleep-mood-boost", type: "sleep",
    title: "Good sleep lifts your mood",
    summary: "Your mood is noticeably higher on days after 7+ hours of sleep.",
    evidence: [`Mood after 7+ hours: ${fmt(avg(good.map((c) => c.mood)))}`, `Mood after <6.5 hours: ${fmt(avg(low.map((c) => c.mood)))}`, `Mood boost: +${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "What would you need to change to get 7+ hours more consistently?",
  };
}

function sleepEnergyBoost(ci: CheckIn[]): Insight | null {
  const good = ci.filter((c) => c.sleepHours >= 7);
  const low = ci.filter((c) => c.sleepHours < 6.5);
  if (!good.length || !low.length) return null;
  const delta = avg(good.map((c) => c.energy)) - avg(low.map((c) => c.energy));
  if (delta < 1) return null;
  return {
    id: "sleep-energy-boost", type: "sleep",
    title: "Sleep fuels your energy",
    summary: "Your energy is significantly higher on days after 7+ hours of sleep.",
    evidence: [`Energy after 7+ hours: ${fmt(avg(good.map((c) => c.energy)))}`, `Energy after <6.5 hours: ${fmt(avg(low.map((c) => c.energy)))}`, `Energy boost: +${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "What drains your energy on low-sleep days, and can any of that be reduced?",
  };
}

function sleepStressRelief(ci: CheckIn[]): Insight | null {
  const good = ci.filter((c) => c.sleepHours >= 7);
  const low = ci.filter((c) => c.sleepHours < 6.5);
  if (!good.length || !low.length) return null;
  const delta = avg(low.map((c) => c.stress)) - avg(good.map((c) => c.stress));
  if (delta < 1) return null;
  return {
    id: "sleep-stress-relief", type: "sleep",
    title: "Sleep reduces your stress",
    summary: "Your stress is lower on days after getting 7+ hours of sleep.",
    evidence: [`Stress after 7+ hours: ${fmt(avg(good.map((c) => c.stress)))}`, `Stress after <6.5 hours: ${fmt(avg(low.map((c) => c.stress)))}`, `Stress reduction: -${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "Which stressors feel more manageable when you're well-rested?",
  };
}

function sleepDeficitMood(ci: CheckIn[]): Insight | null {
  const deficit = ci.filter((c) => c.sleepHours < 6);
  if (deficit.length < 2 || deficit.length / ci.length < 0.25) return null;
  const moodOther = avg(ci.filter((c) => c.sleepHours >= 6).map((c) => c.mood));
  const delta = moodOther - avg(deficit.map((c) => c.mood));
  if (delta < 0.8) return null;
  return {
    id: "sleep-deficit-mood", type: "sleep",
    title: "Frequent short nights are affecting your mood",
    summary: `${Math.round((deficit.length / ci.length) * 100)}% of your nights have been under 6 hours, and mood is lower on those days.`,
    evidence: [`Days with <6h sleep: ${deficit.length}`, `Avg mood on short nights: ${fmt(avg(deficit.map((c) => c.mood)))}`, `Avg mood otherwise: ${fmt(moodOther)}`],
    confidence: conf(ci.length, delta),
    reflection: "What's getting in the way of hitting 6+ hours of sleep?",
  };
}

function sleepDeficitEnergy(ci: CheckIn[]): Insight | null {
  const deficit = ci.filter((c) => c.sleepHours < 6);
  if (deficit.length < 2 || deficit.length / ci.length < 0.25) return null;
  const energyOther = avg(ci.filter((c) => c.sleepHours >= 6).map((c) => c.energy));
  const delta = energyOther - avg(deficit.map((c) => c.energy));
  if (delta < 0.8) return null;
  return {
    id: "sleep-deficit-energy", type: "sleep",
    title: "Short nights are draining your energy",
    summary: "Your energy takes a noticeable hit on days after less than 6 hours of sleep.",
    evidence: [`Energy after <6h: ${fmt(avg(deficit.map((c) => c.energy)))}`, `Energy after 6+ hours: ${fmt(energyOther)}`, `Energy cost: -${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "What's one change that could add 30–60 minutes to your sleep?",
  };
}

function sleepDeficitStress(ci: CheckIn[]): Insight | null {
  const deficit = ci.filter((c) => c.sleepHours < 6);
  if (deficit.length < 2) return null;
  const stressOther = avg(ci.filter((c) => c.sleepHours >= 6).map((c) => c.stress));
  const delta = avg(deficit.map((c) => c.stress)) - stressOther;
  if (delta < 1) return null;
  return {
    id: "sleep-deficit-stress", type: "sleep",
    title: "Poor sleep drives up your stress",
    summary: "Stress is markedly higher on days following less than 6 hours of sleep.",
    evidence: [`Stress after <6h sleep: ${fmt(avg(deficit.map((c) => c.stress)))}`, `Stress after 6+ hours: ${fmt(stressOther)}`, `Stress increase: +${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "Do certain stressors feel more overwhelming when you're sleep-deprived?",
  };
}

function sleep8PlusBenefit(ci: CheckIn[]): Insight | null {
  const eightPlus = ci.filter((c) => c.sleepHours >= 8);
  const under8 = ci.filter((c) => c.sleepHours < 8);
  if (eightPlus.length < 2 || !under8.length) return null;
  const moodDelta = avg(eightPlus.map((c) => c.mood)) - avg(under8.map((c) => c.mood));
  const energyDelta = avg(eightPlus.map((c) => c.energy)) - avg(under8.map((c) => c.energy));
  if (moodDelta < 1 && energyDelta < 1) return null;
  return {
    id: "sleep-8plus-benefit", type: "sleep",
    title: "8+ hours of sleep gives you a noticeable edge",
    summary: "Your mood and energy are significantly higher on days after 8+ hours of sleep.",
    evidence: [`Mood: ${fmt(avg(eightPlus.map((c) => c.mood)))} vs ${fmt(avg(under8.map((c) => c.mood)))}`, `Energy: ${fmt(avg(eightPlus.map((c) => c.energy)))} vs ${fmt(avg(under8.map((c) => c.energy)))}`, `Days with 8+ hours: ${eightPlus.length}`],
    confidence: conf(ci.length, Math.max(moodDelta, energyDelta)),
    reflection: "Is 8 hours of sleep realistically achievable a few nights per week?",
  };
}

function sleepConsistency(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const sleepVals = ci.map((c) => c.sleepHours);
  const mean = avg(sleepVals);
  const stdDev = Math.sqrt(avg(sleepVals.map((h) => Math.pow(h - mean, 2))));
  if (stdDev < 1.5) return null;
  const consistent = ci.filter((c) => Math.abs(c.sleepHours - mean) <= 0.5);
  const irregular = ci.filter((c) => Math.abs(c.sleepHours - mean) > 1.5);
  if (!consistent.length || !irregular.length) return null;
  const delta = avg(consistent.map((c) => c.mood)) - avg(irregular.map((c) => c.mood));
  if (Math.abs(delta) < 0.8) return null;
  return {
    id: "sleep-consistency", type: "sleep",
    title: "Irregular sleep is affecting your wellbeing",
    summary: `Your sleep varies by ${fmt(stdDev)} hours night to night — consistent sleep is linked to better mood.`,
    evidence: [`Sleep range: ${Math.min(...sleepVals).toFixed(1)}h – ${Math.max(...sleepVals).toFixed(1)}h`, `Mood on consistent nights: ${fmt(avg(consistent.map((c) => c.mood)))}`, `Mood on irregular nights: ${fmt(avg(irregular.map((c) => c.mood)))}`],
    confidence: conf(ci.length, Math.abs(delta)),
    reflection: "What causes your most inconsistent sleep nights? Is there a pattern?",
  };
}

function chronicLowSleep(ci: CheckIn[]): Insight | null {
  const low = ci.filter((c) => c.sleepHours < 6.5);
  if (!low.length || low.length / ci.length < 0.4) return null;
  return {
    id: "chronic-low-sleep", type: "sleep",
    title: "You're consistently under-sleeping",
    summary: `${Math.round((low.length / ci.length) * 100)}% of your tracked nights have been under 6.5 hours.`,
    evidence: [`Under-6.5h nights: ${low.length} of ${ci.length}`, `Your avg mood: ${fmt(avg(ci.map((c) => c.mood)))}`, `Your avg energy: ${fmt(avg(ci.map((c) => c.energy)))}`],
    confidence: "Possible pattern",
    reflection: "What would 7 hours of sleep add to your days? What would you need to give up to get there?",
  };
}

function optimalSleepSweetSpot(ci: CheckIn[]): Insight | null {
  if (ci.length < 8) return null;
  const windows = [{ label: "7–7.5h", min: 7, max: 7.5 }, { label: "7.5–8h", min: 7.5, max: 8 }, { label: "8–9h", min: 8, max: 9 }];
  const results = windows
    .map((w) => ({ ...w, entries: ci.filter((c) => c.sleepHours >= w.min && c.sleepHours < w.max) }))
    .filter((w) => w.entries.length >= 2)
    .map((w) => ({ ...w, score: avg(w.entries.map((c) => c.mood)) + avg(w.entries.map((c) => c.energy)) }));
  if (results.length < 2) return null;
  const best = results.reduce((a, b) => (a.score > b.score ? a : b));
  const worst = results.reduce((a, b) => (a.score < b.score ? a : b));
  if (best.score - worst.score < 1.5) return null;
  return {
    id: "optimal-sleep-sweet-spot", type: "sleep",
    title: `${best.label} looks like your sleep sweet spot`,
    summary: `Your mood and energy are highest when you sleep ${best.label}.`,
    evidence: [`Mood at ${best.label}: ${fmt(avg(best.entries.map((c) => c.mood)))}`, `Energy at ${best.label}: ${fmt(avg(best.entries.map((c) => c.energy)))}`, `Sample: ${best.entries.length} nights`],
    confidence: conf(ci.length, best.score - worst.score),
    reflection: `What would help you hit ${best.label} of sleep more consistently?`,
  };
}

// ─── Stress rules (11–20) ────────────────────────────────────────────────────

function stressTopTrigger(ci: CheckIn[]): Insight | null {
  const best = uniqueTags(ci)
    .map((tag) => { const e = tagEffect(ci, tag, "stress"); return e ? { tag, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.delta - a.delta)[0];
  if (!best || best.delta < 1) return null;
  return {
    id: "stress-top-trigger", type: "stress",
    title: `${best.tag} may be linked to higher stress`,
    summary: `Your stress is consistently higher on days involving ${best.tag}.`,
    evidence: [`Stress with ${best.tag}: ${fmt(best.withAvg)}`, `Stress without ${best.tag}: ${fmt(best.withoutAvg)}`, `Stress lift: +${fmt(best.delta)}`],
    confidence: conf(ci.length, best.delta),
    reflection: `What about ${best.tag} creates pressure? Which parts of it are within your control?`,
  };
}

function stressTopReliever(ci: CheckIn[]): Insight | null {
  const best = uniqueTags(ci)
    .map((tag) => { const e = tagEffect(ci, tag, "stress"); return e ? { tag, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.delta - b.delta)[0];
  if (!best || best.delta > -1) return null;
  return {
    id: "stress-top-reliever", type: "stress",
    title: `${best.tag} appears to lower your stress`,
    summary: `Days involving ${best.tag} tend to be lower-stress than your baseline.`,
    evidence: [`Stress with ${best.tag}: ${fmt(best.withAvg)}`, `Stress without ${best.tag}: ${fmt(best.withoutAvg)}`, `Stress reduction: ${fmt(best.delta)}`],
    confidence: conf(ci.length, Math.abs(best.delta)),
    reflection: `How can you incorporate more ${best.tag} into your week?`,
  };
}

function stressRisingTrend(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const delta = trendDelta(ci, "stress");
  if (delta < 0.8) return null;
  return {
    id: "stress-rising-trend", type: "stress",
    title: "Your stress has been rising",
    summary: "Stress levels have trended upward over the period you've been tracking.",
    evidence: [`Recent avg stress: ${fmt(avg(ci.slice(0, 7).map((c) => c.stress)))}`, `Overall avg stress: ${fmt(avg(ci.map((c) => c.stress)))}`, `Upward trend: +${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "What's changed recently that might be contributing to more stress?",
  };
}

function stressFallingTrend(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const delta = trendDelta(ci, "stress");
  if (delta > -0.8) return null;
  return {
    id: "stress-falling-trend", type: "stress",
    title: "Your stress has been declining — good sign",
    summary: "Stress levels have trended downward recently, which is a positive shift.",
    evidence: [`Recent avg stress: ${fmt(avg(ci.slice(0, 7).map((c) => c.stress)))}`, `Overall avg stress: ${fmt(avg(ci.map((c) => c.stress)))}`, `Downward trend: ${fmt(delta)}`],
    confidence: conf(ci.length, Math.abs(delta)),
    reflection: "What's been different recently that might be reducing your stress?",
  };
}

function highStressDays(ci: CheckIn[]): Insight | null {
  const high = ci.filter((c) => c.stress >= 7);
  if (high.length / ci.length < 0.35) return null;
  return {
    id: "high-stress-days", type: "stress",
    title: "High-stress days are happening frequently",
    summary: `${Math.round((high.length / ci.length) * 100)}% of your tracked days have had stress of 7 or higher.`,
    evidence: [`High-stress days (7+): ${high.length} of ${ci.length}`, `Avg stress on those days: ${fmt(avg(high.map((c) => c.stress)))}`, `Avg mood on high-stress days: ${fmt(avg(high.map((c) => c.mood)))}`],
    confidence: conf(ci.length, high.length / ci.length),
    reflection: "Of your recent high-stress days, which felt most preventable?",
  };
}

function stressMoodInverse(ci: CheckIn[]): Insight | null {
  if (ci.length < 6) return null;
  const high = ci.filter((c) => c.stress >= 7);
  const low = ci.filter((c) => c.stress <= 4);
  if (!high.length || !low.length) return null;
  const delta = avg(low.map((c) => c.mood)) - avg(high.map((c) => c.mood));
  if (delta < 1.5) return null;
  return {
    id: "stress-mood-inverse", type: "stress",
    title: "Stress and mood are strongly linked for you",
    summary: "Your mood is significantly higher on low-stress days.",
    evidence: [`Mood when stress ≤4: ${fmt(avg(low.map((c) => c.mood)))}`, `Mood when stress ≥7: ${fmt(avg(high.map((c) => c.mood)))}`, `Mood difference: ${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "Which stress management approaches have helped you most in the past?",
  };
}

function stressEnergyDrain(ci: CheckIn[]): Insight | null {
  if (ci.length < 6) return null;
  const high = ci.filter((c) => c.stress >= 7);
  const low = ci.filter((c) => c.stress <= 4);
  if (!high.length || !low.length) return null;
  const delta = avg(low.map((c) => c.energy)) - avg(high.map((c) => c.energy));
  if (delta < 1.5) return null;
  return {
    id: "stress-energy-drain", type: "stress",
    title: "High stress is depleting your energy",
    summary: "Your energy is significantly lower on high-stress days.",
    evidence: [`Energy when stress ≤4: ${fmt(avg(low.map((c) => c.energy)))}`, `Energy when stress ≥7: ${fmt(avg(high.map((c) => c.energy)))}`, `Energy difference: ${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "What do you do on high-stress days to maintain your energy?",
  };
}

function stressPersonTrigger(ci: CheckIn[]): Insight | null {
  const worst = uniquePeople(ci)
    .map((p) => { const e = personEffect(ci, p, "stress"); return e ? { person: p, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.delta - a.delta)[0];
  if (!worst || worst.delta < 1.2) return null;
  return {
    id: "stress-person-trigger", type: "stress",
    title: `Days with ${worst.person} tend to be more stressful`,
    summary: `Your stress is higher on days when ${worst.person} is involved.`,
    evidence: [`Stress with ${worst.person}: ${fmt(worst.withAvg)}`, `Stress without ${worst.person}: ${fmt(worst.withoutAvg)}`, `Stress increase: +${fmt(worst.delta)}`],
    confidence: conf(ci.length, worst.delta),
    reflection: `What aspects of your interactions with ${worst.person} feel most draining? Is there a way to change the dynamic?`,
  };
}

function stressPersonReliever(ci: CheckIn[]): Insight | null {
  const best = uniquePeople(ci)
    .map((p) => { const e = personEffect(ci, p, "stress"); return e ? { person: p, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.delta - b.delta)[0];
  if (!best || best.delta > -1) return null;
  return {
    id: "stress-person-reliever", type: "stress",
    title: `Time with ${best.person} seems to reduce your stress`,
    summary: `Days involving ${best.person} tend to be calmer than your baseline.`,
    evidence: [`Stress with ${best.person}: ${fmt(best.withAvg)}`, `Stress without ${best.person}: ${fmt(best.withoutAvg)}`, `Stress reduction: ${fmt(best.delta)}`],
    confidence: conf(ci.length, Math.abs(best.delta)),
    reflection: `What makes time with ${best.person} feel calming? Can you see them more regularly?`,
  };
}

function stressRecovery(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const sorted = [...ci].sort((a, b) => a.date.localeCompare(b.date));
  const drops: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].stress >= 7 && sorted[i + 1].stress <= 5) {
      drops.push(sorted[i].stress - sorted[i + 1].stress);
    }
  }
  if (drops.length < 2) return null;
  const meanDrop = avg(drops);
  if (meanDrop < 1.5) return null;
  return {
    id: "stress-recovery", type: "stress",
    title: "You tend to bounce back from stress quickly",
    summary: "After high-stress days, your stress often drops significantly the next day.",
    evidence: [`Recovery instances: ${drops.length}`, `Average next-day stress drop: -${fmt(meanDrop)}`, "This pattern suggests strong stress resilience"],
    confidence: conf(ci.length, meanDrop),
    reflection: "What do you do on recovery days? Are there habits helping the bounce-back?",
  };
}

// ─── Energy rules (21–30) ────────────────────────────────────────────────────

function energyTopSource(ci: CheckIn[]): Insight | null {
  const best = uniqueTags(ci)
    .map((tag) => { const e = tagEffect(ci, tag, "energy"); return e ? { tag, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.delta - a.delta)[0];
  if (!best || best.delta < 1) return null;
  return {
    id: "energy-top-source", type: "energy",
    title: `${best.tag} appears to be an energy source`,
    summary: `Your energy is higher on days involving ${best.tag}.`,
    evidence: [`Energy with ${best.tag}: ${fmt(best.withAvg)}`, `Energy without ${best.tag}: ${fmt(best.withoutAvg)}`, `Energy boost: +${fmt(best.delta)}`],
    confidence: conf(ci.length, best.delta),
    reflection: `How can you make ${best.tag} a more regular part of your week?`,
  };
}

function energyTopDrain(ci: CheckIn[]): Insight | null {
  const worst = uniqueTags(ci)
    .map((tag) => { const e = tagEffect(ci, tag, "energy"); return e ? { tag, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.delta - b.delta)[0];
  if (!worst || worst.delta > -1) return null;
  return {
    id: "energy-top-drain", type: "energy",
    title: `${worst.tag} may be draining your energy`,
    summary: `Energy tends to be lower on days involving ${worst.tag}.`,
    evidence: [`Energy with ${worst.tag}: ${fmt(worst.withAvg)}`, `Energy without ${worst.tag}: ${fmt(worst.withoutAvg)}`, `Energy cost: ${fmt(worst.delta)}`],
    confidence: conf(ci.length, Math.abs(worst.delta)),
    reflection: `Is there a way to manage ${worst.tag} differently to preserve more energy?`,
  };
}

function energyRisingTrend(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const delta = trendDelta(ci, "energy");
  if (delta < 0.8) return null;
  return {
    id: "energy-rising-trend", type: "energy",
    title: "Your energy has been improving",
    summary: "Energy levels have trended upward over your tracked period.",
    evidence: [`Recent avg energy: ${fmt(avg(ci.slice(0, 7).map((c) => c.energy)))}`, `Improvement trend: +${fmt(delta)}`, `Based on ${ci.length} check-ins`],
    confidence: conf(ci.length, delta),
    reflection: "What's different recently that might be boosting your energy?",
  };
}

function energyFallingTrend(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const delta = trendDelta(ci, "energy");
  if (delta > -0.8) return null;
  return {
    id: "energy-falling-trend", type: "energy",
    title: "Your energy has been declining",
    summary: "Energy levels have drifted downward over the period you've been tracking.",
    evidence: [`Recent avg energy: ${fmt(avg(ci.slice(0, 7).map((c) => c.energy)))}`, `Downward trend: ${fmt(delta)}`, `Based on ${ci.length} check-ins`],
    confidence: conf(ci.length, Math.abs(delta)),
    reflection: "What's been different lately that might be contributing to lower energy?",
  };
}

function energySleepLink(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const meanSleep = avg(ci.map((c) => c.sleepHours));
  const aboveSleep = ci.filter((c) => c.sleepHours > meanSleep);
  const belowSleep = ci.filter((c) => c.sleepHours < meanSleep);
  if (!aboveSleep.length || !belowSleep.length) return null;
  const delta = avg(aboveSleep.map((c) => c.energy)) - avg(belowSleep.map((c) => c.energy));
  if (delta < 1) return null;
  return {
    id: "energy-sleep-link", type: "energy",
    title: "Your energy closely tracks your sleep",
    summary: "The more you sleep, the higher your energy — the correlation is consistent.",
    evidence: [`Energy on above-avg sleep nights: ${fmt(avg(aboveSleep.map((c) => c.energy)))}`, `Energy on below-avg sleep nights: ${fmt(avg(belowSleep.map((c) => c.energy)))}`, `Your avg sleep: ${fmt(meanSleep)} hours`],
    confidence: conf(ci.length, delta),
    reflection: "Since sleep is your main energy lever, what's making it hard to sleep more?",
  };
}

function lowEnergyPattern(ci: CheckIn[]): Insight | null {
  const low = ci.filter((c) => c.energy <= 4);
  if (low.length / ci.length < 0.35) return null;
  return {
    id: "low-energy-pattern", type: "energy",
    title: "Low energy is a recurring pattern",
    summary: `${Math.round((low.length / ci.length) * 100)}% of your tracked days have had energy of 4 or below.`,
    evidence: [`Low-energy days (≤4): ${low.length} of ${ci.length}`, `Your avg energy: ${fmt(avg(ci.map((c) => c.energy)))}`, `Avg mood on low-energy days: ${fmt(avg(low.map((c) => c.mood)))}`],
    confidence: conf(ci.length, low.length / ci.length),
    reflection: "Which low-energy days were most preventable? What was different on higher-energy days?",
  };
}

function energyPersonBoost(ci: CheckIn[]): Insight | null {
  const best = uniquePeople(ci)
    .map((p) => { const e = personEffect(ci, p, "energy"); return e ? { person: p, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.delta - a.delta)[0];
  if (!best || best.delta < 1) return null;
  return {
    id: "energy-person-boost", type: "energy",
    title: `Time with ${best.person} seems to energize you`,
    summary: `Your energy is higher on days when you spend time with ${best.person}.`,
    evidence: [`Energy with ${best.person}: ${fmt(best.withAvg)}`, `Energy without ${best.person}: ${fmt(best.withoutAvg)}`, `Energy boost: +${fmt(best.delta)}`],
    confidence: conf(ci.length, best.delta),
    reflection: `What about your time with ${best.person} feels most energizing?`,
  };
}

function energyMoodSync(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const high = ci.filter((c) => c.energy >= 7);
  const low = ci.filter((c) => c.energy <= 4);
  if (!high.length || !low.length) return null;
  const delta = avg(high.map((c) => c.mood)) - avg(low.map((c) => c.mood));
  if (delta < 1.5) return null;
  return {
    id: "energy-mood-sync", type: "energy",
    title: "Your energy and mood move together",
    summary: "On your highest-energy days, mood is also elevated — and vice versa.",
    evidence: [`Mood on high-energy days (7+): ${fmt(avg(high.map((c) => c.mood)))}`, `Mood on low-energy days (≤4): ${fmt(avg(low.map((c) => c.mood)))}`, `Difference: ${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "Does energy drive your mood, or does mood drive your energy? Which can you influence first?",
  };
}

function exerciseEnergyBoost(ci: CheckIn[]): Insight | null {
  const eff = activityEffect(ci, "Exercise", "energy");
  if (!eff || eff.delta < 1) return null;
  return {
    id: "exercise-energy-boost", type: "energy",
    title: "Exercise boosts your energy",
    summary: "Your energy is noticeably higher on days you exercise.",
    evidence: [`Energy on exercise days: ${fmt(eff.withAvg)}`, `Energy on other days: ${fmt(eff.withoutAvg)}`, `Energy boost: +${fmt(eff.delta)}`],
    confidence: conf(ci.length, eff.delta),
    reflection: "What type of exercise gives you the biggest energy boost?",
  };
}

function energyStressInverse(ci: CheckIn[]): Insight | null {
  if (ci.length < 6) return null;
  const high = ci.filter((c) => c.energy >= 7);
  const low = ci.filter((c) => c.energy <= 4);
  if (!high.length || !low.length) return null;
  const delta = avg(low.map((c) => c.stress)) - avg(high.map((c) => c.stress));
  if (delta < 1.5) return null;
  return {
    id: "energy-stress-inverse", type: "energy",
    title: "High energy and low stress go together",
    summary: "Your stress is significantly lower on your highest-energy days.",
    evidence: [`Stress on high-energy days (7+): ${fmt(avg(high.map((c) => c.stress)))}`, `Stress on low-energy days (≤4): ${fmt(avg(low.map((c) => c.stress)))}`, `Difference: ${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "What comes first for you — does energy prevent stress, or does low stress create energy?",
  };
}

// ─── Mood rules (31–40) ──────────────────────────────────────────────────────

function moodTopTrigger(ci: CheckIn[]): Insight | null {
  const best = uniqueTags(ci)
    .map((tag) => { const e = tagEffect(ci, tag, "mood"); return e ? { tag, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.delta - a.delta)[0];
  if (!best || best.delta < 1) return null;
  return {
    id: "mood-top-trigger", type: "mood",
    title: `${best.tag} is linked to your best moods`,
    summary: `Your mood is higher on days involving ${best.tag}.`,
    evidence: [`Mood with ${best.tag}: ${fmt(best.withAvg)}`, `Mood without ${best.tag}: ${fmt(best.withoutAvg)}`, `Mood boost: +${fmt(best.delta)}`],
    confidence: conf(ci.length, best.delta),
    reflection: `What makes ${best.tag} days feel good? Can you create more of that?`,
  };
}

function moodTopDrain(ci: CheckIn[]): Insight | null {
  const worst = uniqueTags(ci)
    .map((tag) => { const e = tagEffect(ci, tag, "mood"); return e ? { tag, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.delta - b.delta)[0];
  if (!worst || worst.delta > -1) return null;
  return {
    id: "mood-top-drain", type: "mood",
    title: `${worst.tag} tends to lower your mood`,
    summary: `Your mood is lower on days involving ${worst.tag}.`,
    evidence: [`Mood with ${worst.tag}: ${fmt(worst.withAvg)}`, `Mood without ${worst.tag}: ${fmt(worst.withoutAvg)}`, `Mood impact: ${fmt(worst.delta)}`],
    confidence: conf(ci.length, Math.abs(worst.delta)),
    reflection: `What aspects of ${worst.tag} feel draining? Is there a way to approach it differently?`,
  };
}

function moodRisingTrend(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const delta = trendDelta(ci, "mood");
  if (delta < 0.8) return null;
  return {
    id: "mood-rising-trend", type: "mood",
    title: "Your mood has been improving",
    summary: "Mood has trended upward across your tracked period — a positive sign.",
    evidence: [`Recent avg mood: ${fmt(avg(ci.slice(0, 7).map((c) => c.mood)))}`, `Upward trend: +${fmt(delta)}`, `Based on ${ci.length} check-ins`],
    confidence: conf(ci.length, delta),
    reflection: "What's been different recently that might be lifting your mood?",
  };
}

function moodFallingTrend(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const delta = trendDelta(ci, "mood");
  if (delta > -0.8) return null;
  return {
    id: "mood-falling-trend", type: "mood",
    title: "Your mood has been declining",
    summary: "Mood has drifted downward over your tracked period.",
    evidence: [`Recent avg mood: ${fmt(avg(ci.slice(0, 7).map((c) => c.mood)))}`, `Downward trend: ${fmt(delta)}`, `Based on ${ci.length} check-ins`],
    confidence: conf(ci.length, Math.abs(delta)),
    reflection: "What's been weighing on you recently? Are there patterns in your lowest-mood days?",
  };
}

function moodPersonPositive(ci: CheckIn[]): Insight | null {
  const best = uniquePeople(ci)
    .map((p) => { const e = personEffect(ci, p, "mood"); return e ? { person: p, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.delta - a.delta)[0];
  if (!best || best.delta < 1) return null;
  return {
    id: "mood-person-positive", type: "mood",
    title: `${best.person} seems to lift your mood`,
    summary: `Days involving ${best.person} are consistently better-mood days.`,
    evidence: [`Mood with ${best.person}: ${fmt(best.withAvg)}`, `Mood without ${best.person}: ${fmt(best.withoutAvg)}`, `Mood boost: +${fmt(best.delta)}`],
    confidence: conf(ci.length, best.delta),
    reflection: `What about your time with ${best.person} feels most nourishing?`,
  };
}

function moodPersonNegative(ci: CheckIn[]): Insight | null {
  const worst = uniquePeople(ci)
    .map((p) => { const e = personEffect(ci, p, "mood"); return e ? { person: p, ...e } : null; })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.delta - b.delta)[0];
  if (!worst || worst.delta > -1) return null;
  return {
    id: "mood-person-negative", type: "mood",
    title: `Days with ${worst.person} tend to be lower-mood days`,
    summary: `Your mood is lower on days involving ${worst.person}.`,
    evidence: [`Mood with ${worst.person}: ${fmt(worst.withAvg)}`, `Mood without ${worst.person}: ${fmt(worst.withoutAvg)}`, `Mood impact: ${fmt(worst.delta)}`],
    confidence: conf(ci.length, Math.abs(worst.delta)),
    reflection: `What feels difficult about your interactions with ${worst.person}? Is there a change you want to make?`,
  };
}

function moodStability(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const moods = ci.map((c) => c.mood);
  const mean = avg(moods);
  const stdDev = Math.sqrt(avg(moods.map((m) => Math.pow(m - mean, 2))));
  if (stdDev > 1.5 || mean < 6) return null;
  return {
    id: "mood-stability", type: "mood",
    title: "Your mood is remarkably stable",
    summary: `Your mood has stayed consistently between ${Math.floor(mean - stdDev)} and ${Math.ceil(mean + stdDev)}.`,
    evidence: [`Average mood: ${fmt(mean)}`, `Standard deviation: ${fmt(stdDev)} (lower = more stable)`, `Tracked over ${ci.length} days`],
    confidence: conf(ci.length, 2 - stdDev),
    reflection: "What daily habits or conditions are keeping your mood steady?",
  };
}

function moodVolatility(ci: CheckIn[]): Insight | null {
  if (ci.length < 7) return null;
  const moods = ci.map((c) => c.mood);
  const mean = avg(moods);
  const stdDev = Math.sqrt(avg(moods.map((m) => Math.pow(m - mean, 2))));
  if (stdDev < 2) return null;
  return {
    id: "mood-volatility", type: "mood",
    title: "Your mood is highly variable",
    summary: `Mood swings by ${fmt(stdDev)} points on average — worth understanding what's driving the peaks and valleys.`,
    evidence: [`Highest mood: ${Math.max(...moods)}`, `Lowest mood: ${Math.min(...moods)}`, `Standard deviation: ${fmt(stdDev)}`],
    confidence: conf(ci.length, stdDev),
    reflection: "Looking at your lowest-mood days, what was happening? And your highest-mood days?",
  };
}

function consistentlyHighMood(ci: CheckIn[]): Insight | null {
  const mean = avg(ci.map((c) => c.mood));
  if (mean < 7.5) return null;
  return {
    id: "consistently-high-mood", type: "mood",
    title: "You're maintaining consistently high mood",
    summary: `Your average mood is ${fmt(mean)} — above where most people typically score.`,
    evidence: [`Average mood: ${fmt(mean)}`, `High-mood days (7+): ${ci.filter((c) => c.mood >= 7).length} of ${ci.length}`, `Tracked over ${ci.length} days`],
    confidence: conf(ci.length, mean - 7.5),
    reflection: "What's working in your life right now? How do you protect these conditions?",
  };
}

function consistentlyLowMood(ci: CheckIn[]): Insight | null {
  const mean = avg(ci.map((c) => c.mood));
  if (mean > 4.5) return null;
  return {
    id: "consistently-low-mood", type: "mood",
    title: "Your mood has been consistently low",
    summary: `Your average mood over this period is ${fmt(mean)}.`,
    evidence: [`Average mood: ${fmt(mean)}`, `Low-mood days (≤4): ${ci.filter((c) => c.mood <= 4).length} of ${ci.length}`, `Tracked over ${ci.length} days`],
    confidence: conf(ci.length, 4.5 - mean),
    reflection: "What's one small thing you could try tomorrow that has helped your mood in the past?",
  };
}

// ─── Relationship rules (41–50) ──────────────────────────────────────────────

function socialEnergyBoost(ci: CheckIn[]): Insight | null {
  const social = ci.filter((c) => c.people.length > 0);
  const solo = ci.filter((c) => c.people.length === 0);
  if (social.length < 2 || solo.length < 2) return null;
  const delta = avg(social.map((c) => c.energy)) - avg(solo.map((c) => c.energy));
  if (delta < 1) return null;
  return {
    id: "social-energy-boost", type: "relationship",
    title: "Social interaction seems to energize you",
    summary: "Your energy is higher on days when you spend time with others.",
    evidence: [`Energy on social days: ${fmt(avg(social.map((c) => c.energy)))}`, `Energy on solo days: ${fmt(avg(solo.map((c) => c.energy)))}`, `Energy boost: +${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "Are there specific types of social interactions that feel most energizing vs draining?",
  };
}

function socialEnergyDrain(ci: CheckIn[]): Insight | null {
  const social = ci.filter((c) => c.people.length > 0);
  const solo = ci.filter((c) => c.people.length === 0);
  if (social.length < 2 || solo.length < 2) return null;
  const delta = avg(solo.map((c) => c.energy)) - avg(social.map((c) => c.energy));
  if (delta < 1) return null;
  return {
    id: "social-energy-drain", type: "relationship",
    title: "You tend to recharge better alone",
    summary: "Your energy is higher on solo days than social days — a classic introvert pattern.",
    evidence: [`Energy on solo days: ${fmt(avg(solo.map((c) => c.energy)))}`, `Energy on social days: ${fmt(avg(social.map((c) => c.energy)))}`, `Energy difference: +${fmt(delta)} when alone`],
    confidence: conf(ci.length, delta),
    reflection: "Are you building enough solo recovery time into your week?",
  };
}

function socialMoodBoost(ci: CheckIn[]): Insight | null {
  const social = ci.filter((c) => c.people.length > 0);
  const solo = ci.filter((c) => c.people.length === 0);
  if (social.length < 2 || solo.length < 2) return null;
  const delta = avg(social.map((c) => c.mood)) - avg(solo.map((c) => c.mood));
  if (delta < 1) return null;
  return {
    id: "social-mood-boost", type: "relationship",
    title: "Spending time with people lifts your mood",
    summary: "Your mood is consistently higher on days involving other people.",
    evidence: [`Mood on social days: ${fmt(avg(social.map((c) => c.mood)))}`, `Mood on solo days: ${fmt(avg(solo.map((c) => c.mood)))}`, `Mood boost: +${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: "Which relationships feel most nourishing? Are you spending enough time there?",
  };
}

function socialStressRelief(ci: CheckIn[]): Insight | null {
  const social = ci.filter((c) => c.people.length > 0);
  const solo = ci.filter((c) => c.people.length === 0);
  if (social.length < 2 || solo.length < 2) return null;
  const delta = avg(solo.map((c) => c.stress)) - avg(social.map((c) => c.stress));
  if (delta < 1) return null;
  return {
    id: "social-stress-relief", type: "relationship",
    title: "Social connection reduces your stress",
    summary: "Your stress is lower on days when you spend time with people.",
    evidence: [`Stress on social days: ${fmt(avg(social.map((c) => c.stress)))}`, `Stress on solo days: ${fmt(avg(solo.map((c) => c.stress)))}`, `Stress reduction: -${fmt(delta)} on social days`],
    confidence: conf(ci.length, delta),
    reflection: "Which people feel most calming to be around?",
  };
}

function topPositivePerson(ci: CheckIn[]): Insight | null {
  const scores = uniquePeople(ci)
    .map((p) => {
      const mood = personEffect(ci, p, "mood");
      const energy = personEffect(ci, p, "energy");
      const stress = personEffect(ci, p, "stress");
      if (!mood) return null;
      return { person: p, score: (mood.delta) + (energy?.delta ?? 0) - (stress?.delta ?? 0), count: mood.count };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null && x.count >= 2)
    .sort((a, b) => b.score - a.score);
  if (!scores.length || scores[0].score < 2) return null;
  const { person, score } = scores[0];
  return {
    id: "top-positive-person", type: "relationship",
    title: `${person} is your biggest wellbeing booster`,
    summary: `Across mood, energy, and stress, ${person} has the most positive impact on your wellbeing.`,
    evidence: [`Combined wellbeing score with ${person}: +${fmt(score)}`, `Appears in ${scores[0].count} of your check-ins`, `This person is a key part of your support system`],
    confidence: conf(ci.length, score / 2),
    reflection: `What about your time with ${person} has the most positive impact on you?`,
  };
}

function topDrainingPerson(ci: CheckIn[]): Insight | null {
  const scores = uniquePeople(ci)
    .map((p) => {
      const mood = personEffect(ci, p, "mood");
      const energy = personEffect(ci, p, "energy");
      const stress = personEffect(ci, p, "stress");
      if (!mood) return null;
      return { person: p, score: (mood.delta) + (energy?.delta ?? 0) - (stress?.delta ?? 0), count: mood.count };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null && x.count >= 2)
    .sort((a, b) => a.score - b.score);
  if (!scores.length || scores[0].score > -2) return null;
  const { person, score } = scores[0];
  return {
    id: "top-draining-person", type: "relationship",
    title: `${person} has the biggest negative impact on your wellbeing`,
    summary: `Across mood, energy, and stress, ${person} correlates with your lowest wellbeing scores.`,
    evidence: [`Combined wellbeing score with ${person}: ${fmt(score)}`, `Appears in ${scores[0].count} of your check-ins`, "This relationship may deserve attention"],
    confidence: conf(ci.length, Math.abs(score) / 2),
    reflection: `What would need to change in your interactions with ${person} to make them less draining?`,
  };
}

function soloVsSocialMood(ci: CheckIn[]): Insight | null {
  const social = ci.filter((c) => c.people.length > 0);
  const solo = ci.filter((c) => c.people.length === 0);
  if (social.length < 2 || solo.length < 2) return null;
  const moodSocial = avg(social.map((c) => c.mood));
  const moodSolo = avg(solo.map((c) => c.mood));
  const delta = Math.abs(moodSocial - moodSolo);
  if (delta < 1.5) return null;
  const better = moodSocial > moodSolo ? "social" : "solo";
  return {
    id: "solo-vs-social-mood", type: "relationship",
    title: `Your mood is better on ${better} days`,
    summary: `There's a clear mood difference between your days with people and your days alone.`,
    evidence: [`Mood on social days: ${fmt(moodSocial)}`, `Mood on solo days: ${fmt(moodSolo)}`, `Difference: ${fmt(delta)}`],
    confidence: conf(ci.length, delta),
    reflection: better === "social"
      ? "Are you getting enough social time? What gets in the way?"
      : "Are you getting enough solo time? How do you feel after a full day alone?",
  };
}

function mostFrequentPerson(ci: CheckIn[]): Insight | null {
  const people = uniquePeople(ci);
  if (!people.length) return null;
  const top = people
    .map((p) => ({ person: p, count: ci.filter((c) => c.people.includes(p)).length }))
    .sort((a, b) => b.count - a.count)[0];
  if (top.count < 3) return null;
  const eff = personEffect(ci, top.person, "mood");
  if (!eff) return null;
  return {
    id: "most-frequent-person", type: "relationship",
    title: `${top.person} is your most frequent companion`,
    summary: `${top.person} appears in ${top.count} of your check-ins — more than anyone else.`,
    evidence: [`Check-ins with ${top.person}: ${top.count}`, `Mood with ${top.person}: ${fmt(eff.withAvg)}`, `Mood otherwise: ${fmt(eff.withoutAvg)}`],
    confidence: conf(ci.length, top.count / ci.length),
    reflection: `Since ${top.person} is such a regular presence, how do you feel about the quality of that relationship?`,
  };
}

function socialStressIncrease(ci: CheckIn[]): Insight | null {
  const social = ci.filter((c) => c.people.length > 0);
  const solo = ci.filter((c) => c.people.length === 0);
  if (social.length < 2 || solo.length < 2) return null;
  const delta = avg(social.map((c) => c.stress)) - avg(solo.map((c) => c.stress));
  if (delta < 1) return null;
  return {
    id: "social-stress-increase", type: "relationship",
    title: "Social days tend to be more stressful for you",
    summary: "Your stress is consistently higher on days involving other people.",
    evidence: [`Stress on social days: ${fmt(avg(social.map((c) => c.stress)))}`, `Stress on solo days: ${fmt(avg(solo.map((c) => c.stress)))}`, `Stress increase: +${fmt(delta)} on social days`],
    confidence: conf(ci.length, delta),
    reflection: "Which social situations feel most draining? Is there a way to protect your energy?",
  };
}

function relationshipWellbeingSummary(ci: CheckIn[]): Insight | null {
  const people = uniquePeople(ci);
  if (people.length < 2) return null;
  const effects = people
    .map((p) => {
      const mood = personEffect(ci, p, "mood");
      const energy = personEffect(ci, p, "energy");
      const stress = personEffect(ci, p, "stress");
      if (!mood || mood.count < 2) return null;
      return { person: p, score: mood.delta + (energy?.delta ?? 0) - (stress?.delta ?? 0) };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (effects.length < 2) return null;
  const positive = effects.filter((e) => e.score > 0.5);
  const negative = effects.filter((e) => e.score < -0.5);
  if (!positive.length || !negative.length) return null;
  const spread = Math.max(...effects.map((e) => e.score)) - Math.min(...effects.map((e) => e.score));
  if (spread < 2) return null;
  return {
    id: "relationship-wellbeing-summary", type: "relationship",
    title: "Your relationships have very different effects on you",
    summary: "Some people in your life boost your wellbeing, while others consistently drain it.",
    evidence: [`Wellbeing boosters: ${positive.map((e) => e.person).join(", ")}`, `Wellbeing drainers: ${negative.map((e) => e.person).join(", ")}`, `Wellbeing spread across relationships: ${fmt(spread)}`],
    confidence: conf(ci.length, spread / 2),
    reflection: "What would happen if you intentionally spent more time with your energy-givers and less with your drainers?",
  };
}

// ─── Engine ──────────────────────────────────────────────────────────────────

const RULES = [
  // Sleep
  sleepMoodBoost, sleepEnergyBoost, sleepStressRelief,
  sleepDeficitMood, sleepDeficitEnergy, sleepDeficitStress,
  sleep8PlusBenefit, sleepConsistency, chronicLowSleep, optimalSleepSweetSpot,
  // Stress
  stressTopTrigger, stressTopReliever, stressRisingTrend, stressFallingTrend,
  highStressDays, stressMoodInverse, stressEnergyDrain, stressPersonTrigger,
  stressPersonReliever, stressRecovery,
  // Energy
  energyTopSource, energyTopDrain, energyRisingTrend, energyFallingTrend,
  energySleepLink, lowEnergyPattern, energyPersonBoost, energyMoodSync,
  exerciseEnergyBoost, energyStressInverse,
  // Mood
  moodTopTrigger, moodTopDrain, moodRisingTrend, moodFallingTrend,
  moodPersonPositive, moodPersonNegative, moodStability, moodVolatility,
  consistentlyHighMood, consistentlyLowMood,
  // Relationship
  socialEnergyBoost, socialEnergyDrain, socialMoodBoost, socialStressRelief,
  topPositivePerson, topDrainingPerson, soloVsSocialMood, mostFrequentPerson,
  socialStressIncrease, relationshipWellbeingSummary,
];

export function generateInsights(checkIns: CheckIn[]): Insight[] {
  if (checkIns.length < 5) return [];
  return RULES.map((rule) => {
    try { return rule(checkIns); } catch { return null; }
  }).filter((x): x is Insight => x !== null);
}
