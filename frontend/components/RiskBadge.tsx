import clsx from "clsx";

export function RiskBadge({ score }: { score: number }) {
  let color = "bg-emerald-100 text-emerald-800";
  let label = "Low";

  if (score >= 70) {
    color = "bg-red-100 text-red-800";
    label = "Critical";
  } else if (score >= 45) {
    color = "bg-orange-100 text-orange-800";
    label = "High";
  } else if (score >= 25) {
    color = "bg-yellow-100 text-yellow-800";
    label = "Medium";
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        color
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {score.toFixed(0)} · {label}
    </span>
  );
}
