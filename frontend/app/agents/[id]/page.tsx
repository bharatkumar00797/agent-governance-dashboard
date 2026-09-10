"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, Agent } from "@/lib/api";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    api
      .getAgent(id)
      .then(setAgent)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleQuarantine = async () => {
    setActionLoading(true);
    try {
      const updated = await api.quarantine(id);
      setAgent(updated);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    setActionLoading(true);
    try {
      const updated = await api.activate(id);
      setAgent(updated);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Permanently remove this agent from the inventory?")) return;
    await api.deleteAgent(id);
    router.push("/agents");
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading…</div>;
  if (!agent) return <div className="p-10 text-center text-red-500">Agent not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" /> Back to inventory
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <p className="text-slate-500 mt-1">{agent.description || "No description"}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={agent.status} />
            <RiskBadge score={agent.risk_score} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="text-slate-500">Owner</dt>
            <dd className="font-medium">{agent.owner}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Type</dt>
            <dd className="font-medium capitalize">{agent.agent_type}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Framework</dt>
            <dd className="font-medium">{agent.framework || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Environment</dt>
            <dd className="font-medium capitalize">{agent.environment}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Shadow Agent</dt>
            <dd className="font-medium">{agent.is_shadow ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Last Seen</dt>
            <dd className="font-medium">{new Date(agent.last_seen).toLocaleString()}</dd>
          </div>
        </dl>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Permissions</h3>
          <div className="flex flex-wrap gap-1.5">
            {agent.permissions.length ? (
              agent.permissions.map((p) => (
                <span key={p} className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                  {p}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-sm">None listed</span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Data Access</h3>
          <div className="flex flex-wrap gap-1.5">
            {agent.data_access.length ? (
              agent.data_access.map((d) => (
                <span key={d} className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                  {d}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-sm">None listed</span>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          {agent.status !== "quarantined" ? (
            <button
              onClick={handleQuarantine}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              Quarantine
            </button>
          ) : (
            <button
              onClick={handleActivate}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              Activate
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm text-slate-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
