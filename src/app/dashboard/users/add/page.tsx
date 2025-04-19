"use client"

import React from 'react';
import AddAdminForm from '@/components/admin/AddAdminForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AddAdminPage() {
  const { admin } = useAuth();
  
  // Periksa jika user yang login bukan superadmin, jangan tampilkan form
  const isCurrentUserSuperadmin = admin?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Add New Admin</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/users">Back to Users List</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
          <CardDescription>
            {isCurrentUserSuperadmin 
              ? "Add a new admin user to the system" 
              : "Only superadmin users can create new admin accounts"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddAdminForm />
        </CardContent>
      </Card>
    </div>
  );
} 