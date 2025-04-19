"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'home' },
  { label: 'Users', href: '/dashboard/users', icon: 'users' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Sidebar logout button clicked');
    
    // Jalankan fungsi logout dengan delay kecil
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold dark:text-white">Admin Panel</h1>
      </div>
      
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center space-x-3">
          <div className="bg-neutral-200 dark:bg-neutral-700 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-neutral-700 dark:text-neutral-200 font-semibold">{admin?.username?.charAt(0) || 'A'}</span>
          </div>
          <div>
            <p className="font-medium dark:text-white">{admin?.username || 'Admin'}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{admin?.role || 'admin'}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="mr-3">{getIcon(item.icon)}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 rounded-md text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/10"
        >
          <span className="mr-3">{getIcon('logout')}</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function getIcon(name: string) {
  switch (name) {
    case 'home':
      return '🏠';
    case 'users':
      return '👥';
    case 'settings':
      return '⚙️';
    case 'logout':
      return '🚪';
    default:
      return '📄';
  }
} 