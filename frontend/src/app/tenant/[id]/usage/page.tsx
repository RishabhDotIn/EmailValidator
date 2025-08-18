"use client";
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

type Row = { day: string; endpoint: string; status: number; count: number; cost: number };

export default function TenantUsagePage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const tenantId = params.id;
  const [days, setDays] = useState<number>(parseInt(search.get('days') || '7', 10));
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await api.get(`/v1/tenant/${tenantId}/usage`, { params: { days } });
      setRows(res.data?.usage || []);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to load usage');
    } finally { setLoading(false); }
  }

  useEffect(() => { if (tenantId) load(); }, [tenantId, days]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Usage</h1>
          <p className="text-sm text-gray-600">Requests aggregated by day, endpoint and status.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Days</label>
          <select className="border rounded px-2 py-1" value={days} onChange={(e)=>setDays(parseInt(e.target.value,10))}>
            {[7,14,30,60,90].map(d=> <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Day</th>
              <th className="p-2">Endpoint</th>
              <th className="p-2">Status</th>
              <th className="p-2">Count</th>
              <th className="p-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 whitespace-nowrap">{r.day}</td>
                <td className="p-2">{r.endpoint}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.count}</td>
                <td className="p-2">{r.cost?.toFixed?.(6) ?? r.cost}</td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={5}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
