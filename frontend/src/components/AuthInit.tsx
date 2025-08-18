"use client";
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom, loadTokenFromStorage } from '@/lib/auth';

export default function AuthInit() {
  const [, setToken] = useAtom(accessTokenAtom);
  useEffect(() => {
    const t = loadTokenFromStorage();
    if (t) setToken(t);
  }, [setToken]);
  return null;
}
