import Link from "next/link";

export function ReportsNav({ active }: { active: "weekly" | "monthly" }) {
  return (
    <div className="flex gap-2">
      <Link
        href="/reports/weekly"
        className={active === "weekly" ? "pill border-indigo/40 bg-lavender text-indigo" : "pill"}
      >
        Weekly
      </Link>
      <Link
        href="/reports/monthly"
        className={active === "monthly" ? "pill border-indigo/40 bg-lavender text-indigo" : "pill"}
      >
        Monthly
      </Link>
    </div>
  );
}
