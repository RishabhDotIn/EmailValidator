"use client";
import { useState } from 'react';
import { api } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email'|'otp'|'done'>('email');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await api.post('/v1/auth/request-otp', { email });
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to request OTP');
    } finally { setLoading(false); }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const res = await api.post('/v1/auth/verify-otp', { email, otp });
      const token = res.data?.accessToken as string;
      if (token) {
        saveToken(token);
        setStep('done');
        router.replace('/tenants');
      } else {
        setError('No access token received');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to verify OTP');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white text-sm">EV</span>
          <div>
            <h1 className="text-xl font-semibold leading-tight">Welcome back</h1>
            <p className="text-sm text-slate-600">Sign in to manage tenants and API keys</p>
          </div>
        </div>

        {step === 'email' && (
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button disabled={loading} className="btn-primary w-full py-2">
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div>
              <label className="label">One-Time Passcode</label>
              <input
                type="text"
                inputMode="numeric"
                className="input tracking-widest"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button disabled={loading} className="btn-primary w-full py-2">
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>
            <button type="button" onClick={()=>setStep('email')} className="btn-ghost w-full py-2">Use a different email</button>
          </form>
        )}
      </div>
    </div>
  );
}
