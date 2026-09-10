"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NewAgentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    owner: "",
    agent_type: "custom",
    environment: "production",
    framework: "",
    permissions: "",
    data_access: "",
    is_shadow: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const agent = await api.createAgent({
        name: form.name,
        description: form.description || undefined,
        owner: form.owner,
        agent_type: form.agent_type,
        environment: form.environment,
        framework: form.framework || undefined,
        permissions: form.permissions
          ? form.permissions.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        data_access: form.data_access
          ? form.data_access.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        is_shadow: form.is_shadow,
      });
      router.push(`/agents/${agent.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to register agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Register New Agent</h1>
        <p className="text-slate-500 text-sm mt-1">
          Add an AI agent to the central inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>
        )}

        <Field label="Name *">
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Support Refund Agent"
          />
        </Field>

        <Field label="Description">
          <textarea
            className="input"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <Field label="Owner *">
          <input
            required
            className="input"
            value={form.owner}
            onChange={(e) => setForm({ ...form, owner: e.target.value })}
            placeholder="platform-team@company.com"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <select
              className="input"
              value={form.agent_type}
              onChange={(e) => setForm({ ...form, agent_type: e.target.value })}
            >
              <option value="custom">Custom</option>
              <option value="support">Support</option>
              <option value="coding">Coding</option>
              <option value="ops">Ops</option>
              <option value="finance">Finance</option>
            </select>
          </Field>

          <Field label="Environment">
            <select
              className="input"
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value })}
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="dev">Dev</option>
            </select>
          </Field>
        </div>

        <Field label="Framework">
          <input
            className="input"
            value={form.framework}
            onChange={(e) => setForm({ ...form, framework: e.target.value })}
            placeholder="LangGraph, CrewAI, custom…"
          />
        </Field>

        <Field label="Permissions (comma-separated)">
          <input
            className="input"
            value={form.permissions}
            onChange={(e) => setForm({ ...form, permissions: e.target.value })}
            placeholder="read, write, refund, execute"
          />
        </Field>

        <Field label="Data Access (comma-separated)">
          <input
            className="input"
            value={form.data_access}
            onChange={(e) => setForm({ ...form, data_access: e.target.value })}
            placeholder="customer_db, billing, pii"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_shadow}
            onChange={(e) => setForm({ ...form, is_shadow: e.target.checked })}
          />
          Mark as shadow agent (discovered without formal registration)
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50 transition"
        >
          {loading ? "Registering…" : "Register Agent"}
        </button>
      </form>

      <style jsx>{`
        .input {
          @apply w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
