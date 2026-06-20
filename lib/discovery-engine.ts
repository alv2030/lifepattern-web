import type { CheckIn, Insight } from "@/types";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function allTags(c: CheckIn) {
  return [...c.activities, ...c.people];
}

export function generateInsights(checkIns: CheckIn[]): Insight[] {
  if (checkIns.length < 5) return [];

  const tags = Array.from(new Set(checkIns.flatMap(allTags)));
  const stressCandidates = tags.map((tag) => {
    const withTag = checkIns.filter((c) => allTags(c).includes(tag));
    const withoutTag = checkIns.filter((c) => !allTags(c).includes(tag));
    return {
      tag,
      count: withTag.length,
      withAvg: average(withTag.map((c) => c.stress)),
      withoutAvg: average(withoutTag.map((c) => c.stress)),
    };
  }).filter((x) => x.count >= 1).sort((a, b) => (b.withAvg - b.withoutAvg) - (a.withAvg - a.withoutAvg));

  const energyCandidates = tags.map((tag) => {
    const withTag = checkIns.filter((c) => allTags(c).includes(tag));
    const withoutTag = checkIns.filter((c) => !allTags(c).includes(tag));
    return {
      tag,
      count: withTag.length,
      withAvg: average(withTag.map((c) => c.energy)),
      withoutAvg: average(withoutTag.map((c) => c.energy)),
    };
  }).filter((x) => x.count >= 1).sort((a, b) => (b.withAvg - b.withoutAvg) - (a.withAvg - a.withoutAvg));

  const stress = stressCandidates[0];
  const energy = energyCandidates[0];
  const goodSleep = checkIns.filter((c) => c.sleepHours >= 7);
  const lowSleep = checkIns.filter((c) => c.sleepHours < 6.5);

  const insights: Insight[] = [];

  if (stress && stress.withAvg - stress.withoutAvg >= 1) {
    insights.push({
      id: "auto-stress-trigger",
      type: "stress",
      title: `${stress.tag} may be linked to higher stress`,
      summary: `${stress.tag} appeared on days where your stress score was higher than your baseline.`,
      evidence: [
        `Average stress with ${stress.tag}: ${stress.withAvg.toFixed(1)}`,
        `Average stress without ${stress.tag}: ${stress.withoutAvg.toFixed(1)}`,
        `Stress lift: +${(stress.withAvg - stress.withoutAvg).toFixed(1)}`
      ],
      confidence: checkIns.length >= 14 ? "Strong pattern" : "Possible pattern",
      reflection: `What about ${stress.tag} creates pressure, and what part can you control?`
    });
  }

  if (energy && energy.withAvg - energy.withoutAvg >= 1) {
    insights.push({
      id: "auto-energy-source",
      type: "energy",
      title: `${energy.tag} may be an energy source`,
      summary: `Your energy score was higher on days involving ${energy.tag}.`,
      evidence: [
        `Average energy with ${energy.tag}: ${energy.withAvg.toFixed(1)}`,
        `Average energy without ${energy.tag}: ${energy.withoutAvg.toFixed(1)}`,
        `Energy lift: +${(energy.withAvg - energy.withoutAvg).toFixed(1)}`
      ],
      confidence: checkIns.length >= 14 ? "Strong pattern" : "Possible pattern",
      reflection: `How can you make ${energy.tag} easier to repeat?`
    });
  }

  if (goodSleep.length && lowSleep.length) {
    const moodGood = average(goodSleep.map((c) => c.mood));
    const moodLow = average(lowSleep.map((c) => c.mood));
    if (moodGood - moodLow >= 1) {
      insights.push({
        id: "auto-sleep-mood",
        type: "sleep",
        title: "Sleep appears connected to your mood",
        summary: "Your mood was higher on days after 7+ hours of sleep.",
        evidence: [`Mood after 7+ hours: ${moodGood.toFixed(1)}`, `Mood after <6.5 hours: ${moodLow.toFixed(1)}`],
        confidence: "Possible pattern",
        reflection: "What usually gets in the way of 7+ hours of sleep?"
      });
    }
  }

  return insights;
}
