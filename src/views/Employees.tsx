import React, { useState, useEffect } from 'react';
import { 
  collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Employee } from '../types';
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { parseExcel, exportToExcel, downloadTemplate } from '../utils/excelHandler';
import { cn } from '../lib/utils';

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [importPreview, setImportPreview] = useState<Partial<Employee>[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, [user]);

  const fetchEmployees = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'employees'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      setEmployees(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Employee)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      department: formData.get('department') as string,
      jobTitle: formData.get('jobTitle') as string,
      dob: formData.get('dob') as string,
      joinedDate: formData.get('joinedDate') as string,
      status: formData.get('status') as 'active' | 'inactive',
      userId: user!.uid,
      createdAt: Timestamp.now(),
    };

    try {
      if (editingEmployee?.id) {
        await updateDoc(doc(db, 'employees', editingEmployee.id), data);
      } else {
        await addDoc(collection(db, 'employees'), data);
      }
      setShowModal(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteDoc(doc(db, 'employees', id));
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseExcel(file);
      setImportPreview(parsed);
      setShowImportModal(true);
    } catch (error) {
      alert('Error parsing Excel file');
    }
  };

  const handleBulkCommit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      importPreview.forEach(emp => {
        const ref = doc(collection(db, 'employees'));
        batch.set(ref, {
          ...emp,
          userId: user.uid,
          createdAt: Timestamp.now(),
        });
      });
      await batch.commit();
      setShowImportModal(false);
      setImportPreview([]);
      fetchEmployees();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Employees</h1>
          <p className="text-slate-500 dark:text-zinc-400">Manage your team members and their milestone dates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => downloadTemplate()}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Template
          </button>
          <label className="btn-secondary flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={() => { setEditingEmployee(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by name, email, department..."
              className="glass-input pl-10 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-corp-blue dark:hover:text-gold-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button 
            onClick={() => exportToExcel(employees)}
            className="text-sm font-semibold text-highlight hover:opacity-80 flex items-center gap-2 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="w-6 h-6 border-2 border-corp-blue dark:border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-corp-blue/10 dark:bg-gold-500/10 flex items-center justify-center text-corp-blue dark:text-gold-500 text-xs font-bold border border-corp-blue/20 dark:border-gold-500/20">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-corp-blue transition-colors">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[11px] font-bold rounded-md uppercase border border-slate-200 dark:border-zinc-700">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-zinc-400">{emp.jobTitle}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                          <span className="font-semibold text-slate-700 dark:text-zinc-300 w-8">DOB:</span> {emp.dob}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                          <span className="font-semibold text-slate-700 dark:text-zinc-300 w-8">Join:</span> {emp.joinedDate}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide border",
                        emp.status === 'active' 
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" 
                          : "bg-slate-100/50 text-slate-500 dark:bg-zinc-800/50 dark:text-zinc-400 border-slate-200 dark:border-zinc-700"
                      )}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingEmployee(emp); setShowModal(true); }}
                          className="p-1.5 text-slate-400 hover:text-corp-blue dark:hover:text-gold-400 hover:bg-corp-blue/10 dark:hover:bg-gold-500/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id!)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-zinc-500 text-sm italic">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">First Name</label>
                  <input name="firstName" defaultValue={editingEmployee?.firstName} required className="glass-input" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Last Name</label>
                  <input name="lastName" defaultValue={editingEmployee?.lastName} required className="glass-input" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input name="email" type="email" defaultValue={editingEmployee?.email} required className="glass-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Department</label>
                  <input name="department" defaultValue={editingEmployee?.department} required className="glass-input" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Job Title</label>
                  <input name="jobTitle" defaultValue={editingEmployee?.jobTitle} required className="glass-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Date of Birth</label>
                  <input name="dob" type="date" defaultValue={editingEmployee?.dob} required className="glass-input" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Joined Date</label>
                  <input name="joinedDate" type="date" defaultValue={editingEmployee?.joinedDate} required className="glass-input" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Status</label>
                <select name="status" defaultValue={editingEmployee?.status || 'active'} className="glass-input">
                  <option value="active" className="dark:bg-zinc-900">Active</option>
                  <option value="inactive" className="dark:bg-zinc-900">Inactive</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-[2] btn-primary">
                  {editingEmployee ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Preview Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-corp-blue dark:text-gold-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Review Import Data</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="table-header">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Dept</th>
                    <th className="px-4 py-2">DOB</th>
                    <th className="px-4 py-2">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-zinc-800/50">
                  {importPreview.map((emp, i) => (
                    <tr key={i} className="text-sm table-row-hover">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-zinc-100">{emp.firstName} {emp.lastName}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-zinc-400">{emp.email}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-zinc-400">{emp.department}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-zinc-400">{emp.dob}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-zinc-400">{emp.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-slate-200/50 dark:border-zinc-800/50 flex gap-3 justify-end">
              <button onClick={() => setShowImportModal(false)} className="btn-secondary">Cancel</button>
              <button 
                onClick={handleBulkCommit}
                className="btn-primary"
              >
                Confirm Import ({importPreview.length} Employees)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
