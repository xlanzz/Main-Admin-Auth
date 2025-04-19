"use client"

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthDebug() {
  const { admin, isLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('adminToken');
      setToken(storedToken);
    }
  }, [admin]);
  
  if (process.env.NODE_ENV === 'production') {
    return null; // Tidak tampilkan di production
  }
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs w-80 z-50 font-mono">
      <h3 className="font-bold mb-2">Auth Debug Info:</h3>
      <div className="space-y-1">
        <p>Loading: {isLoading ? 'true' : 'false'}</p>
        <p>Logged In: {admin ? 'true' : 'false'}</p>
        {admin && (
          <>
            <p>Username: {admin.username}</p>
            <p>Email: {admin.email}</p>
            <p>Role: {admin.role}</p>
          </>
        )}
        <p>Token: {token ? `${token.substring(0, 15)}...` : 'No token'}</p>
      </div>
    </div>
  );
} 