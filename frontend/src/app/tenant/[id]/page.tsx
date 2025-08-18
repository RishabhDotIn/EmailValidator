"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

type Tenant = { _id: string; name: string; domain?: string; allowedOrigins?: string[]; status: 'active'|'suspended' };

export default function TenantDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [t, setT] = useState<Tenant | null>(null);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [origins, setOrigins] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    try {
      const res = await api.get(`/v1/tenant/${id}`);
      const data: Tenant = res.data?.tenant;
      setT(data);
      setName(data?.name || '');
      setDomain(data?.domain || '');
      setOrigins((data?.allowedOrigins || []).join('\n'));
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to load tenant');
    }
  }

  useEffect(() => { if (id) load(); }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null); setMessage(null);
    try {
      const allowedOrigins = origins.split(/\n+/).map(s=>s.trim()).filter(Boolean);
      const res = await api.patch(`/v1/tenant/${id}`, { name, domain: domain || undefined, allowedOrigins });
      setMessage('Saved');
      setT(res.data?.tenant);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to save');
    } finally { setLoading(false); }
  }

  if (!t) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Tenant: {t.name}</h1>
        <div className="text-sm text-gray-600">Status: {t.status}</div>
      </div>

      <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Domain</label>
          <input className="w-full border rounded px-3 py-2" value={domain} onChange={e=>setDomain(e.target.value)} placeholder="mysite.com" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Allowed Origins (one per line)</label>
          <textarea className="w-full border rounded px-3 py-2 h-32" value={origins} onChange={e=>setOrigins(e.target.value)} placeholder="https://app.mysite.com\nhttps://admin.mysite.com" />
        </div>
        <div className="md:col-span-2">
          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
        {error && <div className="md:col-span-2 text-sm text-red-600">{error}</div>}
        {message && <div className="md:col-span-2 text-sm text-green-700">{message}</div>}
      </form>
    </div>
  );
}
