"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

type Key = { id: string; prefix: string; last4: string; createdAt?: string; revokedAt?: string | null };

export default function TenantKeysPage() {
  const params = useParams<{ id: string }>();
  const tenantId = params.id;
  const [items, setItems] = useState<Key[]>([]);
  const [plaintext, setPlaintext] = useState<string | null>(null);
  const [mode, setMode] = useState<'live'|'test'>('live');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await api.get(`/v1/tenant/${tenantId}/keys`);
      setItems(res.data?.apiKeys || []);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to load keys');
    }
  }

  useEffect(() => { if (tenantId) load(); }, [tenantId]);

  async function createKey(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await api.post(`/v1/tenant/${tenantId}/keys`, { mode });
      setPlaintext(res.data?.plaintext || null);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to create key');
    } finally { setLoading(false); }
  }

  async function revoke(id: string) {
    setLoading(true); setError(null);
    try {
      await api.post(`/v1/tenant/${tenantId}/keys/${id}/revoke`);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to revoke key');
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">API Keys</h1>
        <p className="text-sm text-gray-600">Create and manage API keys. Plaintext key is shown only once.</p>
      </div>

      <form onSubmit={createKey} className="flex items-end gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mode</label>
          <select className="border rounded px-3 py-2" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
            <option value="live">Live</option>
            <option value="test">Test</option>
          </select>
        </div>
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
          {loading ? 'Creating…' : 'Create Key'}
        </button>
      </form>
      {error && <div className="text-sm text-red-600">{error}</div>}

      {plaintext && (
        <div className="border rounded p-4 bg-yellow-50">
          <div className="font-medium mb-1">Copy your API key now</div>
          <code className="block break-all text-sm p-2 bg-white border rounded">{plaintext}</code>
          <div className="text-xs text-gray-600 mt-1">This is shown only once. Store it securely.</div>
        </div>
      )}

      <div className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Key</th>
              <th className="p-2">Created</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(k => (
              <tr key={k.id} className="border-t">
                <td className="p-2 font-mono">{k.prefix}••••{k.last4}</td>
                <td className="p-2">{k.createdAt ? new Date(k.createdAt).toLocaleString() : '—'}</td>
                <td className="p-2">{k.revokedAt ? 'revoked' : 'active'}</td>
                <td className="p-2">
                  {!k.revokedAt && (
                    <button onClick={() => revoke(k.id)} className="text-red-600 underline">Revoke</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
