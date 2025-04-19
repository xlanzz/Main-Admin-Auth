"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Set mounted state untuk menandakan kode berjalan di client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Definisikan checkAuth menggunakan useCallback agar dapat digunakan dalam dependencies array
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      // Hanya ambil token di client-side
      let token = null;
      if (mounted && typeof window !== 'undefined') {
        try {
          token = localStorage.getItem('adminToken');
        } catch (error) {
          console.error('Error retrieving token from localStorage:', error);
        }
      }
      
      console.log('Checking auth with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        return false;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Auth check response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      console.log('Auth check successful, received data:', { admin: data.admin });
      
      setAdmin(data.admin);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      
      // Hapus token jika auth gagal
      if (mounted && typeof window !== 'undefined') {
        try {
          localStorage.removeItem('adminToken');
        } catch (error) {
          console.error('Error removing token from localStorage:', error);
        }
      }
      
      setAdmin(null);
      return false;
    }
  }, [mounted]);

  useEffect(() => {
    // Hanya jalankan di client-side
    if (!mounted) return;

    const initializeAuth = async () => {
      const isAuthenticated = await checkAuth();
      console.log('Authentication check result:', isAuthenticated);
      
      // Jika sudah otentikasi, redirect ke dashboard
      if (isAuthenticated && window && window.location) {
        const pathname = window.location.pathname;
        if (pathname === '/login') {
          router.push('/dashboard');
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, [router, mounted, checkAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log('Attempting login with:', { email });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful, received data:', { admin: data.admin });
      
      setAdmin(data.admin);
      
      // Simpan token ke localStorage hanya di client-side
      if (mounted && typeof window !== 'undefined') {
        try {
          localStorage.setItem('adminToken', data.token);
          console.log('Token saved to localStorage');
        } catch (error) {
          console.error('Error saving token to localStorage:', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      console.log('Logout function called');
      
      // Hapus token dari localStorage
      if (mounted && typeof window !== 'undefined') {
        try {
          localStorage.removeItem('adminToken');
          console.log('Token removed from localStorage');
        } catch (error) {
          console.error('Error removing token from localStorage:', error);
        }
      }
      
      // Hapus token cookie dengan API
      fetch('/api/auth/logout', {
        method: 'POST',
      }).then(() => {
        console.log('Logout API called successfully');
      }).catch(error => {
        console.error('Error calling logout API:', error);
      });
      
      // Reset state
      setAdmin(null);
      console.log('Admin state reset');
      
      // Redirect ke halaman login dengan sedikit delay untuk memastikan state terupdate
      setTimeout(() => {
        console.log('Redirecting to login page...');
        router.push('/login');
        // Tambahkan refresh untuk memastikan state terupdate
        if (mounted && typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }, 300);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect
      if (mounted && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}