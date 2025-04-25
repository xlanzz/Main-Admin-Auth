"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { usePathname } from 'next/navigation';

// Mobile nav items (termasuk Modules)
const mobileNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Users', href: '/dashboard/users', icon: '👥' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' }
];

function getPageTitle(pathname: string) {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/dashboard/users') return 'Users';
  if (pathname === '/dashboard/settings') return 'Settings';
  if (pathname === '/dashboard/modules') return 'Modules';
  
  if (pathname.startsWith('/dashboard/users/')) return 'Users';
  if (pathname.startsWith('/dashboard/settings/')) return 'Settings';
  if (pathname.startsWith('/dashboard/modules/')) return 'Modules';
  
  return 'Dashboard';
}

export default function Header() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Menggunakan getPageTitle
  const pageTitle = getPageTitle(pathname);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Header logout button clicked');
    // Tutup menu mobile jika terbuka
    setIsMobileMenuOpen(false);
    // Jalankan fungsi logout dengan delay kecil
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <header className="bg-white border-b border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block md:hidden text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          {/* Logo (mobile only) */}
          <div className="block md:hidden">
            <Link href="/dashboard" className="text-lg font-bold dark:text-white">
              Admin Panel
            </Link>
          </div>
          
          {/* Page title (dekstop) */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold dark:text-white">{pageTitle}</h1>
          </div>
        </div>
        
        {/* User profile menu */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          <div className="text-right">
            <p className="text-sm font-medium dark:text-white">{admin?.username || 'Admin'}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{admin?.email || 'admin@example.com'}</p>
          </div>
          <div className="md:hidden">
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 px-2 py-1 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="block md:hidden bg-white border-t border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
          <nav className="flex flex-col p-2">
            {mobileNavItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 rounded-md ${
                  pathname === item.href 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' 
                    : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 text-red-600 hover:bg-red-100 dark:text-red-500 dark:hover:bg-red-900/20 rounded-md text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}