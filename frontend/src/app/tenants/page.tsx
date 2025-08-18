"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Tenant = { _id: string; name: string; domain?: string; status: 'active'|'suspended' };

export default function TenantsPage() {
  const [items, setItems] = useState<Tenant[]>([]);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await api.get('/v1/tenant');
      setItems(res.data?.tenants || []);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to load tenants');
    }
  }

  useEffect(() => { load(); }, []);

  async function createTenant(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      await api.post('/v1/tenant', { name, domain: domain || undefined });
      setName(''); setDomain('');
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to create tenant');
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Tenants</h1>
        <p className="text-sm text-gray-600">Create a tenant for each website/app you want to integrate.</p>
      </div>

      <form onSubmit={createTenant} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Domain (optional)</label>
          <input className="w-full border rounded px-3 py-2" value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="mysite.com" />
        </div>
        <div>
          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded w-full sm:w-auto">
            {loading ? 'Creating…' : 'Create Tenant'}
          </button>
        </div>
      </form>
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(t => (
          <div key={t._id} className="border rounded p-4">
            <div className="font-medium">{t.name}</div>
            <div className="text-xs text-gray-600">{t.domain || '—'} • {t.status}</div>
            <div className="mt-3 space-x-3 text-sm">
              <Link className="underline" href={`/tenant/${t._id}`}>Manage</Link>
              <Link className="underline" href={`/tenant/${t._id}/keys`}>API Keys</Link>
              <Link className="underline" href={`/tenant/${t._id}/usage`}>Usage</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
