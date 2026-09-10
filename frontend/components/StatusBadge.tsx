import clsx from "clsx";

const styles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-slate-100 text-slate-600",
  quarantined: "bg-red-100 text-red-800",
  draft: "bg-blue-100 text-blue-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
        styles[status] || "bg-slate-100 text-slate-600"
      )}
    >
      {status}
    </span>
  );
}
