"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface AdminFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'superadmin';
}

export default function AddAdminForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { admin } = useAuth();
  
  const form = useForm<AdminFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
    },
  });

  const onSubmit = async (data: AdminFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        router.push('/login');
        return;
      }
      
      console.log('Creating admin with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });
      
      const result = await response.json();
      console.log('Create admin response:', response.status, result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create admin');
      }
      
      toast.success('Admin created successfully');
      router.push('/dashboard/users');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Create admin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Periksa jika user yang login adalah superadmin
  const isCurrentUserSuperadmin = admin?.role === 'superadmin';

  if (!isCurrentUserSuperadmin) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-red-700 font-medium text-lg mb-2">Permission Denied</h3>
        <p className="text-red-600">
          Only superadmin users can create new admin accounts. Your current role is: {admin?.role || 'unknown'}.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="admin123" 
                  {...field} 
                  disabled={isLoading}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="admin@example.com" 
                  {...field} 
                  disabled={isLoading}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="********" 
                  {...field} 
                  disabled={isLoading}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="********" 
                  {...field} 
                  disabled={isLoading}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                  disabled={isLoading}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Admin'}
        </Button>
      </form>
    </Form>
  );
} 