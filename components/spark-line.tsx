const W = 300;
const H = 72;
const PAD = 6;

export function SparkLine({
  data,
  color,
  fillColor,
  min = 0,
  max = 10,
}: {
  data: number[];
  color: string;
  fillColor: string;
  min?: number;
  max?: number;
}) {
  if (data.length < 2) return null;

  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;

  const xOf = (i: number) => PAD + (i / (data.length - 1)) * innerW;
  const yOf = (v: number) =>
    PAD + (1 - Math.max(0, Math.min(1, (v - min) / (max - min))) ) * innerH;

  const pts = data.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ");
  const area = [
    `M${xOf(0)},${yOf(data[0])}`,
    ...data.slice(1).map((v, i) => `L${xOf(i + 1)},${yOf(v)}`),
    `L${xOf(data.length - 1)},${H - PAD}`,
    `L${xOf(0)},${H - PAD}`,
    "Z",
  ].join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-16 w-full"
      preserveAspectRatio="none"
    >
      <path d={area} fill={fillColor} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={xOf(i)}
          cy={yOf(v)}
          r={i === data.length - 1 ? 4 : 2.5}
          fill={color}
        />
      ))}
    </svg>
  );
}
