"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Agent } from "@/lib/api";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Bot, AlertTriangle, ShieldCheck, Eye } from "lucide-react";

export default function OverviewPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listAgents({ limit: 10 })
      .then((res) => {
        setAgents(res.agents);
        setTotal(res.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const highRisk = agents.filter((a) => a.risk_score >= 45).length;
  const shadow = agents.filter((a) => a.is_shadow).length;
  const quarantined = agents.filter((a) => a.status === "quarantined").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1">
          Central visibility into every AI agent running in your organization.
        </p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
          Backend not reachable yet ({error}). Start the FastAPI server on port 8000.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Bot} label="Total Agents" value={total} />
        <StatCard icon={AlertTriangle} label="High / Critical Risk" value={highRisk} tone="danger" />
        <StatCard icon={Eye} label="Shadow Agents" value={shadow} tone="warning" />
        <StatCard icon={ShieldCheck} label="Quarantined" value={quarantined} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold">Recent Agents</h2>
          <Link href="/agents" className="text-sm text-sky-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading…</div>
        ) : agents.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No agents registered yet.{" "}
            <Link href="/agents/new" className="text-sky-600 hover:underline">
              Register the first one
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agents.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/agents/${a.id}`} className="font-medium text-sky-700 hover:underline">
                        {a.name}
                      </Link>
                      {a.is_shadow && (
                        <span className="ml-2 text-xs text-amber-600">shadow</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{a.owner}</td>
                    <td className="px-5 py-3 capitalize text-slate-600">{a.agent_type}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3">
                      <RiskBadge score={a.risk_score} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: any;
  label: string;
  value: number;
  tone?: "default" | "danger" | "warning";
}) {
  const tones = {
    default: "bg-white border-slate-200",
    danger: "bg-red-50 border-red-100",
    warning: "bg-amber-50 border-amber-100",
  };
  return (
    <div className={`rounded-xl border p-5 ${tones[tone]}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/80 shadow-sm">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  );
}
