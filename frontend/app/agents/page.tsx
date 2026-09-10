"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Agent } from "@/lib/api";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    agent_type: "",
    min_risk: "",
  });

  const load = () => {
    setLoading(true);
    const params: Record<string, any> = { limit: 100 };
    if (filters.status) params.status = filters.status;
    if (filters.agent_type) params.agent_type = filters.agent_type;
    if (filters.min_risk) params.min_risk = Number(filters.min_risk);

    api
      .listAgents(params)
      .then((res) => {
        setAgents(res.agents);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agent Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">{total} agents registered</p>
        </div>
        <Link
          href="/agents/new"
          className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition"
        >
          + Register Agent
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="quarantined">Quarantined</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>

        <select
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.agent_type}
          onChange={(e) => setFilters({ ...filters, agent_type: e.target.value })}
        >
          <option value="">All types</option>
          <option value="support">Support</option>
          <option value="coding">Coding</option>
          <option value="ops">Ops</option>
          <option value="custom">Custom</option>
        </select>

        <select
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.min_risk}
          onChange={(e) => setFilters({ ...filters, min_risk: e.target.value })}
        >
          <option value="">Any risk</option>
          <option value="25">Medium+</option>
          <option value="45">High+</option>
          <option value="70">Critical</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Environment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Risk</th>
                <th className="px-5 py-3 font-medium">Actions</th>
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
                      <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                        shadow
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{a.owner}</td>
                  <td className="px-5 py-3 capitalize">{a.agent_type}</td>
                  <td className="px-5 py-3 capitalize text-slate-500">{a.environment}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-3">
                    <RiskBadge score={a.risk_score} />
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/agents/${a.id}`} className="text-sky-600 hover:underline text-xs">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
