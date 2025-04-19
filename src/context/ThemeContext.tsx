"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Periksa mounted untuk memastikan kode hanya berjalan di client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Saat komponen dimuat, cek jika ada tema yang tersimpan
  useEffect(() => {
    if (mounted) {
      try {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        
        // Jika ada tema tersimpan, gunakan tema tersebut
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          setTheme(storedTheme);
        } 
        // Jika tidak ada tema tersimpan, periksa preferensi sistem
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }
  }, [mounted]);

  // Saat tema berubah, update class di dokumen dan simpan ke localStorage
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const root = window.document.documentElement;
      
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [theme, mounted]);

  // Fungsi untuk toggle tema
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Render nilai default saat server-side rendering
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook untuk menggunakan tema
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
} 