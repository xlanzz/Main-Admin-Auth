"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { admin } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      
      // Ambil token dari localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }
      
      const response = await fetch('/api/admin/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch admin list');
      }
      
      const data = await response.json();
      setAdmins(data.admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admin users');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };
  
  // Check if current user is superadmin
  const isCurrentUserSuperadmin = admin?.role === 'superadmin';

  const handleEditClick = (adminUser: Admin) => {
    setCurrentAdmin(adminUser);
    setEditForm({
      username: adminUser.username,
      email: adminUser.email
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (adminUser: Admin) => {
    setCurrentAdmin(adminUser);
    setDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateAdmin = async () => {
    if (!currentAdmin) return;
    
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const response = await fetch('/api/admin/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: currentAdmin.id,
          username: editForm.username,
          email: editForm.email
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update admin');
      }
      
      toast.success('Admin updated successfully');
      setEditDialogOpen(false);
      fetchAdmins(); // Refresh admin list
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update admin');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!currentAdmin) return;
    
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const response = await fetch(`/api/admin/delete?id=${currentAdmin.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete admin');
      }
      
      toast.success('Admin deleted successfully');
      setDeleteDialogOpen(false);
      fetchAdmins(); // Refresh admin list
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete admin');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (adminUser: Admin) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const response = await fetch('/api/admin/toggle-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: adminUser.id
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${adminUser.isActive ? 'deactivate' : 'activate'} admin`);
      }
      
      const result = await response.json();
      toast.success(result.message || `Admin ${adminUser.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchAdmins(); // Refresh admin list
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast.error(error instanceof Error ? error.message : `Failed to ${adminUser.isActive ? 'deactivate' : 'activate'} admin`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
        {isCurrentUserSuperadmin && (
          <Button asChild>
            <Link href="/dashboard/users/add">Add New Admin</Link>
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Admins</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <p>Loading admin users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  {isCurrentUserSuperadmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isCurrentUserSuperadmin ? 6 : 5} className="text-center py-4">
                      No admin users found
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((adminUser) => (
                    <TableRow key={adminUser.id}>
                      <TableCell className="font-medium">{adminUser.username}</TableCell>
                      <TableCell>{adminUser.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          adminUser.role === 'superadmin' 
                            ? 'bg-neutral-900 text-white' 
                            : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          {adminUser.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatDate(adminUser.lastLogin)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          adminUser.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {adminUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      {isCurrentUserSuperadmin && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditClick(adminUser)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={adminUser.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                              onClick={() => handleToggleStatus(adminUser)}
                              disabled={adminUser.role === 'superadmin'}
                            >
                              {adminUser.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(adminUser)}
                              disabled={adminUser.role === 'superadmin' || admin?.id === adminUser.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Admin Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>
              Update the admin user information. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAdmin} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the admin account
              <strong> {currentAdmin?.username}</strong> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 