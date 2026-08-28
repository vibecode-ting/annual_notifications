import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppUser, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ShieldAlert, User, ShieldCheck } from 'lucide-react';

export default function AdminUsers() {
  const { appUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
        })) as AppUser[];
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (appUser?.role === 'admin') {
      fetchUsers();
    }
  }, [appUser]);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        role: newRole
      });
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  if (appUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Access Denied</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">User Management</h1>
        <p className="text-slate-500 dark:text-zinc-400">Manage access levels and roles for your application users.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="w-6 h-6 border-2 border-corp-blue dark:border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.uid} className="table-row-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{u.email}</p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">{u.uid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {u.role === 'admin' ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        ) : u.role === 'pro' ? (
                          <Shield className="w-4 h-4 text-corp-blue dark:text-gold-500" />
                        ) : (
                          <User className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-sm font-semibold capitalize text-slate-700 dark:text-zinc-300">
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                        disabled={u.uid === appUser.uid} // Can't change own role
                        className="glass-input py-1.5 px-3 text-sm max-w-[150px] disabled:opacity-50"
                      >
                        <option value="user" className="dark:bg-zinc-900">User</option>
                        <option value="pro" className="dark:bg-zinc-900">Pro</option>
                        <option value="admin" className="dark:bg-zinc-900">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
